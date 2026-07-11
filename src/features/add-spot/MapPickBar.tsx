import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '~/components/ui/Button'
import { Icon } from '~/components/ui/Icon'
import { reverseGeocode, type GeocodeResult } from '~/lib/mapbox/geocoding'

export interface MapPickResult {
  position: { lng: number; lat: number }
  geo: GeocodeResult | null
}

interface MapPickBarProps {
  position: { lng: number; lat: number } | null
  onConfirm: (result: MapPickResult) => void
  onCancel: () => void
}

/**
 * Floating confirm bar shown while picking a spot location on the main map.
 * Reverse-geocodes the current pin position (latest-wins via AbortController)
 * and degrades to a position-only confirm when geocoding fails or no token is set.
 */
export function MapPickBar({ position, onConfirm, onCancel }: MapPickBarProps) {
  const { t } = useTranslation()
  const [geo, setGeo] = useState<GeocodeResult | null>(null)
  const [loading, setLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    abortRef.current?.abort()
    if (!position) {
      setGeo(null)
      setLoading(false)
      return
    }
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    void (async () => {
      try {
        const result = await reverseGeocode(position.lng, position.lat, {
          signal: controller.signal,
        })
        if (controller.signal.aborted) return
        setGeo(result)
        setLoading(false)
      } catch {
        // Aborted, no token, or network error — degrade to position-only pick
        if (controller.signal.aborted) return
        setGeo(null)
        setLoading(false)
      }
    })()
    return () => controller.abort()
  }, [position])

  const onCancelRef = useRef(onCancel)
  onCancelRef.current = onCancel
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancelRef.current()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const status =
    !position ? t('addSpot.pickHint')
    : loading ? t('addSpot.pickLocating')
    : geo ? geo.placeName
    : t('addSpot.pickNoAddress')

  return (
    <div
      data-testid="map-pick-bar"
      className="fixed inset-x-3 bottom-[calc(76px+env(safe-area-inset-bottom))] z-50 flex flex-col gap-2.5 rounded-[14px] border border-border bg-surface p-3.5 shadow-[var(--shadow-lg)] md:inset-x-auto md:bottom-6 md:left-1/2 md:w-[420px] md:-translate-x-1/2"
    >
      <div className="flex items-center gap-2 text-[13px] text-text-2">
        <Icon name="mappin" size={14} />
        <span className="min-w-0 truncate" aria-live="polite">
          {status}
        </span>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="secondary"
          type="button"
          data-testid="map-pick-cancel"
          onClick={onCancel}
        >
          {t('common.cancel')}
        </Button>
        <Button
          variant="primary"
          type="button"
          data-testid="map-pick-confirm"
          disabled={!position || loading}
          onClick={() => position && onConfirm({ position, geo })}
        >
          {t('addSpot.pickConfirm')}
        </Button>
      </div>
    </div>
  )
}
