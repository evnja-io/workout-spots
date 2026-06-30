# Location-aware Map Centering — SDD progress

Plan: docs/superpowers/plans/2026-06-28-geolocation-map-centering.md
Mode: mocks-first; TanStack Start SSR; Vitest + jsdom
Branch: feat/geolocation-map-centering
Branch base for final review (merge-base main HEAD): cf2053c

## Tasks

- [x] Task 1: complete (commit 39c2290, review clean — spec ✅, quality approved)
- [x] Task 2: complete (commits f8d41d1..8f6d582, review clean — spec ✅, quality approved). DEVIATION: plan's test called getInitialMapCenter() directly, but createIsomorphicFn picks the server branch under vitest ("No StartEvent"). Fix: exported + unit-tested readClientInitialCenter() instead; isomorphic dispatch verified at integration (Task 5 build + SSR curl).
- [x] Task 3: complete (commit 53b179d, review clean — spec ✅, quality approved)
- [x] Task 4: complete (commit b280a75, review clean — spec ✅, quality approved). Deviation (sound): added beforeEach(vi.clearAllMocks()) in MapView.test describe for mock isolation; preserves implementations, doesn't affect the 2 existing tests.
- [x] Task 5: complete (commit 6856044, review clean — spec ✅, quality approved). Gates: typecheck 0, 215 tests pass, build 0, /spots SSR=200.

## Final whole-branch review (opus): no Critical; 1 Important (FIXED), minors deferred
- Important (FIXED, commit 426fab9): server IP-geo path getServerInitialCenter had no test — added location.server.test.ts (vi.mock @tanstack/react-start/server) asserting header names x-vercel-ip-latitude/longitude + [lng,lat] order + cookie/default branches. Also documented auto-fly one-shot semantics in MapView.
- Final state: 39 files / 218 tests pass, typecheck 0, build 0, /spots SSR 200. Ready to merge.
- Deferred minors (see below): #1 parseCoord trailing-junk, #2 cookie-attr test, #3 denial test negation, USER_ZOOM/PRECISE_ZOOM dup (intentional decoupling). All non-blocking.

## Minor findings (for final review triage)

- Task 3 (Minor, non-blocking): denial-test asserts `not.toContain('loc=2.')`; tightening to `not.toContain('loc=')` would express "writes no cookie" precisely. Safe as-is (beforeEach clears cookie, error path is a true no-op).
- Task 1 (non-blocking, both judged non-defects): parseCoord uses parseFloat (accepts trailing junk like "2.35abc"→2.35, unreachable from setLocationCookie output); setLocationCookie test verifies only the value, not path/max-age/samesite (those attrs aren't readable via document.cookie).
