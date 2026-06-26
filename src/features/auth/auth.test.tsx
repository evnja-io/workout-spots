import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createI18n } from '~/lib/i18n/config'
import { SessionProvider, useSession } from './session'
import { useAuthGate } from './useAuthGate'

// ── Supabase browser mock ─────────────────────────────────────────────────────

const mockUnsubscribe = vi.fn()
const mockSignInWithOtp = vi.fn().mockResolvedValue({ data: {}, error: null })
const mockGetSession = vi
  .fn()
  .mockResolvedValue({ data: { session: null }, error: null })
const mockOnAuthStateChange = vi.fn().mockReturnValue({
  data: { subscription: { unsubscribe: mockUnsubscribe } },
})

vi.mock('~/lib/supabase/browser', () => ({
  getBrowserSupabase: () => ({
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
      signInWithOtp: mockSignInWithOtp,
    },
  }),
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

// A component that shows current auth status
function StatusDisplay() {
  const { status } = useSession()
  return <span data-testid="status">{status}</span>
}

// A component that exercises useAuthGate
const actionSpy = vi.fn()

function GatedButton() {
  const gate = useAuthGate()
  return (
    <button onClick={() => gate(actionSpy)}>Protected action</button>
  )
}

// ── Tests ─────────────────────────────────────────────────────────────────────

// Clear call history between tests (keeps the mockResolvedValue defaults) so
// each submit assertion reads its own signInWithOtp call.
beforeEach(() => {
  vi.clearAllMocks()
})

describe('SessionProvider', () => {
  it('starts in loading state then resolves to anon when no session', async () => {
    render(
      <Wrapper>
        <StatusDisplay />
      </Wrapper>,
    )

    // Initial render: loading
    expect(screen.getByTestId('status').textContent).toBe('loading')

    // After effect runs: anon (getSession returns null)
    await waitFor(() =>
      expect(screen.getByTestId('status').textContent).toBe('anon'),
    )
  })

  it('unsubscribes from onAuthStateChange on unmount', async () => {
    const { unmount } = render(
      <Wrapper>
        <StatusDisplay />
      </Wrapper>,
    )
    await waitFor(() =>
      expect(screen.getByTestId('status').textContent).toBe('anon'),
    )
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })
})

describe('useAuthGate + SignInModal', () => {
  it('opens sign-in modal when anon user triggers gated action', async () => {
    const user = userEvent.setup()

    render(
      <Wrapper>
        <GatedButton />
      </Wrapper>,
    )

    // Wait for anon state
    await waitFor(() => {
      expect(mockGetSession).toHaveBeenCalled()
    })

    await user.click(screen.getByRole('button', { name: 'Protected action' }))

    // Modal should be open — sign-in title visible
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    })

    // Gated action was NOT called
    expect(actionSpy).not.toHaveBeenCalled()
  })

  it('sign-in mode: no consent shown, submits with just an email and shouldCreateUser false', async () => {
    const user = userEvent.setup()

    render(
      <Wrapper>
        <GatedButton />
      </Wrapper>,
    )

    await waitFor(() => expect(mockGetSession).toHaveBeenCalled())
    await user.click(screen.getByRole('button', { name: 'Protected action' }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    })

    // Consent block is hidden in sign-in mode.
    expect(screen.queryByRole('checkbox', { name: /i agree/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: /product update emails/i })).not.toBeInTheDocument()

    const emailInput = screen.getByLabelText(/email address/i)
    await user.clear(emailInput)
    await user.type(emailInput, 'test@example.com', { skipClick: false })

    // Submit enables with just a valid email — no terms gate.
    const sendBtn = screen.getByRole('button', { name: /send sign-in link/i })
    expect(sendBtn).toBeEnabled()
    await user.click(sendBtn)

    await waitFor(() => {
      const [callArg] = mockSignInWithOtp.mock.calls.at(-1) as [
        { email: string; options: { emailRedirectTo: string; shouldCreateUser: boolean; data?: unknown } },
      ]
      expect(callArg.email).toBe('test@example.com')
      expect(callArg.options.emailRedirectTo).toContain('/auth/callback')
      // Sign-in must not create a new account (no terms accepted).
      expect(callArg.options.shouldCreateUser).toBe(false)
      expect(callArg.options.data).toBeUndefined()
    })

    await waitFor(() => {
      expect(screen.getByText(/check your inbox/i)).toBeInTheDocument()
    })
    expect(actionSpy).not.toHaveBeenCalled()
  })

  it('sign-up mode: passes consent metadata and shouldCreateUser true on submit', async () => {
    const user = userEvent.setup()

    render(
      <Wrapper>
        <GatedButton />
      </Wrapper>,
    )

    await waitFor(() => expect(mockGetSession).toHaveBeenCalled())
    await user.click(screen.getByRole('button', { name: 'Protected action' }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    })

    // Switch to sign-up (exact name so it doesn't match the submit button label).
    await user.click(screen.getByRole('button', { name: 'Sign up' }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText(/email address/i)
    await user.clear(emailInput)
    await user.type(emailInput, 'test@example.com', { skipClick: false })

    // Terms acceptance is required to create an account.
    await user.click(screen.getByRole('checkbox', { name: /i agree/i }))
    await user.click(screen.getByRole('button', { name: /send sign-up link/i }))

    await waitFor(() => {
      const [callArg] = mockSignInWithOtp.mock.calls.at(-1) as [
        {
          email: string
          options: {
            emailRedirectTo: string
            shouldCreateUser: boolean
            data: {
              terms_version: string
              marketing_email_opt_in: boolean
              partner_offers_opt_in: boolean
            }
          }
        },
      ]
      expect(callArg.email).toBe('test@example.com')
      expect(callArg.options.emailRedirectTo).toContain('/auth/callback')
      expect(callArg.options.shouldCreateUser).toBe(true)
      expect(callArg.options.data.terms_version).toBeTruthy()
      // Marketing opt-ins default off (GDPR: unticked by default)
      expect(callArg.options.data.marketing_email_opt_in).toBe(false)
      expect(callArg.options.data.partner_offers_opt_in).toBe(false)
    })

    await waitFor(() => {
      expect(screen.getByText(/check your inbox/i)).toBeInTheDocument()
    })
    expect(actionSpy).not.toHaveBeenCalled()
  })

  it('sign-up mode: keeps submit disabled until terms are accepted; marketing boxes start unchecked', async () => {
    const user = userEvent.setup()
    render(
      <Wrapper>
        <GatedButton />
      </Wrapper>,
    )
    await waitFor(() => expect(mockGetSession).toHaveBeenCalled())
    await user.click(screen.getByRole('button', { name: 'Protected action' }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Sign up' }))
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com')

    const sendBtn = screen.getByRole('button', { name: /send sign-up link/i })
    expect(sendBtn).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: /product update emails/i })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: /offers from our partners/i })).not.toBeChecked()

    await user.click(screen.getByRole('checkbox', { name: /i agree/i }))
    expect(sendBtn).toBeEnabled()
  })

  it('sign-up mode: passes the chosen marketing opt-ins as signInWithOtp metadata', async () => {
    const user = userEvent.setup()
    render(
      <Wrapper>
        <GatedButton />
      </Wrapper>,
    )
    await waitFor(() => expect(mockGetSession).toHaveBeenCalled())
    await user.click(screen.getByRole('button', { name: 'Protected action' }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Sign up' }))
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await user.click(screen.getByRole('checkbox', { name: /i agree/i }))
    await user.click(screen.getByRole('checkbox', { name: /product update emails/i }))
    await user.click(screen.getByRole('button', { name: /send sign-up link/i }))

    await waitFor(() => {
      const [callArg] = mockSignInWithOtp.mock.calls.at(-1) as [
        {
          options: {
            data: { marketing_email_opt_in: boolean; partner_offers_opt_in: boolean }
          }
        },
      ]
      expect(callArg.options.data.marketing_email_opt_in).toBe(true)
      expect(callArg.options.data.partner_offers_opt_in).toBe(false)
    })
  })
})
