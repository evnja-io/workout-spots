# Task 2 Report: Lint, format, and `no-any` enforcement

**Status: DONE**

## Commit

SHA: `6decd43`
Message: `chore: add eslint (no-any) and prettier`
Branch: `feature/workout-spots-discover`

## Files Created / Modified

- **Created**: `eslint.config.js`
- **Created**: `.prettierrc`
- **Modified**: `package.json` (added `lint` and `format` scripts)
- **Installed**: `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `prettier` (devDependencies)
- **Prettier formatting side-effects**: `src/router.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx`, docs markdown files — all included in same commit per brief instructions.

## Proof: no-any rule fires

Temporarily added `const x: any = 1` to `src/router.tsx`, ran `npm run lint`:

```
> eslint .

/home/sephi/workout-spots/src/router.tsx
  2:7   error  'x' is assigned a value but never used    @typescript-eslint/no-unused-vars
  2:10  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

✖ 2 problems (2 errors, 0 warnings)
```

The `@typescript-eslint/no-explicit-any` rule fired with **"Unexpected any. Specify a different type"**.

## Proof: lint passes clean after removal

After removing the temp line:

```
> eslint .
```

(exit code 0, no output — clean)

## Deviations from Brief

1. **`allowDefaultProject` added**: The flat-config `projectService: true` caused ESLint to error on `eslint.config.js` itself (not in tsconfig include). Fixed by using `projectService: { allowDefaultProject: ['eslint.config.js'] }`.

2. **`@typescript-eslint/only-throw-error: 'off'`**: The scaffold's `src/routes/index.tsx` uses `throw redirect(...)` which is a TanStack Router pattern. The `recommendedTypeChecked` ruleset includes `only-throw-error` which rejects non-Error throws. Turned this rule off to keep the scaffold passing. The critical gate (`no-explicit-any`) is unaffected.

3. **Prettier reformatted scaffold source files**: `src/router.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx` were reformatted (interface brace expansion, minor whitespace). Brief permits this — included in the same commit.
