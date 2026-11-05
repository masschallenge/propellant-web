import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath } from 'node:url';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

const dirname = fileURLToPath(new URL('.', import.meta.url));

const STORYBOOK_PREBUNDLED_DEPENDENCIES = [
  'react',
  'react-dom',
  'react-dom/client',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  '@storybook/react',
  '@storybook/react-vite',
  '@storybook/react-dom-shim',
  '@storybook/addon-a11y/preview',
  '@storybook/addon-docs/preview',
  '@storybook/addon-vitest/internal/setup-file-with-project-annotations',
  '@storybook/addon-vitest/internal/setup-file',
  '@storybook/addon-vitest/internal/setup-file.browser.4',
  'storybook/test',
  'storybook/preview-api',
  'axe-core',
];
const fileCache = new Map<string, boolean>();

const isFile = (file: string) => {
  const cached = fileCache.get(file);
  if (cached !== undefined) return cached;
  let ok = false;
  try {
    ok = existsSync(file) && statSync(file).isFile();
  } catch {
    ok = false;
  }
  fileCache.set(file, ok);
  return ok;
};

// TODO: vitest browser importFile omits /@fs/ on Unix (only prepends it for /^\w:/). Vite 8 then 404s the root-relative URL. Remove when vitest prefixes Unix abs paths.
const unixAbsModule = (): Plugin => ({
  name: 'propellant-unix-abs-module',
  enforce: 'pre',
  resolveId: (id) => {
    const stripped = id.startsWith('/@fs/') ? id.slice(5) : id;
    const file = stripped.replace(/[?#].*$/, '');
    if (
      file.length < 2 ||
      file[0] !== '/' ||
      file.startsWith('/@') ||
      file.startsWith('/__vitest')
    ) {
      return;
    }
    if (isFile(file)) return file;
  },
});

export default defineConfig({
  plugins: [unixAbsModule()],
  server: {
    host: '127.0.0.1',
    fs: { strict: false },
  },
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/__tests__/**', 'src/**/*.stories.tsx'],
      reporter: ['text-summary', 'lcov'],
      thresholds: { lines: 70, statements: 68, functions: 62, branches: 62 },
    },
    projects: [
      {
        extends: true,
        plugins: [unixAbsModule(), storybookTest({ configDir: path.join(dirname, '.storybook') })],
        resolve: { dedupe: ['react', 'react-dom'] },
        // Pre-bundled up front: a dependency Vite discovers mid-run makes it
        // re-bundle, and modules already requested under the old hash then
        // fail with "Failed to fetch dynamically imported module".
        optimizeDeps: { include: STORYBOOK_PREBUNDLED_DEPENDENCIES },
        test: {
          name: 'storybook',
          testTimeout: 60000,
          // One worker in CI: parallel browser projects race Vite's dep
          // optimizer and flake with "Failed to fetch dynamically imported
          // module" on heavier stories (AuthLayout) and neighbors.
          maxWorkers: process.env.CI ? 1 : undefined,
          retry: process.env.CI ? 2 : 0,
          setupFiles: [path.join(dirname, '.storybook/vitest.setup.ts')],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            api: { host: '127.0.0.1' },
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
