import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { MobileNav } from './MobileNav'

// ── Session mock ──────────────────────────────────────────────────────────────
const mockSession = {
  status: 'anon' as 'anon' | 'authed' | 'loading',
  openSignIn: vi.fn(),
  signOut: vi.fn(),
}
vi.mock('~/features/auth/session', () => ({
  useSessionContext: () => mockSession,
}))

// ── Router mock (mutable pathname) ────────────────────────────────────────────
const mockNavigate = vi.fn()
let mockPathname = '/spots'
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
  useLocation: () => ({ pathname: mockPathname }),
  useNavigate: () => mockNavigate,
}))

const i18n = createI18n('en')
function renderNav(props: Partial<React.ComponentProps<typeof MobileNav>> = {}) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MobileNav onOpenSettings={() => {}} {...props} />
    </I18nextProvider>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mockPathname = '/spots'
  mockSession.status = 'anon'
})

describe('MobileNav', () => {
  it('renders Spots, Clubs and Events destinations', () => {
    renderNav()
    expect(screen.getByRole('link', { name: 'Spots' })).toHaveAttribute('href', '/spots')
    expect(screen.getByRole('link', { name: 'Clubs' })).toHaveAttribute('href', '/clubs')
    expect(screen.getByRole('link', { name: 'Events' })).toHaveAttribute('href', '/events')
  })

  it('the + calls onCreateSpot on the spots route', async () => {
    const user = userEvent.setup()
    const onCreateSpot = vi.fn()
    renderNav({ onCreateSpot })
    await user.click(screen.getByTestId('mobile-create-fab'))
    expect(onCreateSpot).toHaveBeenCalledOnce()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('the + navigates to /clubs/new on the clubs route', async () => {
    const user = userEvent.setup()
    mockPathname = '/clubs'
    renderNav()
    await user.click(screen.getByTestId('mobile-create-fab'))
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/clubs/new' })
  })

  it('Account sheet exposes Settings', async () => {
    const user = userEvent.setup()
    const onOpenSettings = vi.fn()
    renderNav({ onOpenSettings })
    await user.click(screen.getByRole('button', { name: /account/i }))
    await user.click(screen.getByRole('button', { name: /settings/i }))
    expect(onOpenSettings).toHaveBeenCalledOnce()
  })
})
