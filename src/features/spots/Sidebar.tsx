import { useRef, useEffect, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useTranslation } from 'react-i18next'
import { Route } from '~/routes/spots/route'
import { disciplinesQueryOptions, equipmentsQueryOptions } from '~/features/taxonomy/queries'
import { spotSearchSchema, applyFilters } from './filters'
import type { SpotSearch } from './filters'
import type { SpotListItem } from './domain'
import { SpotCard } from './SpotCard'
import { SpotCardSkeleton } from './SpotCardSkeleton'
import { Filters } from './Filters'
import { Icon } from '~/components/ui/Icon'
import { trackEvent } from '~/features/analytics/gtag'

const VIRTUALIZE_THRESHOLD = 30

const SKELETON_COUNT = 6

export function Sidebar({
  spots,
  onSpotClick,
  loading = false,
}: {
  /** In-viewport spots from the route's bbox query — single source of truth. */
  spots: SpotListItem[]
  onSpotClick?: (id: string) => void
  /** First load with no cached spots yet — show skeleton cards instead of the empty state. */
  loading?: boolean
}) {
  const { t } = useTranslation()
  const navigate = useNavigate({ from: '/spots' })
  const rawSearch = Route.useSearch()
  const search = spotSearchSchema.parse(rawSearch)

  // Get the active spotId param if we're on a spot detail page
  const params = useParams({ strict: false })
  const activeSpotId = (params).spotId

  const { data: disciplines } = useSuspenseQuery(disciplinesQueryOptions())
  const { data: equipment } = useSuspenseQuery(equipmentsQueryOptions())

  const filtered = applyFilters(spots, search)

  // Debounced search input
  const [inputValue, setInputValue] = useState(search.q)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep local input in sync when search.q changes from URL
  useEffect(() => {
    setInputValue(search.q)
  }, [search.q])

  function handleSearchChange(value: string) {
    setInputValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const term = value.trim()
      if (term) trackEvent('search', { search_term: term })
      void navigate({ search: (prev) => ({ ...prev, q: value }) })
    }, 250)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

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

        <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-surface-2 border border-transparent rounded-[10px] transition-[border-color,background-color] duration-150 focus-within:bg-surface focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--accent-softer)]">
          <Icon name="search" size={16} color="var(--text-3)" />
          <input
            type="search"
            placeholder={t('discover.searchPlaceholder')}
            value={inputValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label={t('discover.searchPlaceholder')}
            className="w-full border-0 bg-transparent text-[13.5px] placeholder:text-text-4"
          />
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
            {t('discover.empty')}
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
