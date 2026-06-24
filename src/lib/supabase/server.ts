// Context7 adaptation note: @tanstack/react-start/server does not expose
// getRequestHeaders().get('cookie') / setResponseHeaders([['set-cookie', ...]]) from the plan
// snippet. The actual API provides getCookies() (parses the cookie header) and
// setCookie(name, value, options) / setResponseHeader(name, value) for responses.
// We use those directly instead of the cookies.ts helpers in this file;
// cookies.ts helpers remain available for other callers.
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  getCookies,
  setCookie,
  setResponseHeader,
} from '@tanstack/react-start/server'
import type { Database } from './types'

export function getServerSupabase(): SupabaseClient<Database> {
  return createServerClient<Database>(
    process.env['VITE_SUPABASE_URL']!,
    process.env['VITE_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        getAll: () => {
          const cookies = getCookies()
          return Object.entries(cookies).map(([name, value]) => ({ name, value }))
        },
        setAll: (toSet, headers) => {
          toSet.forEach(({ name, value, options }) => {
            setCookie(name, value, options)
          })
          // Set any additional response headers required by Supabase (e.g. Cache-Control)
          Object.entries(headers).forEach(([key, value]) => {
            setResponseHeader(key, value)
          })
        },
      },
    },
  )
}
