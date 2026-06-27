import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { eventDetailQueryOptions } from '~/features/events/queries'
import { EventManage } from '~/features/events/components/EventManage'

export const Route = createFileRoute('/events/$eventId_/manage')({
  loader: async ({ context, params }) => {
    const event = await context.queryClient.ensureQueryData(eventDetailQueryOptions(params.eventId))
    if (!event) throw notFound()
    return { event }
  },
  component: EventManagePage,
})

function EventManagePage() {
  const { eventId } = Route.useParams()
  const navigate = useNavigate()
  const { event: initialEvent } = Route.useLoaderData()
  const { data: event } = useSuspenseQuery({
    ...eventDetailQueryOptions(eventId),
    initialData: initialEvent,
  })
  if (!event) return null
  return (
    <EventManage
      event={event}
      onBack={() => void navigate({ to: '/events/$eventId', params: { eventId } })}
    />
  )
}
