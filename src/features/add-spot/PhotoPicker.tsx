import { useEffect, useRef, useState } from 'react'
import { Icon } from '~/components/ui/Icon'
import { validateImage, MAX_IMAGES } from './photos'

interface PhotoPickerProps {
  files: File[]
  onChange: (files: File[]) => void
}

interface SlotEntry {
  file: File
  previewUrl: string
  error: string | null
}

export function PhotoPicker({ files, onChange }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [slots, setSlots] = useState<SlotEntry[]>([])

  // When the wizard resets (files goes to empty array), clear slots
  useEffect(() => {
    if (files.length === 0 && slots.length > 0) {
      slots.forEach((s) => URL.revokeObjectURL(s.previewUrl))
      setSlots([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length])

  // Revoke all object URLs on unmount
  useEffect(() => {
    return () => {
      // Capture current value for cleanup
      setSlots((prev) => {
        prev.forEach((s) => URL.revokeObjectURL(s.previewUrl))
        return []
      })
    }
  }, [])

  function addFiles(incoming: FileList | null) {
    if (!incoming) return

    const newSlots: SlotEntry[] = []
    const remaining = MAX_IMAGES - slots.length
    const count = Math.min(incoming.length, remaining)

    for (let i = 0; i < count; i++) {
      const file = incoming.item(i)
      if (!file) continue
      const validation = validateImage(file)
      const previewUrl = URL.createObjectURL(file)
      newSlots.push({
        file,
        previewUrl,
        error: validation.ok ? null : validation.reason,
      })
    }

    const updatedSlots = [...slots, ...newSlots]
    setSlots(updatedSlots)

    // Notify parent with only valid files
    const validFiles = updatedSlots.filter((s) => s.error === null).map((s) => s.file)
    onChange(validFiles)

    // Reset the input so the same file can be re-selected after removal
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  function removeSlot(index: number) {
    const slot = slots[index]
    if (slot) {
      URL.revokeObjectURL(slot.previewUrl)
    }

    const updatedSlots = slots.filter((_, i) => i !== index)
    setSlots(updatedSlots)

    const validFiles = updatedSlots.filter((s) => s.error === null).map((s) => s.file)
    onChange(validFiles)
  }

  const canAddMore = slots.length < MAX_IMAGES

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginTop: '4px',
        }}
      >
        {slots.map((slot, index) => (
          <div key={slot.previewUrl} style={{ position: 'relative' }}>
            <div
              className="img-slot filled"
              style={{ backgroundImage: `url(${slot.previewUrl})` }}
              aria-label={slot.file.name}
            />
            {slot.error !== null && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  fontSize: '10px',
                  padding: '2px 4px',
                  borderRadius: '0 0 8px 8px',
                  textAlign: 'center',
                }}
              >
                {slot.error}
              </div>
            )}
            <button
              type="button"
              aria-label={`Remove ${slot.file.name}`}
              onClick={() => removeSlot(index)}
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
              }}
            >
              <Icon name="close" size={12} color="#fff" />
            </button>
          </div>
        ))}

        {canAddMore && (
          <label className="img-slot" style={{ cursor: 'pointer' }} aria-label="Add photo">
            <Icon name="camera" size={22} />
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => addFiles(e.target.files)}
            />
          </label>
        )}
      </div>
    </div>
  )
}
