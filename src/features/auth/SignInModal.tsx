import { useCallback, useState, type FormEvent } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { ResponsiveOverlay } from '~/components/ui/ResponsiveOverlay'
import { Icon } from '~/components/ui/Icon'
import { Button } from '~/components/ui/Button'
import { Input, FieldLabel } from '~/components/ui/Field'
import { Checkbox } from '~/components/ui/Checkbox'
import { getBrowserSupabase } from '~/lib/supabase/browser'
import { TERMS_VERSION } from './consent'

interface SignInModalProps {
  open: boolean
  onClose: () => void
}

type AuthMode = 'signin' | 'signup'

export function SignInModal({ open, onClose }: SignInModalProps) {
  const { t } = useTranslation()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [marketingEmail, setMarketingEmail] = useState(false)
  const [partnerOffers, setPartnerOffers] = useState(false)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const titleId = 'sign-in-modal-title'
  const isSignUp = mode === 'signup'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Terms acceptance only gates account creation (sign-up). Returning users
    // already accepted them, so sign-in has no consent step.
    if (isSignUp && !termsAccepted) return
    setLoading(true)
    const emailRedirectTo = window.location.origin + '/auth/callback'
    // Sign-up: consent rides along as auth user-metadata — no public.users row
    // exists yet (the handle_new_user trigger creates it once the magic link is
    // clicked) and the trigger reads these fields to populate the consent
    // columns. Sign-in passes shouldCreateUser:false so an unknown email can't
    // create an account without accepting the terms.
    await getBrowserSupabase().auth.signInWithOtp({
      email,
      options: isSignUp
        ? {
            emailRedirectTo,
            shouldCreateUser: true,
            data: {
              terms_version: TERMS_VERSION,
              marketing_email_opt_in: marketingEmail,
              partner_offers_opt_in: partnerOffers,
            },
          }
        : {
            emailRedirectTo,
            shouldCreateUser: false,
          },
    })
    setLoading(false)
    setSent(true)
  }

  // Stable reference so Modal's focus-on-open effect doesn't re-fire
  // on every keystroke (which would steal focus from the email input).
  const handleClose = useCallback(() => {
    setSent(false)
    setMode('signin')
    setEmail('')
    setTermsAccepted(false)
    setMarketingEmail(false)
    setPartnerOffers(false)
    onClose()
  }, [onClose])

  return (
    <ResponsiveOverlay open={open} onClose={handleClose} labelledBy={titleId} desktopClassName="w-[440px]">
      <div className="flex items-center justify-between border-b border-border px-[22px] py-[18px]">
        <h2 id={titleId} className="m-0 text-[17px] font-semibold tracking-[-0.01em]">
          {isSignUp ? t('auth.signUpTitle') : t('auth.signInTitle')}
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
            <p className="m-0 text-[13.5px] leading-[1.5] text-text-3">
              {isSignUp ? t('auth.signUpRequired') : t('auth.required')}
            </p>
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
            {/* Consent only applies to account creation (sign-up). */}
            {isSignUp && (
              <div className="flex flex-col gap-2.5">
                <Checkbox
                  id="sign-in-terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                >
                  <Trans
                    i18nKey="auth.consent.terms"
                    components={{
                      terms: (
                        <a
                          href="/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent underline underline-offset-2"
                        />
                      ),
                      privacy: (
                        <a
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent underline underline-offset-2"
                        />
                      ),
                    }}
                  />
                </Checkbox>
                <Checkbox
                  id="sign-in-marketing-email"
                  checked={marketingEmail}
                  onChange={(e) => setMarketingEmail(e.target.checked)}
                >
                  {t('auth.consent.marketingEmail')}
                </Checkbox>
                <Checkbox
                  id="sign-in-partner-offers"
                  checked={partnerOffers}
                  onChange={(e) => setPartnerOffers(e.target.checked)}
                >
                  {t('auth.consent.partnerOffers')}
                </Checkbox>
              </div>
            )}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading || !email.trim() || (isSignUp && !termsAccepted)}
            >
              {loading ? t('auth.signingIn') : isSignUp ? t('auth.sendSignUpLink') : t('auth.sendLink')}
            </Button>

            <p className="m-0 text-center text-[13px] text-text-3">
              {isSignUp ? t('auth.haveAccountPrompt') : t('auth.noAccountPrompt')}{' '}
              <button
                type="button"
                className="cursor-pointer border-none bg-transparent p-0 font-medium text-accent underline underline-offset-2 hover:text-accent-2"
                onClick={() => setMode(isSignUp ? 'signin' : 'signup')}
              >
                {isSignUp ? t('auth.switchToSignIn') : t('auth.switchToSignUp')}
              </button>
            </p>
          </form>
        )}
      </div>
    </ResponsiveOverlay>
  )
}
