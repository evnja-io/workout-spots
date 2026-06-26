# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server on :3000
npm run build        # Production build (Nitro → .output, or Vercel Build Output when VERCEL=1)
npm start            # Run the built SSR server: node .output/server/index.mjs
npm run typecheck    # tsc --noEmit
npm run lint         # eslint .
npm run format       # prettier --write .
npm test             # vitest run (single pass)
npm run test:watch   # vitest watch
```

Local Supabase stack (requires Docker; Docker Desktop WSL integration must be ON):
```bash
npm run db:start     # start local stack (API :54321, DB :54322, Studio :54323)
npm run db:stop      # stop the local stack
npm run db:reset     # recreate DB, apply all migrations, then load supabase/seed.sql
npm run db:types     # regenerate src/lib/supabase/types.ts from the local DB
npm run db:diff      # diff local DB vs migrations (scaffold a new migration body)
npm run db:pull      # pull remote schema changes (rarely; see Database notes)
npm run db:push      # push local migrations to the linked remote (prod)
```

Run a single test file or by name:
```bash
npx vitest run src/features/spots/filters.test.ts
npx vitest run -t "applyFilters sorts by rating"
```

## Architecture

Full-stack React 19 app for discovering outdoor workout spots on a map. No custom backend — the browser and SSR talk directly to **Supabase** (Postgres + Auth + Storage) via PostgREST.

**Stack:** TanStack Start (SSR via Nitro) · TanStack Router (file-based) · TanStack Query · Supabase · Mapbox GL · Tailwind v4 · i18next (en/fr) · Zod.

**Layering:** `src/routes/` (thin route shells + SSR loaders) → `src/features/<domain>/` (the real logic: queries, mutations, components, schemas) → `src/lib/` (supabase clients, mapbox, i18n) → `src/components/ui/` (primitives). `~/` is the path alias for `src/`.

**Routing:** File-based under `src/routes/`. `/` redirects to `/spots`. The map UI lives in `spots/route.tsx` (persistent layout); `spots/$spotId.tsx` renders the detail panel as a child `<Outlet>`. `routeTree.gen.ts` is **auto-generated and gitignored — never edit it by hand**.

**Data access pattern:** Each feature's `queries.ts` exports `*QueryOptions()` functions returning TanStack Query `queryOptions`. The queryFn calls Supabase directly with PostgREST embedded-join selects, then a pure `map*Row()` mapper converts snake_case DB rows → camelCase domain types (see `features/spots/domain.ts`). Route `loader`s call `context.queryClient.ensureQueryData(...)` to prefetch for SSR.

**Two Supabase clients:**
- `lib/supabase/browser.ts` — singleton browser client.
- `lib/supabase/server.ts` — per-request SSR client wired to TanStack Start cookies.
- **Env vars are `VITE_`-prefixed and inlined at build time** via `import.meta.env`; they are NOT in `process.env` at runtime. Use `import.meta.env.VITE_*`, never `process.env`.

**Resilience (mocks-first):** `isSupabaseConfigured()` guards every queryFn. When Supabase is unconfigured, queries return `[]`/`null` instead of throwing, so SSR renders HTTP 200 rather than 500. Preserve this guard when adding queries.

**Auth & gated writes:** `features/auth/session.tsx` provides `SessionProvider` + `useSession()`. To perform a write that requires login, wrap it with `useAuthGate()` — it runs the action immediately if authed, otherwise stashes it, opens the sign-in modal, and replays it once the user authenticates.

**Mutations:** Optimistic by convention — `onMutate` snapshots + writes cache, `onError` rolls back, `onSettled` invalidates. Fire `trackEvent(...)` from `features/analytics/gtag` on success.

**Filters/search:** Spot lists are **viewport-bounded** (`spotsInBoundsQueryOptions`) — text search only matches spots in the currently loaded map viewport, not globally. `filters.ts` has two schemas: a lenient `spotRouteSearchSchema` for the router's `validateSearch` (never redirects/500s on bad params) and a strict `spotSearchSchema` that components `.parse()` to apply defaults.

**Preferences (theme/accent/map style/lang):** Stored in cookies, read isomorphically via `createIsomorphicFn()` in `features/settings/prefs.ts` (server branch reads request cookies, client branch reads `document.cookie`). Applied in `__root.tsx` before hydration to avoid flash.

## Database

**Local dev cycle (preferred).** Develop against a local Supabase stack via the CLI (a devDependency — use `npx supabase` / the `db:*` scripts). `npm run db:reset` rebuilds the local DB from `supabase/migrations/` + `supabase/seed.sql`. Workflow for a schema change: edit/create a migration → `npm run db:reset` (verify it applies) → `npm run db:types` (regenerate types) → `npm test`/`npm run typecheck` → `npm run db:push` to apply to prod. Point local dev at the stack via `.env.local` (gitignored; `VITE_SUPABASE_URL=http://127.0.0.1:54321` + the local demo anon key). `.env` keeps prod values for builds.

**Migrations.** `supabase/migrations/` holds exactly two files that reproduce production:
- `…_remote_baseline.sql` — a `supabase db dump` snapshot of the prod `public` schema (58 tables, functions, RLS). Built with `db dump`, **not** `db pull`: the remote has an old migration-history table with no local files, which makes `db pull` fail. Don't run `db pull` to re-baseline without handling that.
- `…_local_infra.sql` — what the public-only dump omits (auth/storage are excluded from the dump): the `auth.users → public.users` mirror trigger and the `location-images`/`avatars` storage buckets + their `storage.objects` policies.

New migrations go **after** these via `supabase migration new <name>`. The 7 original hand-written migrations live in `supabase/migrations_archive/` — already applied in prod, kept for reference only, never re-run. `db.sql` is a stale, incomplete schema dump (context only). The app's anon key **cannot run DDL**; production DDL goes through `db push` (or the SQL Editor — see `supabase/README.md`).

**Seed.** `supabase/seed.sql` is a `db dump --data-only --schema public` of prod data, loaded automatically by `db reset`. It's **gitignored** (real user PII). Regenerate with `supabase db dump --linked --data-only --schema public -x public.spatial_ref_sys -f supabase/seed.sql` — **not** `--use-copy` (the CLI seeder can't parse COPY's `\.` terminators); INSERT format is required.

**Types.** `src/lib/supabase/types.ts` is **generated** (`npm run db:types`), not hand-edited, and is excluded from eslint. Regenerate it whenever the schema changes. jsonb columns (e.g. `locations.metadata`, `opening_hours`) come back as `Json` — narrow them at the read site (see `features/spots/queries.ts`).

**Known issue:** `npm run lint` can OOM under type-aware ESLint when the local stack is consuming RAM; `npm run typecheck` and `npm test` are unaffected.

Ratings have two sources: scraped data in `locations.external_*` columns vs. user submissions in `location_ratings`, which a DB trigger aggregates into `locations.average_rating`/`rating_count`. Don't conflate them.

## Testing

Vitest + jsdom + Testing Library, with **MSW** intercepting Supabase HTTP (`src/test/msw/`); unhandled requests error out. Mapbox GL is mocked (`src/test/mapbox-mock.ts`). Tests are co-located next to source (`*.test.ts(x)`). `src/test/setup.ts` wires MSW lifecycle globally.
