import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

interface LinkedInFormData {
  name: string
  email: string
}

export async function POST(req: Request) {
  try {
    const data: LinkedInFormData = await req.json()

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
      .from("linkedin_contacts")
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
        message: "Contact information stored successfully",
        data: insertedData[0],
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error processing LinkedIn contact:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to store contact information",
      },
      { status: 500 },
    )
  }
}

