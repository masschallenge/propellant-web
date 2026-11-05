import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PopUpButton } from './PopUpButton';
import { appearance, content, events, hide, state } from '../../.storybook/controls';

const options = [
  { value: 'round-1', label: 'Round 1' },
  { value: 'round-2', label: 'Round 2' },
  { value: 'finals', label: 'Finals', disabled: true },
];

const meta = {
  title: 'Components/Inputs/PopUpButton',
  component: PopUpButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Pop-up button on the field shell with an up and down chevron. Opens a portalled listbox on the elevated surface (never clipped by overflow) where the highlighted row fills with the tint and the chosen row carries a check. Keyboard: arrows to move, type to jump, Enter to choose, Escape to close. Pass `tagValues` for the token variant.',
          '',
          "Import: `import { PopUpButton } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
      canvas: { layout: 'padded' },
      story: { height: '480px' },
    },
  },
  args: { label: 'Judging round', placeholder: 'Choose a round', options, onChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'], ...appearance },
    disabled: { control: 'boolean', ...state },
    invalid: { control: 'boolean', ...state },
    required: { control: 'boolean', ...state },
    label: { control: 'text', ...content },
    hint: { control: 'text', ...content },
    placeholder: { control: 'text', ...content },
    onChange: { ...events },
    className: hide,
  },
} satisfies Meta<typeof PopUpButton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Invalid: Story = { args: { invalid: true, hint: 'Choose a round to continue' } };
export const Disabled: Story = { args: { disabled: true } };
export const WithDescriptions: Story = {
  args: {
    label: 'Recommendation',
    value: 'maybe',
    tone: 'warning',
    options: [
      { value: 'advance', label: 'Advance', description: 'Strong fit, move to the next round' },
      { value: 'maybe', label: 'Maybe', description: 'Needs a second look' },
      { value: 'decline', label: 'Do not advance', description: 'Not a fit this cycle' },
    ],
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 max-w-80">
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <PopUpButton key={size} {...args} size={size} label={`Size ${size}`} value="round-2" />
      ))}
    </div>
  ),
};

export const Tags: Story = {
  args: {
    label: 'Industries',
    placeholder: 'Add an industry',
    tagValues: ['health', 'climate'],
    options: [
      { value: 'health', label: 'Healthcare' },
      { value: 'climate', label: 'Climate' },
      { value: 'fintech', label: 'Fintech' },
      { value: 'edtech', label: 'Education' },
    ],
  },
};

export const OpenAndSelect: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('combobox'));
    const listbox = await within(document.body).findByRole('listbox');
    await expect(listbox).toBeVisible();
    await userEvent.click(within(listbox).getByRole('option', { name: 'Round 1' }));
    await expect(args.onChange).toHaveBeenCalledWith('round-1');
  },
};
