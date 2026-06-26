import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createI18n } from '~/lib/i18n/config'
import { Rail } from './Rail'

// ── Session mock ──────────────────────────────────────────────────────────────
// Drive Rail's auth state directly instead of standing up the full provider.
const mockSession = {
  userId: null as string | null,
  status: 'anon' as 'anon' | 'authed' | 'loading',
  openSignIn: vi.fn(),
  signOut: vi.fn(),
  pendingActionRef: { current: null },
}

vi.mock('~/features/auth/session', () => ({
  useSessionContext: () => mockSession,
  useSession: () => ({ userId: mockSession.userId, status: mockSession.status }),
}))

// ── Profile query mock ────────────────────────────────────────────────────────
// currentUserProfileQueryOptions returns a queryFn we can swap per test.
const mockProfileQueryFn = vi.fn().mockResolvedValue(null)
vi.mock('~/features/auth/profile', () => ({
  currentUserProfileQueryOptions: (userId: string | null) => ({
    queryKey: ['profile', userId],
    queryFn: mockProfileQueryFn,
  }),
}))

// ── TanStack Router mock ──────────────────────────────────────────────────────
vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    to?: string
    children?: React.ReactNode
  }) => (
    <a href={props.to ?? '#'} {...props}>
      {children}
    </a>
  ),
  useLocation: () => ({ pathname: '/spots' }),
}))

// ── Helpers ───────────────────────────────────────────────────────────────────
const i18n = createI18n('en')

function renderRail(props: Partial<React.ComponentProps<typeof Rail>> = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <Rail {...props} />
      </I18nextProvider>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mockSession.userId = null
  mockSession.status = 'anon'
  mockProfileQueryFn.mockResolvedValue(null)
})

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('Rail', () => {
  it('renders Map, List, and Saved buttons', () => {
    renderRail()
    expect(screen.getByRole('button', { name: /map/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /list/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /saved/i })).toBeInTheDocument()
  })

  it('calls onOpenSaved when the Saved button is clicked', async () => {
    const user = userEvent.setup()
    const onOpenSaved = vi.fn()
    renderRail({ onOpenSaved })
    await user.click(screen.getByRole('button', { name: /saved/i }))
    expect(onOpenSaved).toHaveBeenCalledOnce()
  })

  it('marks Saved as active (pressed) when its overlay is open', () => {
    renderRail({ savedActive: true })
    const savedBtn = screen.getByRole('button', { name: /saved/i })
    expect(savedBtn).toHaveAttribute('aria-pressed', 'true')
    expect(savedBtn.className).toContain('active')
  })

  it('does NOT render a Community button', () => {
    renderRail()
    expect(screen.queryByRole('button', { name: /community/i })).toBeNull()
    expect(screen.queryByRole('link', { name: /community/i })).toBeNull()
  })

  it('marks Map as active when on /spots', () => {
    renderRail()
    const mapBtn = screen.getByRole('button', { name: /map/i })
    expect(mapBtn.className).toContain('active')
  })

  it('shows the pseudo initial (not the userId) when authed', async () => {
    mockSession.userId = '9f3c0e7a-1234-4abc-9999-aaaabbbbcccc'
    mockSession.status = 'authed'
    mockProfileQueryFn.mockResolvedValue({
      id: mockSession.userId,
      pseudo: 'street_athlete',
      name: null,
      profilePictureUrl: null,
    })

    renderRail()

    const account = await screen.findByRole('button', { name: /account/i })
    // Initial is the first char of the pseudo, never the userId UUID.
    expect(await screen.findByText('S')).toBeInTheDocument()
    expect(account.textContent).not.toContain('9')
  })

  it('renders the avatar image when profilePictureUrl is set', async () => {
    mockSession.userId = 'user-1'
    mockSession.status = 'authed'
    mockProfileQueryFn.mockResolvedValue({
      id: 'user-1',
      pseudo: 'street_athlete',
      name: null,
      profilePictureUrl: 'https://cdn/avatar.png',
    })

    const { container } = renderRail()

    const img = await waitFor(() => {
      const el = container.querySelector('img')
      if (!el) throw new Error('avatar image not rendered yet')
      return el
    })
    expect(img).toHaveAttribute('src', 'https://cdn/avatar.png')
  })

  it('opens the account menu with "Signed in as {pseudo}" and a Profile link', async () => {
    const user = userEvent.setup()
    mockSession.userId = 'user-1'
    mockSession.status = 'authed'
    mockProfileQueryFn.mockResolvedValue({
      id: 'user-1',
      pseudo: 'street_athlete',
      name: null,
      profilePictureUrl: null,
    })

    renderRail()

    await screen.findByText('S')
    await user.click(screen.getByRole('button', { name: /account/i }))

    expect(screen.getByText(/signed in as street_athlete/i)).toBeInTheDocument()
    const profileLink = screen.getByRole('menuitem', { name: /profile/i })
    expect(profileLink).toHaveAttribute('href', '/profile')
  })
})
