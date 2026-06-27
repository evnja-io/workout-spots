import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { eventsListQueryOptions } from '~/features/events/queries'
import { EventsBrowse } from '~/features/events/components/EventsBrowse'

export const Route = createFileRoute('/events/')({
  loader: async ({ context }) => ({
    events: await context.queryClient.ensureQueryData(eventsListQueryOptions()),
  }),
  component: EventsBrowsePage,
})

function EventsBrowsePage() {
  const navigate = useNavigate()
  const { events: initialEvents } = Route.useLoaderData()
  const { data: events } = useQuery({ ...eventsListQueryOptions(), initialData: initialEvents })

  return (
    <EventsBrowse
      events={events}
      loading={false}
      onOpen={(id) => void navigate({ to: '/events/$eventId', params: { eventId: id } })}
      onCreate={() => void navigate({ to: '/events/new' })}
    />
  )
}
