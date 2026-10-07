import js from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist',
      'build',
      'coverage',
      'playwright-report',
      'test-results',
      'public',
      'src/app/routeTree.gen.ts',
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.strict, ...tseslint.configs.stylistic],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      // The rule only special-cases `void` inside a type reference (e.g. `Promise<void>`),
      // not as an explicit type argument on a call expression (e.g. `useMutation<void, E>(...)`),
      // which is a standard, valid TanStack Query pattern for mutations with no return value.
      '@typescript-eslint/no-invalid-void-type': 'off',
    },
  },
  {
    files: ['**/*.config.{js,ts}', 'playwright.config.ts', 'lighthouse/**/*.{js,mjs}'],
    languageOptions: { globals: globals.node },
  },
)
