import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const date = searchParams.get("date")
    const type = searchParams.get("type")
    const pageSize = 10

    const supabase = createServerSupabaseClient()
    let query = supabase.from("messages").select("*", { count: "exact" })

    // Apply date filter if provided
    if (date) {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)

      query = query.gte("created_at", startDate.toISOString()).lte("created_at", endDate.toISOString())
    }

    // Apply type filter if provided
    if (type && type !== "all") {
      query = query.eq("type", type)
    }

    // Add pagination
    const start = (page - 1) * pageSize
    const end = start + pageSize - 1

    const { data, error, count } = await query.order("created_at", { ascending: false }).range(start, end)

    if (error) {
      throw error
    }

    return NextResponse.json({
      messages: data,
      total: count,
      hasMore: count ? count > page * pageSize : false,
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

