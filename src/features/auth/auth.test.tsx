import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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

  it('calls signInWithOtp with emailRedirectTo containing /auth/callback on submit', async () => {
    const user = userEvent.setup()

    render(
      <Wrapper>
        <GatedButton />
      </Wrapper>,
    )

    // Wait for anon
    await waitFor(() => expect(mockGetSession).toHaveBeenCalled())

    // Open modal
    await user.click(screen.getByRole('button', { name: 'Protected action' }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    })

    // Fill in email — use fill() to set value directly (avoids focus-trap interference)
    const emailInput = screen.getByLabelText(/email address/i)
    await user.clear(emailInput)
    await user.type(emailInput, 'test@example.com', { skipClick: false })

    // Submit
    await user.click(screen.getByRole('button', { name: /send sign-in link/i }))

    await waitFor(() => {
      const [callArg] = mockSignInWithOtp.mock.calls[0] as [
        { email: string; options: { emailRedirectTo: string } },
      ]
      expect(callArg.email).toBe('test@example.com')
      expect(callArg.options.emailRedirectTo).toContain('/auth/callback')
    })

    // After submit, "check inbox" message shown
    await waitFor(() => {
      expect(
        screen.getByText(/check your inbox/i),
      ).toBeInTheDocument()
    })

    // Gated action still NOT called (user not authed yet)
    expect(actionSpy).not.toHaveBeenCalled()
  })
})
