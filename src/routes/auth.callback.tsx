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
    // PKCE flow: exchange the ?code= parameter for a session.
    // exchangeCodeForSession accepts the full URL (reads the code query param).
    void supabase.auth
      .exchangeCodeForSession(window.location.href)
      .then(({ error: err }) => {
        if (err) {
          setError(err.message)
        } else {
          // Redirect to /spots (the main app destination after sign-in)
          void navigate({ to: '/spots' })
        }
      })
  }, [navigate])

  if (error) {
    return <p>Sign-in failed: {error}</p>
  }

  return <p>{t('auth.signingIn')}</p>
}
