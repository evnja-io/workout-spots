import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'

// Placeholder — the create-club form lands in Phase 3 (Clubs write path).
export const Route = createFileRoute('/clubs/new')({
  component: CreateClubPage,
})

function CreateClubPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <div className="mx-auto max-w-xl px-5 py-8">
      <button
        type="button"
        onClick={() => void navigate({ to: '/clubs' })}
        className="mb-4 inline-flex items-center gap-1 text-[13px] font-medium text-text-3 hover:text-text"
      >
        <Icon name="chevronL" size={16} />
        {t('clubs.backToClubs')}
      </button>
      <h1 className="text-[22px] font-semibold text-text">{t('clubs.create')}</h1>
      <p className="mt-2 text-[14px] text-text-3">{t('clubs.comingSoon')}</p>
    </div>
  )
}
