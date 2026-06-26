import { describe, expect, it, vi, beforeEach } from 'vitest'

// ── Supabase browser mock ─────────────────────────────────────────────────────

const mockRpc = vi.fn()
const mockConfigured = vi.fn(() => true)

vi.mock('~/lib/supabase/browser', () => ({
  isSupabaseConfigured: () => mockConfigured(),
  getBrowserSupabase: () => ({ rpc: mockRpc }),
}))

import { unsubscribeByToken } from './unsubscribe'

beforeEach(() => {
  vi.clearAllMocks()
  mockConfigured.mockReturnValue(true)
})

describe('unsubscribeByToken', () => {
  it('calls the unsubscribe_marketing RPC with the token and type', async () => {
    mockRpc.mockResolvedValue({ data: true, error: null })

    const result = await unsubscribeByToken('tok-123', 'marketing_email')

    expect(mockRpc).toHaveBeenCalledWith('unsubscribe_marketing', {
      p_token: 'tok-123',
      p_type: 'marketing_email',
    })
    expect(result).toBe(true)
  })

  it('returns false when no row matches the token', async () => {
    mockRpc.mockResolvedValue({ data: false, error: null })
    expect(await unsubscribeByToken('nope', 'all')).toBe(false)
  })

  it('throws when the RPC errors', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'boom' } })
    await expect(unsubscribeByToken('tok', 'all')).rejects.toBeTruthy()
  })

  it('does not call the RPC when Supabase is unconfigured', async () => {
    mockConfigured.mockReturnValue(false)
    expect(await unsubscribeByToken('tok', 'all')).toBe(false)
    expect(mockRpc).not.toHaveBeenCalled()
  })
})
