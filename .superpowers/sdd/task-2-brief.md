### Task 2: Isomorphic initial-center resolver (server reads IP headers)

**Files:**
- Create: `src/features/geolocation/location.server.ts`
- Modify: `src/features/geolocation/location.ts` (append the isomorphic `getInitialMapCenter`)
- Test: `src/features/geolocation/location.test.ts` (append a client-branch case)

**Interfaces:**
- Consumes: `parseLocCookie`, `parseCoord`, `resolveCenter`, `LOC_COOKIE`, `MapCenter` from Task 1.
- Produces:
  - `getServerInitialCenter(): MapCenter` (from `location.server.ts`)
  - `getInitialMapCenter(): MapCenter` (isomorphic, from `location.ts`) — called in the route loader.

- [ ] **Step 1: Write the failing test**

Append to `src/features/geolocation/location.test.ts`:

```ts
import { getInitialMapCenter } from './location'

describe('getInitialMapCenter (client branch)', () => {
  beforeEach(() => {
    document.cookie = 'loc=; path=/; max-age=0'
  })
  it('uses the loc cookie when present', () => {
    document.cookie = 'loc=2.35,48.85; path=/'
    expect(getInitialMapCenter()).toEqual({
      center: [2.35, 48.85],
      zoom: PRECISE_ZOOM,
      source: 'cookie',
    })
  })
  it('falls back to Paris default when no cookie (client has no IP headers)', () => {
    expect(getInitialMapCenter().source).toBe('default')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/geolocation/location.test.ts -t "getInitialMapCenter"`
Expected: FAIL — `getInitialMapCenter` is not exported.

- [ ] **Step 3: Write minimal implementation**

Create `src/features/geolocation/location.server.ts`:

```ts
import { getCookie, getRequestHeader } from '@tanstack/react-start/server'
import { LOC_COOKIE, parseCoord, parseLocCookie, resolveCenter, type MapCenter } from './location'

/** Server branch: remembered cookie first, then Vercel IP-geo headers. */
export function getServerInitialCenter(): MapCenter {
  const cookieLoc = parseLocCookie(getCookie(LOC_COOKIE))
  const ipLat = parseCoord(getRequestHeader('x-vercel-ip-latitude'))
  const ipLng = parseCoord(getRequestHeader('x-vercel-ip-longitude'))
  return resolveCenter(cookieLoc, ipLat, ipLng)
}
```

Append to `src/features/geolocation/location.ts` (top: add the import; bottom: add the export):

```ts
// at the top of the file, with the other imports (add this line):
import { createIsomorphicFn } from '@tanstack/react-start'
import { getServerInitialCenter } from './location.server'
```

```ts
// at the bottom of the file:
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
```

(`@tanstack/react-start` `getRequestHeader`/`getCookie` are confirmed exports of `@tanstack/react-start/server`; `createIsomorphicFn` strips the `.server()` branch from the client bundle — same mechanism as `prefs.ts`.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/geolocation/location.test.ts`
Expected: PASS (Task 1 cases + the two client-branch cases).

- [ ] **Step 5: Commit**

```bash
git add src/features/geolocation/location.ts src/features/geolocation/location.server.ts src/features/geolocation/location.test.ts
git commit -m "feat(geolocation): isomorphic initial-center resolver with Vercel IP fallback"
```

---

