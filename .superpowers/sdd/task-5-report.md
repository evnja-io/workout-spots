# Task 5 Report

## Status: DONE

## Commit
SHA: `956c853`
Message: `feat: add Supabase types and browser/server client factories`

## Browser test output (singleton)
```
PASS (1) FAIL (0)
```

## Full `npm test` output
```
> workout-spots@1.0.0 test
> vitest run

 RUN  v4.1.9 /home/sephi/workout-spots

 Test Files  3 passed (3)
      Tests  4 passed (4)
   Start at  21:57:10
   Duration  535ms (transform 66ms, setup 142ms, import 31ms, tests 43ms, environment 1.09s)
```

## `npm run typecheck` output
```
> tsc --noEmit
(no errors — exit 0)
```

## `npm run lint` output
```
> eslint .
(no errors — exit 0)
```

## Tables typed in `src/lib/supabase/types.ts`
1. `users`
2. `locations`
3. `location_images`
4. `location_likes`
5. `location_comments`
6. `equipments`
7. `location_equipments`
8. `disciplines`
9. `location_disciplines`
10. `location_ratings` ← NOT in db.sql (dump incomplete); hand-authored per brief; `// TODO(db-access): confirm exact columns + average_rating trigger` comment added above the table entry

## Context7 adaptation to server cookie API

The plan snippet used:
```ts
getRequestHeaders().get('cookie')          // read cookies
setResponseHeaders([['set-cookie', ...]])  // write cookies (array syntax)
```

The actual `@tanstack/react-start/server` API (from `@tanstack/start-server-core`) is different:
- **Reading**: `getCookies(): Record<string, string>` — already parses the Cookie header
- **Writing**: `setCookie(name, value, options?)` — sets individual cookies directly; `setResponseHeader(name, value)` — sets arbitrary response headers
- `setResponseHeaders` (plural) takes `TypedHeaders<ResponseHeaderMap>`, not an array of tuples

`server.ts` was adapted to use `getCookies()` / `setCookie()` / `setResponseHeader()` directly. `getServerSupabase()` signature is unchanged. `cookies.ts` helpers (`parseCookies` / `serializeCookie`) remain in place for other callers.

## Files created
- `src/lib/supabase/types.ts` — hand-written `Database` interface + `Json` type
- `src/lib/supabase/browser.ts` — `getBrowserSupabase()` singleton via `createBrowserClient`
- `src/lib/supabase/server.ts` — `getServerSupabase()` via `createServerClient` with adapted tanstack cookie API
- `src/lib/supabase/cookies.ts` — `parseCookies()` / `serializeCookie()` helpers wrapping the `cookie` package
- `src/lib/supabase/browser.test.ts` — singleton test (stubs env via `vi.stubEnv`, no network calls)

## Packages installed
- `@supabase/supabase-js`, `@supabase/ssr`, `cookie` (prod)
- `@types/cookie` (dev)
