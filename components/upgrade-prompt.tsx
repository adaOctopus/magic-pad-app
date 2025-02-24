"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PremiumModal } from "@/components/premium-modal"
import { Sparkles } from "lucide-react"

export function UpgradePrompt() {
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  return (
    <>
      <Card className="p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <div className="space-y-2">
            <h3 className="font-semibold">Premium Feature</h3>
            <p className="text-sm text-muted-foreground">Upgrade to premium to access this feature.</p>
          </div>
          <Button className="ai-button" onClick={() => setShowPremiumModal(true)}>
            Upgrade Now
          </Button>
        </div>
      </Card>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </>
  )
}

