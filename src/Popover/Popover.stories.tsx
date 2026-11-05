import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Popover } from './Popover';
import { appearance, content, hide } from '../../.storybook/controls';

const PANEL = (
  <>
    <span className="text-headline text-[var(--label)]">Priya Raman</span>
    <span className="text-subheadline text-[var(--label-secondary)]">
      Judge, Round 2 · Healthcare cohort
    </span>
    <a
      className="text-callout font-medium text-[var(--tint)] rounded-[var(--corner-sm)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)]"
      href="#priya"
    >
      Open judge profile
    </a>
  </>
);

const meta = {
  title: 'Components/Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Disclosure button that reveals a small labelled panel anchored under it. Closes on Escape (focus returns to the trigger) and on a press outside. Use Menu for lists of actions.',
          '',
          "Import: `import { Popover } from '@masschallenge/propellant-web'`",
        ].join('\n'),
        story: { height: '220px' },
      },
    },
  },
  args: { label: 'Priya Raman', panelLabel: 'Judge details', children: PANEL },
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'end'], ...appearance },
    label: { control: 'text', ...content },
    panelLabel: { control: 'text', ...content },
    children: hide,
    iconTrailing: hide,
    className: hide,
  },
  render: (args) => (
    <div style={{ minHeight: 200 }}>
      <Popover {...args} />
    </div>
  ),
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Open: Story = { args: { defaultOpen: true } };

export const Switch: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Priya Raman' });
    await userEvent.click(trigger);
    await expect(canvas.getByRole('group', { name: 'Judge details' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('group', { name: 'Judge details' })).toBeNull();
    await expect(trigger).toHaveFocus();
  },
};
