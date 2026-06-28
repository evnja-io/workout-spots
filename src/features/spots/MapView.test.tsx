import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import type { SpotListItem } from './domain'

// ── Local interfaces for typed mocks (zero `any`) ─────────────────────────────
interface MarkerInstance {
  setLngLat: (coords: [number, number]) => MarkerInstance
  addTo: (map: MapInstance) => MarkerInstance
  getElement: () => HTMLElement
  remove: () => void
}

interface FakeLngLatBounds {
  getWest: () => number
  getSouth: () => number
  getEast: () => number
  getNorth: () => number
}

interface MapInstance {
  on: (event: string, cb: (e: unknown) => void) => void
  fire: (event: string, payload: unknown) => void
  setStyle: ReturnType<typeof vi.fn>
  flyTo: ReturnType<typeof vi.fn>
  zoomTo: ReturnType<typeof vi.fn>
  getZoom: () => number
  getBounds: () => FakeLngLatBounds
  remove: ReturnType<typeof vi.fn>
  _handlers: Record<string, Array<(e: unknown) => void>>
}

// ── Mapbox mock ───────────────────────────────────────────────────────────────
// Must use function/class so they can be used as constructors with `new`
const MarkerMock = vi.fn(function (this: MarkerInstance, opts: { element?: HTMLElement }) {
  // Make the mock instance conform to MarkerInstance
  this.setLngLat = vi.fn().mockReturnThis()
  this.addTo = vi.fn().mockReturnThis()
  this.getElement = () => opts.element ?? document.createElement('div')
  this.remove = vi.fn()
  // Attach element reference so tests can inspect it
  ;(this as MarkerInstance & { _opts: { element?: HTMLElement } })._opts = opts
})

const MapMock = vi.fn(function (this: MapInstance) {
  const handlers: Record<string, Array<(e: unknown) => void>> = {}
  this.on = (e: string, cb: (e: unknown) => void) => {
    ;(handlers[e] ??= []).push(cb)
  }
  this.fire = (e: string, p: unknown) => handlers[e]?.forEach((h) => h(p))
  this.setStyle = vi.fn()
  this.flyTo = vi.fn()
  this.zoomTo = vi.fn()
  this.getZoom = () => 11.5
  this.getBounds = () => ({
    getWest: () => -180,
    getSouth: () => -90,
    getEast: () => 180,
    getNorth: () => 90,
  })
  this.remove = vi.fn()
  this._handlers = handlers
})

vi.mock('mapbox-gl', () => ({
  default: {
    Map: MapMock,
    Marker: MarkerMock,
    accessToken: '',
  },
}))

// ── Stub Mapbox token ─────────────────────────────────────────────────────────
vi.stubEnv('VITE_MAPBOX_TOKEN', 'pk.test')

// ── Fixtures ──────────────────────────────────────────────────────────────────
const s1: SpotListItem = {
  id: 'spot-1',
  name: 'Spot One',
  city: 'Paris',
  address: '1 Rue Test',
  latitude: 48.85,
  longitude: 2.35,
  isOpen24h: true,
  averageRating: 4.5,
  ratingCount: 10,
  disciplineIds: [],
  equipmentIds: [],
  thumbnailUrl: null,
}

const s2: SpotListItem = {
  id: 'spot-2',
  name: 'Spot Two',
  city: 'Paris',
  address: '2 Rue Test',
  latitude: 48.87,
  longitude: 2.37,
  isOpen24h: false,
  averageRating: 3.8,
  ratingCount: 5,
  disciplineIds: [],
  equipmentIds: [],
  thumbnailUrl: null,
}

// ── Lazy import MapView AFTER mock is in place ────────────────────────────────
// We do a static import at module level since vi.mock is hoisted
import { MapView } from './MapView'

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('MapView', () => {
  const i18n = createI18n('en')

  beforeEach(() => vi.clearAllMocks())

  function renderMapView(props: Parameters<typeof MapView>[0]) {
    return render(
      <I18nextProvider i18n={i18n}>
        <MapView {...props} />
      </I18nextProvider>,
    )
  }

  it('renders markers for each spot and fires events correctly', async () => {
    const selSpy = vi.fn()
    const clickSpy = vi.fn()

    renderMapView({
      spots: [s1, s2],
      activeSpotId: null,
      onSelectSpot: selSpy,
      onMapClick: clickSpy,
      mapStyle: 'light',
      theme: 'light',
    })

    // Wait for async dynamic import + map init effect to run
    await waitFor(() => {
      expect(MarkerMock).toHaveBeenCalledTimes(2)
    })

    // Verify both markers were added
    expect(MarkerMock).toHaveBeenCalledTimes(2)

    // Click first marker's element → onSelectSpot(s1.id)
    // The mock is a constructor, so calls[0][0] is the options passed to new Marker({element})
    const firstMarkerOpts = MarkerMock.mock.calls[0]?.[0] as { element: HTMLElement }
    const el = firstMarkerOpts.element
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(selSpy).toHaveBeenCalledWith(s1.id)

    // Fire map click → onMapClick({ lng, lat })
    // The mock is a constructor, instances are in mock.instances
    const mapInstance = MapMock.mock.instances[0] as unknown as MapInstance
    mapInstance.fire('click', { lngLat: { lng: 2.3, lat: 48.8 } })
    expect(clickSpy).toHaveBeenCalledWith({ lng: 2.3, lat: 48.8 })
  })

  it('shows token-notice and no map when token is missing', () => {
    vi.stubEnv('VITE_MAPBOX_TOKEN', '')
    const { container } = renderMapView({
      spots: [],
      activeSpotId: null,
      onSelectSpot: vi.fn(),
      mapStyle: 'light',
      theme: 'light',
    })
    // The token-notice should be present immediately (no map init)
    const notice = container.querySelector('[data-testid="token-notice"]')
    expect(notice).toBeTruthy()
    // Restore
    vi.stubEnv('VITE_MAPBOX_TOKEN', 'pk.test')
  })

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
})
