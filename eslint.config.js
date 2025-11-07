import js from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import storybookPlugin from 'eslint-plugin-storybook';
import vitest from '@vitest/eslint-plugin';
import cypress from 'eslint-plugin-cypress';
import globals from 'globals';

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '.storybook/**', '**/playwright-report/**'],
  },
  // Base configuration for all files
  {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        // Node globals
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        // Custom globals
        Set: 'readonly',
        Map: 'readonly',
        // React globals
        React: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // ESLint recommended rules
  js.configs.recommended,

  // Main configuration for source files
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['node_modules/**', 'dist/**', '.storybook', '*playwright-report'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
      storybook: storybookPlugin,
      import: importPlugin,
      '@typescript-eslint': typescriptPlugin,
    },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,

      // ESLint rules
      'no-unused-vars': 'off', // TypeScript 규칙을 사용하므로 끄기

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'none', // 함수 매개변수는 체크하지 않음
          varsIgnorePattern: '^_', // _로 시작하는 변수는 무시
          ignoreRestSiblings: true, // rest 매개변수 무시
        },
      ],

      // React rules
      'react/prop-types': 'off',
      ...reactHooksPlugin.configs.recommended.rules,

      // Import rules
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', ['parent', 'sibling'], 'index'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],

      // Prettier rules
      ...prettierConfig.rules,
      'prettier/prettier': 'error',

      // Storybook rules
      ...storybookPlugin.configs.recommended.rules,
    },
  },

  // Test files configuration (Vitest)
  {
    files: [
      '**/src/**/*.{spec,test}.{ts,tsx}',
      '**/__mocks__/**/*.{ts,tsx}',
      './src/setupTests.ts',
      './src/__tests__/utils.ts',
    ],
    ...vitest.configs.recommended,
    plugins: {
      ...(vitest.configs.recommended.plugins ?? {}),
      vitest: vitest,
    },
    rules: {
      ...(vitest.configs.recommended.rules ?? {}),
      'vitest/expect-expect': 'off',
      // TypeScript 미사용 변수 규칙
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'none', // 함수 매개변수는 체크하지 않음
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
    languageOptions: {
      globals: {
        globalThis: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
  },

  // Cypress 전용
  {
    files: ['cypress/**/*.{cy,spec}.ts', 'cypress/**/*.ts'],
    plugins: { cypress },
    languageOptions: {
      globals: {
        ...globals.browser,
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
        context: 'readonly',
        JQuery: 'readonly',
      },
    },
    rules: {
      // 기본 ESLint 규칙들
      'no-unused-vars': 'off',
      'no-undef': 'off',

      // TypeScript 규칙들
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'none', // 함수 매개변수는 체크하지 않음
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // Cypress 특정 규칙들
      'cypress/no-unnecessary-waiting': 'warn',
      'cypress/unsafe-to-chain-command': 'warn',
    },
  },
];
