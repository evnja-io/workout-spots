import { useState, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '~/components/ui/Modal'
import { Button } from '~/components/ui/Button'
import { Icon } from '~/components/ui/Icon'
import { getPrefs } from '~/features/settings/prefs'
import { LocationStep } from './steps/LocationStep'
import { BasicsStep } from './steps/BasicsStep'
import { TaxonomyStep } from './steps/TaxonomyStep'
import { ReviewStep } from './steps/ReviewStep'
import { useCreateSpot, useUpdateSpot, type UpdateArgs } from './mutations'
import {
  addSpotSchema,
  canAdvanceStep0,
  canAdvanceStep1,
  canAdvanceStep2,
  canAdvanceStep3,
  type AddSpotInput,
} from './schema'
import type { SpotImage } from '~/features/spots/domain'

const STEP_COUNT = 4

const EMPTY: AddSpotInput = {
  position: { lng: 0, lat: 0 },
  address: '',
  city: '',
  region: '',
  country: '',
  name: '',
  description: '',
  isOpen24h: false,
  disciplines: [],
  equipment: [],
}

interface AddSpotWizardProps {
  open: boolean
  onClose: () => void
  mode?: 'create' | 'edit'
  spotId?: string
  initialValues?: AddSpotInput
  initialImages?: SpotImage[]
  onSaved?: () => void
}

export function AddSpotWizard({
  open,
  onClose,
  mode = 'create',
  spotId,
  initialValues,
  initialImages,
  onSaved,
}: AddSpotWizardProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<AddSpotInput>(initialValues ?? EMPTY)
  const [files, setFiles] = useState<File[]>([])
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([])
  const { create, pending: createPending } = useCreateSpot()
  const { save, pending: savePending } = useUpdateSpot(spotId ?? '', () => {
    onSaved?.()
    handleClose()
  })
  const mapStyle = getPrefs().mapStyle

  const pending = mode === 'edit' ? savePending : createPending

  function patch(p: Partial<AddSpotInput>) {
    setValues((prev) => ({ ...prev, ...p }))
  }

  function handleClose() {
    onClose()
    // Reset after a short delay so the close animation can play
    setTimeout(() => {
      setStep(0)
      setValues(initialValues ?? EMPTY)
      setFiles([])
      setRemovedImageIds([])
    }, 300)
  }

  const canAdvance =
    step === 0 ? canAdvanceStep0(values)
    : step === 1 ? canAdvanceStep1(values)
    : step === 2 ? canAdvanceStep2(values)
    : canAdvanceStep3(values)

  function handleContinue() {
    if (step < STEP_COUNT - 1) {
      setStep((s) => s + 1)
    }
  }

  function handlePublish() {
    const parsed = addSpotSchema.safeParse(values)
    if (!parsed.success) return
    create(parsed.data, files)
  }

  function handleSave() {
    const parsed = addSpotSchema.safeParse(values)
    if (!parsed.success) return
    const currentImages = initialImages ?? []
    const removedImages = currentImages
      .filter((img) => removedImageIds.includes(img.id))
      .map((img) => ({ id: img.id, path: img.path }))
    const keptImages = currentImages.filter((img) => !removedImageIds.includes(img.id))
    const maxExistingOrder = keptImages.reduce((max, img) => Math.max(max, img.order), 0)

    const args: UpdateArgs = {
      values: parsed.data,
      currentDisciplineIds: initialValues?.disciplines ?? [],
      currentEquipmentIds: initialValues?.equipment ?? [],
      newFiles: files,
      removedImages,
      maxExistingOrder,
    }
    save(args)
  }

  const stepTitles =
    mode === 'edit'
      ? [
          t('editSpot.title'),
          t('editSpot.title'),
          t('addSpot.stepTaxonomy'),
          t('addSpot.stepReview'),
        ]
      : [
          t('addSpot.stepLocation'),
          t('addSpot.stepBasics'),
          t('addSpot.stepTaxonomy'),
          t('addSpot.stepReview'),
        ]

  const parsedForReview =
    step === 3 ? addSpotSchema.safeParse(values) : null

  return (
    <Modal open={open} onClose={handleClose} labelledBy="add-spot-title">
      {/* Header */}
      <div className="modal-head">
        <h2 id="add-spot-title">{stepTitles[step]}</h2>
        <button type="button" onClick={handleClose} aria-label={t('common.cancel')}>
          <Icon name="close" size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="modal-body">
        {step === 0 && (
          <LocationStep
            values={values}
            onChange={patch}
            mapStyle={mapStyle}
            readOnly={mode === 'edit'}
          />
        )}
        {step === 1 && (
          <BasicsStep
            values={values}
            onChange={patch}
            files={files}
            onFilesChange={setFiles}
            existingImages={mode === 'edit' ? (initialImages ?? []) : undefined}
            removedImageIds={mode === 'edit' ? removedImageIds : undefined}
            onPhotosChange={
              mode === 'edit'
                ? ({ removedIds, files: newFiles }) => {
                    setRemovedImageIds(removedIds)
                    setFiles(newFiles)
                  }
                : undefined
            }
          />
        )}
        {step === 2 && (
          <Suspense fallback={<span>{t('addSpot.loading')}</span>}>
            <TaxonomyStep values={values} onChange={patch} />
          </Suspense>
        )}
        {step === 3 && parsedForReview?.success && (
          <ReviewStep values={parsedForReview.data} />
        )}
      </div>

      {/* Footer */}
      <div className="modal-foot">
        {/* Step dots */}
        <div className="step-dots" aria-label={t('addSpot.progress')}>
          {Array.from({ length: STEP_COUNT }).map((_, i) => (
            <div
              key={i}
              className={`step-dot${i < step ? ' done' : i === step ? ' active' : ''}`}
              aria-current={i === step ? 'step' : undefined}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {step > 0 && (
            <Button variant="secondary" type="button" onClick={() => setStep((s) => s - 1)}>
              {t('common.back')}
            </Button>
          )}

          {step < STEP_COUNT - 1 ? (
            <Button
              variant="primary"
              type="button"
              onClick={handleContinue}
              disabled={!canAdvance}
            >
              {t('common.continue')}
            </Button>
          ) : mode === 'edit' ? (
            <Button
              variant="primary"
              type="button"
              onClick={handleSave}
              disabled={!canAdvance || pending}
            >
              {pending ? t('editSpot.saving') : t('editSpot.save')}
            </Button>
          ) : (
            <Button
              variant="primary"
              type="button"
              onClick={handlePublish}
              disabled={!canAdvance || pending}
            >
              {pending ? t('addSpot.publishing') : t('addSpot.publish')}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
