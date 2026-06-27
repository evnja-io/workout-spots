import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { useCreateEvent } from '../mutations'
import { EventForm } from './EventForm'

export function EventCreate({ onCancel }: { onCancel: () => void }) {
  const { t } = useTranslation()
  const { create, pending } = useCreateEvent()

  return (
    <div className="mx-auto max-w-xl px-5 py-8">
      <button
        type="button"
        onClick={onCancel}
        className="mb-4 inline-flex items-center gap-1 text-[13px] font-medium text-text-3 hover:text-text"
      >
        <Icon name="chevronL" size={16} />
        {t('events.backToEvents')}
      </button>
      <h1 className="text-[22px] font-semibold text-text">{t('events.create')}</h1>

      <div className="mt-6">
        <EventForm
          submitLabel={t('events.create')}
          pending={pending}
          onCancel={onCancel}
          onSubmit={({ values, featured, gallery }) => create(values, featured, gallery)}
        />
      </div>
    </div>
  )
}
