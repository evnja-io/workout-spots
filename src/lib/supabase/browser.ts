import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

let client: SupabaseClient<Database> | undefined
export function getBrowserSupabase(): SupabaseClient<Database> {
  if (!client) {
    client = createBrowserClient<Database>(
      import.meta.env.VITE_SUPABASE_URL as string,
      import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    )
  }
  return client
}
