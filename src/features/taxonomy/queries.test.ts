import { http, HttpResponse } from 'msw'
import { expect, test, vi } from 'vitest'
import type { TFunction } from 'i18next'
import { server } from '~/test/msw/server'

test('equipmentsQueryOptions maps rows', async () => {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://x.supabase.co')
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon')
  server.use(
    http.get('https://x.supabase.co/rest/v1/equipments', () =>
      HttpResponse.json([
        { id: 'eq-1', name: 'Pull-up bar', equipment_locale_key: 'equipment.pull_up_bar', category: 'bars' },
      ]),
    ),
  )
  const { equipmentsQueryOptions } = await import('./queries')
  const data = await equipmentsQueryOptions().queryFn!({} as never)
  expect(data[0]).toMatchObject({ id: 'eq-1', localeKey: 'equipment.pull_up_bar' })
})

test('resolveLabel returns defaultValue via t', async () => {
  const t = ((key: string, opts?: { defaultValue?: string }) => opts?.defaultValue ?? key) as unknown as TFunction
  const { resolveLabel } = await import('./queries')
  expect(resolveLabel('equipment.x', 'Fallback', t)).toBe('Fallback')
})
