import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',   // fake browser so React components can render
    globals: true,           // no need to import describe/it/expect in every file
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['components/**/*.tsx'],
      exclude: ['components/**/*.test.tsx'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'), // matches your tsconfig @/* alias
    },
  },
});
