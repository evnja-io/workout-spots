import { useTranslation } from 'react-i18next'
import type { SpotImage } from '~/features/spots/domain'
import { FieldHint } from '~/components/ui/Field'
import { PhotoPicker } from './PhotoPicker'
import { MAX_IMAGES } from './photos'

const imgSlotFilled =
  'grid aspect-square place-items-center rounded-[10px] border-[1.5px] border-solid border-transparent bg-surface-2 bg-cover bg-center text-[11px] text-text-3'

interface SpotPhotoManagerProps {
  existing: SpotImage[]
  removedIds: string[]
  files: File[]
  onChange: (next: { removedIds: string[]; files: File[] }) => void
}

export function SpotPhotoManager({ existing, removedIds, files, onChange }: SpotPhotoManagerProps) {
  const { t } = useTranslation()

  const keptImages = existing.filter((img) => !removedIds.includes(img.id))
  const keptCount = keptImages.length

  function removeExisting(id: string) {
    onChange({ removedIds: [...removedIds, id], files })
  }

  function handleFilesChange(newFiles: File[]) {
    onChange({ removedIds, files: newFiles })
  }

  return (
    <div>
      {keptCount > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginBottom: '8px',
          }}
        >
          {keptImages.map((img) => (
            <div key={img.id} style={{ position: 'relative' }}>
              <div
                className={imgSlotFilled}
                style={{ backgroundImage: `url(${img.url})` }}
                aria-label={`Photo ${img.order}`}
              />
              <button
                type="button"
                aria-label={t('editSpot.removePhoto')}
                onClick={() => removeExisting(img.id)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(0,0,0,0.5)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  padding: 0,
                  fontSize: '12px',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {keptCount >= MAX_IMAGES ? (
        <FieldHint>{t('editSpot.photosLabel')} (max {MAX_IMAGES})</FieldHint>
      ) : (
        <PhotoPicker files={files} onChange={handleFilesChange} />
      )}
    </div>
  )
}
