# Task 3: Test harness (Vitest + RTL + MSW + Mapbox mock)

Authoritative spec: `docs/superpowers/plans/2026-06-24-workout-spots-discover.md` lines 331–458 (Task 3). Follow it verbatim. Summary below.

**Files to create:** `vitest.config.ts`, `src/test/setup.ts`, `src/test/msw/server.ts`, `src/test/msw/handlers.ts`, `src/test/mapbox-mock.ts`, `src/test/sanity.test.ts`. Modify `package.json` (test scripts).

**Produces:** `npm test` (vitest run); MSW `server` for HTTP mocks; `mockMapboxGl()` that stubs `mapbox-gl`.

## Steps

1. **Install**
   ```bash
   npm i -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom msw
   ```

2. **`vitest.config.ts`**
   ```ts
   import { defineConfig } from 'vitest/config'
   import viteReact from '@vitejs/plugin-react'
   import tsconfigPaths from 'vite-tsconfig-paths'

   export default defineConfig({
     plugins: [tsconfigPaths(), viteReact()],
     test: {
       environment: 'jsdom',
       globals: true,
       setupFiles: ['./src/test/setup.ts'],
       css: false,
     },
   })
   ```

3. **MSW server + empty handlers**
   - `src/test/msw/handlers.ts`: `import type { RequestHandler } from 'msw'` then `export const handlers: RequestHandler[] = []`
   - `src/test/msw/server.ts`: `import { setupServer } from 'msw/node'`; `import { handlers } from './handlers'`; `export const server = setupServer(...handlers)`

4. **`src/test/setup.ts`**
   ```ts
   import '@testing-library/jest-dom/vitest'
   import { afterAll, afterEach, beforeAll } from 'vitest'
   import { server } from './msw/server'

   beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
   afterEach(() => server.resetHandlers())
   afterAll(() => server.close())
   ```

5. **`src/test/mapbox-mock.ts`** — `FakeMarker` (setLngLat/addTo/remove → this), `FakeMap` (on/fire event registry, setStyle/flyTo/zoomTo/getZoom→11.5/remove), and `mockMapboxGl()` that `vi.mock('mapbox-gl', …)` exporting `{ default: { Map: FakeMap, Marker: FakeMarker, accessToken: '' }, Map: FakeMap, Marker: FakeMarker }`. Copy verbatim from plan lines 394–433. No `any` — use `unknown` in handler signatures as the plan shows.

6. **Sanity test** `src/test/sanity.test.ts`: `test('harness runs', () => expect(1+1).toBe(2))`. Run `npx vitest run src/test/sanity.test.ts` → expect 1 passed.

7. **Add scripts + commit**
   ```json
   "test": "vitest run",
   "test:watch": "vitest"
   ```
   `git add -A && git commit -m "test: add vitest + RTL + MSW + mapbox mock harness"`

## Global Constraints
- TypeScript strict; zero `any`. `npm run lint` must still pass clean after this task (the new test files are linted too — `recommendedTypeChecked` applies; if test files need vitest globals types, vitest `globals:true` + adding `"vitest/globals"` to tsconfig `types` or importing from 'vitest' explicitly are both fine — prefer explicit imports to avoid config churn).
- Branch `feature/workout-spots-discover`. Mocks-first; never create a real `.env`.
- MSW v2 API (`http`, `HttpResponse`, `setupServer` from `msw/node`). If the installed MSW major differs from v2, consult context7 (resolve `msw`, query "node setupServer v2 handlers") and adapt.

## Controller notes
- If a Bash/MCP call returns "temporarily unavailable" (transient platform classifier outage), retry.
- Verify before reporting: `npm test` (all green incl. sanity) AND `npm run lint` clean AND `npm run typecheck` clean.
- Report contract: write `/home/sephi/workout-spots/.superpowers/sdd/task-3-report.md` with Status, commit SHA+message, ACTUAL output of `npm test` + `npm run lint` + `npm run typecheck`, and any deviations. Reply to me with the same. Real command output only — no unverified claims.
