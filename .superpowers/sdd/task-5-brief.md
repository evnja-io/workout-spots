# Task 5: Supabase types + client factories

Authoritative spec: `docs/superpowers/plans/2026-06-24-workout-spots-discover.md` lines 686–791 (Task 5).

**Mocks-first:** no live keys yet. Write a hand-authored `Database` type matching `db.sql`, committed now; it will be replaced by `supabase gen types` once access lands.

## Files
- Create: `src/lib/supabase/types.ts`, `src/lib/supabase/browser.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/cookies.ts`, `src/lib/supabase/browser.test.ts`

## Produces
`getBrowserSupabase(): SupabaseClient<Database>` (singleton), `getServerSupabase(): SupabaseClient<Database>` (reads request cookies), and the `Database` type.

- [ ] **Step 1: Install** — `npm i @supabase/supabase-js @supabase/ssr cookie` and `npm i -D @types/cookie`

- [ ] **Step 2: Hand-write `src/lib/supabase/types.ts`**

  Read the actual table definitions in `db.sql` (lines 4–150) and produce a `Database` interface in the Supabase-generated shape:
  ```ts
  export interface Database {
    public: {
      Tables: {
        <table>: { Row: {...}; Insert: {...}; Update: {...}; Relationships: [] }
        ...
      }
      Views: Record<string, never>
      Functions: Record<string, never>
      Enums: Record<string, never>
      CompositeTypes: Record<string, never>
    }
  }
  ```
  Map Postgres → TS: `uuid`/`text` → `string`; `numeric`/`integer` → `number`; `boolean` → `boolean`; `timestamp with time zone` → `string`; `jsonb` → a `Json` type (`type Json = string | number | boolean | null | { [k: string]: Json } | Json[]`). Nullable columns (no NOT NULL) → `T | null`. `Insert` makes DB-defaulted columns (id, created_at, updated_at, and DEFAULT'd booleans/counts) optional; `Update` makes all optional.

  **In-scope tables (from db.sql) — type ALL of these:**
  - `users` (id, email, pseudo, birth_year, created_at, updated_at, bio, city, state, name, profile_picture_url, fitness_level, unread_notifications_count, last_notification_read_at)
  - `locations` (id, name, description, latitude, longitude, opening_hours(jsonb), is_open_24h, created_by, created_at, updated_at, address, contributor, rating, city, region, country, metadata(jsonb), average_rating, rating_count, external_rating_count, external_average_rating)
  - `location_images` (id, location_id, image_url, image_path, image_order, file_size, mime_type, created_at, uploaded_by)
  - `location_likes` (id, location_id, user_id, created_at)
  - `location_comments` (id, location_id, user_id, content, created_at, updated_at)
  - `equipments` (id, name, category, description, icon_name, is_active, created_at, updated_at, equipment_locale_key, description_locale_key)
  - `location_equipments` (id, location_id, equipment_id, quantity, condition, notes, added_by, verified, verified_by, verified_at, created_at, updated_at)
  - `disciplines` (id, name, category, description, icon_name, is_active, created_at, updated_at, discipline_locale_key, description_locale_key)
  - `location_disciplines` (id, location_id, discipline_id, popularity_score, notes, added_by, verified, verified_by, verified_at, created_at, updated_at)
  - **`location_ratings`** — NOT in db.sql (the dump is incomplete) but REQUIRED. Type it as the per-user ratings table: `{ id: string; location_id: string | null; user_id: string | null; rating: number; created_at: string | null; updated_at: string | null }`. Insert: id/created_at/updated_at optional. This is where user-submitted star ratings (1–5) live; `locations.average_rating`/`rating_count` aggregate them; `locations.external_average_rating`/`external_rating_count` are the scraped base. (See controller memory `ratings-model`.) Add a `// TODO(db-access): confirm exact columns + average_rating trigger` comment above this table.

- [ ] **Step 3: Failing test** `src/lib/supabase/browser.test.ts` (verbatim from plan lines 717–725): stubs env, imports `getBrowserSupabase`, asserts singleton (`toBe`).

- [ ] **Step 4: Run → fail.**

- [ ] **Step 5: Implement clients** — `browser.ts` (verbatim plan 736–750: singleton via `createBrowserClient<Database>` reading `import.meta.env.VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`). `server.ts` (verbatim plan 755–778: `createServerClient<Database>` reading `process.env.*`, cookies via `@tanstack/react-start/server` `getRequestHeaders`/`setResponseHeaders` + `parseCookies`/`serializeCookie` from `./cookies`). `cookies.ts`: small typed helpers wrapping the `cookie` package — `parseCookies(header: string): Record<string,string>` and `serializeCookie(name: string, value: string, options?: <cookie SerializeOptions>): string`. If the `@tanstack/react-start/server` header API differs from the snippet, consult context7 (resolve `@tanstack/react-start`, query "server request headers cookies createServerFn") and adapt, keeping `getServerSupabase`'s signature.

- [ ] **Step 6: Run → pass + `npm run typecheck`.** Both clean. Also `npm run lint` clean.

- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: add Supabase types and browser/server client factories"`

## Global Constraints
- TS strict, zero `any` (use the `Json` type, not `any`, for jsonb). Branch `feature/workout-spots-discover`. Mocks-first; NEVER create a real `.env` (the clients read env at call time; the singleton test stubs env via `vi.stubEnv`).
- `server.ts` reads `process.env` (server-only) — that's correct for SSR; do not move secrets into client code.

## Controller notes
- If a Bash/MCP call returns "temporarily unavailable" (transient outage), retry.
- The browser singleton test must NOT make network calls (creating the client is offline). If `onUnhandledRequest:'error'` from MSW trips, that means the client made a request it shouldn't — investigate rather than suppress.
- Report contract: write `/home/sephi/workout-spots/.superpowers/sdd/task-5-report.md` with Status, commit SHA+message, ACTUAL output of the browser test + `npm run typecheck` + `npm run lint` + full `npm test`, the list of tables typed, and any context7 adaptation to the server cookie API. Reply to me with the same. Real output only.
