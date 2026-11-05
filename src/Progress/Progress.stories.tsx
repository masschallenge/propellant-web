import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Progress, ProgressRing, ProgressCircle } from './Progress';
import { HStack, VStack, field } from '../../.storybook/stack';
import { appearance, content, hide } from '../../.storybook/controls';

const VALUE_POSITIONS = ['none', 'right', 'below', 'float-top', 'float-bottom'] as const;

const meta = {
  title: 'Components/Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  decorators: [field],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Linear determinate progress bar with five value placements and an optional label.',
          '',
          "Import: `import { Progress, ProgressRing, ProgressCircle } from '@masschallenge/propellant-web'`",
          '',
          'Companions: `ProgressRing` (donut, `RadialProgress` alias) and `ProgressCircle` (full or half gauge).',
        ].join('\n'),
      },
    },
  },
  args: { value: 60, valuePosition: 'right' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 }, ...content },
    valuePosition: { control: 'select', options: VALUE_POSITIONS, ...appearance },
    label: { control: 'text', ...content },
    'aria-label': { control: 'text', ...content },
    className: hide,
  },
} satisfies Meta<typeof Progress>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ValuePositions: Story = {
  render: (args) => (
    <VStack>
      {VALUE_POSITIONS.map((valuePosition) => (
        <Progress
          key={valuePosition}
          {...args}
          valuePosition={valuePosition}
          label={valuePosition}
        />
      ))}
    </VStack>
  ),
};

export const WithLabel: Story = { args: { label: 'Uploading', value: 40 } };

export const Tones: Story = {
  render: () => (
    <VStack>
      <Progress value={87} tone="success" label="Problem" />
      <Progress value={60} label="Go-To-Market" />
    </VStack>
  ),
};

export const Ring: Story = {
  render: (args) => (
    <HStack>
      <ProgressRing value={args.value} />
      <ProgressRing value={100} />
      <ProgressRing value={72} sublabel="submitted" />
    </HStack>
  ),
};

export const Circle: Story = {
  render: (args) => (
    <HStack>
      <ProgressCircle value={args.value} caption="Complete" />
      <ProgressCircle value={args.value} half caption="Score" />
    </HStack>
  ),
};

export const Values: Story = {
  args: { value: 42 },
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar');
    await expect(bar).toHaveAttribute('aria-valuenow', '42');
  },
};
