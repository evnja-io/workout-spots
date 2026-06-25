import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Discipline, Equipment } from './domain'
import type { SpotSearch } from './filters'
import { resolveLabel } from '~/features/taxonomy/queries'
import { Chip } from '~/components/ui/Chip'

type FiltersProps = {
  search: SpotSearch
  disciplines: Discipline[]
  equipment: Equipment[]
  onToggleDiscipline: (id: string) => void
  onToggleEquipment: (id: string) => void
  onToggle24h: () => void
  onSortChange: (s: SpotSearch['sort']) => void
}

/** Number of chips shown before the "+N more" toggle. */
const COLLAPSED_COUNT = 6

type TaxonomyItem = { id: string; name: string; localeKey: string }

/** A collapsible chip group that shows the active items + a capped preview. */
function ChipGroup({
  label,
  items,
  selected,
  onToggle,
  t,
}: {
  label: string
  items: TaxonomyItem[]
  selected: string[]
  onToggle: (id: string) => void
  t: TFunction
}) {
  const [expanded, setExpanded] = useState(false)

  // Always keep selected chips visible even when collapsed.
  const selectedItems = items.filter((i) => selected.includes(i.id))
  const unselectedItems = items.filter((i) => !selected.includes(i.id))
  const ordered = [...selectedItems, ...unselectedItems]
  const visible = expanded ? ordered : ordered.slice(0, COLLAPSED_COUNT)
  const hiddenCount = ordered.length - visible.length

  return (
    <div className="flex flex-col">
      <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-text-4">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {visible.map((item) => (
          <Chip key={item.id} active={selected.includes(item.id)} onClick={() => onToggle(item.id)}>
            {resolveLabel(item.localeKey, item.name, t)}
          </Chip>
        ))}
        {(hiddenCount > 0 || expanded) && (
          <button
            type="button"
            className="inline-flex items-center whitespace-nowrap rounded-full border border-dashed border-border-strong bg-transparent px-2.5 py-[5px] text-[12px] font-medium text-accent transition-[background-color,border-color] duration-150 hover:border-accent hover:bg-accent-softer"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? t('discover.showLess') : t('discover.showMore', { count: hiddenCount })}
          </button>
        )}
      </div>
    </div>
  )
}

export function Filters({
  search,
  disciplines,
  equipment,
  onToggleDiscipline,
  onToggleEquipment,
  onToggle24h,
  onSortChange,
}: FiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2.5 px-4 pt-3 pb-2.5 border-b border-border shrink-0">
      {disciplines.length > 0 && (
        <ChipGroup
          label={t('discover.disciplines')}
          items={disciplines}
          selected={search.disciplines}
          onToggle={onToggleDiscipline}
          t={t}
        />
      )}

      {equipment.length > 0 && (
        <ChipGroup
          label={t('discover.equipment')}
          items={equipment}
          selected={search.equipment}
          onToggle={onToggleEquipment}
          t={t}
        />
      )}

      <div className="flex flex-col">
        <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-text-4">
          {t('discover.access')}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          <Chip active={search.open24h} onClick={onToggle24h}>
            {t('discover.open24')}
          </Chip>
        </div>
      </div>

      <div className="flex items-center justify-end pt-0.5 text-[12.5px] text-text-3">
        <select
          value={search.sort}
          onChange={(e) => onSortChange(e.target.value as SpotSearch['sort'])}
          aria-label={t('discover.filters')}
          className="cursor-pointer appearance-none border-0 bg-transparent bg-no-repeat bg-right py-0.5 pl-0.5 pr-4 font-medium text-text"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
          }}
        >
          <option value="rating">{t('discover.sortRating')}</option>
          <option value="popular">{t('discover.sortPopular')}</option>
          <option value="name">{t('discover.sortName')}</option>
        </select>
      </div>
    </div>
  )
}
