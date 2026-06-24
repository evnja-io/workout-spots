# Task 2: Lint, format, and `no-any` enforcement

Authoritative spec: `docs/superpowers/plans/2026-06-24-workout-spots-discover.md` lines 244–305 (Task 2). Follow it verbatim. Summary below for convenience.

**Files:**

- Create: `eslint.config.js`, `.prettierrc`
- Modify: `package.json` (add `lint` + `format` scripts)

**Produces:** `npm run lint` that fails on any `any`; `npm run format`.

## Steps

1. **Install**

   ```bash
   npm i -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks prettier
   ```

2. **`eslint.config.js`** (flat config):

   ```js
   import js from '@eslint/js'
   import tseslint from 'typescript-eslint'
   import reactHooks from 'eslint-plugin-react-hooks'

   export default tseslint.config(
     { ignores: ['.output', 'dist', 'src/routeTree.gen.ts'] },
     js.configs.recommended,
     ...tseslint.configs.recommendedTypeChecked,
     {
       languageOptions: { parserOptions: { projectService: true } },
       plugins: { 'react-hooks': reactHooks },
       rules: {
         '@typescript-eslint/no-explicit-any': 'error',
         'react-hooks/rules-of-hooks': 'error',
         'react-hooks/exhaustive-deps': 'warn',
       },
     },
   )
   ```

3. **`.prettierrc`**: `{ "semi": false, "singleQuote": true, "trailingComma": "all", "printWidth": 100 }`

4. **Add scripts** to package.json:

   ```json
   "lint": "eslint .",
   "format": "prettier --write ."
   ```

5. **Prove the rule fires**: temporarily add `const x: any = 1` to `src/router.tsx`, run `npm run lint`, confirm error `Unexpected any`. Remove the line; confirm `npm run lint` passes clean on the existing scaffold.

6. **Commit**: `git add -A && git commit -m "chore: add eslint (no-any) and prettier"`

## Global Constraints

- TypeScript strict; zero `any` in authored code. `@typescript-eslint/no-explicit-any: error` is the gate.
- Do NOT run `prettier --write .` and reformat existing committed scaffold files into a noisy diff unless they already conform — if formatting changes scaffold files, that's acceptable but keep it in this commit and note it. Prefer: verify `npm run format` works, but only commit intended config + any consequent formatting.
- Branch `feature/workout-spots-discover`. Mocks-first; never create a real `.env`.
- `recommendedTypeChecked` requires `projectService: true` to find tsconfig — confirm lint actually type-checks (it will be slower). If the flat-config API for `typescript-eslint` differs from the snippet in the current installed version, consult context7 (resolve `typescript-eslint`, query "flat config recommendedTypeChecked projectService") and adapt, keeping the `no-explicit-any: error` rule.

## Controller notes

- If a Bash/MCP call returns "temporarily unavailable" (transient platform classifier outage), just retry.
- Report contract: write `/home/sephi/workout-spots/.superpowers/sdd/task-2-report.md` with Status, commit SHA(s)+message, the ACTUAL output proving no-any fires (the lint error on the temp line) and that lint passes clean after removal, and any deviations. Reply to me with the same. Your final message is the data I consume — include real command output.
