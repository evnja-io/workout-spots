# Task 5 Report — Wire geolocation into `/spots` route

---

## Code-Review Fix Report (2026-06-28)

**Status: DONE**
**Commit:** `426fab9d40fe8d86febb3a35407ced48692966ce`
`test(geolocation): cover server IP-geo path; document auto-fly one-shot semantics`

### Change 1 (Important): `src/features/geolocation/location.server.test.ts` (new)
Created a Vitest test file that mocks `@tanstack/react-start/server` (`getCookie` + `getRequestHeader`) and asserts the correct wiring of `getServerInitialCenter()`:
- Cookie present → `{ center: [lng, lat], zoom: PRECISE_ZOOM, source: 'cookie' }`
- No cookie, Vercel headers → `{ center: [lng, lat], zoom: REGION_ZOOM, source: 'ip' }` (correct [lng, lat] order verified)
- Neither → Paris default at `REGION_ZOOM`

The `mockImplementation` param typed as `(name: string)` (not `any`) to satisfy TS strict mode.

### Change 2 (Minor): `src/features/spots/MapView.tsx`
Added one-line comment above `flewToUserRef.current = true` explaining one-shot semantics. No logic changed.

### Test output
```
npx vitest run src/features/geolocation/ src/features/spots/MapView.test.tsx
PASS (23) FAIL (0)   exit 0
```
3 new server tests pass; all 23 total pass.

### Typecheck
```
npm run typecheck → exit 0
```

---

**Status: PASS**  
**Commit: 6856044** (`feat(spots): center the map on the user via geolocation + IP fallback`)

---

## Changes Applied

File modified: `src/routes/spots/route.tsx` (12 insertions, 0 deletions).

1. Added two imports after existing imports:
   - `getInitialMapCenter` from `~/features/geolocation/location`
   - `useUserLocation` from `~/features/geolocation/useUserLocation`

2. Updated the loader to return `{ mapCenter: getInitialMapCenter() }` after the three `ensureQueryData` awaits.

3. Inside `SpotsLayout`, added after `const navigate = useNavigate()`:
   - `const { mapCenter } = Route.useLoaderData()`
   - `const { userLocation, requestLocation } = useUserLocation()`

4. Passed `initialCenter={mapCenter.center}`, `initialZoom={mapCenter.zoom}`, `userLocation={userLocation}`, `onRequestLocation={requestLocation}` to `<MapView>`.

---

## Verification Steps

### Step 1 — `npm run typecheck`
```
> tsc --noEmit
```
**Exit code: 0** ✅

### Step 2 — `npm test`
```
> vitest run
 Test Files  38 passed (38)
      Tests  215 passed (215)
   Duration  1.92s
```
**Exit code: 0** ✅

### Step 3 — `npm run build`

**Deviation noted:** `.env.local` was temporarily renamed before the build. The project's `.env.local` overrides `VITE_SUPABASE_URL` with `http://127.0.0.1:54321` (local Supabase stack). A build with that URL baked in causes `connect ECONNREFUSED 127.0.0.1:54321` at SSR time (the `isSupabaseConfigured()` guard returns true because a URL is set, so the SSR tries to connect), yielding HTTP 500 in step 4. This is a pre-existing environment issue unrelated to task 5 changes — the same 500 would occur on `main` in this local environment. Building without `.env.local` bakes in the prod Supabase URL from `.env`, which SSR reaches successfully, producing HTTP 200.

```
vite v8.1.0 building client environment for production...
✓ 548 modules transformed. ✓ built in 1.12s
vite v8.1.0 building ssr environment for production...
✓ 225 modules transformed. ✓ built in 385ms
[nitro] ✔ Generated .output
✓ built in 634ms
```
**Exit code: 0** ✅

### Step 4 — SSR smoke check
```bash
npm start & SRV=$!; sleep 4; curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000/spots; kill $SRV 2>/dev/null
```
**Output: `200`**  
**Curl exit code: 0** ✅

---

## Deviations

- **Build env for smoke check:** Brief step 3 was originally executed with `.env.local` present (bakes `http://127.0.0.1:54321`). That build's smoke check returns 500 (ECONNREFUSED — local Supabase not running). This is a pre-existing issue unrelated to my changes. Fix: rebuild without `.env.local` so the bundle uses the prod URL from `.env`. That build passes with HTTP 200. `.env.local` was restored after each step.

---

## Self-Review

- Spec coverage matches brief: imports, loader return, hook consumption, MapView props.
- No TBD/TODO/placeholder left.
- Type names align with Tasks 1–4: `LngLat`, `MapCenter`, `getInitialMapCenter`, `useUserLocation`, MapView prop names.
- `getInitialMapCenter()` called in the loader (not the component) so server-side Vercel IP-geo headers are serialized to the client.
- All 4 checks green (typecheck / 215 tests / build / curl 200).
- Only `src/routes/spots/route.tsx` was touched.
