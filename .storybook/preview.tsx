import type { Preview } from '@storybook/react-vite';
import './preview.css';

const sweepOrphanPortals = () =>
  document.body.querySelectorAll(':scope > [data-propellant]').forEach((node) => node.remove());

const hot = (import.meta as { hot?: { on: (event: string, handler: () => void) => void } }).hot;
if (hot) hot.on('vite:beforeUpdate', sweepOrphanPortals);

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Propellant theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'Match system' },
        ],
        dynamicTitle: true,
      },
    },
  },
  beforeEach: () => () => {
    queueMicrotask(sweepOrphanPortals);
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'light';
      if (typeof document !== 'undefined') {
        if (theme === 'system') document.documentElement.removeAttribute('data-theme');
        else document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-propellant', '');
      }
      return (
        <div
          data-propellant
          data-appearance={theme === 'system' ? 'system' : undefined}
          key={context.id}
        >
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    layout: 'centered',
    a11y: {
      test: 'todo',
      options: { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } },
    },
    docs: {
      toc: true,
      source: { excludeDecorators: true },
      canvas: { layout: 'padded' },
      story: { inline: false, height: '200px' },
    },
    options: {
      storySort: { order: ['Foundations', 'Components', 'Patterns'], method: 'alphabetical' },
    },
  },
};

export default preview;
