import { useTranslation } from 'react-i18next'
import { useSuspenseQuery } from '@tanstack/react-query'
import { disciplinesQueryOptions, equipmentsQueryOptions, resolveLabel } from '~/features/taxonomy/queries'
import { cx } from '~/components/ui/cx'
import type { AddSpotInput } from '../schema'

const fieldLabel = 'mb-1.5 block text-[12px] font-semibold text-text-2'
const chipPicker = 'flex max-h-[220px] flex-wrap gap-1.5 overflow-y-auto px-0.5 py-1'
const pickerChip =
  'rounded-full border border-border-strong bg-surface px-3 py-1.5 text-[12.5px] text-text-2 transition-all duration-150 hover:border-accent hover:text-accent'
const pickerChipSelected = 'border-accent bg-accent-soft font-medium text-accent'

interface TaxonomyStepProps {
  values: AddSpotInput
  onChange: (patch: Partial<AddSpotInput>) => void
}

export function TaxonomyStep({ values, onChange }: TaxonomyStepProps) {
  const { t } = useTranslation()
  const { data: disciplines } = useSuspenseQuery(disciplinesQueryOptions())
  const { data: equipments } = useSuspenseQuery(equipmentsQueryOptions())

  function toggleDiscipline(id: string) {
    const current = values.disciplines ?? []
    const next = current.includes(id) ? current.filter((d) => d !== id) : [...current, id]
    onChange({ disciplines: next })
  }

  function toggleEquipment(id: string) {
    const current = values.equipment ?? []
    const next = current.includes(id) ? current.filter((e) => e !== id) : [...current, id]
    onChange({ equipment: next })
  }

  return (
    <div className="flex flex-col gap-4.5">
      <div>
        <p className={fieldLabel}>{t('addSpot.disciplinesLabel')}</p>
        <div className={chipPicker} aria-label={t('addSpot.disciplinesLabel')}>
          {disciplines.map((d) => {
            const label = resolveLabel(d.localeKey, d.name, t)
            const selected = (values.disciplines ?? []).includes(d.id)
            return (
              <button
                key={d.id}
                type="button"
                className={cx(pickerChip, selected && pickerChipSelected)}
                aria-pressed={selected}
                onClick={() => toggleDiscipline(d.id)}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className={fieldLabel}>{t('addSpot.equipmentLabel')}</p>
        <div className={chipPicker} aria-label={t('addSpot.equipmentLabel')}>
          {equipments.map((eq) => {
            const label = resolveLabel(eq.localeKey, eq.name, t)
            const selected = (values.equipment ?? []).includes(eq.id)
            return (
              <button
                key={eq.id}
                type="button"
                className={cx(pickerChip, selected && pickerChipSelected)}
                aria-pressed={selected}
                onClick={() => toggleEquipment(eq.id)}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
