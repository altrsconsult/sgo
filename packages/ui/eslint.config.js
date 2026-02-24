import js from '@eslint/js';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['dist', 'node_modules', '.storybook', 'stories'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
];
