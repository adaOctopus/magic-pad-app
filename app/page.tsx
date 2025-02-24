import { Badge } from "@/components/ui/badge"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { MessageHistory } from "@/components/message-history"
import { subDays } from "date-fns"
import { DashboardUpgrade } from "@/components/dashboard-upgrade"

const MESSAGES_PER_PAGE = 10

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  const yesterday = subDays(new Date(), 1)
  yesterday.setHours(0, 0, 0, 0)

  const [
    { count: messagesCount },
    { count: linkedinCount },
    { count: producthuntCount },
    { data: messages, count: totalMessages },
  ] = await Promise.all([
    supabase.from("messages").select("*", { count: "exact", head: true }),
    supabase.from("linkedin_contacts").select("*", { count: "exact", head: true }),
    supabase.from("producthunt_contacts").select("*", { count: "exact", head: true }),
    supabase
      .from("messages")
      .select("*", { count: "exact" })
      .gte("created_at", yesterday.toISOString())
      .order("created_at", { ascending: false })
      .range(0, MESSAGES_PER_PAGE - 1),
  ])

  const hasMore = totalMessages ? totalMessages > MESSAGES_PER_PAGE : false
  const isPremium = false // TODO: Replace with actual premium status check

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Messages Sent</div>
          </div>
          <div className="text-2xl font-bold">{messagesCount ?? 0}</div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">LinkedIn Contacts</div>
          </div>
          <div className="text-2xl font-bold">{linkedinCount ?? 0}</div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Product Hunt Contacts</div>
          </div>
          <div className="text-2xl font-bold">{producthuntCount ?? 0}</div>
        </div>
      </div>

      {/* Message History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold tracking-tight">Message History</h3>
          {isPremium && (
            <Badge variant="outline" className="text-xs">
              Showing messages from {yesterday.toLocaleDateString()}
            </Badge>
          )}
        </div>

        {isPremium ? (
          <MessageHistory
            messages={messages || []}
            isLoading={false}
            hasMore={hasMore}
            onLoadMore={async () => {
              "use server"
              // This will be handled by the client component
            }}
          />
        ) : (
          <DashboardUpgrade />
        )}
      </div>
    </div>
  )
}

