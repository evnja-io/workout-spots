import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { SessionProvider } from '~/features/auth/session'
import { reviewSchema } from './schema'
import { useSubmitReview } from './mutations'

// ── Supabase mock ─────────────────────────────────────────────────────────────

const mockUpsert = vi.fn()
const mockInsert = vi.fn()
const mockGetSession = vi.fn()
const mockOnAuthStateChange = vi.fn()
const mockUnsubscribe = vi.fn()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockFrom = vi.fn((_table: string) => ({
  upsert: mockUpsert,
  insert: mockInsert,
}))

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

// ── Helpers ───────────────────────────────────────────────────────────────────

const i18n = createI18n('en')

function makeWrapper(userId: string | null) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  })

  if (userId) {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: userId } } },
    })
    mockOnAuthStateChange.mockImplementation(
      (cb: (event: string, session: { user: { id: string } }) => void) => {
        setTimeout(() => cb('SIGNED_IN', { user: { id: userId } }), 0)
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } }
      },
    )
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

// ── Test component ─────────────────────────────────────────────────────────────

import { useSession } from '~/features/auth/session'

function ReviewButton({ spotId }: { spotId: string }) {
  const { submit, pending } = useSubmitReview(spotId)
  const { status } = useSession()
  return (
    <button
      data-testid="review-btn"
      data-session-status={status}
      disabled={pending}
      onClick={() => submit({ rating: 5, text: 'Great' })}
    >
      Submit
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

describe('reviewSchema', () => {
  it('rejects rating 0', () => {
    const result = reviewSchema.safeParse({ rating: 0, text: '' })
    expect(result.success).toBe(false)
  })

  it('rejects text longer than 1000 chars', () => {
    const result = reviewSchema.safeParse({ rating: 3, text: 'x'.repeat(1001) })
    expect(result.success).toBe(false)
  })

  it('accepts valid rating with empty text', () => {
    const result = reviewSchema.safeParse({ rating: 4, text: '' })
    expect(result.success).toBe(true)
  })

  it('accepts rating 1–5 boundary values', () => {
    expect(reviewSchema.safeParse({ rating: 1, text: '' }).success).toBe(true)
    expect(reviewSchema.safeParse({ rating: 5, text: '' }).success).toBe(true)
  })

  it('rejects rating 6', () => {
    expect(reviewSchema.safeParse({ rating: 6, text: '' }).success).toBe(false)
  })

  it('accepts exactly 1000-char text', () => {
    const result = reviewSchema.safeParse({ rating: 3, text: 'x'.repeat(1000) })
    expect(result.success).toBe(true)
  })
})

describe('useSubmitReview — authed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUpsert.mockResolvedValue({ data: null, error: null })
    mockInsert.mockResolvedValue({ data: null, error: null })
  })

  it('calls upsert on location_ratings with onConflict and insert on location_comments', async () => {
    const userId = 'user-xyz'
    const { Wrapper, qc } = makeWrapper(userId)

    // Pre-seed spot cache with empty comments
    qc.setQueryData(['spot', 'spot-1'], {
      id: 'spot-1',
      comments: [],
      averageRating: 4,
      ratingCount: 1,
    })

    render(
      <Wrapper>
        <ReviewButton spotId="spot-1" />
      </Wrapper>,
    )

    // Wait for session to resolve to authed
    await waitFor(() =>
      expect(
        screen.getByTestId('review-btn').getAttribute('data-session-status'),
      ).toBe('authed'),
    )

    const user = userEvent.setup()
    await user.click(screen.getByTestId('review-btn'))

    // upsert was called with correct args including onConflict
    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('location_ratings')
      expect(mockUpsert).toHaveBeenCalledWith(
        { location_id: 'spot-1', user_id: userId, rating: 5 },
        { onConflict: 'location_id,user_id' },
      )
    })

    // insert was called for the comment
    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('location_comments')
      expect(mockInsert).toHaveBeenCalledWith({
        location_id: 'spot-1',
        user_id: userId,
        content: 'Great',
      })
    })
  })

  it('optimistically prepends the new comment to the spot cache', async () => {
    const userId = 'user-xyz'
    const { Wrapper, qc } = makeWrapper(userId)

    qc.setQueryData(['spot', 'spot-2'], {
      id: 'spot-2',
      comments: [{ id: 'old-1', user: 'Bob', rating: 3, date: '', text: 'Old comment' }],
      averageRating: 3,
      ratingCount: 1,
    })

    render(
      <Wrapper>
        <ReviewButton spotId="spot-2" />
      </Wrapper>,
    )

    await waitFor(() =>
      expect(
        screen.getByTestId('review-btn').getAttribute('data-session-status'),
      ).toBe('authed'),
    )

    const user = userEvent.setup()
    await user.click(screen.getByTestId('review-btn'))

    // Wait for optimistic update to land
    await waitFor(() => {
      const cached = qc.getQueryData<{ comments: { user: string; rating: number }[] }>(
        ['spot', 'spot-2'],
      )
      expect(cached?.comments[0]).toMatchObject({ user: 'You', rating: 5 })
    })
  })

  it('does NOT call location_comments.insert when text is empty', async () => {
    const userId = 'user-empty'
    const { Wrapper, qc } = makeWrapper(userId)

    qc.setQueryData(['spot', 'spot-3'], {
      id: 'spot-3',
      comments: [],
      averageRating: 0,
      ratingCount: 0,
    })

    function RatingOnlyButton() {
      const { submit } = useSubmitReview('spot-3')
      const { status } = useSession()
      return (
        <button
          data-testid="rating-only-btn"
          data-session-status={status}
          onClick={() => submit({ rating: 4, text: '' })}
        >
          Rate only
        </button>
      )
    }

    render(
      <Wrapper>
        <RatingOnlyButton />
      </Wrapper>,
    )

    await waitFor(() =>
      expect(
        screen.getByTestId('rating-only-btn').getAttribute('data-session-status'),
      ).toBe('authed'),
    )

    const user = userEvent.setup()
    await user.click(screen.getByTestId('rating-only-btn'))

    await waitFor(() => expect(mockUpsert).toHaveBeenCalledTimes(1))
    // insert should NOT have been called because text is empty
    expect(mockInsert).not.toHaveBeenCalled()
  })
})

describe('useSubmitReview — anon', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens sign-in modal and does not call upsert or insert', async () => {
    const { Wrapper } = makeWrapper(null)

    render(
      <Wrapper>
        <ReviewButton spotId="spot-anon" />
      </Wrapper>,
    )

    // Wait for anon session
    await waitFor(() => expect(mockGetSession).toHaveBeenCalled())

    const user = userEvent.setup()
    await user.click(screen.getByTestId('review-btn'))

    // Sign-in modal must appear
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument(),
    )

    // No DB writes
    expect(mockUpsert).not.toHaveBeenCalled()
    expect(mockInsert).not.toHaveBeenCalled()
  })
})
