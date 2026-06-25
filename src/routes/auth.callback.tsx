import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getBrowserSupabase } from '~/lib/supabase/browser'
import { trackEvent } from '~/features/analytics/gtag'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallbackComponent,
})

function AuthCallbackComponent() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getBrowserSupabase()
    let settled = false

    // Heuristic to split sign_up from login: a brand-new account's `created_at`
    // is within minutes of this verification (magic-link request → click).
    // Returning users have an old `created_at`. Errs toward `login`.
    const goHome = (createdAt?: string) => {
      if (settled) return
      settled = true
      const created = createdAt ? new Date(createdAt).getTime() : 0
      const isNew = created > 0 && Date.now() - created < 5 * 60 * 1000
      trackEvent(isNew ? 'sign_up' : 'login')
      void navigate({ to: '/spots' })
    }

    // The @supabase/ssr browser client has `detectSessionInUrl` enabled, so it
    // automatically exchanges the `?code=` (PKCE) on load and establishes the
    // session. We must NOT also call exchangeCodeForSession manually — that races
    // the auto-exchange, loses (the code is single-use), and errors even though
    // sign-in succeeded. Instead, redirect as soon as a session exists.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) goHome(session.user.created_at)
    })

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) goHome(data.session.user.created_at)
    })

    // If no session materialises, the link was invalid or expired.
    const timer = setTimeout(() => {
      if (!settled) setError(t('auth.signInFailed'))
    }, 6000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timer)
    }
  }, [navigate, t])

  if (error) {
    return <p>{error}</p>
  }

  return <p>{t('auth.signingIn')}</p>
}
