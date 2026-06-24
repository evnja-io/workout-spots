import { createFileRoute, Outlet } from '@tanstack/react-router'
import { spotRouteSearchSchema } from '~/features/spots/filters'
import { Rail } from '~/features/spots/Rail'

export const Route = createFileRoute('/spots')({
  validateSearch: spotRouteSearchSchema,
  component: SpotsLayout,
})

function SpotsLayout() {
  return (
    <div className="app">
      <Rail />
      <Outlet />
    </div>
  )
}
