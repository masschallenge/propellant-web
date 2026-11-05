import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  staticDirs: ['../assets'],
  managerHead: (head) => `${head}
    <style>
      @font-face { font-family: 'Propellant Sans'; font-weight: 400; font-display: swap; src: url('./fonts/propellant-sans-400-latin.woff2') format('woff2'); }
      @font-face { font-family: 'Propellant Sans'; font-weight: 600; font-display: swap; src: url('./fonts/propellant-sans-600-latin.woff2') format('woff2'); }
      @font-face { font-family: 'Propellant Sans'; font-weight: 700; font-display: swap; src: url('./fonts/propellant-sans-700-latin.woff2') format('woff2'); }
    </style>`,
  viteFinal: async (viteConfig) => {
    const { default: tailwindcss } = await import('@tailwindcss/vite');
    viteConfig.plugins = viteConfig.plugins ?? [];
    viteConfig.plugins.push(tailwindcss());
    return viteConfig;
  },
};

export default config;
