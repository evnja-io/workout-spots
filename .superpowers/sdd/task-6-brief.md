# Task 6: i18n (EN + FR)

Authoritative spec: `docs/superpowers/plans/2026-06-24-workout-spots-discover.md` lines 795–914 (Task 6). Reproduce the code verbatim from those lines.

## Files
- Create: `src/lib/i18n/config.ts`, `src/lib/i18n/en.json`, `src/lib/i18n/fr.json`, `src/lib/i18n/i18n.test.tsx`
- Modify: `src/routes/__root.tsx` (wrap `<Outlet/>` in `<I18nextProvider>`)

## Produces
`createI18n(locale: Locale): i18n`; `type Locale = 'en' | 'fr'`; `LOCALES`; namespaced keys (`common.*`, `discover.*`, …); a `getLocale()` helper.

- [ ] **Step 1: Install** — `npm i i18next react-i18next`
- [ ] **Step 2: Failing test** `src/lib/i18n/i18n.test.tsx` (verbatim plan 816–823): asserts `createI18n('en').t('discover.title')==='Discover'` and `createI18n('fr').t('discover.title')==='Découvrir'`.
- [ ] **Step 3: Run → fail.**
- [ ] **Step 4: Implement** `en.json` (plan 832–851), `fr.json` (plan 855–879), `config.ts` (plan 883–901: `createI18n` builds an isolated instance via `i18next.createInstance()`, `.use(initReactI18next).init({ lng, fallbackLng:'en', resources, interpolation:{escapeValue:false} })`, returns the instance). Importing JSON needs `resolveJsonModule` — tsconfig already allows it via `esModuleInterop`/bundler resolution; if a JSON import type error appears, add `"resolveJsonModule": true` to tsconfig compilerOptions (note it).
- [ ] **Step 5: Run → pass.**
- [ ] **Step 6: Wire provider in `__root.tsx`** — add a `getLocale(): Locale` helper: on the client read `document.cookie` for `lang` (default `'en'`); on the server read the request cookie via `@tanstack/react-start/server` `getCookies()` (same module Task 5's server.ts uses). Guard `typeof document !== 'undefined'` to branch client/server. Create the i18n instance from `getLocale()` and wrap `<Outlet/>` in `<I18nextProvider i18n={instance}>`. Keep `lang="en"` on `<html>` for now OR set it from locale — either is fine; note which.
- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: add react-i18next with EN/FR resources"`

## Global Constraints
- TS strict, zero `any`. Branch `feature/workout-spots-discover`. Mocks-first; never create a real `.env`.
- Keep `createI18n` returning a fresh instance (no shared global mutable state) so SSR is request-safe.

## Controller notes
- If a Bash/MCP call returns "temporarily unavailable" (transient outage), retry.
- VERIFY before reporting: i18n test passes, full `npm test` green, `npm run lint` clean, `npm run typecheck` clean, and `npm run build` exit 0 (confirms __root.tsx provider wiring + JSON imports compile under SSR).
- Report contract: write `/home/sephi/workout-spots/.superpowers/sdd/task-6-report.md` with Status, commit SHA+message, ACTUAL output of i18n test + full test + lint + typecheck + build, and any deviations (e.g. resolveJsonModule, html lang). Reply with the same. Real output only.
