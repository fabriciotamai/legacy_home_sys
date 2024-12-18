import typescriptParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  ignorePatterns: ['node_modules/**', 'dist/**'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint', 'prettier'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
      rules: {
        'no-unused-vars': 'warn',
        'no-console': 'off',
        '@typescript-eslint/no-unused-vars': ['warn'],
        'prettier/prettier': 'error',
        'max-len': ['warn', { code: 120, ignoreStrings: true }],
      },
    },
  ],
};

export default config;
