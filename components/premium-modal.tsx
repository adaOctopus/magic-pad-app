"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Zap } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { toast } from "sonner"

// Use placeholder price IDs until real ones are set up
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "placeholder_key")

interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
}

const pricingTiers = [
  {
    name: "Monthly",
    description: "Perfect for individual creators",
    price: "$9.99",
    priceId: "price_monthly", // Placeholder price ID
    features: ["Unlimited AI responses", "Message history access", "Advanced analytics", "Priority support"],
  },
  {
    name: "Yearly",
    description: "Best value for professionals",
    price: "$99.99",
    priceId: "price_yearly", // Placeholder price ID
    features: [
      "All Monthly features",
      "2 months free",
      "Early access to new features",
      "Custom AI training",
      "Team collaboration tools",
    ],
  },
]

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string) => {
    try {
      setIsLoading(priceId)

      // If Stripe isn't set up yet, show a toast
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        toast.error("Stripe is not configured yet")
        return
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Failed to load Stripe")
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId })
      if (stripeError) {
        throw stripeError
      }
    } catch (error) {
      console.error("Subscription error:", error)
      toast.error("Failed to start subscription process")
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-3xl font-bold gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Upgrade to Premium
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-2 mt-4">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-3xl font-bold mb-6">
                  {tier.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    {tier.name === "Monthly" ? "/month" : "/year"}
                  </span>
                </div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full ai-button group relative overflow-hidden"
                  onClick={() => handleSubscribe(tier.priceId)}
                  disabled={isLoading === tier.priceId}
                >
                  {isLoading === tier.priceId ? (
                    "Processing..."
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      Subscribe {tier.name}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Secure payment powered by Stripe. Cancel anytime.
        </p>
      </DialogContent>
    </Dialog>
  )
}

