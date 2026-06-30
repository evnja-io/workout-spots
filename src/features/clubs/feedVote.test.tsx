import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { SessionProvider } from '~/features/auth/session'
import { ClubFeed } from './components/ClubFeed'

// ── Stateful Supabase mock: a tiny in-memory poll so invalidate-refetch reflects truth ──
type Vote = { post_id: string; option_id: string; user_id: string }
let voteStore: Vote[] = []
const mockVoteInsert = vi.fn()

const countFor = (optionId: string) => voteStore.filter((v) => v.option_id === optionId).length

function postRow() {
  return {
    id: 'post-1',
    content: 'Best pet?',
    image_url: null,
    video_url: null,
    media_type: 'poll',
    poll_closes_at: null,
    created_at: '2026-06-30T00:00:00Z',
    author: { id: 'author-1', pseudo: 'Author', name: null, profile_picture_url: null },
    likes: [{ count: 0 }],
    poll_options: [
      { id: 'opt-1', label: 'Cats', position: 0, votes: [{ count: countFor('opt-1') }] },
      { id: 'opt-2', label: 'Dogs', position: 1, votes: [{ count: countFor('opt-2') }] },
    ],
    comments: [],
  }
}

// A chainable, awaitable builder: every method returns itself; awaiting yields `result`.
function builder(result: unknown) {
  const b: Record<string, unknown> = {}
  for (const m of ['select', 'eq', 'in', 'order']) b[m] = () => b
  b.then = (resolve: (v: unknown) => unknown) => resolve(result)
  return b
}

const mockFrom = vi.fn((table: string) => {
  if (table === 'club_posts') return { select: () => builder({ data: [postRow()], error: null }) }
  if (table === 'club_post_likes') return { select: () => builder({ data: [], error: null }) }
  if (table === 'club_poll_votes') {
    return {
      select: () =>
        builder({
          data: voteStore
            .filter((v) => v.user_id === 'user-1')
            .map(({ post_id, option_id }) => ({ post_id, option_id })),
          error: null,
        }),
      insert: mockVoteInsert,
    }
  }
  return { select: () => builder({ data: [], error: null }) }
})

const mockGetSession = vi.fn()
const mockOnAuthStateChange = vi.fn()

vi.mock('~/lib/supabase/browser', () => ({
  isSupabaseConfigured: () => true,
  getBrowserSupabase: () => ({
    auth: { getSession: mockGetSession, onAuthStateChange: mockOnAuthStateChange },
    from: mockFrom,
  }),
}))

const i18n = createI18n('en')

function makeWrapper(userId: string | null) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  if (userId) {
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: userId } } } })
    mockOnAuthStateChange.mockImplementation(
      (cb: (e: string, s: { user: { id: string } }) => void) => {
        setTimeout(() => cb('SIGNED_IN', { user: { id: userId } }), 0)
        return { data: { subscription: { unsubscribe: vi.fn() } } }
      },
    )
  } else {
    mockGetSession.mockResolvedValue({ data: { session: null } })
    mockOnAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
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
  return { Wrapper }
}

describe('ClubFeed poll voting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    voteStore = []
    mockVoteInsert.mockImplementation((row: Vote) => {
      voteStore.push(row)
      return Promise.resolve({ error: null })
    })
  })

  it('authed: clicking an option optimistically records the vote and inserts it', async () => {
    const { Wrapper } = makeWrapper('user-1')
    render(
      <Wrapper>
        <ClubFeed clubId="club-1" locked={false} canCompose={false} />
      </Wrapper>,
    )

    const cats = await screen.findByRole('button', { name: 'Cats' })
    const user = userEvent.setup()
    await user.click(cats)

    // Optimistic: results render with the vote counted; the option is no longer a button.
    await waitFor(() => expect(screen.getByText('1 vote')).toBeInTheDocument())
    expect(screen.queryByRole('button', { name: 'Cats' })).not.toBeInTheDocument()

    expect(mockVoteInsert).toHaveBeenCalledWith({
      post_id: 'post-1',
      option_id: 'opt-1',
      user_id: 'user-1',
    })
  })

  it('rollback: a rejected insert reverts to the unvoted options', async () => {
    mockVoteInsert.mockResolvedValue({ error: new Error('denied') })
    const { Wrapper } = makeWrapper('user-1')
    render(
      <Wrapper>
        <ClubFeed clubId="club-1" locked={false} canCompose={false} />
      </Wrapper>,
    )

    const cats = await screen.findByRole('button', { name: 'Cats' })
    const user = userEvent.setup()
    await user.click(cats)

    // After the failed insert, the invalidate-refetch returns zero votes → options reappear.
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Cats' })).toBeInTheDocument(),
    )
    expect(screen.queryByText('1 vote')).not.toBeInTheDocument()
  })

  it('anon: clicking an option opens the sign-in modal and does not insert', async () => {
    const { Wrapper } = makeWrapper(null)
    render(
      <Wrapper>
        <ClubFeed clubId="club-1" locked={false} canCompose={false} />
      </Wrapper>,
    )

    const cats = await screen.findByRole('button', { name: 'Cats' })
    const user = userEvent.setup()
    await user.click(cats)

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument(),
    )
    expect(mockVoteInsert).not.toHaveBeenCalled()
  })
})
