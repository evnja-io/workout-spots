import { useTranslation } from 'react-i18next'
import { Button } from '~/components/ui/Button'

interface CookieBannerProps {
  onAccept: () => void
  onDecline: () => void
}

export function CookieBanner({ onAccept, onDecline }: CookieBannerProps) {
  const { t } = useTranslation()

  return (
    <div
      role="dialog"
      aria-label={t('cookieConsent.title')}
      className="fixed bottom-4 left-4 right-4 z-[60] mx-auto flex max-w-[480px] flex-col gap-3 rounded-[12px] border border-border bg-surface p-4 text-text shadow-[var(--shadow-lg)]"
    >
      <p className="m-0 text-[14px] leading-[1.4] text-text-2">{t('cookieConsent.description')}</p>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onDecline}>
          {t('cookieConsent.decline')}
        </Button>
        <Button type="button" variant="primary" onClick={onAccept}>
          {t('cookieConsent.accept')}
        </Button>
      </div>
    </div>
  )
}
