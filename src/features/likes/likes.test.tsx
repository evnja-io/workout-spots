import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { SessionProvider } from '~/features/auth/session'
import { useSaveSpot } from './useSaveSpot'

// ── Supabase mock setup ───────────────────────────────────────────────────────
const mockInsert = vi.fn()
const mockDelete = vi.fn()
const mockMaybeSingle = vi.fn()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockFrom = vi.fn((_table: string) => {
  return {
    insert: mockInsert,
    delete: () => ({
      eq: () => ({
        eq: mockDelete,
      }),
    }),
    select: () => ({
      eq: () => ({
        eq: () => ({
          maybeSingle: mockMaybeSingle,
        }),
      }),
    }),
  }
})

const mockGetSession = vi.fn()
const mockOnAuthStateChange = vi.fn()
const mockUnsubscribe = vi.fn()

vi.mock('~/lib/supabase/browser', () => ({
  isSupabaseConfigured: () => true,
  getBrowserSupabase: () => ({
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
    from: mockFrom,
  }),
}))

// ── Test component ─────────────────────────────────────────────────────────────
import { useSession } from '~/features/auth/session'

function SaveButton({ spotId }: { spotId: string }) {
  const { liked, toggle, pending } = useSaveSpot(spotId)
  const { status } = useSession()
  return (
    <button
      onClick={toggle}
      disabled={pending}
      data-testid="save-btn"
      aria-pressed={liked}
      data-session-status={status}
    >
      {liked ? 'Saved' : 'Save'}
    </button>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const i18n = createI18n('en')

function makeWrapper(userId: string | null) {
  const qc = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        // Prevent background refetches from overwriting optimistic updates in tests
        staleTime: Infinity,
      },
    },
  })

  // Seed the like query to false initially
  if (userId) {
    qc.setQueryData(['like', 'sp-1', userId], false)
  }

  // Set up session mock
  if (userId) {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: userId } } },
    })
    mockOnAuthStateChange.mockImplementation((cb: (event: string, session: { user: { id: string } }) => void) => {
      // Fire immediately with authed session
      setTimeout(() => cb('SIGNED_IN', { user: { id: userId } }), 0)
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } }
    })
  } else {
    mockGetSession.mockResolvedValue({ data: { session: null } })
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    })
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={qc}>
        <I18nextProvider i18n={i18n}>
          <SessionProvider>{children}</SessionProvider>
        </I18nextProvider>
      </QueryClientProvider>
    )
  }

  return { Wrapper, qc }
}

describe('useSaveSpot', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMaybeSingle.mockResolvedValue({ data: null, error: null })
    mockInsert.mockResolvedValue({ data: null, error: null })
    mockDelete.mockResolvedValue({ data: null, error: null })
  })

  it('authed: optimistically flips liked to true and calls insert', async () => {
    const userId = 'user-abc'
    const { Wrapper } = makeWrapper(userId)

    render(
      <Wrapper>
        <SaveButton spotId="sp-1" />
      </Wrapper>
    )

    // Wait until the session has resolved to 'authed' before clicking.
    // aria-pressed='false' alone is not sufficient — the cache is pre-seeded
    // so the button renders immediately while status is still 'loading', and
    // the gate would redirect to sign-in instead of calling the mutation.
    await waitFor(() =>
      expect(screen.getByTestId('save-btn').getAttribute('data-session-status')).toBe('authed')
    )

    // After a successful insert the DB row exists, so subsequent reads return it.
    // This prevents onSettled's invalidateQueries refetch from overwriting the
    // optimistic update back to false.
    mockMaybeSingle.mockResolvedValue({ data: { id: 'row-1' }, error: null })

    const user = userEvent.setup()
    await user.click(screen.getByTestId('save-btn'))

    // Optimistic: liked should flip to true immediately
    await waitFor(() =>
      expect(screen.getByTestId('save-btn').getAttribute('aria-pressed')).toBe('true')
    )

    // Insert was called with correct args
    expect(mockInsert).toHaveBeenCalledWith({ location_id: 'sp-1', user_id: userId })
  })

  it('rollback: reverts to false when insert rejects', async () => {
    const userId = 'user-abc'
    const { Wrapper } = makeWrapper(userId)
    mockInsert.mockRejectedValue(new Error('DB error'))

    render(
      <Wrapper>
        <SaveButton spotId="sp-1" />
      </Wrapper>
    )

    await waitFor(() =>
      expect(screen.getByTestId('save-btn').getAttribute('aria-pressed')).toBe('false')
    )

    const user = userEvent.setup()
    await user.click(screen.getByTestId('save-btn'))

    // After error + rollback, liked returns to false
    await waitFor(() =>
      expect(screen.getByTestId('save-btn').getAttribute('aria-pressed')).toBe('false')
    )
  })

  it('anon: clicking opens sign-in modal, no insert called', async () => {
    const { Wrapper } = makeWrapper(null)

    render(
      <Wrapper>
        <SaveButton spotId="sp-1" />
      </Wrapper>
    )

    // Wait for anon session
    await waitFor(() => expect(mockGetSession).toHaveBeenCalled())

    const user = userEvent.setup()
    await user.click(screen.getByTestId('save-btn'))

    // Sign-in modal appears (email input)
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    )

    // No insert called
    expect(mockInsert).not.toHaveBeenCalled()
  })
})
