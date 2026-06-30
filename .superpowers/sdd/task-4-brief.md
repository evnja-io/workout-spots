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

