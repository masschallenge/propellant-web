import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Spinner, DotSpinner } from './Spinner';
import { HStack } from '../../.storybook/stack';
import { appearance, content, hide } from '../../.storybook/controls';

const SIZES = ['sm', 'md', 'lg', 'xl'] as const;

const meta = {
  title: 'Components/Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Indeterminate loading mark: a tint arc on a quiet track. Four sizes, an optional label in secondary text, a thicker stroke, and a longer arc. It keeps spinning under reduced motion, since the motion is the message.',
          '',
          "Import: `import { Spinner, DotSpinner } from '@masschallenge/propellant-web'`",
          '',
          'Companion: `DotSpinner` is the quieter ten dot chase. Both announce with `role="status"`.',
        ].join('\n'),
      },
    },
  },
  args: { size: 'md', thick: false, longArc: false },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES, ...appearance },
    thick: { control: 'boolean', ...appearance },
    longArc: { control: 'boolean', ...appearance },
    label: { control: 'text', ...content },
    className: hide,
  },
} satisfies Meta<typeof Spinner>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <HStack>
      {SIZES.map((size) => (
        <Spinner key={size} {...args} size={size} />
      ))}
    </HStack>
  ),
};

export const WithLabel: Story = { args: { label: 'Loading results' } };
export const Thick: Story = { args: { thick: true, size: 'lg' } };
export const LongArc: Story = { args: { longArc: true, size: 'lg' } };

export const Dots: Story = {
  render: (args) => <DotSpinner size={args.size} label={args.label} />,
  args: { label: 'Syncing judge scores' },
};

export const Labelled: Story = {
  args: { label: 'Loading results' },
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status');
    await expect(status).toHaveTextContent('Loading results');
  },
};
