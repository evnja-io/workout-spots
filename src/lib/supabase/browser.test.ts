import { afterEach, expect, test, vi } from 'vitest'
afterEach(() => vi.unstubAllEnvs())
test('browser client is a singleton', async () => {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://x.supabase.co')
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon')
  const { getBrowserSupabase } = await import('./browser')
  expect(getBrowserSupabase()).toBe(getBrowserSupabase())
})
