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
    <div className="filter-group">
      <div className="filter-group-label">{label}</div>
      <div className="filters-row">
        {visible.map((item) => (
          <Chip key={item.id} active={selected.includes(item.id)} onClick={() => onToggle(item.id)}>
            {resolveLabel(item.localeKey, item.name, t)}
          </Chip>
        ))}
        {(hiddenCount > 0 || expanded) && (
          <button
            type="button"
            className="show-more-btn"
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
    <div className="filters">
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

      <div className="filter-group">
        <div className="filter-group-label">{t('discover.access')}</div>
        <div className="filters-row">
          <Chip active={search.open24h} onClick={onToggle24h}>
            {t('discover.open24')}
          </Chip>
        </div>
      </div>

      <div className="sort-row">
        <select
          value={search.sort}
          onChange={(e) => onSortChange(e.target.value as SpotSearch['sort'])}
          aria-label={t('discover.filters')}
        >
          <option value="rating">{t('discover.sortRating')}</option>
          <option value="popular">{t('discover.sortPopular')}</option>
          <option value="name">{t('discover.sortName')}</option>
        </select>
      </div>
    </div>
  )
}
