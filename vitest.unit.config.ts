import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'unit',
    environment: 'jsdom',
    globals: true,
    dangerouslyIgnoreUnhandledErrors: true,
    setupFiles: [path.join(dirname, 'vitest.setup.ts')],
    testTimeout: 15000,
    env: {
      TZ: 'UTC',
    },
    include: ['src/**/*.test.{ts,tsx}', 'site/**/*.test.{ts,tsx}', 'scripts/**/*.test.mjs'],
  },
});
