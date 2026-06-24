import type { Theme } from '~/features/theme/theme'
export type MapStyle = 'light' | 'minimal' | 'satellite'
export function mapStyleUrl(style: MapStyle, theme: Theme): string {
  const map: Record<MapStyle, string> = {
    light:
      theme === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11',
    minimal:
      theme === 'dark'
        ? 'mapbox://styles/mapbox/navigation-night-v1'
        : 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  }
  return map[style]
}
