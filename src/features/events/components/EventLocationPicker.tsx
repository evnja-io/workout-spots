import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import { spotSearchQueryOptions } from '~/features/clubs/queries'
import type { EventLocationInput } from '../schema'

export function EventLocationPicker({
  value,
  onChange,
}: {
  value: EventLocationInput[]
  onChange: (next: EventLocationInput[]) => void
}) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const { data: results = [] } = useQuery(spotSearchQueryOptions(query))

  const add = (spot: { id: string; name: string; city: string }) => {
    if (value.some((l) => l.locationId === spot.id)) return
    onChange([
      ...value,
      {
        locationId: spot.id,
        name: spot.name,
        city: spot.city,
        isPrimary: value.length === 0,
        note: '',
      },
    ])
    setQuery('')
  }
  const remove = (id: string) => {
    let next = value.filter((l) => l.locationId !== id)
    // keep a primary if any remain
    if (next.length > 0 && !next.some((l) => l.isPrimary)) {
      next = next.map((l, i) => (i === 0 ? { ...l, isPrimary: true } : l))
    }
    onChange(next)
  }
  const setPrimary = (id: string) =>
    onChange(value.map((l) => ({ ...l, isPrimary: l.locationId === id })))
  const setNote = (id: string, note: string) =>
    onChange(value.map((l) => (l.locationId === id ? { ...l, note } : l)))

  const available = results.filter((r) => !value.some((l) => l.locationId === r.id))

  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
          <Icon name="search" size={15} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('events.searchSpot')}
            className="min-w-0 flex-1 bg-transparent text-[14px] text-text outline-none placeholder:text-text-4"
          />
        </div>
        {query.trim().length >= 2 && available.length > 0 && (
          <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-surface shadow-[var(--shadow-md)]">
            {available.map((spot) => (
              <button
                key={spot.id}
                type="button"
                onClick={() => add(spot)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13.5px] hover:bg-surface-2"
              >
                <Icon name="mappin" size={14} />
                <span className="min-w-0 flex-1 truncate text-text">{spot.name}</span>
                {spot.city && <span className="shrink-0 text-[12px] text-text-4">{spot.city}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {value.map((loc) => (
        <div key={loc.locationId} className="rounded-lg border border-border p-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPrimary(loc.locationId)}
              className={cx(
                'rounded-full px-2 py-0.5 text-[11px] font-medium',
                loc.isPrimary ? 'bg-accent-soft text-accent' : 'bg-surface-2 text-text-3',
              )}
            >
              {loc.isPrimary ? t('events.primary') : t('events.makePrimary')}
            </button>
            <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-text">
              {loc.name}
            </span>
            <button
              type="button"
              aria-label={t('common.cancel')}
              onClick={() => remove(loc.locationId)}
              className="text-text-4 hover:text-text"
            >
              <Icon name="close" size={14} />
            </button>
          </div>
          <input
            value={loc.note}
            onChange={(e) => setNote(loc.locationId, e.target.value)}
            placeholder={t('events.locationNote')}
            className="mt-2 w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-[13px] text-text outline-none placeholder:text-text-4"
          />
        </div>
      ))}
    </div>
  )
}
