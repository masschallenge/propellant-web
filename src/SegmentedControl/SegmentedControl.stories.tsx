import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SegmentedControl } from './SegmentedControl';
import { VStack } from '../../.storybook/stack';
import { appearance, events, hide, state } from '../../.storybook/controls';

const STAGES = [
  { id: 'application', label: 'Application' },
  { id: 'online', label: 'Online review' },
  { id: 'pitch', label: 'Pitch selection' },
  { id: 'cohort', label: 'Cohort' },
  { id: 'close', label: 'Close' },
];

const meta = {
  title: 'Components/Navigation/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Picks one of a few closely related views or filters. A white thumb springs to the chosen segment on a gray capsule track; corners stay concentric. Without panels it is a radio group (arrow keys select); with `controlsPanels` it is a tab list paired with `TabPanel`. Keep it to about five segments.',
          '',
          "Import: `import { SegmentedControl } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { items: STAGES, 'aria-label': 'Stage', size: 'md', onChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'], ...appearance },
    fullWidth: { control: 'inline-radio', options: [false, true, 'narrow'], ...appearance },
    controlsPanels: { control: 'boolean', ...state },
    onChange: { ...events },
    items: hide,
    className: hide,
  },
} satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <VStack>
      <SegmentedControl
        {...args}
        size="sm"
        aria-label="Range, small"
        items={[
          { id: 'day', label: 'Day' },
          { id: 'week', label: 'Week' },
          { id: 'month', label: 'Month' },
        ]}
      />
      <SegmentedControl
        {...args}
        aria-label="Range"
        items={[
          { id: 'day', label: 'Day' },
          { id: 'week', label: 'Week' },
          { id: 'month', label: 'Month' },
        ]}
      />
    </VStack>
  ),
};

export const WithCounts: Story = {
  args: {
    items: [
      { id: 'open', label: 'Open', meta: 12 },
      { id: 'acknowledged', label: 'Acknowledged', meta: 4 },
      { id: 'all', label: 'All' },
    ],
    'aria-label': 'Show alerts',
  },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  decorators: [
    (Story) => (
      <div style={{ width: 560 }}>
        <Story />
      </div>
    ),
  ],
};

export const Keyboard: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('radio', { name: 'Application' });
    await expect(first).toHaveAttribute('aria-checked', 'true');
    first.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('radio', { name: 'Online review' })).toHaveFocus();
    await expect(args.onChange).toHaveBeenCalledWith('online');
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('radio', { name: 'Close' })).toHaveFocus();
  },
};
