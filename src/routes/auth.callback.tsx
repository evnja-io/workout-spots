import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getBrowserSupabase } from '~/lib/supabase/browser'

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

    const goHome = () => {
      if (settled) return
      settled = true
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
      if (session) goHome()
    })

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) goHome()
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
