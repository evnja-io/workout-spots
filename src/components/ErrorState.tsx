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
    <div className="px-5 py-10 text-center text-[13px] text-text-3" role="alert">
      <p className="mb-1 font-semibold text-text">{title}</p>
      <p>{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          {t('common.retry')}
        </Button>
      )}
    </div>
  )
}
