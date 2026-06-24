import { useTranslation } from 'react-i18next'
import type { MapStyle } from '~/lib/mapbox/map'

interface MapStyleSwitchProps {
  value: MapStyle
  onChange: (s: MapStyle) => void
}

const STYLES: { key: MapStyle; labelKey: string }[] = [
  { key: 'light', labelKey: 'discover.styleLight' },
  { key: 'minimal', labelKey: 'discover.styleMinimal' },
  { key: 'satellite', labelKey: 'discover.styleSatellite' },
]

export function MapStyleSwitch({ value, onChange }: MapStyleSwitchProps) {
  const { t } = useTranslation()
  return (
    <div className="map-style-switch">
      {STYLES.map(({ key, labelKey }) => (
        <button
          key={key}
          className={value === key ? 'active' : undefined}
          onClick={() => onChange(key)}
          type="button"
        >
          {t(labelKey, key.charAt(0).toUpperCase() + key.slice(1))}
        </button>
      ))}
    </div>
  )
}
