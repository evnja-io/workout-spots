import { useCallback, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ResponsiveOverlay } from '~/components/ui/ResponsiveOverlay'
import { Icon } from '~/components/ui/Icon'
import { Button } from '~/components/ui/Button'
import { Input, FieldLabel } from '~/components/ui/Field'
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
    <ResponsiveOverlay open={open} onClose={handleClose} labelledBy={titleId} desktopClassName="w-[440px]">
      <div className="flex items-center justify-between border-b border-border px-[22px] py-[18px]">
        <h2 id={titleId} className="m-0 text-[17px] font-semibold tracking-[-0.01em]">
          {t('auth.signInTitle')}
        </h2>
        <button
          type="button"
          className="grid size-[30px] place-items-center rounded-[8px] text-text-3 transition-colors duration-150 hover:bg-surface-2 hover:text-text"
          aria-label={t('common.cancel')}
          onClick={handleClose}
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto px-[22px] py-[18px]">
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-2.5 text-center">
            <div className="grid size-[52px] place-items-center rounded-full bg-accent-soft">
              <Icon name="user" size={22} color="var(--accent)" />
            </div>
            <p role="status" className="m-0 text-[14px] leading-[1.5] text-text-2">
              {t('auth.checkInbox')}
            </p>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={(e) => void handleSubmit(e)}>
            <p className="m-0 text-[13.5px] leading-[1.5] text-text-3">{t('auth.required')}</p>
            <div>
              <FieldLabel htmlFor="sign-in-email">{t('auth.emailLabel')}</FieldLabel>
              <Input
                id="sign-in-email"
                type="email"
                value={email}
                placeholder={t('auth.emailPlaceholder')}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <Button type="submit" variant="primary" className="w-full flex-none" disabled={loading}>
              {loading ? t('auth.signingIn') : t('auth.sendLink')}
            </Button>
          </form>
        )}
      </div>
    </ResponsiveOverlay>
  )
}
