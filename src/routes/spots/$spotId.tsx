import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { spotDetailQueryOptions } from '~/features/spots/queries'
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
  return (
    <div
      className="detail"
      style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Spot not found</p>
    </div>
  )
}
