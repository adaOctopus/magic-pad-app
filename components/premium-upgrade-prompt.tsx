"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PremiumModal } from "@/components/premium-modal"
import { BarChart3, Sparkles } from "lucide-react"

export default function PremiumUpgradePrompt() {
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  return (
    <>
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary to-primary-foreground opacity-75 blur" />
            <div className="relative flex items-center justify-center w-16 h-16 rounded-lg bg-background border">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold">Upgrade to Premium</h3>
            <p className="text-muted-foreground max-w-sm">
              Get access to all premium features and take your experience to the next level.
            </p>
          </div>

          <Button className="ai-button" size="lg" onClick={() => setShowPremiumModal(true)}>
            <Sparkles className="mr-2 h-4 w-4" />
            Go Premium
          </Button>
        </div>
      </Card>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </>
  )
}

