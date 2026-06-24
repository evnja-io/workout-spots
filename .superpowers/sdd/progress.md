# Workout Spots Discover — SDD progress

Plan: docs/superpowers/plans/2026-06-24-workout-spots-discover.md
Mode: mocks-first (no live keys yet); Tailwind v4 styling
Branch: feature/workout-spots-discover
Branch base for final review: e2f1f60

## Tasks

- [x] Task 1: Project scaffold (TanStack Start + TS strict + Vite + Tailwind v4) — commits f85e370, a3fa063. Reviewed: APPROVE (2 Minor; `directories` leftover fixed). typecheck ✅, dev server serves /spots ✅. Deviations: `"type":"module"` (ESM), `getRouter` export (Start server-core requirement), no index.html (SSR uses \_\_root.tsx).
- [x] Task 2: Lint + Prettier + no-any — commit 6decd43. Verified: no-any rule fires on temp `any`; `npm run lint` exits 0 clean. Deviations: `allowDefaultProject:['eslint.config.js']`, `only-throw-error:'off'` (TanStack `throw redirect()`; broad — revisit later), prettier normalized 3 scaffold files.
- [x] Task 3: Test harness (Vitest + RTL + MSW + Mapbox mock) — commit ee58d92. No deviations. Independently verified: `npm test` 1 passed, `npm run lint` clean, `npm run typecheck` clean. MSW 2.14.6 (v2 API).
- [x] Task 5: Supabase types + client factories — commit 956c853. Hand-written `Database` (10 tables incl. `location_ratings` w/ TODO(db-access); `Json` type for jsonb; zero any). browser.ts singleton + server.ts cookie wiring. Deviation: plan's cookie API snippet was stale — adapted via context7 to `getCookies`/`setCookie`/`setResponseHeader`; `setAll(toSet, headers)` 2-arg form is CORRECT for installed @supabase/ssr (verified against its types — prevents CDN caching of auth cookies). Verified: browser test pass, full test 4 passed, typecheck+lint clean. **Pending DB-access:** swap to `supabase gen types`; confirm location_ratings columns + average_rating trigger.
- [x] Task 4: Global styles + theme/accent helpers — commit 18a9251. **Deliberate deviation:** plan's Task 4 described minimal CSS port + utility-rebuilt components, but Tasks 10/14–21 say "port markup/class names". Resolved by porting FULL prototype CSS into `@layer components` + `@theme inline` tokens (controller authored global.css, 1254 lines). theme.ts verbatim from plan (4 accents × 2 themes). Verified: theme tests pass, `npm run build` exit 0 (CSS compiles, 25kB emitted), test/lint/typecheck clean. Later component tasks apply prototype class names.
