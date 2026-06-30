import type { Theme } from '~/features/theme/theme'
export type MapStyle = 'minimal' | 'satellite'
export function mapStyleUrl(style: MapStyle, theme: Theme): string {
  const map: Record<MapStyle, string> = {
    minimal:
      theme === 'dark'
        ? 'mapbox://styles/mapbox/navigation-night-v1'
        : 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  }
  return map[style]
}
