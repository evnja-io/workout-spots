# Location-aware Map Centering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Open the discover map near the user (precise GPS if permitted, IP-geo region otherwise) instead of always on Paris, showing a "you are here" marker when located.

**Architecture:** A location priority ladder — precise GPS (client) → remembered cookie → IP-geo (Vercel headers, read in the route loader) → Paris default — resolves the map's initial center. The center is resolved in the route loader so the server-only IP headers reach the client via `useLoaderData`. A client hook auto-asks for geolocation on mount, refines the center, persists it to a cookie, and drives the "you are here" marker. Nearby spots fall out of the existing viewport-bounds query — no new radius query.

**Tech Stack:** TanStack Start (SSR/Nitro), TanStack Router (file-based loaders), React 19, Mapbox GL, Vitest + jsdom + Testing Library.

## Global Constraints

- TypeScript strict, **zero `any`** — match the typed-mock style already in `MapView.test.tsx`.
- **Mocks-first resilience:** never throw on missing config; no Supabase or DB changes in this feature.
- Env vars are `VITE_`-prefixed and read via `import.meta.env`, never `process.env`.
- Server-only helpers import from `@tanstack/react-start/server`; isomorphic split mirrors `features/settings/prefs.ts` ↔ `prefs.server.ts`.
- Coordinate order is **Mapbox `[lng, lat]`** everywhere a tuple is used.
- Cookie coords rounded to 2 decimals (~1.1 km) before storing; cookie name `loc`, `path=/; max-age=2592000; samesite=lax` (30 days).
- `routeTree.gen.ts` is auto-generated — never edit by hand.
- Run `npm test`, `npm run typecheck` to verify. (`npm run lint` may OOM when the local DB stack is running — typecheck + test are the gates.)

---

### Task 1: Pure location utilities

**Files:**
- Create: `src/features/geolocation/location.ts`
- Test: `src/features/geolocation/location.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type LngLat = [number, number]` (Mapbox `[lng, lat]`)
  - `type MapCenter = { center: LngLat; zoom: number; source: 'cookie' | 'ip' | 'default' }`
  - `const PARIS_CENTER: LngLat` = `[2.35, 48.85]`
  - `const REGION_ZOOM = 11.5`, `const PRECISE_ZOOM = 13`, `const LOC_COOKIE = 'loc'`
  - `roundCoord(n: number): number`
  - `parseCoord(raw: string | undefined | null): number | null`
  - `parseLocCookie(raw: string | undefined | null): LngLat | null`
  - `resolveCenter(cookieLoc: LngLat | null, ipLat: number | null, ipLng: number | null): MapCenter`
  - `setLocationCookie(lng: number, lat: number): void`

- [ ] **Step 1: Write the failing test**

Create `src/features/geolocation/location.test.ts`:

```ts
import { describe, expect, it, beforeEach } from 'vitest'
import {
  roundCoord,
  parseCoord,
  parseLocCookie,
  resolveCenter,
  setLocationCookie,
  PARIS_CENTER,
  REGION_ZOOM,
  PRECISE_ZOOM,
} from './location'

describe('roundCoord', () => {
  it('rounds to 2 decimals', () => {
    expect(roundCoord(48.8566123)).toBe(48.86)
    expect(roundCoord(2.3522)).toBe(2.35)
    expect(roundCoord(-0.126)).toBe(-0.13)
  })
})

describe('parseCoord', () => {
  it('parses finite decimals', () => {
    expect(parseCoord('48.85')).toBe(48.85)
    expect(parseCoord('-2.3')).toBe(-2.3)
  })
  it('returns null for missing/invalid', () => {
    expect(parseCoord(undefined)).toBeNull()
    expect(parseCoord(null)).toBeNull()
    expect(parseCoord('')).toBeNull()
    expect(parseCoord('abc')).toBeNull()
  })
})

describe('parseLocCookie', () => {
  it('parses "lng,lat" into a tuple', () => {
    expect(parseLocCookie('2.35,48.85')).toEqual([2.35, 48.85])
  })
  it('returns null for malformed values', () => {
    expect(parseLocCookie(undefined)).toBeNull()
    expect(parseLocCookie('2.35')).toBeNull()
    expect(parseLocCookie('a,b')).toBeNull()
    expect(parseLocCookie('2.35,48.85,9')).toBeNull()
  })
})

describe('resolveCenter', () => {
  it('prefers the cookie location at precise zoom', () => {
    expect(resolveCenter([2.35, 48.85], 51, 0)).toEqual({
      center: [2.35, 48.85],
      zoom: PRECISE_ZOOM,
      source: 'cookie',
    })
  })
  it('falls back to IP coords (lng,lat order) at region zoom', () => {
    expect(resolveCenter(null, 51.5, -0.12)).toEqual({
      center: [-0.12, 51.5],
      zoom: REGION_ZOOM,
      source: 'ip',
    })
  })
  it('falls back to Paris default when nothing is known', () => {
    expect(resolveCenter(null, null, null)).toEqual({
      center: PARIS_CENTER,
      zoom: REGION_ZOOM,
      source: 'default',
    })
  })
  it('treats a partial IP pair as unknown', () => {
    expect(resolveCenter(null, 51.5, null).source).toBe('default')
  })
})

describe('setLocationCookie', () => {
  beforeEach(() => {
    document.cookie = 'loc=; path=/; max-age=0'
  })
  it('writes rounded coords as "lng,lat"', () => {
    setLocationCookie(2.352211, 48.856612)
    expect(document.cookie).toContain('loc=2.35,48.86')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/geolocation/location.test.ts`
Expected: FAIL — cannot resolve `./location`.

- [ ] **Step 3: Write minimal implementation**

Create `src/features/geolocation/location.ts`:

```ts
export type LngLat = [number, number]

export type MapCenter = {
  center: LngLat
  zoom: number
  source: 'cookie' | 'ip' | 'default'
}

export const PARIS_CENTER: LngLat = [2.35, 48.85]
export const REGION_ZOOM = 11.5
export const PRECISE_ZOOM = 13
export const LOC_COOKIE = 'loc'

/** Round a coordinate to 2 decimals (~1.1 km) for privacy. */
export function roundCoord(n: number): number {
  return Math.round(n * 100) / 100
}

/** Parse a single finite decimal coordinate, else null. */
export function parseCoord(raw: string | undefined | null): number | null {
  if (raw == null || raw === '') return null
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : null
}

/** Parse the `loc` cookie value ("lng,lat") into a tuple, tolerant of garbage. */
export function parseLocCookie(raw: string | undefined | null): LngLat | null {
  if (raw == null) return null
  const parts = raw.split(',')
  if (parts.length !== 2) return null
  const lng = parseCoord(parts[0])
  const lat = parseCoord(parts[1])
  if (lng == null || lat == null) return null
  return [lng, lat]
}

/**
 * Resolve the initial map center from the location priority ladder:
 * remembered cookie (precise) → IP geo (region) → Paris default.
 */
export function resolveCenter(
  cookieLoc: LngLat | null,
  ipLat: number | null,
  ipLng: number | null,
): MapCenter {
  if (cookieLoc) return { center: cookieLoc, zoom: PRECISE_ZOOM, source: 'cookie' }
  if (ipLat != null && ipLng != null) {
    return { center: [ipLng, ipLat], zoom: REGION_ZOOM, source: 'ip' }
  }
  return { center: PARIS_CENTER, zoom: REGION_ZOOM, source: 'default' }
}

/** Persist the last precise location (client-only). Coords rounded for privacy. */
export function setLocationCookie(lng: number, lat: number): void {
  const value = `${roundCoord(lng)},${roundCoord(lat)}`
  document.cookie = `${LOC_COOKIE}=${value}; path=/; max-age=2592000; samesite=lax`
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/geolocation/location.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
git add src/features/geolocation/location.ts src/features/geolocation/location.test.ts
git commit -m "feat(geolocation): pure location resolver + cookie helpers"
```

---

### Task 2: Isomorphic initial-center resolver (server reads IP headers)

**Files:**
- Create: `src/features/geolocation/location.server.ts`
- Modify: `src/features/geolocation/location.ts` (append the isomorphic `getInitialMapCenter`)
- Test: `src/features/geolocation/location.test.ts` (append a client-branch case)

**Interfaces:**
- Consumes: `parseLocCookie`, `parseCoord`, `resolveCenter`, `LOC_COOKIE`, `MapCenter` from Task 1.
- Produces:
  - `getServerInitialCenter(): MapCenter` (from `location.server.ts`)
  - `getInitialMapCenter(): MapCenter` (isomorphic, from `location.ts`) — called in the route loader.

- [ ] **Step 1: Write the failing test**

Append to `src/features/geolocation/location.test.ts`:

```ts
import { getInitialMapCenter } from './location'

describe('getInitialMapCenter (client branch)', () => {
  beforeEach(() => {
    document.cookie = 'loc=; path=/; max-age=0'
  })
  it('uses the loc cookie when present', () => {
    document.cookie = 'loc=2.35,48.85; path=/'
    expect(getInitialMapCenter()).toEqual({
      center: [2.35, 48.85],
      zoom: PRECISE_ZOOM,
      source: 'cookie',
    })
  })
  it('falls back to Paris default when no cookie (client has no IP headers)', () => {
    expect(getInitialMapCenter().source).toBe('default')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/geolocation/location.test.ts -t "getInitialMapCenter"`
Expected: FAIL — `getInitialMapCenter` is not exported.

- [ ] **Step 3: Write minimal implementation**

Create `src/features/geolocation/location.server.ts`:

```ts
import { getCookie, getRequestHeader } from '@tanstack/react-start/server'
import { LOC_COOKIE, parseCoord, parseLocCookie, resolveCenter, type MapCenter } from './location'

/** Server branch: remembered cookie first, then Vercel IP-geo headers. */
export function getServerInitialCenter(): MapCenter {
  const cookieLoc = parseLocCookie(getCookie(LOC_COOKIE))
  const ipLat = parseCoord(getRequestHeader('x-vercel-ip-latitude'))
  const ipLng = parseCoord(getRequestHeader('x-vercel-ip-longitude'))
  return resolveCenter(cookieLoc, ipLat, ipLng)
}
```

Append to `src/features/geolocation/location.ts` (top: add the import; bottom: add the export):

```ts
// at the top of the file, with the other imports (add this line):
import { createIsomorphicFn } from '@tanstack/react-start'
import { getServerInitialCenter } from './location.server'
```

```ts
// at the bottom of the file:
function readClientInitialCenter(): MapCenter {
  const raw = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${LOC_COOKIE}=`))
    ?.split('=')[1]
  return resolveCenter(parseLocCookie(raw), null, null)
}

/**
 * Resolve the initial map center. Call this in the route loader so the
 * server-only Vercel IP headers reach the client via serialized loader data.
 * - server: cookie → IP headers → Paris
 * - client (nav): cookie → Paris (no IP headers available client-side)
 */
export const getInitialMapCenter = createIsomorphicFn()
  .client(readClientInitialCenter)
  .server((): MapCenter => getServerInitialCenter())
```

(`@tanstack/react-start` `getRequestHeader`/`getCookie` are confirmed exports of `@tanstack/react-start/server`; `createIsomorphicFn` strips the `.server()` branch from the client bundle — same mechanism as `prefs.ts`.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/geolocation/location.test.ts`
Expected: PASS (Task 1 cases + the two client-branch cases).

- [ ] **Step 5: Commit**

```bash
git add src/features/geolocation/location.ts src/features/geolocation/location.server.ts src/features/geolocation/location.test.ts
git commit -m "feat(geolocation): isomorphic initial-center resolver with Vercel IP fallback"
```

---

### Task 3: `useUserLocation` hook (auto-ask + persist)

**Files:**
- Create: `src/features/geolocation/useUserLocation.ts`
- Test: `src/features/geolocation/useUserLocation.test.tsx`

**Interfaces:**
- Consumes: `setLocationCookie`, `LngLat` from Task 1.
- Produces:
  - `type UserLocationState = { userLocation: LngLat | null; requestLocation: () => void }`
  - `useUserLocation(): UserLocationState`

- [ ] **Step 1: Write the failing test**

Create `src/features/geolocation/useUserLocation.test.tsx`:

```ts
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { useUserLocation } from './useUserLocation'

type SuccessCb = (pos: { coords: { longitude: number; latitude: number } }) => void
type ErrorCb = (err: unknown) => void

function stubGeolocation(impl: (success: SuccessCb, error: ErrorCb) => void) {
  const getCurrentPosition = vi.fn(impl)
  vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })
  return getCurrentPosition
}

describe('useUserLocation', () => {
  beforeEach(() => {
    document.cookie = 'loc=; path=/; max-age=0'
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('auto-asks on mount, stores the position and writes the cookie on success', async () => {
    const getCurrentPosition = stubGeolocation((success) => {
      success({ coords: { longitude: 2.352, latitude: 48.857 } })
    })

    const { result } = renderHook(() => useUserLocation())

    expect(getCurrentPosition).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(result.current.userLocation).toEqual([2.352, 48.857])
    })
    expect(document.cookie).toContain('loc=2.35,48.86')
  })

  it('stays null and writes no cookie when permission is denied', async () => {
    stubGeolocation((_success, error) => {
      error({ code: 1, message: 'denied' })
    })

    const { result } = renderHook(() => useUserLocation())

    await waitFor(() => {
      expect(result.current.userLocation).toBeNull()
    })
    expect(document.cookie).not.toContain('loc=2.')
  })

  it('requestLocation re-triggers a position request', async () => {
    const getCurrentPosition = stubGeolocation((success) => {
      success({ coords: { longitude: 1, latitude: 2 } })
    })

    const { result } = renderHook(() => useUserLocation())
    expect(getCurrentPosition).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.requestLocation()
    })
    expect(getCurrentPosition).toHaveBeenCalledTimes(2)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/geolocation/useUserLocation.test.tsx`
Expected: FAIL — cannot resolve `./useUserLocation`.

- [ ] **Step 3: Write minimal implementation**

Create `src/features/geolocation/useUserLocation.ts`:

```ts
import { useCallback, useEffect, useState } from 'react'
import { setLocationCookie, type LngLat } from './location'

export type UserLocationState = {
  userLocation: LngLat | null
  requestLocation: () => void
}

/**
 * Asks the browser for the user's location on mount (the native permission
 * prompt). On success: stores the position and persists it to the `loc` cookie.
 * On denial/error/timeout: no-op — the map keeps its loader-resolved center.
 */
export function useUserLocation(): UserLocationState {
  const [userLocation, setUserLocation] = useState<LngLat | null>(null)

  const requestLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next: LngLat = [pos.coords.longitude, pos.coords.latitude]
        setUserLocation(next)
        setLocationCookie(next[0], next[1])
      },
      () => {
        // denied / unavailable / timeout — keep the existing center.
      },
    )
  }, [])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  return { userLocation, requestLocation }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/geolocation/useUserLocation.test.tsx`
Expected: PASS (3 cases).

- [ ] **Step 5: Commit**

```bash
git add src/features/geolocation/useUserLocation.ts src/features/geolocation/useUserLocation.test.tsx
git commit -m "feat(geolocation): useUserLocation hook (auto-ask + cookie persist)"
```

---

### Task 4: MapView — initial center props, user marker, locate button, auto-fly

**Files:**
- Modify: `src/features/spots/MapView.tsx`
- Modify: `src/styles/global.css` (append `.wp-user` marker styles after the `.wp-pin` block, ~line 224)
- Test: `src/features/spots/MapView.test.tsx` (append cases)

**Interfaces:**
- Consumes: `LngLat` concept (uses plain `[number, number]` props to stay decoupled from the geolocation module).
- Produces: extended `MapViewProps`:
  - `initialCenter?: [number, number]`
  - `initialZoom?: number`
  - `userLocation?: [number, number] | null`
  - `onRequestLocation?: () => void`

- [ ] **Step 1: Write the failing test**

Append to `src/features/spots/MapView.test.tsx` inside the `describe('MapView', ...)` block:

```ts
  it('renders a user marker when userLocation is provided', async () => {
    renderMapView({
      spots: [],
      activeSpotId: null,
      onSelectSpot: vi.fn(),
      userLocation: [2.35, 48.85],
      mapStyle: 'light',
      theme: 'light',
    })

    await waitFor(() => {
      // one Marker for the "you are here" pin (no spots in this case)
      expect(MarkerMock).toHaveBeenCalled()
    })
    const userMarkerCall = MarkerMock.mock.calls.find(
      (c) => (c[0] as { element?: HTMLElement })?.element?.className.includes('wp-user'),
    )
    expect(userMarkerCall).toBeTruthy()
  })

  it('locate button flies to the user when known', async () => {
    const { getByLabelText } = renderMapView({
      spots: [],
      activeSpotId: null,
      onSelectSpot: vi.fn(),
      userLocation: [2.35, 48.85],
      onRequestLocation: vi.fn(),
      mapStyle: 'light',
      theme: 'light',
    })

    await waitFor(() => expect(MapMock).toHaveBeenCalled())
    const mapInstance = MapMock.mock.instances[0] as unknown as MapInstance

    getByLabelText('Recenter').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(mapInstance.flyTo).toHaveBeenCalledWith(
      expect.objectContaining({ center: [2.35, 48.85] }),
    )
  })

  it('locate button requests location when user is not known', async () => {
    const onRequestLocation = vi.fn()
    const { getByLabelText } = renderMapView({
      spots: [],
      activeSpotId: null,
      onSelectSpot: vi.fn(),
      userLocation: null,
      onRequestLocation,
      mapStyle: 'light',
      theme: 'light',
    })

    await waitFor(() => expect(MapMock).toHaveBeenCalled())
    getByLabelText('Recenter').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(onRequestLocation).toHaveBeenCalledTimes(1)
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/spots/MapView.test.tsx`
Expected: FAIL — `userLocation`/`onRequestLocation` not accepted; no `wp-user` marker; locate button still flies to Paris default.

- [ ] **Step 3: Write minimal implementation**

In `src/features/spots/MapView.tsx`:

(a) Add a user-zoom constant near the top (after `DEFAULT_ZOOM`, line ~11):

```ts
const USER_ZOOM = 13
```

(b) Extend `MapViewProps` (after `theme: Theme` field, ~line 59):

```ts
  initialCenter?: [number, number]
  initialZoom?: number
  userLocation?: [number, number] | null
  onRequestLocation?: () => void
```

(c) Add the new params to the destructured signature (after `theme,`):

```ts
  initialCenter,
  initialZoom,
  userLocation = null,
  onRequestLocation,
```

(d) Add a stable ref for the callback and the user-marker/auto-fly refs. Near the other callback refs (~line 98) add:

```ts
  const onRequestLocationRef = useRef(onRequestLocation)
  onRequestLocationRef.current = onRequestLocation
```

Near `newSpotMarkerRef` (~line 82) add:

```ts
  const userMarkerRef = useRef<MapboxMarker | null>(null)
  const flewToUserRef = useRef(false)
```

(e) Use the initial-center props in the map constructor (replace the `center`/`zoom` lines ~120-121):

```ts
        center: initialCenter ?? DEFAULT_CENTER,
        zoom: initialZoom ?? DEFAULT_ZOOM,
```

(f) In the init effect cleanup (~line 156, alongside `newSpotMarkerRef.current = null`) add:

```ts
      userMarkerRef.current = null
```

(g) Add the user-marker effect (after the new-spot-position effect, ~line 235):

```ts
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

  // ── Auto-fly to the user once, when their location first resolves ──────────
  // Skips if a spot is already selected (don't yank a deep-linked detail view).
  useEffect(() => {
    const map = mapRef.current
    if (!mapReady || !map || !userLocation) return
    if (flewToUserRef.current) return
    flewToUserRef.current = true
    if (activeSpotId) return
    map.flyTo({ center: userLocation, zoom: USER_ZOOM })
  }, [userLocation, mapReady, activeSpotId])
```

(h) Repurpose `handleRecenter` (~line 270):

```ts
  function handleRecenter() {
    if (!mapRef.current) return
    if (userLocation) {
      mapRef.current.flyTo({ center: userLocation, zoom: USER_ZOOM })
      return
    }
    onRequestLocationRef.current?.()
  }
```

In `src/styles/global.css`, after the `[data-theme='dark'] .wp-pin .dot { ... }` block (~line 224), append:

```css
.wp-user {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  pointer-events: none;
}
.wp-user .dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #2563eb;
  border: 3px solid white;
  box-shadow:
    0 0 0 6px rgba(37, 99, 235, 0.18),
    0 2px 8px rgba(37, 99, 235, 0.4);
}
[data-theme='dark'] .wp-user .dot {
  border-color: var(--surface);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/spots/MapView.test.tsx`
Expected: PASS (existing 2 cases + 3 new cases).

- [ ] **Step 5: Commit**

```bash
git add src/features/spots/MapView.tsx src/features/spots/MapView.test.tsx src/styles/global.css
git commit -m "feat(spots): map initial-center props, user marker, locate-to-me button"
```

---

### Task 5: Wire geolocation into the `/spots` route

**Files:**
- Modify: `src/routes/spots/route.tsx`

**Interfaces:**
- Consumes: `getInitialMapCenter` (Task 2), `useUserLocation` (Task 3), `MapView`'s new props (Task 4).
- Produces: a `/spots` loader that returns `{ mapCenter }`, and a `SpotsLayout` that passes `initialCenter`, `initialZoom`, `userLocation`, `onRequestLocation` to `MapView`.

- [ ] **Step 1: Add imports**

In `src/routes/spots/route.tsx`, after the existing feature imports (~line 15) add:

```ts
import { getInitialMapCenter } from '~/features/geolocation/location'
import { useUserLocation } from '~/features/geolocation/useUserLocation'
```

- [ ] **Step 2: Return the resolved center from the loader**

Change the loader (currently lines ~35-41) to resolve the center and return it. The center is resolved in the loader specifically so the server-only Vercel IP headers serialize to the client:

```ts
  loader: async ({ context }) => {
    // Prefetch the initial world-bounds query (top-500 most-rated spots globally)
    // so SSR renders spots immediately without a loading state.
    await context.queryClient.ensureQueryData(spotsInBoundsQueryOptions(WORLD_BOUNDS))
    await context.queryClient.ensureQueryData(equipmentsQueryOptions())
    await context.queryClient.ensureQueryData(disciplinesQueryOptions())
    // Resolve the initial map center here (not in the component): the server
    // branch reads Vercel IP-geo headers, which the client can't see — returning
    // it from the loader serializes that value to the client.
    return { mapCenter: getInitialMapCenter() }
  },
```

- [ ] **Step 3: Consume the loader data and the hook in `SpotsLayout`**

Inside `SpotsLayout`, after `const navigate = useNavigate()` (~line 53) add:

```ts
  const { mapCenter } = Route.useLoaderData()
  const { userLocation, requestLocation } = useUserLocation()
```

- [ ] **Step 4: Pass the new props to `MapView`**

Update the `<MapView .../>` element (~lines 96-104) to include the new props:

```tsx
        <MapView
          spots={spots}
          activeSpotId={activeSpotId}
          onSelectSpot={handleSelectSpot}
          onBoundsChange={debouncedSetBounds}
          initialCenter={mapCenter.center}
          initialZoom={mapCenter.zoom}
          userLocation={userLocation}
          onRequestLocation={requestLocation}
          mapStyle={mapStyle}
          onChange={setMapStyle}
          theme="light"
        />
```

- [ ] **Step 5: Verify types + full suite + build**

This task is plumbing; its logic is covered by Tasks 1-4. Verify nothing regressed:

Run: `npm run typecheck`
Expected: no errors.

Run: `npm test`
Expected: all suites PASS (including the existing `discover.integration.test.tsx` and `MapView.test.tsx`).

Run: `npm run build`
Expected: build completes (SSR graph compiles with the new loader return + isomorphic import).

- [ ] **Step 6: Manual SSR smoke check (mocks-first, no token)**

Run the built server and confirm HTTP 200 (per the "build passing ≠ SSR works" rule):

```bash
npm start &
sleep 3
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000/spots
kill %1
```

Expected: `200`.

- [ ] **Step 7: Commit**

```bash
git add src/routes/spots/route.tsx
git commit -m "feat(spots): center the map on the user via geolocation + IP fallback"
```

---

## Self-Review

**Spec coverage:**
- Priority ladder (GPS → cookie → IP → Paris) → Task 1 (`resolveCenter`) + Task 2 (server IP read) + Task 3 (GPS) + Task 5 (loader wiring). ✓
- IP geo via Vercel headers, read on SSR → Task 2 (`getServerInitialCenter`) + Task 5 (resolved in loader so it reaches the client). ✓
- Auto-ask permission on first load → Task 3 (`useEffect` → `requestLocation`). ✓
- Persist precise location in a cookie, re-verified on load → Task 1 (`setLocationCookie`) + Task 3 (writes on success, runs each mount). ✓
- "You are here" marker → Task 4 (`.wp-user` marker + CSS). ✓
- Auto-fly to precise location once, not over an active spot → Task 4 (auto-fly effect with `flewToUserRef` + `activeSpotId` guard). ✓
- Locate button repurposed (fly to user / re-prompt) → Task 4 (`handleRecenter`). ✓
- Nearby spots via existing viewport query, no radius query → no query changes; centering drives `moveend` → `spotsInBoundsQueryOptions`. ✓
- Denied/timeout = silent, keep center → Task 3 (empty error callback). ✓
- No Vercel headers (local dev) → Paris default → Task 1 (`resolveCenter` default branch); existing tests unaffected. ✓
- SSR-safe (browser APIs behind client branch / effects) → Task 2 (isomorphic split) + Task 3 (effect-only) + Task 4 (marker built in effects). ✓
- Privacy: 2-decimal rounding, 30-day cookie → Task 1 (`setLocationCookie`). ✓
- Mocks-first, no Supabase/DB changes → confirmed across all tasks. ✓

**Placeholder scan:** No TBD/TODO/"handle edge cases"/"similar to Task N"; every code step shows full code. ✓

**Type consistency:** `LngLat = [number, number]`, `MapCenter`, `REGION_ZOOM`/`PRECISE_ZOOM`/`USER_ZOOM` (13 in both `location.ts` and MapView — MapView keeps a local `USER_ZOOM` to avoid importing the isomorphic module; the values match), `getInitialMapCenter`/`getServerInitialCenter`, `setLocationCookie`, `useUserLocation`/`UserLocationState`, MapView props `initialCenter`/`initialZoom`/`userLocation`/`onRequestLocation`, loader return `{ mapCenter }` consumed via `Route.useLoaderData()`. Names align across tasks. ✓
