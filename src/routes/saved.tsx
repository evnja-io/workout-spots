import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSession, useSessionContext } from '~/features/auth/session'
import { savedSpotsQueryOptions } from '~/features/likes/queries'
import { SpotCard } from '~/features/spots/SpotCard'
import { ErrorState } from '~/components/ErrorState'

function SavedError({ reset }: { reset: () => void }) {
  const { t } = useTranslation()
  return (
    <ErrorState
      title={t('common.errorTitle')}
      message={t('common.errorMessage')}
      onRetry={reset}
    />
  )
}

function SavedPending() {
  return <div className="px-5 py-10 text-center text-[13px] text-text-3" aria-busy="true" />
}

export const Route = createFileRoute('/saved')({
  pendingComponent: SavedPending,
  errorComponent: SavedError,
  component: SavedPage,
})

function SavedPage() {
  const { t } = useTranslation()
  const { userId, status } = useSession()
  const { openSignIn } = useSessionContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (status === 'anon') {
      openSignIn()
      void navigate({ to: '/spots' })
    }
  }, [status, openSignIn, navigate])

  const { data: spots = [] } = useQuery(savedSpotsQueryOptions(userId))

  if (status === 'loading') {
    return <div className="h-screen" />
  }

  if (status === 'anon') {
    return null
  }

  return (
    <div className="mx-auto flex h-screen max-w-[680px] flex-col overflow-hidden p-6">
      <h1 className="mb-4 text-[20px] font-semibold tracking-[-0.01em]">{t('saved.title')}</h1>
      {spots.length === 0 ? (
        <p className="text-[13px] text-text-3">{t('saved.empty')}</p>
      ) : (
        <div className="flex-1 overflow-y-auto pb-5">
          {spots.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              active={false}
              onClick={() => void navigate({ to: '/spots/$spotId', params: { spotId: spot.id } })}
            />
          ))}
        </div>
      )}
    </div>
  )
}
