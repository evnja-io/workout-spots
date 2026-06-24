import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { getBrowserSupabase } from '~/lib/supabase/browser'

// ── Types ─────────────────────────────────────────────────────────────────────

export type SessionStatus = 'loading' | 'authed' | 'anon'

interface SessionState {
  userId: string | null
  status: SessionStatus
}

interface SessionContextValue extends SessionState {
  /** Open the sign-in modal (set by SignInModal host) */
  openSignIn: () => void
  /** Pending action to replay once authed */
  pendingActionRef: React.MutableRefObject<(() => void) | null>
}

// ── Context ───────────────────────────────────────────────────────────────────

const SessionContext = createContext<SessionContextValue | null>(null)

// ── Provider ──────────────────────────────────────────────────────────────────

export function SessionProvider({ children }: { children: ReactNode }) {
  // SSR-safe: start loading; never call browser APIs synchronously
  const [userId, setUserId] = useState<string | null>(null)
  const [status, setStatus] = useState<SessionStatus>('loading')
  const [modalOpen, setModalOpen] = useState(false)
  const pendingActionRef = useRef<(() => void) | null>(null)

  // Seed session + subscribe to auth state changes (client-only)
  useEffect(() => {
    const supabase = getBrowserSupabase()

    // Resolve initial session
    void supabase.auth.getSession().then(({ data }) => {
      const id = data.session?.user.id ?? null
      setUserId(id)
      setStatus(id ? 'authed' : 'anon')
    })

    // Listen for subsequent auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const id = session?.user.id ?? null
      setUserId(id)
      setStatus(id ? 'authed' : 'anon')
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Replay pending action once user becomes authed
  useEffect(() => {
    if (status === 'authed' && pendingActionRef.current) {
      const action = pendingActionRef.current
      pendingActionRef.current = null
      setModalOpen(false)
      action()
    }
  }, [status])

  const openSignIn = useCallback(() => {
    setModalOpen(true)
  }, [])

  const closeSignIn = useCallback(() => {
    setModalOpen(false)
    pendingActionRef.current = null
  }, [])

  return (
    <SessionContext.Provider
      value={{ userId, status, openSignIn, pendingActionRef }}
    >
      {children}
      {/* SignInModal is rendered here (lazy import to avoid circular deps) */}
      <SignInModalSlot open={modalOpen} onClose={closeSignIn} />
    </SessionContext.Provider>
  )
}

// ── Slot placeholder (filled by SignInModal export) ───────────────────────────
// We import SignInModal here to keep it co-located with the provider that
// manages its open state.  The import is inside the module (no circular dep).

import { SignInModal } from './SignInModal'

function SignInModalSlot({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return <SignInModal open={open} onClose={onClose} />
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useSession(): SessionState {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>')
  return { userId: ctx.userId, status: ctx.status }
}

export function useSessionContext(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx)
    throw new Error('useSessionContext must be used inside <SessionProvider>')
  return ctx
}
