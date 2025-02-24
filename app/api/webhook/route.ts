import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createServerSupabaseClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = headers().get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        if (!session?.metadata?.userId) {
          throw new Error("No user ID in session metadata")
        }

        // First, create or update the subscription
        const { data: subscription, error: subscriptionError } = await supabase
          .from("user_subscriptions")
          .upsert({
            user_id: session.metadata.userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            status: "active",
            plan_type: session.amount_total === 999 ? "monthly" : "yearly",
            amount: session.amount_total ? session.amount_total / 100 : null,
            currency: session.currency,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(
              Date.now() + (session.amount_total === 999 ? 30 : 365) * 24 * 60 * 60 * 1000,
            ).toISOString(),
          })
          .select()
          .single()

        if (subscriptionError) throw subscriptionError

        // Then, record the payment
        const { error: paymentError } = await supabase.from("payments").insert({
          user_id: session.metadata.userId,
          subscription_id: subscription?.id,
          stripe_payment_intent_id: session.payment_intent as string,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency,
          status: "succeeded",
          payment_method_type: session.payment_method_types?.[0],
        })

        if (paymentError) throw paymentError
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice

        // Get the subscription details
        const { data: subscription } = await supabase
          .from("user_subscriptions")
          .select("id")
          .eq("stripe_subscription_id", invoice.subscription)
          .single()

        // Record the payment
        const { error: paymentError } = await supabase.from("payments").insert({
          user_id: invoice.customer as string,
          subscription_id: subscription?.id,
          stripe_payment_intent_id: invoice.payment_intent as string,
          stripe_payment_method_id: invoice.payment_method as string,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
          status: "succeeded",
          payment_method_type: invoice.payment_method_types?.[0],
        })

        if (paymentError) throw paymentError
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription

        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
          })
          .eq("stripe_subscription_id", subscription.id)

        if (error) throw error
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            status: "canceled",
            canceled_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id)

        if (error) throw error
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

