import { useTranslation } from 'react-i18next'
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
        <div>
          <div className="filter-group-label">{t('discover.disciplines')}</div>
          <div className="filters-row">
            {disciplines.map((d) => (
              <Chip
                key={d.id}
                active={search.disciplines.includes(d.id)}
                onClick={() => onToggleDiscipline(d.id)}
              >
                {resolveLabel(d.localeKey, d.name, t)}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {equipment.length > 0 && (
        <div>
          <div className="filter-group-label">{t('discover.equipment')}</div>
          <div className="filters-row">
            {equipment.map((e) => (
              <Chip
                key={e.id}
                active={search.equipment.includes(e.id)}
                onClick={() => onToggleEquipment(e.id)}
              >
                {resolveLabel(e.localeKey, e.name, t)}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <div>
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
        >
          <option value="rating">{t('discover.sortRating')}</option>
          <option value="popular">{t('discover.sortPopular')}</option>
          <option value="name">{t('discover.sortName')}</option>
        </select>
      </div>
    </div>
  )
}
