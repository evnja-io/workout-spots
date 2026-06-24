import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSession, useSessionContext } from '~/features/auth/session'
import { savedSpotsQueryOptions } from '~/features/likes/queries'
import { SpotCard } from '~/features/spots/SpotCard'

export const Route = createFileRoute('/saved')({
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
    return <div className="saved-loading" />
  }

  if (status === 'anon') {
    return null
  }

  return (
    <div className="saved-page">
      <h1>{t('saved.title')}</h1>
      {spots.length === 0 ? (
        <p className="saved-empty">{t('saved.empty')}</p>
      ) : (
        <div className="spot-list">
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
