import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { SessionProvider, useSession } from '~/features/auth/session'
import { useReport } from './mutations'
import { ReportDialog } from './ReportDialog'

// ── Supabase mock ─────────────────────────────────────────────────────────────

const mockInsert = vi.fn()
const mockGetSession = vi.fn()
const mockOnAuthStateChange = vi.fn()
const mockUnsubscribe = vi.fn()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockFrom = vi.fn((_table: string) => ({
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

function ReportButton({
  targetType,
  targetId,
  reason,
}: {
  targetType: 'spot' | 'comment'
  targetId: string
  reason?: string
}) {
  const { report, pending } = useReport()
  const { status } = useSession()
  return (
    <button
      data-testid="report-btn"
      data-session-status={status}
      disabled={pending}
      onClick={() => report({ targetType, targetId, reason })}
    >
      Report
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

describe('useReport — authed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockInsert.mockResolvedValue({ data: null, error: null })
  })

  it('inserts a spot report with target_type/target_id/reporter_id and trimmed reason', async () => {
    const userId = 'user-rep'
    const { Wrapper } = makeWrapper(userId)

    render(
      <Wrapper>
        <ReportButton targetType="spot" targetId="spot-9" reason="  broken equipment  " />
      </Wrapper>,
    )

    await waitFor(() =>
      expect(screen.getByTestId('report-btn').getAttribute('data-session-status')).toBe('authed'),
    )

    const user = userEvent.setup()
    await user.click(screen.getByTestId('report-btn'))

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('reports')
      expect(mockInsert).toHaveBeenCalledWith({
        target_type: 'spot',
        target_id: 'spot-9',
        reporter_id: userId,
        reason: 'broken equipment',
      })
    })
  })

  it('inserts a comment report with null reason when reason is empty', async () => {
    const userId = 'user-rep2'
    const { Wrapper } = makeWrapper(userId)

    render(
      <Wrapper>
        <ReportButton targetType="comment" targetId="cmt-3" />
      </Wrapper>,
    )

    await waitFor(() =>
      expect(screen.getByTestId('report-btn').getAttribute('data-session-status')).toBe('authed'),
    )

    const user = userEvent.setup()
    await user.click(screen.getByTestId('report-btn'))

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        target_type: 'comment',
        target_id: 'cmt-3',
        reporter_id: userId,
        reason: null,
      })
    })
  })
})

describe('useReport — anon', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens the sign-in modal and does not insert', async () => {
    const { Wrapper } = makeWrapper(null)

    render(
      <Wrapper>
        <ReportButton targetType="spot" targetId="spot-anon" />
      </Wrapper>,
    )

    await waitFor(() => expect(mockGetSession).toHaveBeenCalled())

    const user = userEvent.setup()
    await user.click(screen.getByTestId('report-btn'))

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument(),
    )

    expect(mockInsert).not.toHaveBeenCalled()
  })
})

describe('ReportDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockInsert.mockResolvedValue({ data: null, error: null })
  })

  it('submits the typed reason and shows the success confirmation', async () => {
    const userId = 'user-dialog'
    const { Wrapper } = makeWrapper(userId)

    function Host() {
      const { status } = useSession()
      return (
        <div data-session-status={status} data-testid="host">
          <ReportDialog open onClose={() => {}} targetType="spot" targetId="spot-d" />
        </div>
      )
    }

    render(
      <Wrapper>
        <Host />
      </Wrapper>,
    )

    await waitFor(() =>
      expect(screen.getByTestId('host').getAttribute('data-session-status')).toBe('authed'),
    )

    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText(/what's wrong/i), 'spam')
    await user.click(screen.getByRole('button', { name: /submit report/i }))

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        target_type: 'spot',
        target_id: 'spot-d',
        reporter_id: userId,
        reason: 'spam',
      })
    })

    // Success confirmation replaces the form.
    await waitFor(() =>
      expect(screen.getByText(/we've received your report/i)).toBeInTheDocument(),
    )
  })
})
