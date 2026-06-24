import { useTranslation } from 'react-i18next'
import { Button } from '~/components/ui/Button'

type ErrorStateProps = {
  title: string
  message: string
  onRetry?: () => void
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation()
  return (
    <div className="empty" role="alert">
      <p className="empty-title">{title}</p>
      <p className="empty-message">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          {t('common.retry')}
        </Button>
      )}
    </div>
  )
}
