import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SectionShell } from '~/features/navigation/SectionShell'

export const Route = createFileRoute('/events')({
  component: EventsLayout,
})

function EventsLayout() {
  return (
    <SectionShell>
      <Outlet />
    </SectionShell>
  )
}
