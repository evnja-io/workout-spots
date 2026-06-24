import { useTranslation } from 'react-i18next'
import { useSuspenseQuery } from '@tanstack/react-query'
import { disciplinesQueryOptions, equipmentsQueryOptions, resolveLabel } from '~/features/taxonomy/queries'
import type { AddSpotInput } from '../schema'

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <p className="field-label">{t('addSpot.disciplinesLabel')}</p>
        <div className="chip-picker" aria-label={t('addSpot.disciplinesLabel')}>
          {disciplines.map((d) => {
            const label = resolveLabel(d.localeKey, d.name, t)
            const selected = (values.disciplines ?? []).includes(d.id)
            return (
              <button
                key={d.id}
                type="button"
                className={`picker-chip${selected ? ' selected' : ''}`}
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
        <p className="field-label">{t('addSpot.equipmentLabel')}</p>
        <div className="chip-picker" aria-label={t('addSpot.equipmentLabel')}>
          {equipments.map((eq) => {
            const label = resolveLabel(eq.localeKey, eq.name, t)
            const selected = (values.equipment ?? []).includes(eq.id)
            return (
              <button
                key={eq.id}
                type="button"
                className={`picker-chip${selected ? ' selected' : ''}`}
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
