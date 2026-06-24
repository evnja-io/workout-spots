import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { spotDetailQueryOptions } from '~/features/spots/queries'
import type { SpotDetail } from '~/features/spots/domain'
import { Detail } from '~/features/spots/Detail'

export const Route = createFileRoute('/spots/$spotId')({
  loader: async ({ context, params }) => {
    const spotId = (params as { spotId: string }).spotId
    try {
      const data = await context.queryClient.ensureQueryData(spotDetailQueryOptions(spotId))
      if (!data) throw notFound()
    } catch (e) {
      if (e && typeof e === 'object' && 'isNotFound' in e) throw e
      throw notFound()
    }
  },
  head: ({ params, match }) => {
    const spot = match.context.queryClient.getQueryData<SpotDetail | null>(
      spotDetailQueryOptions(params.spotId).queryKey
    )
    return {
      meta: [
        { title: spot?.name ?? 'Workout Spot' },
        { name: 'description', content: spot?.description ?? '' },
      ],
    }
  },
  notFoundComponent: SpotNotFound,
  component: SpotDetailPage,
})

function SpotDetailPage() {
  const params = Route.useParams()
  const spotId = (params as { spotId: string }).spotId
  const navigate = useNavigate()
  const { data: spot } = useSuspenseQuery(spotDetailQueryOptions(spotId))

  if (!spot) return null

  return (
    <Detail
      spot={spot}
      onClose={() => void navigate({ to: '/spots', search: (p) => p })}
    />
  )
}

function SpotNotFound() {
  const { t } = useTranslation()
  return (
    <div
      className="detail"
      style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <p style={{ color: 'var(--text-3)', fontSize: 14 }}>{t('detail.notFound')}</p>
    </div>
  )
}
