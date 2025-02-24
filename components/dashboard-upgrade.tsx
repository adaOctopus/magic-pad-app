"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PremiumModal } from "@/components/premium-modal"
import { BarChart3, Sparkles, Filter, CalendarRange } from "lucide-react"

export function DashboardUpgrade() {
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
            <h3 className="text-2xl font-bold">Unlock Advanced Analytics</h3>
            <p className="text-muted-foreground max-w-sm">
              Get detailed insights into your messaging history and track your communication patterns with premium
              features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
            <Card className="p-4 flex flex-col items-center text-center space-y-2">
              <Filter className="w-6 h-6 text-primary mb-2" />
              <h4 className="font-semibold">Advanced Filters</h4>
              <p className="text-sm text-muted-foreground">Filter messages by type, content, and more</p>
            </Card>
            <Card className="p-4 flex flex-col items-center text-center space-y-2">
              <CalendarRange className="w-6 h-6 text-primary mb-2" />
              <h4 className="font-semibold">Date Insights</h4>
              <p className="text-sm text-muted-foreground">Track message history across custom date ranges</p>
            </Card>
            <Card className="p-4 flex flex-col items-center text-center space-y-2">
              <BarChart3 className="w-6 h-6 text-primary mb-2" />
              <h4 className="font-semibold">Analytics Dashboard</h4>
              <p className="text-sm text-muted-foreground">Visualize your messaging patterns and trends</p>
            </Card>
          </div>

          <Button className="ai-button" size="lg" onClick={() => setShowPremiumModal(true)}>
            <Sparkles className="mr-2 h-4 w-4" />
            Upgrade to Premium
          </Button>
        </div>
      </Card>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </>
  )
}

