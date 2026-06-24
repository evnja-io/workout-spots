# Task 3 Report: Test Harness (Vitest + RTL + MSW + Mapbox mock)

## Status: DONE

## Commit
SHA: `ee58d92`
Message: `test: add vitest + RTL + MSW + mapbox mock harness`

## Files Created
- `vitest.config.ts`
- `src/test/setup.ts`
- `src/test/msw/handlers.ts`
- `src/test/msw/server.ts`
- `src/test/mapbox-mock.ts`
- `src/test/sanity.test.ts`

## Files Modified
- `package.json` (added `test` and `test:watch` scripts)

## Actual Command Output

### `npm test`
```
> workout-spots@1.0.0 test
> vitest run

The plugin "vite-tsconfig-paths" is detected. Vite now supports tsconfig paths resolution natively via the resolve.tsconfigPaths option. You can remove the plugin and set resolve.tsconfigPaths: true in your Vite config instead.

 RUN  v4.1.9 /home/sephi/workout-spots


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  21:00:55
   Duration  465ms (transform 24ms, setup 57ms, import 5ms, tests 3ms, environment 328ms)
```

### `npm run lint`
```
> eslint .

(no output — clean)
```

### `npm run typecheck`
```
> tsc --noEmit

(no output — clean)
```

## Deviations
None. All files copied verbatim from plan lines 394–433. MSW version installed was 2.14.6 (v2 API used as specified).

The vite-tsconfig-paths advisory message in `npm test` output is a non-fatal informational note from the plugin itself (not an error); lint and typecheck are fully clean.
