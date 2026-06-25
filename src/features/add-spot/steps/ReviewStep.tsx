import { useTranslation } from 'react-i18next'
import type { AddSpotParsed } from '../schema'

const fieldLabel = 'mb-1.5 block text-[12px] font-semibold text-text-2'

interface ReviewStepProps {
  values: AddSpotParsed
}

export function ReviewStep({ values }: ReviewStepProps) {
  const { t } = useTranslation()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
      <div>
        <span className={fieldLabel}>{t('addSpot.nameLabel')}</span>
        <p style={{ margin: 0, color: 'var(--text)' }}>{values.name}</p>
      </div>

      <div>
        <span className={fieldLabel}>{t('addSpot.addressLabel')}</span>
        <p style={{ margin: 0, color: 'var(--text)' }}>
          {values.address}
          {values.city ? `, ${values.city}` : ''}
          {values.country ? ` (${values.country})` : ''}
        </p>
      </div>

      <div>
        <span className={fieldLabel}>{t('addSpot.coordsLabel')}</span>
        <p style={{ margin: 0, color: 'var(--text-3)' }}>
          {values.position.lat.toFixed(5)}, {values.position.lng.toFixed(5)}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span className={fieldLabel} style={{ margin: 0 }}>
          {t('discover.open24')}
        </span>
        <span style={{ color: values.isOpen24h ? 'var(--accent)' : 'var(--text-3)' }}>
          {values.isOpen24h ? t('addSpot.yes') : t('addSpot.no')}
        </span>
      </div>

      <div>
        <span className={fieldLabel}>{t('addSpot.disciplinesLabel')}</span>
        <p style={{ margin: 0, color: 'var(--text-3)' }}>
          {t('addSpot.selectedCount', { count: values.disciplines.length })}
        </p>
      </div>

      {values.equipment.length > 0 && (
        <div>
          <span className={fieldLabel}>{t('addSpot.equipmentLabel')}</span>
          <p style={{ margin: 0, color: 'var(--text-3)' }}>
            {t('addSpot.selectedCount', { count: values.equipment.length })}
          </p>
        </div>
      )}
    </div>
  )
}
