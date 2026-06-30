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
