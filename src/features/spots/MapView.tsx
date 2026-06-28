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
const USER_ZOOM = 13
// Point addresses have no bbox; fly to a neighborhood-level zoom instead.
const SEARCH_ZOOM = 14

/** A place picked from the sidebar geosuggest. `bbox` is [west, south, east, north] when known. */
export type SearchLocation = {
  center: [number, number]
  bbox?: [number, number, number, number]
}

// ── Minimal typed interfaces for mapbox-gl instances ─────────────────────────
interface MapboxMarker {
  setLngLat: (coords: [number, number]) => MapboxMarker
  addTo: (map: MapboxMap) => MapboxMarker
  getElement: () => HTMLElement
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
  fitBounds: (
    bounds: [[number, number], [number, number]],
    opts?: { padding?: number; maxZoom?: number },
  ) => void
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
  initialCenter?: [number, number]
  initialZoom?: number
  searchLocation?: SearchLocation | null
  userLocation?: [number, number] | null
  onRequestLocation?: () => void
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
  initialCenter,
  initialZoom,
  searchLocation = null,
  userLocation = null,
  onRequestLocation,
}: MapViewProps) {
  const { t } = useTranslation()
  const mapHostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const mapboxglRef = useRef<MapboxGLStatic | null>(null)
  // Markers keyed by spot id so refetches reconcile incrementally (only add the
  // newly-revealed spots, remove the departed ones) instead of tearing down and
  // recreating the whole pin layer — which would flicker on every pan.
  const markersRef = useRef<Map<string, MapboxMarker>>(new Map())
  const newSpotMarkerRef = useRef<MapboxMarker | null>(null)
  const userMarkerRef = useRef<MapboxMarker | null>(null)
  const searchMarkerRef = useRef<MapboxMarker | null>(null)
  const flewToUserRef = useRef(false)
  // Tracks the spot we last flew to, so refetching spots (e.g. after panning)
  // never re-centers the map — we only fly when the *selection* changes.
  const flownToRef = useRef<string | null>(null)
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
  const onRequestLocationRef = useRef(onRequestLocation)
  onRequestLocationRef.current = onRequestLocation

  // ── Init effect (mount, client-only, token required) ─────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!hasToken) return
    if (!mapHostRef.current) return

    let cancelled = false
    // Stable Map reference (never reassigned), captured for use in cleanup.
    const markers = markersRef.current

    void (async () => {
      const mapboxgl = ((await import('mapbox-gl')).default as unknown) as MapboxGLStatic
      if (cancelled || !mapHostRef.current) return

      mapboxgl.accessToken = token as string
      mapboxglRef.current = mapboxgl

      const map = new mapboxgl.Map({
        container: mapHostRef.current,
        style: mapStyleUrl(mapStyle, theme),
        center: initialCenter ?? DEFAULT_CENTER,
        zoom: initialZoom ?? DEFAULT_ZOOM,
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
      // map.remove() detaches marker DOM; drop our references too so a remount
      // reconciles from a clean slate rather than against stale markers.
      markers.clear()
      newSpotMarkerRef.current = null
      userMarkerRef.current = null
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

  // ── Reconcile spot markers incrementally (add new, remove departed) ───────
  // Keyed by spot id so panning/refetching leaves existing pins untouched
  // (no destroy/recreate flicker). The active highlight is a class toggle, not
  // a rebuild, so selecting a spot never churns the pin layer.
  const reconcileMarkers = useCallback(() => {
    const map = mapRef.current
    const mapboxgl = mapboxglRef.current
    if (!map || !mapboxgl) return

    const markers = markersRef.current
    const nextIds = new Set(spots.map((s) => s.id))

    // Remove markers for spots no longer in view
    for (const [id, marker] of markers) {
      if (!nextIds.has(id)) {
        marker.remove()
        markers.delete(id)
      }
    }

    for (const spot of spots) {
      let marker = markers.get(spot.id)
      if (!marker) {
        const el = document.createElement('div')
        el.className = 'wp-pin'

        const dot = document.createElement('div')
        dot.className = 'dot'
        el.appendChild(dot)

        const spotId = spot.id
        el.addEventListener('click', () => onSelectSpotRef.current(spotId))

        marker = new mapboxgl.Marker({ element: el })
          .setLngLat([spot.longitude, spot.latitude])
          .addTo(map)

        markers.set(spot.id, marker)
      }
      marker.getElement().classList.toggle('active', spot.id === activeSpotId)
    }
  }, [spots, activeSpotId])

  useEffect(() => {
    if (!mapReady) return
    reconcileMarkers()
  }, [mapReady, reconcileMarkers])

  // ── New-spot position marker (add-spot flow) — isolated from the pin layer ──
  useEffect(() => {
    const map = mapRef.current
    const mapboxgl = mapboxglRef.current
    if (!mapReady || !map || !mapboxgl) return

    newSpotMarkerRef.current?.remove()
    newSpotMarkerRef.current = null
    if (!newSpotPosition) return

    const el = document.createElement('div')
    el.className = 'wp-pin active'
    const dot = document.createElement('div')
    dot.className = 'dot'
    el.appendChild(dot)
    newSpotMarkerRef.current = new mapboxgl.Marker({ element: el })
      .setLngLat([newSpotPosition.lng, newSpotPosition.lat])
      .addTo(map)
  }, [newSpotPosition, mapReady])

  // ── "You are here" marker — isolated from the spot-pin layer ───────────────
  useEffect(() => {
    const map = mapRef.current
    const mapboxgl = mapboxglRef.current
    if (!mapReady || !map || !mapboxgl) return

    userMarkerRef.current?.remove()
    userMarkerRef.current = null
    if (!userLocation) return

    const el = document.createElement('div')
    el.className = 'wp-user'
    const dot = document.createElement('div')
    dot.className = 'dot'
    el.appendChild(dot)
    userMarkerRef.current = new mapboxgl.Marker({ element: el })
      .setLngLat(userLocation)
      .addTo(map)
  }, [userLocation, mapReady])

  // ── Searched location: fly/fit the map + drop a marker ─────────────────────
  // Fitting to the result's bbox (cities/regions) loads exactly the spots in
  // that area; point addresses (no bbox) fall back to a neighborhood zoom. The
  // resulting moveend reloads viewport spots via onBoundsChange — no extra fetch.
  useEffect(() => {
    const map = mapRef.current
    if (!mapReady || !map || !searchLocation) return
    const { center, bbox } = searchLocation
    if (bbox) {
      map.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        { padding: 40, maxZoom: 16 },
      )
    } else {
      map.flyTo({ center, zoom: SEARCH_ZOOM })
    }
  }, [searchLocation, mapReady])

  // ── Searched-location marker — distinct from spot pins and the user marker ──
  useEffect(() => {
    const map = mapRef.current
    const mapboxgl = mapboxglRef.current
    if (!mapReady || !map || !mapboxgl) return

    searchMarkerRef.current?.remove()
    searchMarkerRef.current = null
    if (!searchLocation) return

    const el = document.createElement('div')
    el.className = 'wp-search'
    const dot = document.createElement('div')
    dot.className = 'dot'
    el.appendChild(dot)
    searchMarkerRef.current = new mapboxgl.Marker({ element: el })
      .setLngLat(searchLocation.center)
      .addTo(map)
  }, [searchLocation, mapReady])

  // ── Auto-fly to the user once, when their location first resolves ──────────
  // Skips if a spot is already selected (don't yank a deep-linked detail view).
  useEffect(() => {
    const map = mapRef.current
    if (!mapReady || !map || !userLocation) return
    if (flewToUserRef.current) return
    // One-shot: burn the flag even if we skip flying (a spot is open), so closing a deep-linked detail later never yanks the map to the user.
    flewToUserRef.current = true
    if (activeSpotId) return
    map.flyTo({ center: userLocation, zoom: USER_ZOOM })
  }, [userLocation, mapReady, activeSpotId])

  // ── Fly to the active spot ONLY when the selection changes ────────────────
  // Decoupled from marker rebuilds so panning (which refetches spots) never
  // snaps the map back. The ref guard ensures we fly once per selection.
  useEffect(() => {
    const map = mapRef.current
    if (!mapReady || !map) return
    if (!activeSpotId) {
      flownToRef.current = null
      return
    }
    if (flownToRef.current === activeSpotId) return
    const active = spots.find((s) => s.id === activeSpotId)
    if (active) {
      map.flyTo({ center: [active.longitude, active.latitude] })
      flownToRef.current = activeSpotId
    }
  }, [activeSpotId, spots, mapReady])

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
    if (userLocation) {
      mapRef.current.flyTo({ center: userLocation, zoom: USER_ZOOM })
      return
    }
    onRequestLocationRef.current?.()
  }

  return (
    <div className="relative h-full bg-surface-2">
      {/* The actual mapbox canvas host — all mapbox code runs in effects, SSR-safe */}
      <div
        ref={mapHostRef}
        className="map-canvas-host"
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* Style switch */}
      <div className="pointer-events-none absolute top-[14px] right-[14px] left-[14px] z-[3] flex justify-between gap-2.5">
        {onChange && <MapStyleSwitch value={mapStyle} onChange={onChange} />}
      </div>

      {/* Zoom / recenter controls — lifted above the bottom nav on mobile */}
      <div className="absolute right-[14px] bottom-5 z-[3] flex flex-col gap-1.5 max-md:bottom-[88px]">
        <button
          className="grid size-9 place-items-center rounded-[10px] border border-border bg-surface text-text-2 shadow-[var(--shadow-md)] transition-colors duration-150 hover:bg-surface-2"
          type="button"
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          <Icon name="zoomIn" size={15} />
        </button>
        <button
          className="grid size-9 place-items-center rounded-[10px] border border-border bg-surface text-text-2 shadow-[var(--shadow-md)] transition-colors duration-150 hover:bg-surface-2"
          type="button"
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          <Icon name="zoomOut" size={15} />
        </button>
        <button
          className="grid size-9 place-items-center rounded-[10px] border border-border bg-surface text-text-2 shadow-[var(--shadow-md)] transition-colors duration-150 hover:bg-surface-2"
          type="button"
          onClick={handleRecenter}
          aria-label="Recenter"
        >
          <Icon name="locate" size={15} />
        </button>
      </div>

      {/* Token notice — shown when no token (mocks-first / SSR) */}
      {!hasToken && (
        <div
          data-testid="token-notice"
          className="absolute bottom-[14px] left-[14px] z-[2] max-w-[320px] rounded-[10px] border border-border bg-surface px-3 py-2 text-[11.5px] text-text-3 shadow-[var(--shadow-sm)] max-md:bottom-[88px]"
        >
          {t('discover.mapTokenMissing')}
        </div>
      )}
    </div>
  )
}
