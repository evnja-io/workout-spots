# Task 4: Theme/accent helpers + verify global styles build

Authoritative spec: `docs/superpowers/plans/2026-06-24-workout-spots-discover.md` lines 462–682 (Task 4).

**Controller has already written `src/styles/global.css`** — the full prototype CSS ported into Tailwind v4 structure: `@import 'tailwindcss'`, `:root`/`[data-theme="dark"]` token blocks (incl. shadows), `@theme inline` token→utility mapping, `@layer base` resets, `@layer components` with all prototype component classes, keyframes, dark-mode overrides, and Mapbox overrides. DO NOT rewrite global.css. You only verify it compiles (see Step 4).

**Architecture note (deliberate deviation from plan's minimal-port wording):** the plan's Task 4 text described porting only ~5 bespoke pieces and rebuilding components as pure utilities, but Tasks 10/14–21 say "port markup / use prototype class names." Controller resolved this conflict by porting the FULL component CSS into `@layer components` while ALSO exposing tokens via `@theme inline`. Net: later component tasks apply the prototype class names; utilities remain available. This preserves the approved prototype look exactly. (This is already done — just be aware.)

## Your work

### Files
- Create: `src/features/theme/theme.ts`, `src/features/theme/theme.test.ts`
- Modify: `src/routes/__root.tsx` (global.css is already imported there from Task 1 — confirm; set a default `data-theme` is NOT required here, leave SSR default to light. Do not over-engineer.)

### Produces
`applyTheme(theme)`, `applyAccent(key, theme)`, `ACCENTS`, types `Theme='light'|'dark'`, `AccentKey='violet'|'slate'|'emerald'|'rose'`.

- [ ] **Step 1: Failing test** — `src/features/theme/theme.test.ts` (verbatim from plan lines 477–496):
  ```ts
  import { describe, expect, it, beforeEach } from 'vitest'
  import { ACCENTS, applyAccent, applyTheme } from './theme'

  describe('theme', () => {
    beforeEach(() => {
      document.documentElement.removeAttribute('data-theme')
      document.documentElement.removeAttribute('style')
    })
    it('sets data-theme', () => {
      applyTheme('dark')
      expect(document.documentElement.dataset.theme).toBe('dark')
    })
    it('sets accent css vars', () => {
      applyAccent('violet', 'dark')
      expect(document.documentElement.style.getPropertyValue('--accent')).toBe(
        ACCENTS.violet.dark.accent,
      )
    })
  })
  ```

- [ ] **Step 2: Run → fail** (`npx vitest run src/features/theme/theme.test.ts`, module not found).

- [ ] **Step 3: Implement `src/features/theme/theme.ts`** — copy VERBATIM from the plan lines 503–588. It defines `Theme`, `AccentKey`, `Palette`, the full `ACCENTS` record (violet/slate/emerald/rose × light/dark — all four palettes are in the plan, lines 510–575), `applyTheme` (sets `document.documentElement.dataset.theme`), and `applyAccent` (sets `--accent`, `--accent-2`, `--accent-soft`, `--accent-softer`, `--accent-fg`). Read those exact lines from the plan file and reproduce them. Zero `any`.

- [ ] **Step 4: Run → pass + VERIFY TAILWIND BUILD.**
  - `npx vitest run src/features/theme/theme.test.ts` → pass.
  - Confirm the new global.css compiles under Tailwind v4: run `npm run build` and confirm it completes with exit 0 and no CSS/PostCSS errors (this is the real check that `@theme inline` + `@layer` syntax is valid). If `@theme inline` errors, consult context7 (resolve `Tailwind CSS`, query "v4 @theme inline @layer components") and fix ONLY the offending syntax in global.css, noting the change. Do not strip the ported component styles.
  - Also run full `npm test`, `npm run lint`, `npm run typecheck` → all clean.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: port global styles and theme/accent helpers"`

## Global Constraints
- TS strict, zero `any`. Branch `feature/workout-spots-discover`. Mocks-first; never create a real `.env`.
- `__root.tsx` already does `import '~/styles/global.css'` (Task 1). Just confirm it's present; if missing, add it.

## Controller notes
- If a Bash/MCP call returns "temporarily unavailable" (transient outage), retry.
- Report contract: write `/home/sephi/workout-spots/.superpowers/sdd/task-4-report.md` with Status, commit SHA+message, ACTUAL output of: the theme test, `npm run build` (the Tailwind compile check), `npm test`, `npm run lint`, `npm run typecheck`, plus any CSS syntax fix you had to make. Reply to me with the same. Real output only.
