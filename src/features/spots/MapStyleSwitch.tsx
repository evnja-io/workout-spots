import { useTranslation } from 'react-i18next'
import { cx } from '~/components/ui/cx'
import type { MapStyle } from '~/lib/mapbox/map'

interface MapStyleSwitchProps {
  value: MapStyle
  onChange: (s: MapStyle) => void
}

const STYLES: { key: MapStyle; labelKey: string }[] = [
  { key: 'minimal', labelKey: 'discover.styleMinimal' },
  { key: 'satellite', labelKey: 'discover.styleSatellite' },
]

export function MapStyleSwitch({ value, onChange }: MapStyleSwitchProps) {
  const { t } = useTranslation()
  return (
    <div className="pointer-events-auto inline-flex rounded-full border border-border bg-surface p-[3px] shadow-[var(--shadow-md)]">
      {STYLES.map(({ key, labelKey }) => (
        <button
          key={key}
          className={cx(
            'rounded-full px-3 py-1.5 text-[12px] text-text-3',
            value === key && 'bg-text text-bg',
          )}
          onClick={() => onChange(key)}
          type="button"
        >
          {t(labelKey, key.charAt(0).toUpperCase() + key.slice(1))}
        </button>
      ))}
    </div>
  )
}
