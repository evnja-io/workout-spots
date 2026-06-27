import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { trackEvent } from '~/features/analytics/gtag'
import { eventDetailQueryOptions } from '~/features/events/queries'
import type { EventDetail as EventDetailType } from '~/features/events/domain'
import { EventDetail } from '~/features/events/components/EventDetail'
import { ErrorState } from '~/components/ErrorState'
import { SITE_URL } from '~/routes/__root'

export const Route = createFileRoute('/events/$eventId')({
  loader: async ({ context, params }) => {
    let event
    try {
      event = await context.queryClient.ensureQueryData(eventDetailQueryOptions(params.eventId))
    } catch {
      throw notFound()
    }
    if (!event) throw notFound()
    return { event }
  },
  head: ({ params, match }) => {
    const event = match.context.queryClient.getQueryData<EventDetailType | null>(
      eventDetailQueryOptions(params.eventId).queryKey,
    )
    const title = event?.title ? `${event.title} · Events · Workout Spots` : 'Event · Workout Spots'
    const description =
      event?.description ||
      `${event?.title ?? 'An event'} — a Workout Spots meetup. See when, where and how to join.`
    const url = `${SITE_URL}/events/${params.eventId}`
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
      ],
      links: [{ rel: 'canonical', href: url }],
    }
  },
  pendingComponent: EventDetailPending,
  notFoundComponent: EventNotFound,
  errorComponent: EventError,
  component: EventDetailPage,
})

function EventDetailPage() {
  const { eventId } = Route.useParams()
  const navigate = useNavigate()
  const { event: initialEvent } = Route.useLoaderData()
  const { data: event } = useSuspenseQuery({
    ...eventDetailQueryOptions(eventId),
    initialData: initialEvent,
  })

  useEffect(() => {
    trackEvent('view_event', { event_id: eventId })
  }, [eventId])

  if (!event) return null

  return (
    <EventDetail
      event={event}
      onBack={() => void navigate({ to: '/events' })}
      onOpenSpot={(spotId) => void navigate({ to: '/spots/$spotId', params: { spotId } })}
    />
  )
}

function EventDetailPending() {
  return (
    <div>
      <div className="h-52 w-full animate-pulse bg-surface-2 md:h-64" />
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 md:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-3">
          <div className="h-16 w-full animate-pulse rounded-xl bg-surface-2" />
          <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-surface-2" />
        </div>
        <div className="hidden h-56 animate-pulse rounded-xl bg-surface-2 md:block" />
      </div>
    </div>
  )
}

function EventNotFound() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 text-center text-[14px] text-text-3">
      {t('events.notFound')}
    </div>
  )
}

function EventError({ reset }: { reset: () => void }) {
  const { t } = useTranslation()
  return (
    <ErrorState title={t('common.errorTitle')} message={t('common.errorMessage')} onRetry={reset} />
  )
}
