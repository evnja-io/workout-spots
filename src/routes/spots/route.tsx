import { createFileRoute, Outlet, useNavigate, useParams } from '@tanstack/react-router'
import { Suspense, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { spotRouteSearchSchema } from '~/features/spots/filters'
import { Rail } from '~/features/spots/Rail'
import { Sidebar } from '~/features/spots/Sidebar'
import { MapView } from '~/features/spots/MapView'
import { spotsQueryOptions } from '~/features/spots/queries'
import { equipmentsQueryOptions, disciplinesQueryOptions } from '~/features/taxonomy/queries'
import type { MapStyle } from '~/lib/mapbox/map'

export const Route = createFileRoute('/spots')({
  validateSearch: spotRouteSearchSchema,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(spotsQueryOptions())
    await context.queryClient.ensureQueryData(equipmentsQueryOptions())
    await context.queryClient.ensureQueryData(disciplinesQueryOptions())
  },
  component: SpotsLayout,
})

function SpotsLayout() {
  const [mapStyle, setMapStyle] = useState<MapStyle>('light')
  const { data: spots } = useSuspenseQuery(spotsQueryOptions())
  const navigate = useNavigate()

  // Get active spotId from child route params (non-strict)
  const params = useParams({ strict: false })
  const activeSpotId = (params).spotId ?? null

  function handleSelectSpot(id: string) {
    void navigate({ to: '/spots/$spotId', params: { spotId: id }, search: (prev) => prev })
  }

  return (
    <div className="app">
      <Rail />
      <aside className="sidebar">
        <Suspense fallback={null}>
          <Sidebar onSpotClick={handleSelectSpot} />
        </Suspense>
      </aside>
      <div className="map-container">
        <MapView
          spots={spots}
          activeSpotId={activeSpotId}
          onSelectSpot={handleSelectSpot}
          mapStyle={mapStyle}
          onChange={setMapStyle}
          theme="light"
        />
      </div>
      <Outlet />
    </div>
  )
}
