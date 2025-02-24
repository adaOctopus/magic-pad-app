import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

export function createClientSupabaseClient() {
  return createClientComponentClient<Database>()
}

