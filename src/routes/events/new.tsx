import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'

// Placeholder — the create-event form lands in Phase 5 (Events write path).
export const Route = createFileRoute('/events/new')({
  component: CreateEventPage,
})

function CreateEventPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <div className="mx-auto max-w-xl px-5 py-8">
      <button
        type="button"
        onClick={() => void navigate({ to: '/events' })}
        className="mb-4 inline-flex items-center gap-1 text-[13px] font-medium text-text-3 hover:text-text"
      >
        <Icon name="chevronL" size={16} />
        {t('events.backToEvents')}
      </button>
      <h1 className="text-[22px] font-semibold text-text">{t('events.create')}</h1>
      <p className="mt-2 text-[14px] text-text-3">{t('events.comingSoon')}</p>
    </div>
  )
}
