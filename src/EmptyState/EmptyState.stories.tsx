import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { EmptyState } from './EmptyState';
import { Button } from '../Button/Button';
import { VStack } from '../../.storybook/stack';
import { appearance, content, hide } from '../../.storybook/controls';
import { icons, iconOptions } from '../../.storybook/icons';

const VISUALS = [
  'icon',
  'illustration',
  'file',
  'avatar-radius',
  'avatar-row',
  'avatar-grid',
] as const;

const AVATARS = [
  '/avatars/avatar-1.svg',
  '/avatars/avatar-2.svg',
  '/avatars/avatar-3.svg',
  '/avatars/avatar-4.svg',
  '/avatars/avatar-5.svg',
  '/avatars/avatar-6.svg',
];

const TILES = [
  { src: AVATARS[0] },
  { icon: icons.plus, brand: true },
  { src: AVATARS[1] },
  { icon: icons.search },
  { src: AVATARS[2] },
  { icon: icons.check, brand: true },
];

const meta = {
  title: 'Components/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Placeholder for empty views: a plain symbol in tertiary label, a title in title 3, a short description in secondary callout, and actions.',
          'No rings, halos or tinted boxes. The `visual` prop picks the symbol (search, file) or a quiet row of avatars or tiles; `rings` and `live` are accepted and render the same calm layout.',
          '',
          "Import: `import { EmptyState } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    title: 'No applications yet',
    description: 'Applications appear here as soon as founders submit them.',
    visual: 'icon',
    framed: true,
    icon: 'none',
  },
  argTypes: {
    visual: { control: 'select', options: VISUALS, ...appearance },
    rings: hide,
    live: hide,
    framed: { control: 'boolean', ...appearance },
    icon: { control: 'select', options: iconOptions, mapping: icons, ...content },
    title: { control: 'text', ...content },
    description: { control: 'text', ...content },
    avatars: hide,
    tiles: hide,
    actions: hide,
    className: hide,
  },
} satisfies Meta<typeof EmptyState>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Visuals: Story = {
  render: (args) => (
    <VStack>
      {VISUALS.map((visual) => (
        <EmptyState
          key={visual}
          {...args}
          visual={visual}
          title={visual}
          avatars={AVATARS}
          tiles={TILES}
        />
      ))}
    </VStack>
  ),
};

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button variant="gray">Import from CSV</Button>
        <Button iconLeading={icons.plus}>Invite judges</Button>
      </>
    ),
  },
};

export const Unframed: Story = { args: { framed: false } };
export const Waiting: Story = {
  args: {
    live: true,
    title: 'Your panel queue is empty',
    description: 'Panels you are assigned to show up here.',
  },
};

export const HasHeading: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    const heading = within(canvasElement).getByRole('heading', { name: args.title });
    await expect(heading).toBeVisible();
  },
};
