import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { ignores: ['dist/**', 'node_modules/**'] },
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  }
);
