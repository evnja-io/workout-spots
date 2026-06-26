import { createFileRoute, Outlet, useNavigate, useParams } from '@tanstack/react-router'
import { Suspense, useState, useRef, useCallback } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { spotRouteSearchSchema } from '~/features/spots/filters'
import { Rail } from '~/features/spots/Rail'
import { Sidebar } from '~/features/spots/Sidebar'
import { BottomNav } from '~/features/spots/BottomNav'
import { MapView } from '~/features/spots/MapView'
import { Sheet } from '~/components/ui/Sheet'
import {
  spotsInBoundsQueryOptions,
  WORLD_BOUNDS,
  type Bounds,
} from '~/features/spots/queries'
import { equipmentsQueryOptions, disciplinesQueryOptions } from '~/features/taxonomy/queries'
import { getPrefs } from '~/features/settings/prefs'
import { SettingsPanel } from '~/features/settings/SettingsPanel'
import { AddSpotWizard } from '~/features/add-spot/AddSpotWizard'
import { useTranslation } from 'react-i18next'
import type { MapStyle } from '~/lib/mapbox/map'
import { ErrorState } from '~/components/ErrorState'

const BOUNDS_DEBOUNCE_MS = 200

function SpotsPending() {
  return <div className="px-5 py-10 text-center text-[13px] text-text-3" aria-busy="true" />
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
    // Prefetch the initial world-bounds query (top-500 most-rated spots globally)
    // so SSR renders spots immediately without a loading state.
    await context.queryClient.ensureQueryData(spotsInBoundsQueryOptions(WORLD_BOUNDS))
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
  const [listSheetOpen, setListSheetOpen] = useState(false)
  const [mapStyle, setMapStyle] = useState<MapStyle>(() => getPrefs().mapStyle)
  const navigate = useNavigate()

  // ── Bounds state (starts at world, tightens as the map reports its viewport) ─
  const [bounds, setBounds] = useState<Bounds>(WORLD_BOUNDS)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced setter passed to MapView — avoids a query per frame while panning.
  const debouncedSetBounds = useCallback((newBounds: Bounds) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setBounds(newBounds)
    }, BOUNDS_DEBOUNCE_MS)
  }, [])

  // ── Spots query — non-suspense so bounds changes don't unmount the layout ───
  // keepPreviousData: the list keeps showing the previous viewport's spots while
  // the new bbox fetch is in flight, avoiding a flash to empty on every pan.
  const { data: spots = [], isPending } = useQuery({
    ...spotsInBoundsQueryOptions(bounds),
    placeholderData: keepPreviousData,
  })

  // Get active spotId from child route params (non-strict)
  const params = useParams({ strict: false })
  const activeSpotId = params.spotId ?? null

  function handleSelectSpot(id: string) {
    setListSheetOpen(false)
    void navigate({ to: '/spots/$spotId', params: { spotId: id }, search: (prev) => prev })
  }

  return (
    <div className="h-screen overflow-hidden bg-bg md:grid md:grid-cols-[64px_380px_1fr]">
      <Rail onOpenSettings={() => setSettingsOpen(true)} />
      {/* Sidebar column — desktop only; on mobile the list lives in a bottom sheet */}
      <aside className="hidden min-h-0 flex-col border-r border-border bg-surface md:flex">
        <Suspense fallback={null}>
          {/* NOTE: text search only matches spots in the current viewport (Task 24).
              Global name search would require server-side full-text query. */}
          <Sidebar spots={spots} onSpotClick={handleSelectSpot} loading={isPending} />
        </Suspense>
      </aside>
      <div className="relative h-full bg-surface-2">
        <MapView
          spots={spots}
          activeSpotId={activeSpotId}
          onSelectSpot={handleSelectSpot}
          onBoundsChange={debouncedSetBounds}
          mapStyle={mapStyle}
          onChange={setMapStyle}
          theme="light"
        />
        {/* Add-spot button — floating top-right of the map (desktop; mobile uses the BottomNav FAB) */}
        <div className="pointer-events-auto absolute top-[14px] right-[14px] z-[3] hidden md:block">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-[9px] text-[13px] font-medium text-white shadow-[var(--shadow-md)] transition-[background-color,transform] duration-150 hover:bg-accent-2 active:translate-y-px"
            data-testid="add-spot-btn"
            onClick={() => setAddSpotOpen(true)}
          >
            + {t('discover.addSpot')}
          </button>
        </div>
      </div>

      {/* Mobile bottom navigation (hidden on md+) */}
      <BottomNav
        onOpenList={() => setListSheetOpen(true)}
        onOpenAdd={() => setAddSpotOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Mobile list/filters sheet — hosts the same Sidebar shown on desktop */}
      <Sheet open={listSheetOpen} onClose={() => setListSheetOpen(false)}>
        <div className="flex h-[80dvh] flex-col">
          <Suspense fallback={null}>
            <Sidebar spots={spots} onSpotClick={handleSelectSpot} loading={isPending} />
          </Suspense>
        </div>
      </Sheet>

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
