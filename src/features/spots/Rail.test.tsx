import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createI18n } from '~/lib/i18n/config'
import { SessionProvider } from '~/features/auth/session'
import { Rail } from './Rail'

// ── Supabase browser mock ─────────────────────────────────────────────────────
vi.mock('~/lib/supabase/browser', () => ({
  getBrowserSupabase: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  }),
}))

// ── TanStack Router mock ──────────────────────────────────────────────────────
// Rail uses useLocation from @tanstack/react-router; mock it for unit tests.
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string; children?: React.ReactNode }) => (
    <a href={props.to ?? '#'} {...props}>
      {children}
    </a>
  ),
  useLocation: () => ({ pathname: '/spots' }),
}))

// ── Helpers ───────────────────────────────────────────────────────────────────
const i18n = createI18n('en')
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <SessionProvider>{children}</SessionProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('Rail', () => {
  it('renders Map, List, and Saved buttons', () => {
    render(
      <Wrapper>
        <Rail />
      </Wrapper>,
    )

    expect(screen.getByRole('button', { name: /map/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /list/i })).toBeInTheDocument()
    // Saved is a link, query by role link or button with aria-label
    expect(
      screen.getByRole('link', { name: /saved/i }),
    ).toBeInTheDocument()
  })

  it('does NOT render a Community button', () => {
    render(
      <Wrapper>
        <Rail />
      </Wrapper>,
    )

    expect(
      screen.queryByRole('button', { name: /community/i }),
    ).toBeNull()
    expect(
      screen.queryByRole('link', { name: /community/i }),
    ).toBeNull()
  })

  it('marks Map as active when on /spots', () => {
    render(
      <Wrapper>
        <Rail />
      </Wrapper>,
    )

    const mapBtn = screen.getByRole('button', { name: /map/i })
    expect(mapBtn.className).toContain('active')
  })
})
