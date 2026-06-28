import { useRef, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useTranslation } from 'react-i18next'
import { Route } from '~/routes/spots/route'
import { disciplinesQueryOptions, equipmentsQueryOptions } from '~/features/taxonomy/queries'
import { spotSearchSchema, applyFilters } from './filters'
import type { SpotSearch } from './filters'
import type { SpotListItem } from './domain'
import type { GeocodeResult } from '~/lib/mapbox/geocoding'
import { SpotCard } from './SpotCard'
import { SpotCardSkeleton } from './SpotCardSkeleton'
import { Filters } from './Filters'
import { LocationSearch } from './LocationSearch'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import { trackEvent } from '~/features/analytics/gtag'
import { useSession } from '~/features/auth/session'
import { useAuthGate } from '~/features/auth/useAuthGate'
import { savedSpotsQueryOptions } from '~/features/likes/queries'

const VIRTUALIZE_THRESHOLD = 30

const SKELETON_COUNT = 6

export function Sidebar({
  spots,
  onSpotClick,
  onLocationSelect,
  loading = false,
}: {
  /** In-viewport spots from the route's bbox query — single source of truth. */
  spots: SpotListItem[]
  onSpotClick?: (id: string) => void
  /** A geosuggest result was picked — the route recenters the map on it. */
  onLocationSelect?: (r: GeocodeResult) => void
  /** First load with no cached spots yet — show skeleton cards instead of the empty state. */
  loading?: boolean
}) {
  const { t } = useTranslation()
  const navigate = useNavigate({ from: '/spots' })
  const rawSearch = Route.useSearch()
  const search = spotSearchSchema.parse(rawSearch)

  // Get the active spotId param if we're on a spot detail page
  const params = useParams({ strict: false })
  const activeSpotId = params.spotId

  const { data: disciplines } = useSuspenseQuery(disciplinesQueryOptions())
  const { data: equipment } = useSuspenseQuery(equipmentsQueryOptions())

  // All / Saved toggle. Saved is a separate (auth-gated) query, so switching to
  // "Saved" swaps the list source; the same search/filters apply on top.
  const { userId } = useSession()
  const gate = useAuthGate()
  const [mode, setMode] = useState<'all' | 'saved'>('all')
  const { data: savedSpots = [] } = useQuery({
    ...savedSpotsQueryOptions(userId),
    enabled: mode === 'saved' && !!userId,
  })
  const source = mode === 'saved' ? savedSpots : spots
  const filtered = applyFilters(source, search)

  function toggleDiscipline(id: string) {
    trackEvent('filter_applied', { filter_type: 'discipline', filter_id: id })
    void navigate({
      search: (prev) => {
        const parsed = spotSearchSchema.parse(prev)
        const disciplines = parsed.disciplines.includes(id)
          ? parsed.disciplines.filter((d) => d !== id)
          : [...parsed.disciplines, id]
        return { ...prev, disciplines }
      },
    })
  }

  function toggleEquipment(id: string) {
    trackEvent('filter_applied', { filter_type: 'equipment', filter_id: id })
    void navigate({
      search: (prev) => {
        const parsed = spotSearchSchema.parse(prev)
        const eq = parsed.equipment.includes(id)
          ? parsed.equipment.filter((e) => e !== id)
          : [...parsed.equipment, id]
        return { ...prev, equipment: eq }
      },
    })
  }

  function toggle24h() {
    trackEvent('filter_applied', { filter_type: 'access', filter_id: 'open_24h' })
    void navigate({
      search: (prev) => {
        const parsed = spotSearchSchema.parse(prev)
        return { ...prev, open24h: !parsed.open24h }
      },
    })
  }

  function handleSortChange(sort: SpotSearch['sort']) {
    void navigate({ search: (prev) => ({ ...prev, sort }) })
  }

  function handleSpotClick(id: string) {
    if (onSpotClick) {
      onSpotClick(id)
    } else {
      void navigate({ to: '/spots/$spotId', params: { spotId: id }, search: (prev) => prev })
    }
  }

  // Virtualized list
  const parentRef = useRef<HTMLDivElement>(null)
  const shouldVirtualize = filtered.length > VIRTUALIZE_THRESHOLD

  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    enabled: shouldVirtualize,
  })

  return (
    <div className="flex flex-1 flex-col min-h-0 bg-surface border-r border-border">
      <div className="shrink-0 pt-4.5 px-5 pb-3 border-b border-border">
        <div className="flex items-center justify-between mb-2.5">
          <h1 className="m-0 text-[20px] font-semibold tracking-[-0.01em]">
            {t('discover.title')}
          </h1>
          <span className="text-[11px] font-medium bg-surface-2 text-text-3 px-2 py-[3px] rounded-full">
            {filtered.length}
          </span>
        </div>

        <div className="mt-3">
          <LocationSearch onSelect={(r) => onLocationSelect?.(r)} />
        </div>

        {/* All / Saved toggle */}
        <div className="mt-3 flex gap-1 rounded-[10px] bg-surface-2 p-0.5">
          <button
            type="button"
            onClick={() => setMode('all')}
            className={cx(
              'flex flex-1 items-center justify-center gap-1 rounded-[8px] py-1.5 text-[12.5px] font-medium transition-colors',
              mode === 'all' ? 'bg-surface text-text shadow-sm' : 'text-text-3',
            )}
          >
            {t('discover.all')}
          </button>
          <button
            type="button"
            onClick={() => gate(() => setMode('saved'))}
            aria-pressed={mode === 'saved'}
            className={cx(
              'flex flex-1 items-center justify-center gap-1 rounded-[8px] py-1.5 text-[12.5px] font-medium transition-colors',
              mode === 'saved' ? 'bg-surface text-text shadow-sm' : 'text-text-3',
            )}
          >
            <Icon name="heart" size={13} fill={mode === 'saved' ? 'currentColor' : 'none'} />
            {t('discover.saved')}
          </button>
        </div>
      </div>

      {/* On mobile the sheet is height-constrained: cap the filters into their own
          scrollable region so the spot list keeps the majority of the space. On
          desktop (md+) filters render at natural height and the list takes the rest. */}
      <div className="min-h-0 flex-1 overflow-y-auto md:flex-none md:overflow-visible">
        <Filters
          search={search}
          disciplines={disciplines}
          equipment={equipment}
          onToggleDiscipline={toggleDiscipline}
          onToggleEquipment={toggleEquipment}
          onToggle24h={toggle24h}
          onSortChange={handleSortChange}
        />
      </div>

      {filtered.length === 0 && loading ? (
        <div className="flex-[1.7] md:flex-1 min-h-0 overflow-y-auto px-2.5 pt-1.5 pb-5">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <SpotCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex-[1.7] md:flex-1 min-h-0 overflow-y-auto px-2.5 pt-1.5 pb-5">
          <div className="text-center px-5 py-10 text-text-3 text-[13px]">
            {mode === 'saved' ? t('saved.empty') : t('discover.empty')}
          </div>
        </div>
      ) : shouldVirtualize ? (
        <div
          ref={parentRef}
          className="flex-[1.7] md:flex-1 min-h-0 overflow-y-auto px-2.5 pt-1.5 pb-5"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const spot = filtered[virtualItem.index]!
              return (
                <div
                  key={spot.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <SpotCard
                    spot={spot}
                    active={spot.id === activeSpotId}
                    onClick={() => handleSpotClick(spot.id)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="flex-[1.7] md:flex-1 min-h-0 overflow-y-auto px-2.5 pt-1.5 pb-5">
          {filtered.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              active={spot.id === activeSpotId}
              onClick={() => handleSpotClick(spot.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
