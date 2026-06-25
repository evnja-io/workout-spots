import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { trackEvent } from '~/features/analytics/gtag'
import { spotDetailQueryOptions } from '~/features/spots/queries'
import type { SpotDetail } from '~/features/spots/domain'
import { Detail } from '~/features/spots/Detail'
import { ErrorState } from '~/components/ErrorState'

function SpotError({ reset }: { reset: () => void }) {
  const { t } = useTranslation()
  return (
    <ErrorState
      title={t('common.errorTitle')}
      message={t('common.errorMessage')}
      onRetry={reset}
    />
  )
}

export const Route = createFileRoute('/spots/$spotId')({
  loader: async ({ context, params }) => {
    const spotId = (params).spotId
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
  errorComponent: SpotError,
  component: SpotDetailPage,
})

function SpotDetailPage() {
  const params = Route.useParams()
  const spotId = (params).spotId
  const navigate = useNavigate()
  const { data: spot } = useSuspenseQuery(spotDetailQueryOptions(spotId))

  useEffect(() => {
    trackEvent('view_item', { item_id: spotId })
  }, [spotId])

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
    <div className="absolute top-[14px] right-[14px] z-[4] flex max-h-[calc(100vh-28px)] w-[420px] items-center justify-center overflow-hidden rounded-lg border border-border bg-surface p-6 shadow-[var(--shadow-lg)] animate-[slideIn_0.25s_ease]">
      <p className="text-[14px] text-text-3">{t('detail.notFound')}</p>
    </div>
  )
}
