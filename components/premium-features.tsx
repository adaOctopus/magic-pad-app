// In a Client Component
"use client"

import { useSubscription } from "@/lib/subscription"
import { UpgradePrompt } from "./upgrade-prompt"

export function PremiumFeatures() {
  const { status, isLoading } = useSubscription()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!status.isActive) {
    return <UpgradePrompt />
  }

  return (
    <div>
      <h2>Welcome to Premium!</h2>
      {status.isCanceled && (
        <div className="text-yellow-500">
          Your subscription will end on {new Date(status.expiresAt!).toLocaleDateString()}
        </div>
      )}
      {/* Premium content */}
    </div>
  )
}

