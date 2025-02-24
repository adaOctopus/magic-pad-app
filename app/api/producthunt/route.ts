import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

interface ProductHuntFormData {
  name: string
  email: string
}

export async function POST(req: Request) {
  try {
    const data: ProductHuntFormData = await req.json()

    if (!data.email || !data.name) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and email are required",
        },
        { status: 400 },
      )
    }

    // Insert into Supabase
    const { data: insertedData, error } = await supabase
      .from("producthunt_contacts")
      .insert([
        {
          name: data.name,
          email: data.email,
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json(
      {
        success: true,
        message: "Subscription stored successfully",
        data: insertedData[0],
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error processing Product Hunt subscription:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to store subscription",
      },
      { status: 500 },
    )
  }
}

