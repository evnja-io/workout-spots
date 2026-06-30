# Task 3 Report: `useUserLocation` Hook (auto-ask + persist)

## Status
**DONE** ✓

## Commit Hash
```
53b179d feat(geolocation): useUserLocation hook (auto-ask + cookie persist)
```

## Test Execution

### Command
```bash
./node_modules/.bin/vitest run src/features/geolocation/useUserLocation.test.tsx
```

### Output
```
The plugin "vite-tsconfig-paths" is detected. Vite now supports tsconfig paths resolution natively via the resolve.tsconfigPaths option. You can remove the plugin and set resolve.tsconfigPaths: true in your Vite config instead.

 RUN  v4.1.9 /home/sephi/workout-spots


 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  07:10:24
   Duration  379ms (transform 40ms, setup 57ms, import 137ms, tests 17ms, environment 102ms)
```

### Summary
- ✅ Test Files: 1 passed
- ✅ Tests: 3 passed (all three test cases pass)
  1. `auto-asks on mount, stores the position and writes the cookie on success`
  2. `stays null and writes no cookie when permission is denied`
  3. `requestLocation re-triggers a position request`

## Files Created
1. **`src/features/geolocation/useUserLocation.ts`** — React hook implementation (32 lines)
   - Exports: `UserLocationState` type + `useUserLocation()` hook
   - Auto-requests browser geolocation on mount via `useEffect`
   - Stores location in state and persists to cookie via `setLocationCookie`
   - Gracefully handles permission denial/error without throwing
   - Provides `requestLocation()` callback for manual re-request

2. **`src/features/geolocation/useUserLocation.test.tsx`** — Vitest suite (66 lines)
   - 3 test cases covering success, denial, and manual request
   - Stubs `navigator.geolocation.getCurrentPosition` with `vi.stubGlobal`
   - Verifies `setLocationCookie` rounds coordinates (2.352 → 2.35, 48.857 → 48.86)
   - Uses `renderHook`, `waitFor`, `act` from Testing Library

## Deviations
None. Implementation follows the brief exactly:
- Used exact code blocks verbatim (test + implementation)
- All imports match brief specifications (`setLocationCookie`, `LngLat` from `./location`)
- No additional functionality beyond brief scope
- TS strict + zero `any` enforced throughout

## Verification

### TypeScript Check
```bash
npm run typecheck  # ✓ No errors
```

### Branch
```bash
git branch  # ✓ on feat/geolocation-map-centering
```

### Implementation Review
- ✅ `useUserLocation()` returns `UserLocationState` with correct shape
- ✅ Auto-requests location on mount via `useEffect([requestLocation])`
- ✅ `requestLocation()` callback stable via `useCallback([])`
- ✅ Success: stores `[lng, lat]` in state + calls `setLocationCookie(lng, lat)`
- ✅ Error: silently no-ops, keeping map center at loader-resolved default
- ✅ Graceful fallback for SSR: checks `typeof navigator !== 'undefined'` before API call
- ✅ No `any` types; full TypeScript strict compliance

## TDD Process Followed
✅ Step 1: Write failing test
✅ Step 2: Run test → confirmed FAIL (module not found)
✅ Step 3: Implement hook
✅ Step 4: Run test → confirmed PASS (3/3)
✅ Step 5: Commit with brief's exact message
