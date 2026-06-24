# Task 6 Report: i18n (EN + FR)

## Status: DONE

## Commit
SHA: `06fc43e`
Message: `feat: add react-i18next with EN/FR resources`

## Files Created / Modified
- `src/lib/i18n/en.json` — English translations (verbatim from plan)
- `src/lib/i18n/fr.json` — French translations (verbatim from plan)
- `src/lib/i18n/config.ts` — `createI18n(locale)` using `i18next.createInstance()` (verbatim from plan)
- `src/lib/i18n/i18n.test.tsx` — test (verbatim from plan)
- `src/lib/i18n/locale.server.ts` — server-side locale helper (deviation, see below)
- `src/routes/__root.tsx` — wired `<I18nextProvider>`, `getLocale()`, `lang={locale}` on `<html>`

---

## i18n Test Output
```
npx vitest run src/lib/i18n/i18n.test.tsx
PASS (1) FAIL (0)
EXIT: 0
```

## Full Test Suite
```
npx vitest run
PASS (5) FAIL (0)
EXIT: 0
```

## Lint
```
npm run lint
> eslint .
EXIT: 0
```

## Typecheck
```
npm run typecheck
> tsc --noEmit
EXIT: 0
```

## Build
```
npm run build
> vite build
vite v8.1.0 building client environment for production...
✓ 143 modules transformed.
dist/client/assets/index-DQx4raQz.css   25.32 kB │ gzip:   6.22 kB
dist/client/assets/index-COKmSpb_.js   384.92 kB │ gzip: 120.94 kB
✓ built in 240ms
vite v8.1.0 building ssr environment for production...
✓ 47 modules transformed.
dist/server/server.js                                      63.12 kB │ gzip: 15.76 kB
✓ built in 128ms
EXIT: 0
```

---

## Deviations from Plan

### 1. `getLocale()` implementation — `createIsomorphicFn` + `locale.server.ts`

**Problem**: The plan said to use `typeof document !== 'undefined'` to branch client/server and import `getCookies` from `@tanstack/react-start/server` in the same file. However, `@tanstack/start-plugin-core` enforces a hard import-protection rule that blocks `@tanstack/react-start/server` from appearing in any file reachable by the client bundle — even guarded by a runtime check.

**Solution**: Used `createIsomorphicFn()` from `@tanstack/react-start` (the framework's own isomorphic API) with two separate implementations. The server branch does a dynamic `require()` of a new helper module `src/lib/i18n/locale.server.ts` which contains the `getCookies()` call. The `.server.ts` suffix signals to the bundler that this module is server-only, keeping the import out of the client bundle.

### 2. `html lang` set from locale

The `<html lang={locale}>` is set dynamically from the resolved locale (`'en'` or `'fr'`) rather than hard-coded `lang="en"`. This is strictly better (FR users get correct `lang` for accessibility/SEO) and aligns with the plan's parenthetical "or set it from locale — either is fine".

### 3. `resolveJsonModule` not needed

No `resolveJsonModule` was required. The project uses `"moduleResolution": "Bundler"` which handles JSON imports natively. No tsconfig change was made.
