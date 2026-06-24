import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { spotsQueryOptions } from '~/features/spots/queries'
import { equipmentsQueryOptions, disciplinesQueryOptions } from '~/features/taxonomy/queries'
import { Sidebar } from '~/features/spots/Sidebar'
import { MapView } from '~/features/spots/MapView'
import type { MapStyle } from '~/lib/mapbox/map'

export const Route = createFileRoute('/spots/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(spotsQueryOptions())
    await context.queryClient.ensureQueryData(equipmentsQueryOptions())
    await context.queryClient.ensureQueryData(disciplinesQueryOptions())
  },
  component: SpotsDiscover,
})

function SpotsDiscover() {
  const [mapStyle, setMapStyle] = useState<MapStyle>('light')
  const { data: spots = [] } = useQuery(spotsQueryOptions())

  function handleSelectSpot(id: string) {
    // /spots/$spotId route is added in a later task; navigate directly for now
    if (typeof window !== 'undefined') {
      window.location.href = `/spots/${id}`
    }
  }

  return (
    <div className="discover-layout">
      <aside className="sidebar">
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>
      </aside>
      <div className="map-container">
        <MapView
          spots={spots}
          activeSpotId={null}
          onSelectSpot={handleSelectSpot}
          mapStyle={mapStyle}
          onChange={setMapStyle}
          theme="light"
        />
      </div>
    </div>
  )
}
