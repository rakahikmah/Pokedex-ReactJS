import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react'; // <-- 1. Import plugin react
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react, // <-- 2. Daftarkan plugin di sini
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Menggabungkan aturan yang direkomendasikan dari semua plugin
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules, // <-- 3. Terapkan aturan rekomendasi React
      ...reactHooks.configs['recommended-latest'].rules,
      ...reactRefresh.configs.vite.rules,

      // --- Di bawah ini adalah kustomisasi Anda ---
      'react/prop-types': 'off', // <-- 4. Matikan aturan prop-types
      'react/react-in-jsx-scope': 'off', // <-- 5. Matikan aturan react-in-jsx-scope

      // Aturan bawaan Anda tetap di sini
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
    },
    settings: {
        react: {
            version: 'detect' // <-- 6. Penting agar tidak ada warning versi React
        }
    }
  },
]);