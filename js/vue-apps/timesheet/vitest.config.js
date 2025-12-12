import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '*.config.js',
        'main.js',
        'index.html',
        'stores/**' // Store тестируется через интеграционные тесты
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70
      }
    },
    include: ['tests/**/*.spec.js', 'tests/**/*.test.js'],
    setupFiles: ['./tests/setup.js']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.')
    }
  }
});

