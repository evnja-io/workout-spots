import { useTranslation } from 'react-i18next'
import { Switch } from '~/components/ui/Switch'
import { PhotoPicker } from '../PhotoPicker'
import { SpotPhotoManager } from '../SpotPhotoManager'
import type { AddSpotInput } from '../schema'
import type { SpotImage } from '~/features/spots/domain'

interface BasicsStepProps {
  values: AddSpotInput
  onChange: (patch: Partial<AddSpotInput>) => void
  files: File[]
  onFilesChange: (files: File[]) => void
  existingImages?: SpotImage[]
  removedImageIds?: string[]
  onPhotosChange?: (next: { removedIds: string[]; files: File[] }) => void
}

export function BasicsStep({ values, onChange, files, onFilesChange, existingImages, removedImageIds, onPhotosChange }: BasicsStepProps) {
  const { t } = useTranslation()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label className="field-label" htmlFor="add-spot-name">
          {t('addSpot.nameLabel')}
        </label>
        <input
          id="add-spot-name"
          className="input"
          type="text"
          value={values.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder={t('addSpot.namePlaceholder')}
        />
      </div>

      <div>
        <label className="field-label" htmlFor="add-spot-description">
          {t('addSpot.descriptionLabel')}
        </label>
        <textarea
          id="add-spot-description"
          className="textarea"
          value={values.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder={t('addSpot.descriptionPlaceholder')}
        />
      </div>

      <div className="toggle-row">
        <span style={{ fontWeight: 500, fontSize: '13px' }}>{t('discover.open24')}</span>
        <Switch
          on={values.isOpen24h ?? false}
          onChange={(v) => onChange({ isOpen24h: v })}
          label={t('discover.open24')}
        />
      </div>

      {existingImages != null && onPhotosChange != null ? (
        <SpotPhotoManager
          existing={existingImages}
          removedIds={removedImageIds ?? []}
          files={files}
          onChange={onPhotosChange}
        />
      ) : (
        <PhotoPicker files={files} onChange={onFilesChange} />
      )}
    </div>
  )
}
