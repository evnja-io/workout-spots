import { useTranslation } from 'react-i18next'

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
      style={{
        position: 'fixed',
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 60,
        margin: '0 auto',
        maxWidth: 480,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 16,
        background: 'var(--surface)',
        color: 'var(--text)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.4, color: 'var(--text-2)' }}>
        {t('cookieConsent.description')}
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-secondary" onClick={onDecline}>
          {t('cookieConsent.decline')}
        </button>
        <button type="button" className="btn btn-primary" onClick={onAccept}>
          {t('cookieConsent.accept')}
        </button>
      </div>
    </div>
  )
}
