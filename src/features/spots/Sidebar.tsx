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
import { Filters } from './Filters'
import { Icon } from '~/components/ui/Icon'

const VIRTUALIZE_THRESHOLD = 30

export function Sidebar({
  spots,
  onSpotClick,
}: {
  /** In-viewport spots from the route's bbox query — single source of truth. */
  spots: SpotListItem[]
  onSpotClick?: (id: string) => void
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
      void navigate({ search: (prev) => ({ ...prev, q: value }) })
    }, 250)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  function toggleDiscipline(id: string) {
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
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <h1>{t('discover.title')}</h1>
          <span className="count-pill">{filtered.length}</span>
        </div>

        <div className="search">
          <Icon name="search" size={16} color="var(--text-3)" />
          <input
            type="search"
            placeholder={t('discover.searchPlaceholder')}
            value={inputValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label={t('discover.searchPlaceholder')}
          />
        </div>
      </div>

      <Filters
        search={search}
        disciplines={disciplines}
        equipment={equipment}
        onToggleDiscipline={toggleDiscipline}
        onToggleEquipment={toggleEquipment}
        onToggle24h={toggle24h}
        onSortChange={handleSortChange}
      />

      {filtered.length === 0 ? (
        <div className="spot-list">
          <div className="empty">{t('discover.empty')}</div>
        </div>
      ) : shouldVirtualize ? (
        <div ref={parentRef} className="spot-list">
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
        <div className="spot-list">
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
