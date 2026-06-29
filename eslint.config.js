import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  // src/lib/supabase/types.ts is `supabase gen types` output (regenerated, not
  // hand-edited); like routeTree.gen.ts it's excluded from type-aware linting,
  // whose heavy generics otherwise exhaust the heap on the generated file.
  { ignores: ['.output', 'dist', 'scripts', 'src/routeTree.gen.ts', 'src/lib/supabase/types.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.js'],
        },
      },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      // TanStack Router uses `throw redirect(...)` which is not an Error instance
      '@typescript-eslint/only-throw-error': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
)
