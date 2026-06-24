# Task 1: Project scaffold (TanStack Start + TS strict + Vite + Tailwind v4)

**Files:**

- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `.env.example`, `src/router.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/spots/route.tsx`, `src/routes/spots/index.tsx`
- Create: `index.html`, `src/styles/global.css`

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

Import it in `__root.tsx`: `import '~/styles/global.css'`.

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
import '~/styles/global.css'

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
printf 'node_modules\n.output\n.vinxi\ndist\n.env\nsrc/routeTree.gen.ts\n' > .gitignore
git add -A && git commit -m "chore: scaffold TanStack Start app with strict TypeScript and Tailwind v4"
```

## Global Constraints (apply to this task)

- TypeScript strict; zero `any`. Prefer `unknown` + narrowing.
- React 19, TanStack Start latest stable, TanStack Query v5, TanStack Router (file-based), Vite 7+.
- Styling: Tailwind CSS v4 via `@tailwindcss/vite` + `@import "tailwindcss"`. In this task, `global.css` only needs the `@import 'tailwindcss';` line plus the Tailwind Vite plugin wired in `vite.config.ts`; theme tokens come in Task 4.
- No secrets in client bundles. `.env` is git-ignored; only `.env.example` is committed.
- Commit on branch `feature/workout-spots-discover`.

## Notes from controller

- We are mocks-first: no live Supabase/Mapbox keys yet. `.env.example` is committed; do NOT create a real `.env`.
- A platform classifier outage is making `Bash`/MCP calls intermittently return "temporarily unavailable". If a Bash call returns that error, simply retry it — it is transient, not a real failure.
- `routeTree.gen.ts` is generated by the TanStack Start/Router Vite plugin on `npm run dev`/`build`. It is fine that it does not exist until the dev server runs; it is git-ignored. If typecheck fails solely because `routeTree.gen.ts` is missing, run `npm run dev` once (or the router generator) to produce it, then stop the server.
