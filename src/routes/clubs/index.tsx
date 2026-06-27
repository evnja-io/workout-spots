import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/clubs/')({
  component: ClubsBrowse,
})

function ClubsBrowse() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <h1 className="text-[22px] font-semibold text-text">{t('clubs.title')}</h1>
      <p className="mt-2 text-[14px] text-text-3">{t('clubs.comingSoon')}</p>
    </div>
  )
}
