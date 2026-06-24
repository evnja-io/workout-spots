import { createFileRoute, Outlet, useNavigate, useParams } from '@tanstack/react-router'
import { Suspense, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { spotRouteSearchSchema } from '~/features/spots/filters'
import { Rail } from '~/features/spots/Rail'
import { Sidebar } from '~/features/spots/Sidebar'
import { MapView } from '~/features/spots/MapView'
import { spotsQueryOptions } from '~/features/spots/queries'
import { equipmentsQueryOptions, disciplinesQueryOptions } from '~/features/taxonomy/queries'
import { getPrefs } from '~/features/settings/prefs'
import { SettingsPanel } from '~/features/settings/SettingsPanel'
import { AddSpotWizard } from '~/features/add-spot/AddSpotWizard'
import { useTranslation } from 'react-i18next'
import type { MapStyle } from '~/lib/mapbox/map'
import { ErrorState } from '~/components/ErrorState'

function SpotsPending() {
  return <div className="empty" aria-busy="true" />
}

function SpotsError({ reset }: { reset: () => void }) {
  const { t } = useTranslation()
  return (
    <ErrorState
      title={t('common.errorTitle')}
      message={t('common.errorMessage')}
      onRetry={reset}
    />
  )
}

export const Route = createFileRoute('/spots')({
  validateSearch: spotRouteSearchSchema,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(spotsQueryOptions())
    await context.queryClient.ensureQueryData(equipmentsQueryOptions())
    await context.queryClient.ensureQueryData(disciplinesQueryOptions())
  },
  pendingComponent: SpotsPending,
  errorComponent: SpotsError,
  component: SpotsLayout,
})

function SpotsLayout() {
  const { t } = useTranslation()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [addSpotOpen, setAddSpotOpen] = useState(false)
  const [mapStyle, setMapStyle] = useState<MapStyle>(() => getPrefs().mapStyle)
  const { data: spots } = useSuspenseQuery(spotsQueryOptions())
  const navigate = useNavigate()

  // Get active spotId from child route params (non-strict)
  const params = useParams({ strict: false })
  const activeSpotId = params.spotId ?? null

  function handleSelectSpot(id: string) {
    void navigate({ to: '/spots/$spotId', params: { spotId: id }, search: (prev) => prev })
  }

  return (
    <div className="app">
      <Rail onOpenSettings={() => setSettingsOpen(true)} />
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
        {/* Add-spot button — rendered inside map-topbar area via the MapView wrapper */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            zIndex: 3,
            pointerEvents: 'auto',
          }}
        >
          <button
            type="button"
            className="add-spot-btn"
            data-testid="add-spot-btn"
            onClick={() => setAddSpotOpen(true)}
          >
            + {t('discover.addSpot')}
          </button>
        </div>
      </div>
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        mapStyle={mapStyle}
        onMapStyleChange={setMapStyle}
      />
      <AddSpotWizard open={addSpotOpen} onClose={() => setAddSpotOpen(false)} />
      <Outlet />
    </div>
  )
}
