import { vi } from 'vitest'

export class FakeMarker {
  setLngLat() {
    return this
  }
  addTo() {
    return this
  }
  remove() {
    return this
  }
}
export class FakeMap {
  private handlers: Record<string, ((e: unknown) => void)[]> = {}
  on(evt: string, cb: (e: unknown) => void) {
    ;(this.handlers[evt] ??= []).push(cb)
  }
  fire(evt: string, e: unknown) {
    ;(this.handlers[evt] ?? []).forEach((h) => h(e))
  }
  setStyle() {}
  flyTo() {}
  zoomTo() {}
  getZoom() {
    return 11.5
  }
  remove() {}
}
export function mockMapboxGl() {
  vi.mock('mapbox-gl', () => ({
    default: { Map: FakeMap, Marker: FakeMarker, accessToken: '' },
    Map: FakeMap,
    Marker: FakeMarker,
  }))
}
