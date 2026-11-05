import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TabBar, TabPanel } from './TabBar';
import { appearance, events, hide } from '../../.storybook/controls';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'applicants', label: 'Applicants', meta: 128 },
  { id: 'judges', label: 'Judges', badge: 3 },
  { id: 'schedule', label: 'Schedule' },
];

const meta = {
  title: 'Components/Navigation/TabBar',
  component: TabBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Switches between sections of one page, with a teal indicator under the current tab and a hairline under the bar. Pair each tab with a `TabPanel`. For a filter or a small choice of views inside a toolbar, use `SegmentedControl` instead.',
          '',
          "Import: `import { TabBar, TabPanel } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { id: 'round', items: SECTIONS, 'aria-label': 'Round sections', onChange: fn() },
  argTypes: {
    vertical: { control: 'boolean', ...appearance },
    fullWidth: { control: 'boolean', ...appearance },
    onChange: { ...events },
    items: hide,
    className: hide,
  },
} satisfies Meta<typeof TabBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar {...args} />
      <TabPanel tabsId="round" value="overview">
        <p className="m-0 text-body text-[var(--label-secondary)]">Overview of the round.</p>
      </TabPanel>
    </div>
  ),
};

export const Vertical: Story = { args: { vertical: true } };

export const Keyboard: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('tab', { name: 'Overview' });
    first.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: /Applicants/ })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onChange).toHaveBeenCalledWith('applicants');
  },
};
