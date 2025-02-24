// Example of a subscription status badge
"use client"

import { useSubscription } from "@/lib/subscription"
import { Badge } from "@/components/ui/badge"

export function SubscriptionBadge() {
  const { status, isLoading } = useSubscription()

  if (isLoading) return null

  if (!status.isActive) return null

  return (
    <Badge variant="premium" className="bg-gradient-to-r from-primary to-primary-foreground">
      {status.planType === "yearly" ? "Yearly" : "Monthly"} Premium
      {status.isCanceled && " (Canceling)"}
    </Badge>
  )
}

