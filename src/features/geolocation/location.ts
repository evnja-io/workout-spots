import { createIsomorphicFn } from '@tanstack/react-start'
import { getServerInitialCenter } from './location.server'

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
