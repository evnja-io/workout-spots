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

