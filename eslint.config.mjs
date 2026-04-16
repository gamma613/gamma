// @ts-check

import js from '@eslint/js';
import next from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { importX } from 'eslint-plugin-import-x';
import perfectionist from 'eslint-plugin-perfectionist';
import prettier from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactHooksAddons from 'eslint-plugin-react-hooks-addons';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

const { configs: nextPlugin } = next;

// ----------------------------------------------------------------------

export default defineConfig([
  // Globally ignored files
  globalIgnores([
    '**/node_modules/*',
    '**/out/*',
    '**/.next/*',
    '**/.content-collections/*',
    'next-env.d.ts',
    'storybook-static/*',
    // Unused stuff from SRC, for which we've removed dependencies.
    // NOTE: these also need be added to the "exclude" section of tsconfig.json
    // currently none
  ]),

  // Baseline presets
  /** @type any */ (importX.flatConfigs.recommended),
  /** @type any */ (importX.flatConfigs.typescript),
  js.configs.recommended,
  nextPlugin['core-web-vitals'],
  reactHooksAddons.configs.recommended,
  reactPlugin.configs.flat.recommended,

  // Global block
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],

    plugins: {
      next,
      perfectionist,
      prettier,
      'react-hooks': /** @type {any} */ (reactHooksPlugin),
      'unused-imports': /** @type {any} */ (reactHooksPlugin),
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          // Always try to resolve types under `<root>@types` directory even if it doesn't contain any source code, like `@types/unist`
          alwaysTryTypes: true,
        }),
      ],
    },
    rules: {
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      'func-names': ['warn', 'as-needed'],
      'import-x/no-duplicates': 'error',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/order': 'off',
      // 'perfectionist/sort-imports': [
      //   'warn',
      //   {
      //     // Keep package imports above app-internal aliases, and relative imports last.
      //     type: 'alphabetical',
      //     order: 'asc',
      //     fallbackSort: {
      //       type: 'unsorted',
      //     },
      //     ignoreCase: true,
      //     sortBy: 'path',
      //     internalPattern: ['^src/.+'],
      //     partitionByComment: false,
      //     partitionByNewLine: false,
      //     newlinesBetween: 0,
      //     newlinesInside: 0,
      //     groups: [
      //       ['type-builtin', 'value-builtin'],
      //       ['type-external', 'value-external'],
      //       ['type-internal', 'value-internal'],
      //       [
      //         'type-parent',
      //         'type-sibling',
      //         'type-index',
      //         'value-parent',
      //         'value-sibling',
      //         'value-index',
      //       ],
      //       'ts-equals-import',
      //       'unknown',
      //     ],
      //   },
      // ],
      // 'perfectionist/sort-named-imports': [
      //   'warn',
      //   {
      //     type: 'alphabetical',
      //     order: 'asc',
      //     ignoreCase: true,
      //   },
      // ],
      'perfecitonist-sort-imports': 'off',
      'perfecitonist-sort-named-imports': 'off',
      'import-x/prefer-default-export': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/control-has-associated-label': 'off',
      'no-alert': 'off',
      'no-console': 'off',
      'no-nested-ternary': 'warn',
      'no-param-reassign': 'off',
      'no-promise-executor-return': 'off',
      'no-restricted-exports': 'off',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              // selected auth provider is re-exported by parent auth folder
              name: 'src/modules/auth/selected-provider',
            },
          ],
          patterns: [
            // auth providers should only be exposed by `selected-provider`
            'src/modules/auth/providers/*',
          ],
        },
      ],
      'no-undef': 'off',
      'no-underscore-dangle': 'off',
      'no-unused-vars': [
        'error',
        {
          // allow unused vars in function args
          args: 'none',
          // allow unused vars in `catch()`
          caughtErrors: 'none',
        },
      ],
      'prefer-destructuring': [
        'warn',
        {
          array: false,
          object: true,
        },
      ],
      'react/function-component-definition': 'off',
      'react/jsx-no-duplicate-props': [
        'warn',
        {
          ignoreCase: false,
        },
      ],
      'react/jsx-no-useless-fragment': [
        'warn',
        {
          allowExpressions: true,
        },
      ],
      'react/jsx-props-no-spreading': 'off',
      'react/no-array-index-key': 'off',
      'react/no-children-prop': 'off',
      'react/no-danger': 'error',
      'react/display-name': 'off',
      'react/no-unstable-nested-components': [
        'error',
        {
          allowAsProps: true,
        },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
    },
  },

  // TypeScript overrides
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': /** @type {any} */ (tsPlugin),
    },
    rules: {
      // Turn off core rules that clash
      'no-unused-vars': 'off',

      // Turn on TS-aware versions
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          // allow unused vars in function args
          args: 'none',
          // allow unused vars in `catch()`
          caughtErrors: 'none',
        },
      ],
    },
  },
]);
