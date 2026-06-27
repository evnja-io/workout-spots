import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { EventCreate } from '~/features/events/components/EventCreate'

export const Route = createFileRoute('/events/new')({
  component: CreateEventPage,
})

function CreateEventPage() {
  const navigate = useNavigate()
  return <EventCreate onCancel={() => void navigate({ to: '/events' })} />
}
