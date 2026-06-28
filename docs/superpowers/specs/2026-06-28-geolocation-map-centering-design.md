# Location-aware map centering — Design

**Date:** 2026-06-28
**Status:** Approved, ready for implementation plan

## Problem

The discover map (`/spots`) always opens centered on Paris (`DEFAULT_CENTER = [2.35, 48.85]`),
regardless of where the user is. We want the map to open near the user and surface
nearby spots:

- **If geolocation permission is granted:** show the user's position on the map and
  center on them (the existing viewport-bounds logic then fetches nearby spots).
- **If denied or unavailable:** still center on the user's approximate region
  (their city/country) rather than Paris.

## Current behavior (context)

- `MapView.tsx` initializes the Mapbox map at a hardcoded `DEFAULT_CENTER` / `DEFAULT_ZOOM`
  (Paris, zoom 11.5).
- On map `load` and every `moveend`, the map emits its viewport bounds → debounced →
  `spotsInBoundsQueryOptions(bounds)`. **Spots are already "whatever is in the current
  viewport"** — there is no radius/"nearby" query.
- The SSR loader prefetches `WORLD_BOUNDS` (top-500 most-rated spots globally) so the
  first paint is not empty.
- The "Recenter" button (locate icon, bottom-right) currently flies back to Paris.
- There is **no geolocation code anywhere** yet.

## Core idea: a location priority ladder

Resolve "where is the user" newest-and-most-precise first:

1. **Precise GPS** — client `navigator.geolocation` (requires permission).
2. **Remembered cookie** — last precise GPS coords from a prior visit.
3. **IP geo** — Vercel `x-vercel-ip-latitude` / `x-vercel-ip-longitude` headers, read
   during SSR.
4. **Paris default** — final fallback (local dev / non-Vercel hosts).

The map's **initial** center comes from the best available of (2) → (3) → (4) at first
paint, so it is already near the user. This means the **denied path needs zero extra
work** — the map is already regional. Granted users additionally get a fly-to-precise
refinement and a "you are here" marker.

**"Nearby spots" falls out for free:** once the map is centered, the existing
`moveend` → `spotsInBoundsQueryOptions` flow fetches what's in the viewport. No new
radius query is introduced.

## Decisions (from brainstorming)

- **Fallback source:** IP geo via Vercel headers (no external API, no extra deps,
  works on first paint). Confirmed `getRequestHeader()` is exported from
  `@tanstack/react-start/server`.
- **Permission UX:** auto-ask on first load — fire the native geolocation prompt on
  mount.
- **Persistence:** remember the last precise location in a first-party cookie (mirrors
  the existing theme/lang prefs pattern), re-verified by a fresh GPS read on load.

## Components

### New: `src/features/geolocation/`

**`location.ts`** — isomorphic location resolution, mirroring `features/settings/prefs.ts`.
- `resolveCenter(cookieLoc, ipLat, ipLng)` — **pure** function returning
  `{ center: [lng, lat], zoom, source: 'cookie' | 'ip' | 'default' }`. Unit-testable in
  isolation. Priority: cookie → IP → Paris default.
- `getInitialMapCenter()` — `createIsomorphicFn()` with a client branch (reads `loc` from
  `document.cookie`) and a server branch (delegates to `location.server.ts`).
- `setLocationCookie(lng, lat)` — writes the `loc` cookie. Coords **rounded to 2 decimals**
  (~1.1 km) for privacy before storing; 30-day expiry; `path=/; samesite=lax`.
- A parser for the `loc` cookie value (`"lng,lat"`), tolerant of malformed values
  (returns null → falls through the ladder).

**`location.server.ts`** — server branch implementation.
- Read `getCookie('loc')` first (remembered precise location).
- Else read `getRequestHeader('x-vercel-ip-latitude')` / `'x-vercel-ip-longitude'`.
- Feed both into `resolveCenter(...)`.

**`useUserLocation.ts`** — client hook.
- On mount (first load), calls `navigator.geolocation.getCurrentPosition(...)` — this
  fires the native permission prompt (the auto-ask).
- On success: sets `userLocation` state `{ lng, lat }` and calls `setLocationCookie(...)`.
- On denied / error / timeout: no-op (the map stays at its SSR/initial center).
- Returns `{ userLocation, requestLocation }` where `requestLocation()` re-triggers a
  `getCurrentPosition` call (used by the locate button).
- Browser-only: all access happens inside `useEffect` / event handlers; SSR-safe.

### Changed: `src/features/spots/MapView.tsx`

- Replace the hardcoded `DEFAULT_CENTER` / `DEFAULT_ZOOM` used in the map constructor with
  `initialCenter` / `initialZoom` props.
- New `userLocation` prop → a distinct **"you are here"** marker (blue dot, Google-Maps-like),
  rendered via its own ref + effect, isolated from the spot-pin layer (same isolation
  pattern as the existing `newSpotMarker`).
- **Auto-fly to precise location once** when `userLocation` first arrives, guarded by a ref
  so it fires a single time — and **only if no spot is selected** (`!activeSpotId`), so
  deep-linking to `/spots/$spotId` is not yanked away.
- **Repurpose the locate button (`handleRecenter`):** fly to `userLocation` if known;
  otherwise call `requestLocation()` to (re-)prompt. The locate icon finally does what it
  implies.

### Changed: `src/routes/spots/route.tsx`

- Compute `initialCenter` via `getInitialMapCenter()` (isomorphic, same call style as the
  existing `getPrefs()` in this file).
- Wire `useUserLocation()`; pass `userLocation`, `initialCenter`, and `initialZoom` to
  `MapView`, plus `requestLocation` for the locate button.
- The SSR loader keeps prefetching `WORLD_BOUNDS` unchanged — first list stays non-empty;
  the map re-emits regional bounds on `load`.

## Data flow

```
SSR: getInitialMapCenter() → cookie? → Vercel IP header? → Paris
      ↓ (passed as initialCenter / initialZoom)
Client mount: map inits at initialCenter
              useUserLocation() → native prompt
                ├─ granted → setLocationCookie + fly to precise + show "you are here" marker
                └─ denied  → nothing (already regional via IP)
Map 'load' / 'moveend' → bounds → spotsInBoundsQueryOptions (unchanged)
```

## Error handling

- Denied / timeout / unavailable → silently keep the SSR center. No error UI in v1
  (non-critical degradation).
- No Vercel headers (local dev / non-Vercel) → Paris default. **Local dev and existing
  tests behave exactly as today.**
- All browser APIs (`navigator.geolocation`, `document.cookie`) are guarded behind the
  client branch / `useEffect` — SSR-safe.

## Testing

Vitest + jsdom + MSW (existing setup); Mapbox GL is mocked.

- **`resolveCenter`** (pure): cookie > IP > default priority; malformed cookie falls
  through. No mocking required.
- **`useUserLocation`**: mock `navigator.geolocation.getCurrentPosition` for success and
  denied → assert `userLocation` state is set and the `loc` cookie is written (success
  only).
- **`MapView`**: extend the existing mapbox mock — assert the "you are here" marker appears
  when `userLocation` is provided; assert the locate button flies to the user when known
  and calls `requestLocation()` when not.
- **Mocks-first preserved:** no Supabase or DB schema changes at all.

## Out of scope (YAGNI for v1)

- Radius-based "nearby" query (viewport bounds already covers it).
- City/country *text* resolution for a fallback query (we center by coords, not by filtering
  on `city`/`country` columns).
- Error toasts / in-app permission education UI.
- Prefetching a regional bbox on SSR instead of `WORLD_BOUNDS` (possible later
  optimization; the map re-emits bounds on load regardless).

## Style / minor decisions

- **User marker:** blue "you are here" dot, visually distinct from spot pins.
- **Fly-to zoom** when centering on precise GPS: ~13 (tighter than the current 11.5).
- **Cookie:** `loc` = `"lng,lat"` rounded to 2 decimals, 30-day expiry.
