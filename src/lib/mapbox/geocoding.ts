export type GeocodeResult = {
  placeName: string
  address: string
  city: string
  region: string
  country: string
  lng: number
  lat: number
  /** [west, south, east, north] extent — present for areas (cities/regions), absent for point addresses. */
  bbox?: [number, number, number, number]
}
type MapboxContext = { id: string; text: string }
type MapboxFeature = {
  place_name: string
  text: string
  center: [number, number]
  bbox?: [number, number, number, number]
  context?: MapboxContext[]
}

function token(): string {
  const t = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined
  if (!t) throw new Error('VITE_MAPBOX_TOKEN missing')
  return t
}
function pick(ctx: MapboxContext[] | undefined, prefix: string): string {
  return ctx?.find((c) => c.id.startsWith(prefix))?.text ?? ''
}
function toResult(f: MapboxFeature): GeocodeResult {
  return {
    placeName: f.place_name,
    address: f.text,
    city: pick(f.context, 'place'),
    region: pick(f.context, 'region'),
    country: pick(f.context, 'country'),
    lng: f.center[0],
    lat: f.center[1],
    bbox: f.bbox,
  }
}
export async function forwardGeocode(
  query: string,
  opts: { limit?: number; signal?: AbortSignal } = {},
): Promise<GeocodeResult[]> {
  if (!query.trim()) return []
  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
  )
  url.searchParams.set('access_token', token())
  url.searchParams.set('limit', String(opts.limit ?? 5))
  const res = await fetch(url, { signal: opts.signal })
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`)
  const data = (await res.json()) as { features: MapboxFeature[] }
  return data.features.map(toResult)
}
export async function reverseGeocode(
  lng: number,
  lat: number,
  opts: { signal?: AbortSignal } = {},
): Promise<GeocodeResult | null> {
  const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`)
  url.searchParams.set('access_token', token())
  const res = await fetch(url, { signal: opts.signal })
  if (!res.ok) throw new Error(`Reverse geocoding failed: ${res.status}`)
  const data = (await res.json()) as { features: MapboxFeature[] }
  const f = data.features[0]
  return f ? toResult(f) : null
}
