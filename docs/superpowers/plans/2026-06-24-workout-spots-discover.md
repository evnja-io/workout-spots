# Workout Spots — Discover (v1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the production "Discover" web app for Workout Spots — a map-first, filterable directory of outdoor workout spots with detail pages, combined reviews, saving, and community-contributed spots — backed by the existing Supabase schema.

**Architecture:** TanStack Start (SSR) + React 19 + TypeScript. Route loaders hydrate TanStack Query; public reads use an isomorphic Supabase anon client, viewer-scoped/authed reads and all secrets go through `createServerFn`. Filter/search/sort state lives in Zod-validated URL search params. Mapbox GL renders the map and powers geocoding. react-i18next provides EN/FR. Vitest + RTL + MSW test everything with Supabase and Mapbox mocked.

**Tech Stack:** TanStack Start, TanStack Router, TanStack Query v5, TanStack Form, TanStack Virtual, Zod, Supabase JS v2, Mapbox GL JS v3, react-i18next, Vitest, React Testing Library, MSW.

## Global Constraints

- **TypeScript strict; zero `any`.** ESLint rule `@typescript-eslint/no-explicit-any: error` must pass. Prefer `unknown` + narrowing.
- **React 19**, **TanStack Start** latest stable, **TanStack Query v5**, **TanStack Router** (file-based), **Vite 7+**, **Vitest 3+**.
- **Styling: Tailwind CSS v4** (CSS-first config via `@tailwindcss/vite` + `@import "tailwindcss"` + `@theme`). Build component markup with Tailwind utility classes. Design tokens (accent palette, surfaces, radii, shadows) are defined in `@theme inline` mapped to runtime CSS variables (`--accent`, `--surface`, …) so the existing light/dark `data-theme` switch and the four runtime accent palettes keep working. Only genuinely bespoke styles that don't map to utilities (keyframe animations, custom scrollbars, Mapbox pin/marker styling, image-gradient placeholders) live in a small `@layer` block in `global.css`. No other CSS frameworks.
- **No secrets in client bundles.** Anything beyond the Supabase URL + anon key and the public Mapbox token must run in a `createServerFn` handler.
- **Loaders run on server AND client** — never read `process.env` server-secrets directly in a loader; wrap in `createServerFn`.
- **Every task is TDD:** failing test → run (fail) → minimal impl → run (pass) → commit.
- **i18n:** no hardcoded user-facing English in components — all strings via `t()` with keys present in both `en` and `fr`.
- **Branch:** `feature/workout-spots-discover` (already created). Commit per task.
- **Spec:** `docs/superpowers/specs/2026-06-24-workout-spots-discover-design.md` is authoritative for scope.
- **Env vars:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_MAPBOX_TOKEN`. Provided by the user before any task requiring live calls; all tests mock these so tasks are not blocked.

---

## File Structure

```
package.json, tsconfig.json, vite.config.ts, vitest.config.ts,
.eslintrc.cjs, .prettierrc, .env.example
src/
  router.tsx                      # router factory (Query context)
  routes/
    __root.tsx                    # shell: providers + Rail + <Outlet/>
    index.tsx                     # redirect → /spots
    spots/route.tsx               # Discover layout + search-param validation
    spots/index.tsx               # list/map (loader → spots query)
    spots/$spotId.tsx             # detail panel (loader → spot query)
    saved.tsx                     # liked spots (auth-gated)
    auth.callback.tsx             # magic-link return
  lib/
    supabase/types.ts             # generated DB types (committed)
    supabase/browser.ts           # browser client
    supabase/server.ts            # server client factory (cookies)
    mapbox/geocoding.ts           # geocoding client (typed)
    mapbox/map.ts                 # map style + helpers
    i18n/config.ts                # react-i18next init
    i18n/en.json, i18n/fr.json
  features/
    spots/
      domain.ts                   # app-facing types (SpotListItem, SpotDetail, …)
      filters.ts                  # search-param schema + filter/sort logic
      queries.ts                  # queryOptions + server fns for reads
      Sidebar.tsx, SpotCard.tsx, Filters.tsx
      MapView.tsx, MapStyleSwitch.tsx
      Detail.tsx
    add-spot/
      schema.ts, AddSpotWizard.tsx, steps/*.tsx
    reviews/
      schema.ts, ReviewForm.tsx, ReviewList.tsx, mutations.ts
    likes/
      mutations.ts, useSaveSpot.ts
    auth/
      session.tsx                 # session context + useSession
      SignInModal.tsx, useAuthGate.ts
    taxonomy/
      queries.ts                  # equipments + disciplines + locale resolution
  components/ui/
    Icon.tsx, Button.tsx, Chip.tsx, Switch.tsx, Stars.tsx, Modal.tsx
  styles/global.css               # ported from prototype styles.css
  test/
    setup.ts, msw/handlers.ts, msw/server.ts, fixtures.ts, mapbox-mock.ts
```

---

## Task 1: Project scaffold (TanStack Start + TS strict + Vite)

**Files:**

- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `.env.example`, `src/router.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/spots/route.tsx`, `src/routes/spots/index.tsx`
- Create: `index.html`

**Interfaces:**

- Produces: a running TanStack Start dev server; `createRouter()` factory in `src/router.tsx`; route tree with `/` → redirect `/spots` and a placeholder `/spots`.

- [ ] **Step 1: Initialize package + install**

Run:

```bash
npm init -y
npm i react@^19 react-dom@^19 @tanstack/react-start @tanstack/react-router @tanstack/react-query
npm i tailwindcss @tailwindcss/vite
npm i -D typescript @types/react @types/react-dom vite @vitejs/plugin-react vite-tsconfig-paths
```

If any TanStack Start or Tailwind v4 install detail differs from current docs, consult context7 (`/websites/tanstack_start_framework_react`, query "build from scratch vite config"; and resolve `Tailwind CSS` → query "v4 @tailwindcss/vite plugin setup and @theme") and follow it. Keep the produced config shape below.

- [ ] **Step 2: Write `tsconfig.json` (strict)**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": { "~/*": ["./src/*"] },
    "noEmit": true,
    "types": ["vite/client"]
  },
  "include": ["src", "*.ts", "*.tsx"]
}
```

- [ ] **Step 3: Write `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: { port: 3000 },
  plugins: [tsconfigPaths(), tailwindcss(), tanstackStart(), viteReact()],
})
```

Create `src/styles/global.css` with the Tailwind entrypoint (theme tokens are added in Task 4):

```css
@import 'tailwindcss';
```

Import it in `__root.tsx`: `import '~/styles/global.css'`. Add `@tailwindcss/vite` and the css plugin to `vitest.config.ts` is unnecessary (Task 3 sets `css: false`).

- [ ] **Step 4: Write router + root + routes**

`src/router.tsx`:

```tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000 } },
  })
  return createTanStackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    scrollRestoration: true,
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
```

`src/routes/__root.tsx`:

```tsx
import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({ meta: [{ title: 'Workout Spots' }] }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
```

`src/routes/index.tsx`:

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/spots' })
  },
})
```

`src/routes/spots/route.tsx`:

```tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/spots')({ component: () => <Outlet /> })
```

`src/routes/spots/index.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/spots/')({
  component: () => <main>Discover</main>,
})
```

`.env.example`:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_MAPBOX_TOKEN=
```

- [ ] **Step 5: Add scripts to `package.json`**

```json
"scripts": {
  "dev": "vite dev",
  "build": "vite build",
  "start": "node .output/server/index.mjs",
  "typecheck": "tsc --noEmit"
}
```

- [ ] **Step 6: Verify dev server boots**

Run: `npm run dev` then in another shell `curl -s localhost:3000/spots | grep -i discover`
Expected: response contains "Discover"; stop the server.

- [ ] **Step 7: Commit**

```bash
echo "node_modules\n.output\n.vinxi\ndist\n.env\nsrc/routeTree.gen.ts" > .gitignore
git add -A && git commit -m "chore: scaffold TanStack Start app with strict TypeScript"
```

---

## Task 2: Lint, format, and `no-any` enforcement

**Files:**

- Create: `eslint.config.js`, `.prettierrc`
- Modify: `package.json` (scripts)

**Interfaces:**

- Produces: `npm run lint` failing on any `any`; `npm run format`.

- [ ] **Step 1: Install**

```bash
npm i -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks prettier
```

- [ ] **Step 2: Write `eslint.config.js`**

```js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  { ignores: ['.output', 'dist', 'src/routeTree.gen.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: { parserOptions: { projectService: true } },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
)
```

- [ ] **Step 3: Write `.prettierrc`**

```json
{ "semi": false, "singleQuote": true, "trailingComma": "all", "printWidth": 100 }
```

- [ ] **Step 4: Add scripts**

```json
"lint": "eslint .",
"format": "prettier --write ."
```

- [ ] **Step 5: Prove the rule fires**

Temporarily add `const x: any = 1` to `src/router.tsx`, run `npm run lint`.
Expected: error `Unexpected any`. Remove the line; `npm run lint` passes.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: add eslint (no-any) and prettier"
```

---

## Task 3: Test harness (Vitest + RTL + MSW + Mapbox mock)

**Files:**

- Create: `vitest.config.ts`, `src/test/setup.ts`, `src/test/msw/server.ts`, `src/test/msw/handlers.ts`, `src/test/mapbox-mock.ts`, `src/test/sanity.test.ts`

**Interfaces:**

- Produces: `npm test`; MSW `server` for HTTP mocks; `mapbox-mock` that stubs `mapbox-gl`.

- [ ] **Step 1: Install**

```bash
npm i -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom msw
```

- [ ] **Step 2: Write `vitest.config.ts`**

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

- [ ] **Step 3: Write MSW server + empty handlers**

`src/test/msw/handlers.ts`:

```ts
import type { RequestHandler } from 'msw'
export const handlers: RequestHandler[] = []
```

`src/test/msw/server.ts`:

```ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'
export const server = setupServer(...handlers)
```

- [ ] **Step 4: Write `src/test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './msw/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

- [ ] **Step 5: Write `src/test/mapbox-mock.ts`**

```ts
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
```

- [ ] **Step 6: Sanity test**

`src/test/sanity.test.ts`:

```ts
import { expect, test } from 'vitest'
test('harness runs', () => {
  expect(1 + 1).toBe(2)
})
```

Run: `npx vitest run src/test/sanity.test.ts`
Expected: 1 passed.

- [ ] **Step 7: Add script + commit**

```json
"test": "vitest run",
"test:watch": "vitest"
```

```bash
git add -A && git commit -m "test: add vitest + RTL + MSW + mapbox mock harness"
```

---

## Task 4: Global styles + theme

**Files:**

- Create: `src/styles/global.css` (port of prototype `styles.css`), `src/features/theme/theme.ts`, `src/features/theme/theme.test.ts`
- Modify: `src/routes/__root.tsx` (import css; set `data-theme`)

**Interfaces:**

- Produces: `applyTheme(theme: Theme)`, `applyAccent(accent: AccentKey, theme: Theme)`, `ACCENTS`, types `Theme = 'light' | 'dark'`, `AccentKey = 'violet' | 'slate' | 'emerald' | 'rose'`.

- [ ] **Step 1: Failing test**

`src/features/theme/theme.test.ts`:

```ts
import { describe, expect, it, beforeEach } from 'vitest'
import { ACCENTS, applyAccent, applyTheme } from './theme'

describe('theme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('style')
  })
  it('sets data-theme', () => {
    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
  it('sets accent css vars', () => {
    applyAccent('violet', 'dark')
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe(
      ACCENTS.violet.dark.accent,
    )
  })
})
```

- [ ] **Step 2: Run → fail**

Run: `npx vitest run src/features/theme/theme.test.ts` — Expected: FAIL (module not found).

- [ ] **Step 3: Implement `src/features/theme/theme.ts`**

```ts
export type Theme = 'light' | 'dark'
export type AccentKey = 'violet' | 'slate' | 'emerald' | 'rose'
type Palette = { accent: string; accent2: string; soft: string; softer: string; fg: string }

export const ACCENTS: Record<AccentKey, Record<Theme, Palette>> = {
  violet: {
    light: {
      accent: '#4C1D95',
      accent2: '#6D28D9',
      soft: '#EDE9FE',
      softer: '#F5F3FF',
      fg: '#FFFFFF',
    },
    dark: {
      accent: '#A78BFA',
      accent2: '#8B5CF6',
      soft: '#2A1F4A',
      softer: '#1B1633',
      fg: '#0B0D10',
    },
  },
  slate: {
    light: {
      accent: '#1E293B',
      accent2: '#334155',
      soft: '#E2E8F0',
      softer: '#F1F5F9',
      fg: '#FFFFFF',
    },
    dark: {
      accent: '#E2E8F0',
      accent2: '#CBD5E1',
      soft: '#1E293B',
      softer: '#0F172A',
      fg: '#0B0D10',
    },
  },
  emerald: {
    light: {
      accent: '#065F46',
      accent2: '#047857',
      soft: '#D1FAE5',
      softer: '#ECFDF5',
      fg: '#FFFFFF',
    },
    dark: {
      accent: '#34D399',
      accent2: '#10B981',
      soft: '#0F2E22',
      softer: '#09201A',
      fg: '#0B0D10',
    },
  },
  rose: {
    light: {
      accent: '#9F1239',
      accent2: '#BE123C',
      soft: '#FFE4E6',
      softer: '#FFF1F2',
      fg: '#FFFFFF',
    },
    dark: {
      accent: '#FB7185',
      accent2: '#F43F5E',
      soft: '#3B1522',
      softer: '#260E18',
      fg: '#0B0D10',
    },
  },
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}
export function applyAccent(key: AccentKey, theme: Theme): void {
  const a = ACCENTS[key][theme]
  const r = document.documentElement.style
  r.setProperty('--accent', a.accent)
  r.setProperty('--accent-2', a.accent2)
  r.setProperty('--accent-soft', a.soft)
  r.setProperty('--accent-softer', a.softer)
  r.setProperty('--accent-fg', a.fg)
}
```

- [ ] **Step 4: Define Tailwind theme tokens + base layer**

Extend `src/styles/global.css` (created in Task 1) so the design tokens are Tailwind-addressable while staying runtime-swappable. `applyTheme`/`applyAccent` set `--accent`, `--accent-2`, `--accent-soft`, `--accent-softer`, `--accent-fg` at runtime; the base `:root` / `[data-theme="dark"]` blocks define the surface/text/border/shadow/radius variables (ported verbatim from the prototype `styles.css` `:root` and `[data-theme="dark"]`). Map them into Tailwind via `@theme inline` so utilities like `bg-accent`, `text-accent-fg`, `bg-surface`, `border-border`, `rounded-md` resolve to the live variables:

```css
@import 'tailwindcss';

:root {
  --bg: #f9fafb;
  --surface: #ffffff;
  --surface-2: #f3f4f6;
  --border: #e5e7eb;
  --border-strong: #d1d5db;
  --text: #030712;
  --text-2: #374151;
  --text-3: #6b7280;
  --text-4: #9ca3af;
  --accent: #4c1d95;
  --accent-2: #6d28d9;
  --accent-soft: #ede9fe;
  --accent-softer: #f5f3ff;
  --accent-fg: #ffffff;
  --radius: 12px;
  --radius-sm: 8px;
  --radius-lg: 18px;
  /* shadow-sm/md/lg ported verbatim from prototype */
}
[data-theme='dark'] {
  --bg: #0b0d10;
  --surface: #14171c;
  --surface-2: #1b1f26;
  --border: #262b33;
  --border-strong: #323842;
  --text: #f3f4f6;
  --text-2: #d1d5db;
  --text-3: #9ca3af;
  --text-4: #6b7280;
}

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-text: var(--text);
  --color-text-2: var(--text-2);
  --color-text-3: var(--text-3);
  --color-text-4: var(--text-4);
  --color-accent: var(--accent);
  --color-accent-2: var(--accent-2);
  --color-accent-soft: var(--accent-soft);
  --color-accent-softer: var(--accent-softer);
  --color-accent-fg: var(--accent-fg);
  --radius-md: var(--radius);
  --radius-sm: var(--radius-sm);
  --radius-lg: var(--radius-lg);
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
}

@layer base {
  html,
  body,
  #root {
    height: 100%;
  }
  body {
    margin: 0;
    font-family: var(--font-sans);
    color: var(--text);
    background: var(--bg);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
}

/* Bespoke, non-utility styles ported from the prototype live here in @layer:
   keyframes (slideIn/fadeIn), custom scrollbars, Mapbox .wp-pin/.dot marker styling,
   the image-gradient placeholder helper, and the detail hero swatch gradient. */
```

Subsequent component tasks build markup with Tailwind utilities referencing these tokens (e.g. `className="bg-accent text-accent-fg rounded-md"`); only the listed bespoke pieces use ported class rules. Confirm the `@theme inline` syntax against current Tailwind v4 docs via context7 if the build errors; keep the token names above.

- [ ] **Step 5: Run → pass**

Run: `npx vitest run src/features/theme/theme.test.ts` — Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: port global styles and theme/accent helpers"
```

---

## Task 5: Supabase types + client factories

**Files:**

- Create: `src/lib/supabase/types.ts`, `src/lib/supabase/browser.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/browser.test.ts`

**Interfaces:**

- Consumes: env vars.
- Produces: `getBrowserSupabase(): SupabaseClient<Database>`; `getServerSupabase(): SupabaseClient<Database>` (reads request cookies via server fn context); `Database` type.

- [ ] **Step 1: Install**

```bash
npm i @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 2: Generate types (or stub until access)**

If Supabase CLI access is available:

```bash
npx supabase gen types typescript --project-id <PROJECT_ID> > src/lib/supabase/types.ts
```

If keys are not yet provided, create `src/lib/supabase/types.ts` with the minimal hand-written `Database` interface covering tables used in this plan (`locations`, `location_images`, `location_comments`, `location_ratings`, `location_likes`, `equipments`, `location_equipments`, `disciplines`, `location_disciplines`, `users`), matching `db.sql` columns/types. Replace with generated types once access lands. This file is committed.

- [ ] **Step 3: Failing test**

`src/lib/supabase/browser.test.ts`:

```ts
import { afterEach, expect, test, vi } from 'vitest'
afterEach(() => vi.unstubAllEnvs())
test('browser client is a singleton', async () => {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://x.supabase.co')
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon')
  const { getBrowserSupabase } = await import('./browser')
  expect(getBrowserSupabase()).toBe(getBrowserSupabase())
})
```

- [ ] **Step 4: Run → fail**

Run: `npx vitest run src/lib/supabase/browser.test.ts` — Expected: FAIL.

- [ ] **Step 5: Implement clients**

`src/lib/supabase/browser.ts`:

```ts
import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

let client: SupabaseClient<Database> | undefined
export function getBrowserSupabase(): SupabaseClient<Database> {
  if (!client) {
    client = createBrowserClient<Database>(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
    )
  }
  return client
}
```

`src/lib/supabase/server.ts`:

```ts
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getRequestHeaders, setResponseHeaders } from '@tanstack/react-start/server'
import { parseCookies, serializeCookie } from '~/lib/supabase/cookies'
import type { Database } from './types'

export function getServerSupabase(): SupabaseClient<Database> {
  const cookieHeader = getRequestHeaders().get('cookie') ?? ''
  return createServerClient<Database>(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () =>
          Object.entries(parseCookies(cookieHeader)).map(([name, value]) => ({ name, value })),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) =>
            setResponseHeaders([['set-cookie', serializeCookie(name, value, options)]]),
          ),
      },
    },
  )
}
```

Also create `src/lib/supabase/cookies.ts` with small typed `parseCookies` / `serializeCookie` helpers (use the `cookie` package: `npm i cookie @types/cookie`). If the exact `@tanstack/react-start/server` header API differs, consult context7 (query "createServerFn request headers cookies") and adapt — keep the `getServerSupabase` signature unchanged.

- [ ] **Step 6: Run → pass; typecheck**

Run: `npx vitest run src/lib/supabase/browser.test.ts` then `npm run typecheck` — Expected: PASS / no errors.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add Supabase types and browser/server client factories"
```

---

## Task 6: i18n (EN + FR)

**Files:**

- Create: `src/lib/i18n/config.ts`, `src/lib/i18n/en.json`, `src/lib/i18n/fr.json`, `src/lib/i18n/i18n.test.tsx`
- Modify: `src/routes/__root.tsx` (wrap app in `I18nextProvider`)

**Interfaces:**

- Produces: `createI18n(locale: Locale)`; `Locale = 'en' | 'fr'`; translation keys used across the app (namespaced: `discover.*`, `detail.*`, `addSpot.*`, `review.*`, `auth.*`, `common.*`).

- [ ] **Step 1: Install**

```bash
npm i i18next react-i18next
```

- [ ] **Step 2: Failing test**

`src/lib/i18n/i18n.test.tsx`:

```tsx
import { expect, test } from 'vitest'
import { createI18n } from './config'

test('resolves english and french title', () => {
  expect(createI18n('en').t('discover.title')).toBe('Discover')
  expect(createI18n('fr').t('discover.title')).toBe('Découvrir')
})
```

- [ ] **Step 3: Run → fail.** `npx vitest run src/lib/i18n/i18n.test.tsx` → FAIL.

- [ ] **Step 4: Implement**

`src/lib/i18n/en.json` (seed with keys; expand as components are built):

```json
{
  "common": { "save": "Save", "cancel": "Cancel", "back": "Back", "continue": "Continue" },
  "discover": {
    "title": "Discover",
    "searchPlaceholder": "Search by name, city or address…",
    "spotsCount": "{{count}} spots",
    "results": "{{count}} results",
    "empty": "No spots match your filters.",
    "open24": "Open 24/7",
    "disciplines": "Disciplines",
    "equipment": "Equipment",
    "access": "Access",
    "sortRating": "Top rated",
    "sortPopular": "Most rated",
    "sortName": "A–Z",
    "addSpot": "Add a spot"
  }
}
```

`src/lib/i18n/fr.json`:

```json
{
  "common": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "back": "Retour",
    "continue": "Continuer"
  },
  "discover": {
    "title": "Découvrir",
    "searchPlaceholder": "Rechercher par nom, ville ou adresse…",
    "spotsCount": "{{count}} spots",
    "results": "{{count}} résultats",
    "empty": "Aucun spot ne correspond à vos filtres.",
    "open24": "Ouvert 24/7",
    "disciplines": "Disciplines",
    "equipment": "Équipement",
    "access": "Accès",
    "sortRating": "Mieux notés",
    "sortPopular": "Plus notés",
    "sortName": "A–Z",
    "addSpot": "Ajouter un spot"
  }
}
```

`src/lib/i18n/config.ts`:

```ts
import i18next, { type i18n } from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import fr from './fr.json'

export type Locale = 'en' | 'fr'
export const LOCALES: Locale[] = ['en', 'fr']

export function createI18n(locale: Locale): i18n {
  const instance = i18next.createInstance()
  void instance.use(initReactI18next).init({
    lng: locale,
    fallbackLng: 'en',
    resources: { en: { translation: en }, fr: { translation: fr } },
    interpolation: { escapeValue: false },
  })
  return instance
}
```

- [ ] **Step 5: Run → pass.** `npx vitest run src/lib/i18n/i18n.test.tsx` → PASS.

- [ ] **Step 6: Wire provider in `__root.tsx`**

Read locale from a cookie `lang` (default `en`), create the instance once per render tree, wrap `<Outlet/>` in `<I18nextProvider i18n={...}>`. Add a `getLocale()` helper that reads `document.cookie` on client and the request cookie on server.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add react-i18next with EN/FR resources"
```

---

## Task 7: Mapbox geocoding client

**Files:**

- Create: `src/lib/mapbox/geocoding.ts`, `src/lib/mapbox/map.ts`, `src/lib/mapbox/geocoding.test.ts`

**Interfaces:**

- Produces:
  - `forwardGeocode(query: string, opts?: { limit?: number; signal?: AbortSignal }): Promise<GeocodeResult[]>`
  - `reverseGeocode(lng: number, lat: number): Promise<GeocodeResult | null>`
  - `type GeocodeResult = { placeName: string; address: string; city: string; region: string; country: string; lng: number; lat: number }`
  - `mapStyleUrl(style: MapStyle, theme: Theme): string`; `type MapStyle = 'light' | 'minimal' | 'satellite'`

- [ ] **Step 1: Failing test**

`src/lib/mapbox/geocoding.test.ts`:

```ts
import { afterEach, expect, test, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '~/test/msw/server'
import { forwardGeocode } from './geocoding'

afterEach(() => vi.unstubAllEnvs())

test('forwardGeocode maps features to results', async () => {
  vi.stubEnv('VITE_MAPBOX_TOKEN', 'pk.test')
  server.use(
    http.get('https://api.mapbox.com/geocoding/v5/mapbox.places/:q.json', () =>
      HttpResponse.json({
        features: [
          {
            place_name: '47 Rue des Couronnes, Paris',
            text: '47 Rue des Couronnes',
            center: [2.38, 48.87],
            context: [
              { id: 'place.1', text: 'Paris' },
              { id: 'region.1', text: 'Île-de-France' },
              { id: 'country.1', text: 'France' },
            ],
          },
        ],
      }),
    ),
  )
  const [r] = await forwardGeocode('couronnes')
  expect(r).toMatchObject({
    city: 'Paris',
    region: 'Île-de-France',
    country: 'France',
    lng: 2.38,
    lat: 48.87,
  })
})
```

- [ ] **Step 2: Run → fail.** Expected: FAIL.

- [ ] **Step 3: Implement `geocoding.ts`**

```ts
export type GeocodeResult = {
  placeName: string
  address: string
  city: string
  region: string
  country: string
  lng: number
  lat: number
}
type MapboxContext = { id: string; text: string }
type MapboxFeature = {
  place_name: string
  text: string
  center: [number, number]
  context?: MapboxContext[]
}

function token(): string {
  const t = import.meta.env.VITE_MAPBOX_TOKEN
  if (!t) throw new Error('VITE_MAPBOX_TOKEN missing')
  return t
}
function pick(ctx: MapboxContext[] | undefined, prefix: string): string {
  return ctx?.find((c) => c.id.startsWith(prefix))?.text ?? ''
}
function toResult(f: MapboxFeature): GeocodeResult {
  return {
    placeName: f.place_name,
    address: f.text,
    city: pick(f.context, 'place'),
    region: pick(f.context, 'region'),
    country: pick(f.context, 'country'),
    lng: f.center[0],
    lat: f.center[1],
  }
}
export async function forwardGeocode(
  query: string,
  opts: { limit?: number; signal?: AbortSignal } = {},
): Promise<GeocodeResult[]> {
  if (!query.trim()) return []
  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
  )
  url.searchParams.set('access_token', token())
  url.searchParams.set('limit', String(opts.limit ?? 5))
  const res = await fetch(url, { signal: opts.signal })
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`)
  const data = (await res.json()) as { features: MapboxFeature[] }
  return data.features.map(toResult)
}
export async function reverseGeocode(lng: number, lat: number): Promise<GeocodeResult | null> {
  const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`)
  url.searchParams.set('access_token', token())
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Reverse geocoding failed: ${res.status}`)
  const data = (await res.json()) as { features: MapboxFeature[] }
  const f = data.features[0]
  return f ? toResult(f) : null
}
```

- [ ] **Step 4: Implement `map.ts`**

```ts
import type { Theme } from '~/features/theme/theme'
export type MapStyle = 'light' | 'minimal' | 'satellite'
export function mapStyleUrl(style: MapStyle, theme: Theme): string {
  const map: Record<MapStyle, string> = {
    light:
      theme === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11',
    minimal:
      theme === 'dark'
        ? 'mapbox://styles/mapbox/navigation-night-v1'
        : 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  }
  return map[style]
}
```

- [ ] **Step 5: Run → pass.** Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add Mapbox geocoding client and style helpers"
```

---

## Task 8: Spot domain types + filter/sort logic + search-param schema

**Files:**

- Create: `src/features/spots/domain.ts`, `src/features/spots/filters.ts`, `src/features/spots/filters.test.ts`

**Interfaces:**

- Produces:
  - `domain.ts`: `SpotListItem`, `SpotDetail`, `Equipment`, `Discipline`, `SpotComment`, `SpotImage` types (below).
  - `filters.ts`: `spotSearchSchema` (Zod), `type SpotSearch`, `applyFilters(spots: SpotListItem[], search: SpotSearch): SpotListItem[]`, `sortSpots(...)`.

- [ ] **Step 1: Define `domain.ts`**

```ts
export type Equipment = { id: string; name: string; localeKey: string; category: string }
export type Discipline = { id: string; name: string; localeKey: string; category: string }
export type SpotImage = { id: string; url: string; order: number }
export type SpotComment = {
  id: string
  user: string
  rating: number | null
  date: string
  text: string
}

export type SpotListItem = {
  id: string
  name: string
  city: string
  address: string
  latitude: number
  longitude: number
  isOpen24h: boolean
  averageRating: number
  ratingCount: number
  disciplineIds: string[]
  equipmentIds: string[]
  thumbnailUrl: string | null
}
export type SpotDetail = SpotListItem & {
  description: string | null
  region: string
  country: string
  contributor: string
  openingHours: Record<string, string> | null
  images: SpotImage[]
  equipment: Equipment[]
  disciplines: Discipline[]
  comments: SpotComment[]
  viewerLiked: boolean
  viewerRating: number | null
}
```

- [ ] **Step 2: Failing test**

`src/features/spots/filters.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { applyFilters, spotSearchSchema } from './filters'
import type { SpotListItem } from './domain'

const base: Omit<SpotListItem, 'id' | 'name'> = {
  city: 'Paris',
  address: 'x',
  latitude: 0,
  longitude: 0,
  isOpen24h: false,
  averageRating: 0,
  ratingCount: 0,
  disciplineIds: [],
  equipmentIds: [],
  thumbnailUrl: null,
}
const spots: SpotListItem[] = [
  {
    ...base,
    id: 'a',
    name: 'Bercy Bars',
    averageRating: 4.8,
    ratingCount: 200,
    disciplineIds: ['di-1'],
    isOpen24h: true,
  },
  {
    ...base,
    id: 'b',
    name: 'Charléty',
    averageRating: 4.7,
    ratingCount: 400,
    disciplineIds: ['di-4'],
  },
]

describe('filters', () => {
  it('search schema defaults', () => {
    expect(spotSearchSchema.parse({})).toEqual({
      q: '',
      disciplines: [],
      equipment: [],
      open24h: false,
      sort: 'rating',
    })
  })
  it('filters by discipline', () => {
    const out = applyFilters(spots, spotSearchSchema.parse({ disciplines: ['di-4'] }))
    expect(out.map((s) => s.id)).toEqual(['b'])
  })
  it('filters by open24h and query', () => {
    expect(applyFilters(spots, spotSearchSchema.parse({ open24h: true })).map((s) => s.id)).toEqual(
      ['a'],
    )
    expect(applyFilters(spots, spotSearchSchema.parse({ q: 'charl' })).map((s) => s.id)).toEqual([
      'b',
    ])
  })
  it('sorts by popular then name', () => {
    expect(
      applyFilters(spots, spotSearchSchema.parse({ sort: 'popular' })).map((s) => s.id),
    ).toEqual(['b', 'a'])
    expect(applyFilters(spots, spotSearchSchema.parse({ sort: 'name' })).map((s) => s.id)).toEqual([
      'a',
      'b',
    ])
  })
})
```

- [ ] **Step 3: Run → fail.**

- [ ] **Step 4: Implement `filters.ts`**

```ts
import { z } from 'zod'
import type { SpotListItem } from './domain'

export const spotSearchSchema = z.object({
  q: z.string().catch('').default(''),
  disciplines: z.array(z.string()).catch([]).default([]),
  equipment: z.array(z.string()).catch([]).default([]),
  open24h: z.boolean().catch(false).default(false),
  sort: z.enum(['rating', 'popular', 'name']).catch('rating').default('rating'),
})
export type SpotSearch = z.infer<typeof spotSearchSchema>

function matches(s: SpotListItem, search: SpotSearch): boolean {
  if (search.q) {
    const q = search.q.toLowerCase()
    if (![s.name, s.address, s.city].some((f) => f.toLowerCase().includes(q))) return false
  }
  if (search.disciplines.length && !search.disciplines.some((d) => s.disciplineIds.includes(d)))
    return false
  if (search.equipment.length && !search.equipment.some((e) => s.equipmentIds.includes(e)))
    return false
  if (search.open24h && !s.isOpen24h) return false
  return true
}
export function applyFilters(spots: SpotListItem[], search: SpotSearch): SpotListItem[] {
  const filtered = spots.filter((s) => matches(s, search))
  const sorted = [...filtered]
  if (search.sort === 'rating') sorted.sort((a, b) => b.averageRating - a.averageRating)
  else if (search.sort === 'popular') sorted.sort((a, b) => b.ratingCount - a.ratingCount)
  else sorted.sort((a, b) => a.name.localeCompare(b.name))
  return sorted
}
```

Install zod if needed: `npm i zod`.

- [ ] **Step 5: Run → pass.**

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: spot domain types, search-param schema, filter/sort logic"
```

---

## Task 9: Icon component (port)

**Files:**

- Create: `src/components/ui/Icon.tsx`, `src/components/ui/Icon.test.tsx`

**Interfaces:**

- Produces: `Icon` with `type IconName` union covering all names in the prototype `icons.jsx` (`map, list, heart, user, settings, search, plus, close, star, mappin, clock, users, chevronR, chevronL, chevronD, chevronU, zoomIn, zoomOut, minus, locate, filter, camera, image, share, dumbbell, route`).

- [ ] **Step 1: Failing test**

```tsx
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Icon } from './Icon'
test('renders an svg of given size', () => {
  const { container } = render(<Icon name="search" size={20} />)
  const svg = container.querySelector('svg')
  expect(svg).toBeInTheDocument()
  expect(svg).toHaveAttribute('width', '20')
})
```

- [ ] **Step 2: Run → fail.**

- [ ] **Step 3: Implement** — port `icons.jsx` to a typed component: `type IconName = 'map' | ...`; `paths: Record<IconName, ReactNode>`; props `{ name: IconName; size?: number; color?: string; strokeWidth?: number }`. Copy each SVG path group verbatim from the prototype.

- [ ] **Step 4: Run → pass.**

- [ ] **Step 5: Commit** — `git commit -m "feat: typed Icon component ported from prototype"`

---

## Task 10: UI primitives (Button, Chip, Switch, Stars, Modal)

**Files:**

- Create: `src/components/ui/{Button,Chip,Switch,Stars,Modal}.tsx` and matching `*.test.tsx`

**Interfaces:**

- Produces:
  - `Button` `{ variant?: 'primary'|'secondary'|'ghost'; ... } & ButtonHTMLAttributes`
  - `Chip` `{ active?: boolean; onClick?: () => void; children }`
  - `Switch` `{ on: boolean; onChange: (v: boolean) => void; label?: string }`
  - `Stars` `{ value: number; size?: number; interactive?: boolean; onChange?: (v: number) => void }`
  - `Modal` `{ open: boolean; onClose: () => void; children; labelledBy?: string }` (focus trap + Esc + backdrop click)

- [ ] **Step 1: Failing tests** — one behavior each, e.g. Stars interactive calls `onChange(3)` on click of the 3rd star; Switch toggles; Modal calls `onClose` on Escape and renders nothing when `open=false`; Button applies `btn btn-primary` classes.

```tsx
// Stars.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { Stars } from './Stars'
test('interactive stars report clicked value', async () => {
  const onChange = vi.fn()
  render(<Stars value={0} interactive onChange={onChange} />)
  await userEvent.click(screen.getAllByRole('button')[2])
  expect(onChange).toHaveBeenCalledWith(3)
})
```

- [ ] **Step 2: Run → fail.**

- [ ] **Step 3: Implement** each primitive using the prototype's class names (`.btn`, `.chip`, `.switch`, `.stars`, `.modal*`). `Stars` interactive renders 5 `<button aria-label>` stars; `Modal` uses a backdrop div, traps focus, listens for `Escape`, renders via portal, sets `role="dialog"` + `aria-modal`.

- [ ] **Step 4: Run → pass** (all primitive tests).

- [ ] **Step 5: Commit** — `git commit -m "feat: accessible UI primitives (Button, Chip, Switch, Stars, Modal)"`

---

## Task 11: Taxonomy queries (equipments + disciplines, locale-resolved)

**Files:**

- Create: `src/features/taxonomy/queries.ts`, `src/features/taxonomy/queries.test.ts`

**Interfaces:**

- Consumes: `getBrowserSupabase`, `getServerSupabase`, i18n `t`, `Equipment`/`Discipline` types.
- Produces:
  - `equipmentsQueryOptions()` / `disciplinesQueryOptions()` returning `queryOptions` with stable keys `['equipments']` / `['disciplines']`.
  - `resolveLabel(localeKey: string, fallback: string, t: TFunction): string` — resolves `taxonomy.<localeKey>` if present, else fallback.

- [ ] **Step 1: Failing test** (mock Supabase select via MSW on the REST endpoint `/rest/v1/equipments`):

```ts
import { http, HttpResponse } from 'msw'
import { expect, test, vi } from 'vitest'
import { server } from '~/test/msw/server'
test('equipmentsQueryOptions maps rows', async () => {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://x.supabase.co')
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon')
  server.use(
    http.get('https://x.supabase.co/rest/v1/equipments', () =>
      HttpResponse.json([
        {
          id: 'eq-1',
          name: 'Pull-up bar',
          equipment_locale_key: 'equipment.pull_up_bar',
          category: 'bars',
        },
      ]),
    ),
  )
  const { equipmentsQueryOptions } = await import('./queries')
  const data = await equipmentsQueryOptions().queryFn!({} as never)
  expect(data[0]).toMatchObject({ id: 'eq-1', localeKey: 'equipment.pull_up_bar' })
})
```

- [ ] **Step 2: Run → fail.**

- [ ] **Step 3: Implement** queries selecting `id,name,equipment_locale_key,category` (and discipline equivalents), mapping rows to `Equipment`/`Discipline`. `resolveLabel` uses `t(localeKey, { defaultValue: fallback })`.

- [ ] **Step 4: Run → pass.**

- [ ] **Step 5: Commit** — `git commit -m "feat: taxonomy queries with locale-key label resolution"`

---

## Task 12: Spot read queries + loaders (list + detail)

**Files:**

- Create: `src/features/spots/queries.ts`, `src/features/spots/queries.test.ts`

**Interfaces:**

- Consumes: Supabase clients, `SpotListItem`/`SpotDetail`.
- Produces:
  - `spotsQueryOptions()` → `queryOptions<SpotListItem[]>` key `['spots']`.
  - `spotDetailQueryOptions(id: string)` → `queryOptions<SpotDetail>` key `['spot', id]`.
  - `mapSpotRow(row): SpotListItem`, `mapSpotDetailRow(row): SpotDetail` (pure, exported for tests).

- [ ] **Step 1: Failing test** — feed a representative joined row (built from `db.sql` columns) into `mapSpotDetailRow` and assert it produces a `SpotDetail` with `images` ordered by `order`, `viewerLiked=false` when no like rows, comments mapped, `disciplineIds` derived.

```ts
import { expect, test } from 'vitest'
import { mapSpotRow } from './queries'
test('mapSpotRow flattens taxonomy join ids', () => {
  const item = mapSpotRow({
    id: 'sp-1',
    name: 'Bercy',
    city: 'Paris',
    address: 'Quai',
    latitude: 48.83,
    longitude: 2.38,
    is_open_24h: true,
    average_rating: 4.8,
    rating_count: 214,
    location_disciplines: [{ discipline_id: 'di-1' }],
    location_equipments: [{ equipment_id: 'eq-1' }],
    location_images: [{ image_url: 'u', image_order: 1 }],
  })
  expect(item).toMatchObject({
    id: 'sp-1',
    isOpen24h: true,
    averageRating: 4.8,
    disciplineIds: ['di-1'],
    equipmentIds: ['eq-1'],
    thumbnailUrl: 'u',
  })
})
```

- [ ] **Step 2: Run → fail.**

- [ ] **Step 3: Implement** `mapSpotRow`/`mapSpotDetailRow` (pure mappers) and the `queryOptions`. List `queryFn` uses an isomorphic Supabase select with embedded `location_disciplines(discipline_id), location_equipments(equipment_id), location_images(image_url,image_order)`. Detail `queryFn` selects the full graph + comments (join `users` for author pseudo) and, when a session exists, the viewer's `location_likes`/`location_ratings`. Viewer-scoped reads go through a `createServerFn` (`getSpotDetailFn`) so cookies/session are read server-side; the loader calls it.

- [ ] **Step 4: Run → pass; typecheck.**

- [ ] **Step 5: Commit** — `git commit -m "feat: spot list/detail queries and row mappers"`

---

## Task 13: Auth — magic-link session, sign-in modal, auth gate

**Files:**

- Create: `src/features/auth/session.tsx`, `src/features/auth/SignInModal.tsx`, `src/features/auth/useAuthGate.ts`, `src/routes/auth.callback.tsx`, `src/features/auth/auth.test.tsx`
- Modify: `src/lib/i18n/{en,fr}.json` (auth keys)

**Interfaces:**

- Produces:
  - `SessionProvider` + `useSession(): { userId: string | null; status: 'loading'|'authed'|'anon' }`.
  - `useAuthGate(): (action: () => void) => void` — runs `action` if authed, else opens `SignInModal` and resumes after sign-in.
  - `SignInModal` `{ open; onClose }` calling `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo } })`.

- [ ] **Step 1: Failing test** — render a component using `useAuthGate`; with no session, clicking the gated button shows the sign-in modal (email input present); submitting calls a mocked `signInWithOtp`.

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
test('auth gate opens sign-in when anonymous', async () => {
  // arrange: mock getBrowserSupabase().auth.getSession → null; signInWithOtp spy
  // render <SessionProvider><GatedButton/></SessionProvider>
  // act: click button
  // assert: email field visible; submit triggers signInWithOtp with emailRedirectTo containing '/auth/callback'
})
```

Fill the test body using `vi.mock('~/lib/supabase/browser', ...)` to return a fake client whose `auth.getSession` resolves `{ data: { session: null } }`, `auth.onAuthStateChange` returns an unsubscribe, and `auth.signInWithOtp` is a spy.

- [ ] **Step 2: Run → fail.**

- [ ] **Step 3: Implement** session context (subscribe to `onAuthStateChange`, seed from `getSession`), `SignInModal` (email + magic-link submit + "check your inbox" state), `useAuthGate` (stores pending action, opens modal, replays on `authed`). `auth.callback.tsx` calls `supabase.auth.exchangeCodeForSession` (or reads the URL hash per Supabase magic-link flow — verify against Supabase docs via context7 `/supabase/supabase`) then redirects to the stored return path. Add `auth.*` i18n keys (EN+FR).

- [ ] **Step 4: Run → pass.**

- [ ] **Step 5: Commit** — `git commit -m "feat: magic-link auth, session provider, auth gate"`

---

## Task 14: App shell — Rail + Discover layout route

**Files:**

- Create: `src/features/spots/Rail.tsx`, `src/features/spots/Rail.test.tsx`
- Modify: `src/routes/__root.tsx` (render `Rail` + providers: Query, i18n, Session, Theme), `src/routes/spots/route.tsx` (search-param validation + layout grid)

**Interfaces:**

- Consumes: `spotSearchSchema`, `useSession`, theme helpers, `Icon`.
- Produces: `/spots` route validates search via `validateSearch: spotSearchSchema`; layout renders `.app` grid (rail + sidebar slot + map `<Outlet/>`). `Rail` with Map/List/Saved/Settings (Community omitted) + avatar.

- [ ] **Step 1: Failing test** — render `Rail` with a router stub; assert Map/List/Saved buttons exist (by `aria-label`/title) and **no** Community button.

- [ ] **Step 2: Run → fail.**

- [ ] **Step 3: Implement** `Rail` (port markup, `aria-label` per button, active state from current route/view), wire `validateSearch` on `/spots` and the `.app` grid in `route.tsx`. Settings button toggles a Settings panel (placeholder until Task 20). Providers composed in `__root.tsx`.

- [ ] **Step 4: Run → pass; `npm run dev` shows the shell.**

- [ ] **Step 5: Commit** — `git commit -m "feat: app shell with rail and Discover layout + search params"`

---

## Task 15: Sidebar + Filters + SpotCard (virtualized)

**Files:**

- Create: `src/features/spots/Filters.tsx`, `src/features/spots/SpotCard.tsx`, `src/features/spots/Sidebar.tsx`, and `*.test.tsx`
- Modify: `src/routes/spots/index.tsx` (loader + render Sidebar)

**Interfaces:**

- Consumes: `spotsQueryOptions`, `applyFilters`, taxonomy queries, `useNavigate`/`Route.useSearch`, `Chip`, `Stars`, `Icon`, `resolveLabel`.
- Produces: `Sidebar` driven by URL search params; `SpotCard` `{ spot: SpotListItem; active: boolean; onClick }`; filter changes call `navigate({ search })`.

- [ ] **Step 1: Failing tests**
  - `SpotCard` renders name, rounded rating (`4.8`), city, and a 24/7 tag when `isOpen24h`.
  - `Filters`: clicking a discipline chip calls `navigate` with that id added to `search.disciplines`.
  - `Sidebar`: given 2 spots and `search.q='bercy'`, only the matching card renders (uses `applyFilters`).

- [ ] **Step 2: Run → fail.**

- [ ] **Step 3: Implement.** `spots/index.tsx` loader: `context.queryClient.ensureQueryData(spotsQueryOptions())` (+ taxonomy). Component reads `Route.useSearch()`, `useSuspenseQuery(spotsQueryOptions())`, computes `applyFilters`, renders `Sidebar`. Sidebar: search input (debounced → `navigate`), discipline/equipment `Chip`s (labels via `resolveLabel`), 24/7 chip, sort `<select>`, results count, virtualized list via `@tanstack/react-virtual` (`npm i @tanstack/react-virtual`), empty state. Selecting a card navigates to `/spots/$spotId` preserving search. Port `.sidebar`, `.spot-card`, `.chip` markup/classes.

- [ ] **Step 4: Run → pass.**

- [ ] **Step 5: Commit** — `git commit -m "feat: sidebar, filters, virtualized spot cards bound to URL state"`

---

## Task 16: MapView (real Mapbox) + style switch + controls

**Files:**

- Create: `src/features/spots/MapView.tsx`, `src/features/spots/MapStyleSwitch.tsx`, `src/features/spots/MapView.test.tsx`
- Modify: `src/routes/spots/index.tsx` (render `MapView` in the map column)

**Interfaces:**

- Consumes: `mapbox-gl`, `mapStyleUrl`, `MapStyle`, `SpotListItem`, theme.
- Produces: `MapView` `{ spots; activeSpotId; onSelectSpot; onMapClick?; addMode?; newSpotPosition?; mapStyle; theme }`; `MapStyleSwitch` `{ value: MapStyle; onChange }`.

- [ ] **Step 1: Install + failing test**

```bash
npm i mapbox-gl && npm i -D @types/mapbox-gl
```

Test uses `mockMapboxGl()` from the harness: render `MapView` with 2 spots; assert a `FakeMarker` was created per spot (spy on `Marker`), and that clicking a marker element calls `onSelectSpot`. Also assert `onMapClick` fires when the fake map emits `click`.

- [ ] **Step 2: Run → fail.**

- [ ] **Step 3: Implement** `MapView` porting `mapview.jsx` (drop `FakeMap`): init map once (token from `VITE_MAPBOX_TOKEN`), `setStyle` on `mapStyle`/`theme` change, sync markers on `spots`/`activeSpotId`, `flyTo` active spot, zoom/recenter controls, `crosshair` cursor in `addMode`, render `newSpotPosition` marker. `MapStyleSwitch` ports `.map-style-switch`. Render a non-blocking notice if the token is missing.

- [ ] **Step 4: Run → pass.**

- [ ] **Step 5: Commit** — `git commit -m "feat: Mapbox MapView with pins, style switch, controls"`

---

## Task 17: Spot detail panel + route

**Files:**

- Create: `src/features/spots/Detail.tsx`, `src/features/spots/Detail.test.tsx`
- Modify: `src/routes/spots/$spotId.tsx` (loader + render)
- Modify: i18n `detail.*` keys

**Interfaces:**

- Consumes: `spotDetailQueryOptions`, `getSpotDetailFn`, `Stars`, `Icon`, `Button`, `resolveLabel`, `ReviewForm` (Task 19 — render a placeholder slot until then), likes (Task 18).
- Produces: `/spots/$spotId` SSR loader → `ensureQueryData(spotDetailQueryOptions(id))`; `Detail` `{ spot: SpotDetail; onClose }`.

- [ ] **Step 1: Failing test** — render `Detail` with a `SpotDetail` fixture; assert name, address, rating (`4.6`), equipment count stat, disciplines/equipment chips (translated labels), reviews count, and "Get directions" link with an external maps URL. Clicking close calls `onClose`.

- [ ] **Step 2: Run → fail.**

- [ ] **Step 3: Implement** `$spotId.tsx` loader (SSR via `getSpotDetailFn`) + `head` meta (spot name/description for SEO). `Detail` ports `detail.jsx`: hero image carousel (real `images`, gradient fallback), stats, About, Disciplines, Equipment, Contributor, Reviews list (`ReviewList`, Task 19), review form slot, "Get directions" (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`), Save button (Task 18). Closing navigates to `/spots` keeping search.

- [ ] **Step 4: Run → pass.**

- [ ] **Step 5: Commit** — `git commit -m "feat: SSR spot detail panel and route"`

---

## Task 18: Likes (save/unsave) + Saved page

**Files:**

- Create: `src/features/likes/mutations.ts`, `src/features/likes/useSaveSpot.ts`, `src/routes/saved.tsx`, `src/features/likes/likes.test.tsx`
- Modify: `src/features/spots/Detail.tsx` (wire Save button), `Rail` (Saved active state)

**Interfaces:**

- Consumes: browser Supabase, `useAuthGate`, `useSession`, Query client.
- Produces: `useSaveSpot(spotId)` → `{ liked: boolean; toggle: () => void; pending: boolean }` (optimistic, auth-gated); `savedSpotsQueryOptions(userId)`.

- [ ] **Step 1: Failing test** — with an authed session, clicking Save optimistically flips `liked` and calls Supabase `insert` into `location_likes`; on error it rolls back. With anon session, clicking opens the sign-in modal (no insert).

- [ ] **Step 2: Run → fail.**

- [ ] **Step 3: Implement** `toggle` via `useMutation` with optimistic cache update on `['spot', id]`; insert/delete `location_likes` by `(location_id, user_id)`. `/saved` route: auth-gated `beforeLoad` (redirect to `/spots` + open sign-in if anon), loader fetches liked spots, renders the same `SpotCard` list. Wire Detail Save through `useAuthGate`.

- [ ] **Step 4: Run → pass.**

- [ ] **Step 5: Commit** — `git commit -m "feat: optimistic save/unsave and Saved page"`

---

## Task 19: Combined reviews (rating + comment)

**Files:**

- Create: `src/features/reviews/schema.ts`, `src/features/reviews/mutations.ts`, `src/features/reviews/ReviewForm.tsx`, `src/features/reviews/ReviewList.tsx`, `src/features/reviews/reviews.test.tsx`
- Modify: `src/features/spots/Detail.tsx` (mount form + list), i18n `review.*`

**Interfaces:**

- Consumes: browser Supabase, `useAuthGate`, `useSession`, `Stars`, `Button`, TanStack Form, Zod.
- Produces: `reviewSchema` (`{ rating: 1..5; text: string (≤1000) }`), `useSubmitReview(spotId)` → `{ submit, pending }` that upserts `location_ratings` and inserts `location_comments`, then invalidates `['spot', spotId]`.

- [ ] **Step 1: Failing tests**
  - `reviewSchema` rejects `rating: 0` and `text` > 1000 chars.
  - Submitting a review (authed) calls upsert on `location_ratings` (unique by user+location) and insert on `location_comments`, then optimistically prepends the comment.
  - Submitting while anon opens the sign-in modal.

- [ ] **Step 2: Run → fail.**

- [ ] **Step 3: Implement** `ReviewForm` (TanStack Form: interactive `Stars` + textarea, disabled until valid), `useSubmitReview` (auth-gated; `upsert location_ratings onConflict (location_id,user_id)` + `insert location_comments`; optimistic prepend + refetch for denormalized `average_rating`), `ReviewList` (port `.comment` markup, show `Stars` per comment). Add `review.*` i18n.

- [ ] **Step 4: Run → pass.**

- [ ] **Step 5: Commit** — `git commit -m "feat: combined rating+comment reviews with optimistic update"`

---

## Task 20: Settings panel (theme, accent, language, map style)

**Files:**

- Create: `src/features/settings/SettingsPanel.tsx`, `src/features/settings/settings.test.tsx`
- Modify: `Rail`/shell to toggle it; persist to cookies (`theme`, `accent`, `lang`, `mapStyle`)

**Interfaces:**

- Consumes: theme helpers, i18n, `MapStyle`.
- Produces: `SettingsPanel` `{ open; onClose }`; persisted prefs read on load (SSR-safe) to avoid theme flash.

- [ ] **Step 1: Failing test** — toggling Theme to "dark" calls `applyTheme('dark')` and writes the `theme` cookie; switching language to FR updates i18n (`discover.title` → "Découvrir").

- [ ] **Step 2: Run → fail.**

- [ ] **Step 3: Implement** the trimmed Tweaks panel (theme seg, accent swatches, language seg, map-style seg) porting `.tweaks-*` styles; persist prefs to cookies; read cookies in `__root.tsx` to set initial `data-theme`/accent/lang server-side.

- [ ] **Step 4: Run → pass.**

- [ ] **Step 5: Commit** — `git commit -m "feat: settings panel for theme, accent, language, map style"`

---

## Task 21: Add-spot wizard (steps + geocoding + create)

**Files:**

- Create: `src/features/add-spot/schema.ts`, `src/features/add-spot/AddSpotWizard.tsx`, `src/features/add-spot/steps/{LocationStep,BasicsStep,TaxonomyStep,ReviewStep}.tsx`, `src/features/add-spot/mutations.ts`, `src/features/add-spot/AddressAutocomplete.tsx`, `src/features/add-spot/addspot.test.tsx`
- Modify: `src/routes/spots/route.tsx` or `index.tsx` (add-mode + modal mount), i18n `addSpot.*`

**Interfaces:**

- Consumes: `useAuthGate`, geocoding client, taxonomy queries, `MapView` (pin), `Modal`, TanStack Form, Zod, browser Supabase.
- Produces: `addSpotSchema`; `useCreateSpot()` → `{ create, pending }` inserting `locations` (+ `location_disciplines`, `location_equipments`) and returning the new id; `AddressAutocomplete` `{ value; onSelect: (r: GeocodeResult) => void }`.

- [ ] **Step 1: Failing tests**
  - `addSpotSchema` requires `position`, `address`, `name` (≥1), `description`, `disciplines.length ≥ 1`; matches the prototype's per-step `canNext` rules.
  - Step 0: selecting an autocomplete suggestion fills address/city/region (mocked geocoding).
  - Reverse geocode fills address when a pin is dropped (mocked).
  - `useCreateSpot` (authed) inserts `locations` then join rows; anon → sign-in modal.

- [ ] **Step 2: Run → fail.**

- [ ] **Step 3: Implement** the 4-step wizard porting `addspot.jsx` (step dots, Back/Continue/Publish, validation gating), using the real `MapView` for the pin (Task 16) instead of the fake mini-map, `AddressAutocomplete` (debounced `forwardGeocode`), reverse geocode on pin drop, taxonomy chip pickers (translated), review step summary. `useCreateSpot` inserts via Supabase with `created_by = auth.uid()`; on success navigate to `/spots/$newId`. Add `addSpot.*` i18n. (Photos handled in Task 22.)

- [ ] **Step 4: Run → pass.**

- [ ] **Step 5: Commit** — `git commit -m "feat: add-spot wizard with geocoding and create mutation"`

---

## Task 22: Photo upload to Supabase Storage

**Files:**

- Create: `src/features/add-spot/photos.ts`, `src/features/add-spot/PhotoPicker.tsx`, `src/features/add-spot/photos.test.ts`
- Modify: `BasicsStep.tsx` (mount `PhotoPicker`), `useCreateSpot` (write `location_images`), `Detail` carousel already consumes `images`.

**Interfaces:**

- Consumes: browser Supabase Storage, validation constants.
- Produces:
  - `validateImage(file: File): { ok: true } | { ok: false; reason: string }` (mime in allowed set, size > 0, ≤ 5 MB).
  - `uploadSpotImages(spotId: string, files: File[]): Promise<SpotImage[]>` — uploads to bucket, inserts `location_images` rows with `image_order` 1..n, returns created images. Bucket name from a constant `SPOT_IMAGES_BUCKET` (default `'location-images'` — verify against the project, §13 of spec).

- [ ] **Step 1: Failing tests**
  - `validateImage` rejects `text/plain` and a 0-byte file; accepts a small `image/webp`.
  - `uploadSpotImages` (mock Storage `upload` + REST insert) returns images ordered 1..n; surfaces a per-file error when `upload` fails.

- [ ] **Step 2: Run → fail.**

- [ ] **Step 3: Implement** validation (allowed mimes from `db.sql`: jpeg/jpg/png/webp/gif/bmp/tiff; ≤10 images; order 1–10), `uploadSpotImages` (path `${spotId}/${order}-${filename}`, `getPublicUrl`, insert rows), `PhotoPicker` (port `.img-slot` grid, preview thumbnails, per-slot error, remove). Wire into the wizard create flow.

- [ ] **Step 4: Run → pass.**

- [ ] **Step 5: Commit** — `git commit -m "feat: spot photo upload to Supabase Storage"`

---

## Task 23: Error boundaries, empty/loading states, integration pass

**Files:**

- Modify: `src/routes/spots/index.tsx`, `src/routes/spots/$spotId.tsx`, `__root.tsx` (errorComponent/pendingComponent), `src/routes/saved.tsx`
- Create: `src/components/ErrorState.tsx`, `src/components/ErrorState.test.tsx`, `src/features/spots/discover.integration.test.tsx`

**Interfaces:**

- Produces: `ErrorState` `{ title; message; onRetry? }`; route `errorComponent`/`pendingComponent` wired on data routes.

- [ ] **Step 1: Failing tests**
  - `ErrorState` renders message and calls `onRetry` on click.
  - Integration: render `/spots` with MSW-seeded spots; type in search → list narrows and URL search param updates; click a card → detail loads; toggle a discipline chip → list + count update. (Mapbox mocked.)

- [ ] **Step 2: Run → fail.**

- [ ] **Step 3: Implement** `ErrorState`, wire `errorComponent` (uses `ErrorState` + `router.invalidate()` retry) and `pendingComponent` (skeleton) on data routes; confirm empty states use i18n. Make the integration test pass end-to-end.

- [ ] **Step 4: Run full suite + quality gates**

Run: `npm run lint && npm run typecheck && npm test`
Expected: all pass, zero `any`, zero type errors.

- [ ] **Step 5: Commit** — `git commit -m "feat: error/empty/loading states and discover integration test"`

---

## Self-Review

**Spec coverage** (spec §→task): Stack §2→T1–3,5–7; structure §3→all; data model §4→T5,11,12; routes/screens §5→T14,15,16,17,18,21; components §6→T9,10,15,16,17; data flow §7→T12,13,18,19; i18n §8→T6,11,20; maps/geocoding §9→T7,16,21; photos §10→T22; error/edge §11→T23; testing §12→T3 + per-task; assumptions §13→noted in T5,12,13,18,19,22; non-goals §14→respected (client filtering T8/T15, no realtime, Community omitted T14).

**Placeholder scan:** No "TBD/TODO/implement later" for core functionality. Where live Supabase/Mapbox API exact shapes may have drifted, steps name the specific context7 library + query to confirm, and keep the produced interface fixed — these are verification actions, not deferred work.

**Type consistency:** `SpotListItem`/`SpotDetail`/`Equipment`/`Discipline`/`SpotComment`/`SpotImage` defined once (T8 domain.ts) and consumed verbatim downstream. `SpotSearch`/`spotSearchSchema` (T8) used by T14/T15. `MapStyle` (T7) used by T16/T20. `GeocodeResult` (T7) used by T21. Query keys consistent: `['spots']`, `['spot', id]`, `['equipments']`, `['disciplines']`.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-24-workout-spots-discover.md`.
