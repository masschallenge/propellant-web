import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { artifactPagePlugin, siteDataPlugin } from './tooling/site-data-plugin';

const siteDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(siteDir, '..');

export default defineConfig({
  root: siteDir,
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    siteDataPlugin(packageDir),
    artifactPagePlugin({
      fileName: 'propellant.html',
      title: 'Propellant',
      description:
        'Propellant, the MassChallenge design system for the web: brand, foundations, tokens, components and patterns.',
    }),
  ],
  resolve: {
    alias: {
      'storybook/test': path.join(siteDir, 'tooling/story-test-shim.ts'),
    },
  },
  build: {
    outDir: path.join(siteDir, 'dist'),
    emptyOutDir: true,
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 4000,
  },
});
