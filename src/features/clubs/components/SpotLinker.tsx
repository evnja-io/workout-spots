import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { spotSearchQueryOptions, type LinkableSpot } from '../queries'

/** Search existing spots and build a list of linked spots (used by create + manage). */
export function SpotLinker({
  selected,
  onChange,
}: {
  selected: LinkableSpot[]
  onChange: (next: LinkableSpot[]) => void
}) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const { data: results = [] } = useQuery(spotSearchQueryOptions(query))

  const add = (spot: LinkableSpot) => {
    if (!selected.some((s) => s.id === spot.id)) onChange([...selected, spot])
    setQuery('')
  }
  const remove = (id: string) => onChange(selected.filter((s) => s.id !== id))

  const available = results.filter((r) => !selected.some((s) => s.id === r.id))

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
          <Icon name="search" size={15} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('clubs.linkSpotPlaceholder')}
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

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((spot) => (
            <span
              key={spot.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 py-1 pl-2.5 pr-1.5 text-[12.5px] text-text"
            >
              {spot.name}
              <button
                type="button"
                aria-label={t('common.cancel')}
                onClick={() => remove(spot.id)}
                className="grid size-4 place-items-center rounded-full text-text-3 hover:bg-surface hover:text-text"
              >
                <Icon name="close" size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
