import { useCallback, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '~/components/ui/Modal'
import { getBrowserSupabase } from '~/lib/supabase/browser'

interface SignInModalProps {
  open: boolean
  onClose: () => void
}

export function SignInModal({ open, onClose }: SignInModalProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const titleId = 'sign-in-modal-title'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const emailRedirectTo = window.location.origin + '/auth/callback'
    await getBrowserSupabase().auth.signInWithOtp({
      email,
      options: { emailRedirectTo },
    })
    setLoading(false)
    setSent(true)
  }

  // Stable reference so Modal's focus-on-open effect doesn't re-fire
  // on every keystroke (which would steal focus from the email input).
  const handleClose = useCallback(() => {
    setSent(false)
    setEmail('')
    onClose()
  }, [onClose])

  return (
    <Modal open={open} onClose={handleClose} labelledBy={titleId}>
      <h2 id={titleId}>{t('auth.signInTitle')}</h2>

      {sent ? (
        <p role="status">{t('auth.checkInbox')}</p>
      ) : (
        <form onSubmit={(e) => void handleSubmit(e)}>
          <label htmlFor="sign-in-email">{t('auth.emailLabel')}</label>
          <input
            id="sign-in-email"
            type="email"
            value={email}
            placeholder={t('auth.emailPlaceholder')}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <button type="submit" disabled={loading}>
            {loading ? t('auth.signingIn') : t('auth.sendLink')}
          </button>
        </form>
      )}
    </Modal>
  )
}
