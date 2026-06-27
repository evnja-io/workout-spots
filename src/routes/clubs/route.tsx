import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SectionShell } from '~/features/navigation/SectionShell'

export const Route = createFileRoute('/clubs')({
  component: ClubsLayout,
})

function ClubsLayout() {
  return (
    <SectionShell>
      <Outlet />
    </SectionShell>
  )
}
