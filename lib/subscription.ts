"use client"

import { useState, useEffect } from "react"
import { createClientSupabaseClient } from "@/lib/supabase/client"

export type SubscriptionStatus = {
  isActive: boolean
  planType?: string | null
  expiresAt?: string | null
  isCanceled?: boolean
}

export async function checkUserSubscription(): Promise<SubscriptionStatus> {
  const supabase = createClientSupabaseClient()

  try {
    // Get current session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return { isActive: false }
    }

    // Query the user's subscription
    const { data: subscription, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("status", "active")
      .single()

    if (error) {
      console.error("Error checking subscription:", error)
      return { isActive: false }
    }

    if (!subscription) {
      return { isActive: false }
    }

    // Check if subscription is active and not expired
    const now = new Date()
    const expiresAt = new Date(subscription.current_period_end)
    const isActive = expiresAt > now && subscription.status === "active"

    return {
      isActive,
      planType: subscription.plan_type,
      expiresAt: subscription.current_period_end,
      isCanceled: subscription.cancel_at_period_end,
    }
  } catch (error) {
    console.error("Error checking subscription status:", error)
    return { isActive: false }
  }
}

// Hook for client components
export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus>({ isActive: false })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkSubscription() {
      try {
        const status = await checkUserSubscription()
        setStatus(status)
      } catch (error) {
        console.error("Error in useSubscription:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSubscription()
  }, [])

  return { status, isLoading }
}

