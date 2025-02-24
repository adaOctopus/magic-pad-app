// Move dashboard page here from (app)/page.tsx

import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  // Fetch counts from each table
  const [{ count: messagesCount }, { count: linkedinCount }, { count: producthuntCount }] = await Promise.all([
    supabase.from("messages").select("*", { count: "exact", head: true }),
    supabase.from("linkedin_contacts").select("*", { count: "exact", head: true }),
    supabase.from("producthunt_contacts").select("*", { count: "exact", head: true }),
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
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
    </div>
  )
}

