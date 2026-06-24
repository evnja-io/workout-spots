# Workout Spots — Discover (v1) Design

**Date:** 2026-06-24
**Status:** Approved (pending spec review)
**Source design:** claude.ai design project `f2a8e04f-f32b-4983-b793-307bc1ddafab` ("Workout spots") — files `Workout Spots.html`, `data.js`, `sidebar.jsx`, `mapview.jsx`, `detail.jsx`, `addspot.jsx`, `icons.jsx`, `styles.css`.
**Backend:** existing Supabase project (schema in `db.sql`).

## 1. Goal & scope

Build the **"Discover"** experience of Workout Spots as a production web app: a map-first directory of outdoor calisthenics / street-workout spots, with filtering, spot detail, reviews, saving, and community-contributed spots.

**In scope (v1):**

- Discover: Mapbox map + sidebar list, search, discipline/equipment filters, "Open 24/7" filter, sort (top-rated / most-rated / A–Z).
- Spot detail: photos, address, stats, about, disciplines, equipment, contributor, reviews, directions, save.
- Reviews: combined rating (1–5) + optional text in one action.
- Likes/Save + a dedicated **Saved** page (liked spots).
- Add-a-spot: 4-step wizard with map pin, Mapbox geocoding, photo upload, taxonomy selection.
- Auth: **public read**, **magic-link** sign-in required only to contribute (add spot, review, rate, like/save).
- i18n: **English + French** at launch.
- Real photo upload to Supabase Storage.
- Rendering: **TanStack Start (SSR)** for SEO on `/spots` and `/spots/$spotId`.

**Out of scope (v1):** Community tab (clubs/events), workouts/programs/exercises/sessions, subscriptions, notifications, push — i.e. the rest of the `db.sql` schema. The rail's Community entry is hidden in v1.

## 2. Stack & tooling

| Concern      | Choice                                                                                                                                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework    | TanStack Start (SSR) on React 19, TypeScript (strict), Vite                                                                                                                                                                        |
| Routing      | TanStack Router (file-based, type-safe, validated search params)                                                                                                                                                                   |
| Server state | TanStack Query v5 (hydrated from route loaders)                                                                                                                                                                                    |
| Forms        | TanStack Form + Zod (add-spot wizard, review form)                                                                                                                                                                                 |
| Long lists   | TanStack Virtual (virtualized spot list)                                                                                                                                                                                           |
| Backend SDK  | Supabase JS v2 — server client (loaders/SSR) + browser client (auth + mutations)                                                                                                                                                   |
| Styling      | **Tailwind CSS v4** (`@tailwindcss/vite`, CSS-first `@theme`); design tokens mapped to runtime CSS variables so light/dark + accent palettes stay swappable; bespoke styles (animations, scrollbars, map pins) in a small `@layer` |
| Types        | `supabase gen types typescript` → typed DB client; **no `any`** (lint-enforced)                                                                                                                                                    |
| Map          | Mapbox GL JS v3 + `@types/mapbox-gl`; Mapbox Geocoding API for autocomplete + reverse geocode                                                                                                                                      |
| i18n         | react-i18next (en + fr), SSR-safe; locale via cookie + `?lang`; taxonomy via `*_locale_key`                                                                                                                                        |
| Testing      | Vitest + React Testing Library + user-event + MSW (mock Supabase REST/Storage + Mapbox Geocoding) + jsdom; Mapbox GL mocked                                                                                                        |
| Quality      | ESLint (`@typescript-eslint/no-explicit-any: error`), Prettier, `tsc --noEmit` in CI                                                                                                                                               |

## 3. Project structure (feature-first)

```
src/
  routes/
    __root.tsx            # shell: rail + providers (Query, i18n, theme, auth)
    index.tsx             # redirect → /spots
    spots/
      route.tsx           # Discover layout (sidebar + map); validates search params
      index.tsx           # list/map view (loader: spots)
      $spotId.tsx         # spot detail (loader: one spot) — SSR for SEO
    saved.tsx             # liked spots (auth-gated)
    auth/callback.tsx     # magic-link return → establishes session
  features/
    spots/                # SpotCard, MapView, Detail, Filters, queries, hooks
    add-spot/             # wizard + steps, geocoding integration
    reviews/              # combined rating+comment form, review list
    likes/                # save/unsave (optimistic)
    auth/                 # magic-link sign-in, session provider, auth gate
    equipment-disciplines/# taxonomy fetch + locale resolution
  lib/
    supabase/             # browser + server client factories, generated DB types
    mapbox/               # map init helpers, geocoding client
    i18n/                 # config, en/fr resources
  components/ui/          # Button, Chip, Modal, Stars, Switch, Icon, ... (from styles.css)
  styles/                 # global.css (ported), CSS variables / themes
  test/                   # setup, MSW handlers, fixtures
```

## 4. Data model mapping

| App concept | Supabase tables                                                                   |
| ----------- | --------------------------------------------------------------------------------- |
| Spot        | `locations` (denormalized `average_rating`, `rating_count`)                       |
| Spot photos | `location_images` (Supabase Storage)                                              |
| Equipment   | `equipments`, `location_equipments`                                               |
| Disciplines | `disciplines`, `location_disciplines`                                             |
| Review      | `location_ratings` (1–5, upsert per user) + `location_comments` (text)            |
| Save        | `location_likes`                                                                  |
| Profile     | `public.users` (FK target for `created_by` / `user_id`), keyed to `auth.users.id` |

- **List query:** card fields (`id, name, city, average_rating, rating_count, is_open_24h`) + one thumbnail + discipline/equipment ids for filter parity with the prototype. (Server-side filtering can replace client filtering once datasets grow.)
- **Detail query:** `locations` joined with `location_images` (ordered), `location_equipments`→`equipments`, `location_disciplines`→`disciplines`, `location_comments` (+ author from `public.users`), `location_ratings` aggregate, and the viewer's own like + rating when authenticated.

## 5. Routes & screens

- **`/spots`** — Discover. Sidebar (search, discipline chips, equipment chips, 24/7 toggle, sort) + Mapbox map with pins, style switch (Light/Minimal/Satellite), zoom/recenter, "Add a spot". **All filter/search/sort state in URL search params** (Zod-validated) → shareable, SSR-rendered, correct back-button.
- **`/spots/$spotId`** — Discover shell with the Detail panel open. Deep-linkable, SSR'd for SEO. Closing returns to `/spots` preserving filters.
- **`/saved`** — liked spots; auth-gated (redirect to sign-in when logged out).
- **Add-spot** — wizard as overlay route/modal over `/spots`; map click sets the pin; 4 steps (Location → Basics+photos+24/7 → Disciplines & equipment → Review).
- **Sign-in** — magic-link modal/route; `/auth/callback` completes the session and resumes the pending action.
- **Rail** — Map/List toggle the Discover view mode; Saved → `/saved`; Community hidden in v1; Settings opens a trimmed panel (theme, accent, language, map style) derived from the prototype's Tweaks.

## 6. Components

Port the prototype 1:1 visually (same CSS variables, light/dark themes, accent palette) as typed components:
`Rail`, `Sidebar`, `SpotCard`, `MapView` (real Mapbox — **fake-map fallback dropped**), `MapStyleSwitch`, `Detail`, `ReviewForm`, `Stars`, `AddSpotWizard` (+ step components), `MiniMap` (real Mapbox), `Modal`, `Chip`, `Button`, `Switch`, `Icon`. Same visual language, real data.

## 7. Data flow

- **Reads (public):** route loader → server Supabase client → data hydrated into TanStack Query cache → components consume via `useQuery`/`useSuspenseQuery`. RLS permits anon `select`.
- **Mutations (auth):** browser Supabase client via `useMutation`. Optimistic updates for likes and reviews; invalidate/refetch the affected spot. Magic-link session stored in SSR-readable cookie storage.
- **Ratings denormalization:** assume DB triggers maintain `locations.average_rating` / `rating_count`; after a review mutation, refetch the spot. _(Assumption — §11.)_
- **Auth gate:** contribute actions check the session; if absent, open the magic-link modal, then resume the action on return.

## 8. i18n

- UI strings in `en` / `fr` JSON resources; react-i18next with SSR hydration; locale resolved from cookie (default from `Accept-Language`), switchable in Settings and via `?lang`.
- Equipment/discipline labels resolved from `equipment_locale_key` / `discipline_locale_key` against the bundles (taxonomy translated, not hardcoded).

## 9. Maps & geocoding

- Mapbox GL v3 via env token; Light/Minimal/Satellite styles; custom pins, fly-to on select, zoom/recenter (per prototype).
- Add-spot: pin-drop on the main map → **reverse geocode** to prefill address/city/region; address field **autocompletes** via Mapbox Geocoding (debounced).

## 10. Photos / Storage

- Upload to a Supabase Storage bucket (assume `location-images` — verify), client-side validation per schema (`image/jpeg|png|webp|gif|bmp|tiff`, ≤10 images, `image_order` 1–10, `file_size > 0`), then write `location_images` rows. Detail carousel shows real images; falls back to gradient placeholder when none exist.

## 11. Error handling & edge cases

- Loader/query errors → route error boundaries with retry.
- Empty states ("No spots match your filters").
- Map: missing/invalid token state; geolocation permission denied.
- Auth failures (expired/invalid magic link).
- Optimistic-update rollback on mutation failure.
- Form validation (Zod), bilingual messages.
- Per-slot image-upload failure surfaced in the wizard.

## 12. Testing strategy

Vitest + RTL + user-event; MSW mocks Supabase REST/Storage and Mapbox Geocoding; Mapbox GL mocked. Coverage focus (meaningful, not a vanity %):

- Filter / sort / search logic and URL search-param sync.
- Review submit (rating + comment, optimistic update + rollback).
- Like toggle (optimistic).
- Add-spot wizard: step validation, geocoding prefill, create.
- i18n language switching + taxonomy label resolution.
- Auth-gate redirect / resume-after-sign-in.
- Route loaders with a mocked Supabase client.

## 13. Assumptions to verify (when Supabase access + keys are provided)

1. A trigger creates a `public.users` profile row on signup (else the app creates it on first contribution).
2. RLS: anon `select` on `locations`, `location_images`, taxonomy tables, `location_comments`, `location_ratings`; authenticated `insert`/`update` scoped to `auth.uid()`.
3. Triggers maintain `locations.average_rating` / `rating_count` (else add an RPC or client recompute).
4. Storage bucket name + public-read policy for spot images.
5. Magic-link redirect URL allow-listed in Supabase Auth settings.
6. Env vars available: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_MAPBOX_TOKEN` (+ server-side equivalents for loaders/SSR).

## 14. Non-goals / deferred

- Server-side filtering/pagination (client filtering for v1, matching the prototype).
- Realtime comment/review updates.
- Community (clubs/events), workouts, programs, subscriptions, notifications.
- Native/mobile app (the schema's Expo/RevenueCat fields are unused here).
