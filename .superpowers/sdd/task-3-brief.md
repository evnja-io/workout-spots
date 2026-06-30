### Task 3: `useUserLocation` hook (auto-ask + persist)

**Files:**
- Create: `src/features/geolocation/useUserLocation.ts`
- Test: `src/features/geolocation/useUserLocation.test.tsx`

**Interfaces:**
- Consumes: `setLocationCookie`, `LngLat` from Task 1.
- Produces:
  - `type UserLocationState = { userLocation: LngLat | null; requestLocation: () => void }`
  - `useUserLocation(): UserLocationState`

- [ ] **Step 1: Write the failing test**

Create `src/features/geolocation/useUserLocation.test.tsx`:

```ts
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { useUserLocation } from './useUserLocation'

type SuccessCb = (pos: { coords: { longitude: number; latitude: number } }) => void
type ErrorCb = (err: unknown) => void

function stubGeolocation(impl: (success: SuccessCb, error: ErrorCb) => void) {
  const getCurrentPosition = vi.fn(impl)
  vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })
  return getCurrentPosition
}

describe('useUserLocation', () => {
  beforeEach(() => {
    document.cookie = 'loc=; path=/; max-age=0'
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('auto-asks on mount, stores the position and writes the cookie on success', async () => {
    const getCurrentPosition = stubGeolocation((success) => {
      success({ coords: { longitude: 2.352, latitude: 48.857 } })
    })

    const { result } = renderHook(() => useUserLocation())

    expect(getCurrentPosition).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(result.current.userLocation).toEqual([2.352, 48.857])
    })
    expect(document.cookie).toContain('loc=2.35,48.86')
  })

  it('stays null and writes no cookie when permission is denied', async () => {
    stubGeolocation((_success, error) => {
      error({ code: 1, message: 'denied' })
    })

    const { result } = renderHook(() => useUserLocation())

    await waitFor(() => {
      expect(result.current.userLocation).toBeNull()
    })
    expect(document.cookie).not.toContain('loc=2.')
  })

  it('requestLocation re-triggers a position request', async () => {
    const getCurrentPosition = stubGeolocation((success) => {
      success({ coords: { longitude: 1, latitude: 2 } })
    })

    const { result } = renderHook(() => useUserLocation())
    expect(getCurrentPosition).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.requestLocation()
    })
    expect(getCurrentPosition).toHaveBeenCalledTimes(2)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/geolocation/useUserLocation.test.tsx`
Expected: FAIL — cannot resolve `./useUserLocation`.

- [ ] **Step 3: Write minimal implementation**

Create `src/features/geolocation/useUserLocation.ts`:

```ts
import { useCallback, useEffect, useState } from 'react'
import { setLocationCookie, type LngLat } from './location'

export type UserLocationState = {
  userLocation: LngLat | null
  requestLocation: () => void
}

/**
 * Asks the browser for the user's location on mount (the native permission
 * prompt). On success: stores the position and persists it to the `loc` cookie.
 * On denial/error/timeout: no-op — the map keeps its loader-resolved center.
 */
export function useUserLocation(): UserLocationState {
  const [userLocation, setUserLocation] = useState<LngLat | null>(null)

  const requestLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next: LngLat = [pos.coords.longitude, pos.coords.latitude]
        setUserLocation(next)
        setLocationCookie(next[0], next[1])
      },
      () => {
        // denied / unavailable / timeout — keep the existing center.
      },
    )
  }, [])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  return { userLocation, requestLocation }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/geolocation/useUserLocation.test.tsx`
Expected: PASS (3 cases).

- [ ] **Step 5: Commit**

```bash
git add src/features/geolocation/useUserLocation.ts src/features/geolocation/useUserLocation.test.tsx
git commit -m "feat(geolocation): useUserLocation hook (auto-ask + cookie persist)"
```

---

