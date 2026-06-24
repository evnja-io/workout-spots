import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { spotsQueryOptions } from '~/features/spots/queries'
import { equipmentsQueryOptions, disciplinesQueryOptions } from '~/features/taxonomy/queries'
import { Sidebar } from '~/features/spots/Sidebar'

export const Route = createFileRoute('/spots/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(spotsQueryOptions())
    await context.queryClient.ensureQueryData(equipmentsQueryOptions())
    await context.queryClient.ensureQueryData(disciplinesQueryOptions())
  },
  component: SpotsDiscover,
})

function SpotsDiscover() {
  return (
    <div className="discover-layout">
      <aside className="sidebar">
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>
      </aside>
      <div className="map-container" />
    </div>
  )
}
