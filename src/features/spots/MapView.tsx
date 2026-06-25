import { useRef, useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { mapStyleUrl, type MapStyle } from '~/lib/mapbox/map'
import type { Theme } from '~/features/theme/theme'
import type { SpotListItem } from './domain'
import type { Bounds } from './queries'
import { MapStyleSwitch } from './MapStyleSwitch'

const DEFAULT_CENTER: [number, number] = [2.35, 48.85]
const DEFAULT_ZOOM = 11.5

// ── Minimal typed interfaces for mapbox-gl instances ─────────────────────────
interface MapboxMarker {
  setLngLat: (coords: [number, number]) => MapboxMarker
  addTo: (map: MapboxMap) => MapboxMarker
  remove: () => void
}

interface MapboxMapEvent {
  lngLat: { lng: number; lat: number }
}

interface MapboxLngLatBounds {
  getWest: () => number
  getSouth: () => number
  getEast: () => number
  getNorth: () => number
}

interface MapboxMap {
  on: (event: string, cb: (e: MapboxMapEvent) => void) => void
  setStyle: (style: string) => void
  flyTo: (opts: { center: [number, number]; zoom?: number }) => void
  zoomTo: (zoom: number) => void
  getZoom: () => number
  getBounds: () => MapboxLngLatBounds
  remove: () => void
}

interface MapboxGLStatic {
  accessToken: string
  Map: new (opts: object) => MapboxMap
  Marker: new (opts: object) => MapboxMarker
}

// ── Props ─────────────────────────────────────────────────────────────────────
export interface MapViewProps {
  spots: SpotListItem[]
  activeSpotId: string | null
  onSelectSpot: (id: string) => void
  onMapClick?: (pos: { lng: number; lat: number }) => void
  onBoundsChange?: (bounds: Bounds) => void
  addMode?: boolean
  newSpotPosition?: { lng: number; lat: number } | null
  mapStyle: MapStyle
  onChange?: (s: MapStyle) => void
  theme: Theme
}

export function MapView({
  spots,
  activeSpotId,
  onSelectSpot,
  onMapClick,
  onBoundsChange,
  addMode = false,
  newSpotPosition = null,
  mapStyle,
  onChange,
  theme,
}: MapViewProps) {
  const { t } = useTranslation()
  const mapHostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const mapboxglRef = useRef<MapboxGLStatic | null>(null)
  const markersRef = useRef<MapboxMarker[]>([])
  const newSpotMarkerRef = useRef<MapboxMarker | null>(null)
  // Trigger re-renders when map becomes ready
  const [mapReady, setMapReady] = useState(false)

  const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined
  const hasToken = Boolean(token)

  // Stable callback refs so effects don't re-run when callbacks change
  const onSelectSpotRef = useRef(onSelectSpot)
  onSelectSpotRef.current = onSelectSpot
  const onMapClickRef = useRef(onMapClick)
  onMapClickRef.current = onMapClick
  const onBoundsChangeRef = useRef(onBoundsChange)
  onBoundsChangeRef.current = onBoundsChange

  // ── Init effect (mount, client-only, token required) ─────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!hasToken) return
    if (!mapHostRef.current) return

    let cancelled = false

    void (async () => {
      const mapboxgl = ((await import('mapbox-gl')).default as unknown) as MapboxGLStatic
      if (cancelled || !mapHostRef.current) return

      mapboxgl.accessToken = token as string
      mapboxglRef.current = mapboxgl

      const map = new mapboxgl.Map({
        container: mapHostRef.current,
        style: mapStyleUrl(mapStyle, theme),
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      })

      map.on('click', (e) => {
        onMapClickRef.current?.({ lng: e.lngLat.lng, lat: e.lngLat.lat })
      })

      // Emit viewport bounds on initial load and on every pan/zoom end.
      // We use a named helper so the moveend listener can be removed on unmount.
      function emitBounds() {
        const b = map.getBounds()
        onBoundsChangeRef.current?.({
          west: b.getWest(),
          south: b.getSouth(),
          east: b.getEast(),
          north: b.getNorth(),
        })
      }

      map.on('load', emitBounds)
      map.on('moveend', emitBounds)

      mapRef.current = map
      setMapReady(true)
    })()

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      mapboxglRef.current = null
      setMapReady(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasToken, token])

  // ── Style effect (runs when style/theme changes, after map is ready) ──────
  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    mapRef.current.setStyle(mapStyleUrl(mapStyle, theme))
  }, [mapStyle, theme, mapReady])

  // ── Rebuild markers whenever spots / activeSpotId / mapReady changes ──────
  const rebuildMarkers = useCallback(() => {
    const map = mapRef.current
    const mapboxgl = mapboxglRef.current
    if (!map || !mapboxgl) return

    // Remove previous markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    for (const spot of spots) {
      const el = document.createElement('div')
      el.className = 'wp-pin' + (spot.id === activeSpotId ? ' active' : '')

      const dot = document.createElement('div')
      dot.className = 'dot'
      el.appendChild(dot)

      const spotId = spot.id
      el.addEventListener('click', () => onSelectSpotRef.current(spotId))

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([spot.longitude, spot.latitude])
        .addTo(map)

      markersRef.current.push(marker)
    }

    // Fly to active spot when it changes
    if (activeSpotId) {
      const active = spots.find((s) => s.id === activeSpotId)
      if (active) {
        map.flyTo({ center: [active.longitude, active.latitude] })
      }
    }

    // New spot position marker
    newSpotMarkerRef.current?.remove()
    newSpotMarkerRef.current = null
    if (newSpotPosition) {
      const el = document.createElement('div')
      el.className = 'wp-pin active'
      const dot = document.createElement('div')
      dot.className = 'dot'
      el.appendChild(dot)
      newSpotMarkerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat([newSpotPosition.lng, newSpotPosition.lat])
        .addTo(map)
    }
  }, [spots, activeSpotId, newSpotPosition])

  useEffect(() => {
    if (!mapReady) return
    rebuildMarkers()
  }, [mapReady, rebuildMarkers])

  // ── addMode cursor ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapHostRef.current) return
    mapHostRef.current.style.cursor = addMode ? 'crosshair' : ''
  }, [addMode])

  // ── Controls ──────────────────────────────────────────────────────────────
  function handleZoomIn() {
    if (!mapRef.current) return
    mapRef.current.zoomTo(mapRef.current.getZoom() + 1)
  }
  function handleZoomOut() {
    if (!mapRef.current) return
    mapRef.current.zoomTo(mapRef.current.getZoom() - 1)
  }
  function handleRecenter() {
    if (!mapRef.current) return
    mapRef.current.flyTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM })
  }

  return (
    <div className="map-container">
      {/* The actual mapbox canvas host — all mapbox code runs in effects, SSR-safe */}
      <div
        ref={mapHostRef}
        className="map-canvas-host"
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* Style switch */}
      <div className="map-topbar">
        {onChange && <MapStyleSwitch value={mapStyle} onChange={onChange} />}
      </div>

      {/* Zoom / recenter controls */}
      <div className="map-ctrls">
        <button className="map-ctrl" type="button" onClick={handleZoomIn} aria-label="Zoom in">
          <Icon name="zoomIn" size={15} />
        </button>
        <button className="map-ctrl" type="button" onClick={handleZoomOut} aria-label="Zoom out">
          <Icon name="zoomOut" size={15} />
        </button>
        <button className="map-ctrl" type="button" onClick={handleRecenter} aria-label="Recenter">
          <Icon name="locate" size={15} />
        </button>
      </div>

      {/* Token notice — shown when no token (mocks-first / SSR) */}
      {!hasToken && <div className="token-notice">{t('discover.mapTokenMissing')}</div>}
    </div>
  )
}
