import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/events/')({
  component: EventsBrowse,
})

function EventsBrowse() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <h1 className="text-[22px] font-semibold text-text">{t('events.title')}</h1>
      <p className="mt-2 text-[14px] text-text-3">{t('events.comingSoon')}</p>
    </div>
  )
}
