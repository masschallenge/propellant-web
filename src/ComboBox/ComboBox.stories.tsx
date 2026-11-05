import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SingleComboBox } from './SingleComboBox';
import { appearance, content, events, hide, state } from '../../.storybook/controls';

const options = [
  { value: 'boston', label: 'Boston', sub: 'Eastern time' },
  { value: 'austin', label: 'Austin', sub: 'Central time' },
  { value: 'geneva', label: 'Geneva', sub: 'Central European time' },
];

const meta = {
  title: 'Components/Inputs/SingleComboBox',
  component: SingleComboBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Single select on the field shell with a filter field at the top of a portalled menu on the elevated surface. Groups use footnote headers, the highlighted row fills with the tint, and the chosen row carries a check.',
          '',
          "Import: `import { SingleComboBox } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
      canvas: { layout: 'padded' },
      story: { height: '480px' },
    },
  },
  args: { label: 'Program location', placeholder: 'Choose a location', options, onChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], ...appearance },
    clearable: { control: 'boolean', ...appearance },
    invalid: { control: 'boolean', ...state },
    disabled: { control: 'boolean', ...state },
    label: { control: 'text', ...content },
    onChange: { ...events },
    className: hide,
  },
} satisfies Meta<typeof SingleComboBox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Clearable: Story = { args: { clearable: true, defaultValue: 'austin' } };
export const Invalid: Story = { args: { invalid: true, hint: 'Choose where the program runs' } };
export const Disabled: Story = { args: { disabled: true } };
export const OpenAndFilter: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('combobox'));
    const listbox = await within(document.body).findByRole('listbox');
    await userEvent.click(within(listbox).getByText('Austin'));
    await expect(args.onChange).toHaveBeenCalledWith('austin');
  },
};

const judgeOptions = [
  { value: 'ana', label: 'Ana Silva', sub: '1 panel', group: 'Available judges' },
  { value: 'ben', label: 'Ben Okafor', sub: '0 panels', group: 'Available judges' },
  {
    value: 'cy',
    label: 'Cy Moreau',
    sub: '2 panels',
    detail: 'Needs override: already holds the max panels for this round',
    group: 'Other judges',
  },
];

export const Grouped: Story = {
  tags: ['interaction', '!autodocs'],
  args: { label: 'Judge', placeholder: 'Add a judge', options: judgeOptions },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('combobox'));
    const listbox = await within(document.body).findByRole('listbox');
    await expect(within(listbox).getByRole('group', { name: 'Available judges' })).toBeVisible();
    await expect(within(listbox).getByText(/Needs override/)).toBeVisible();
    await userEvent.click(within(listbox).getByText('Cy Moreau'));
    await expect(args.onChange).toHaveBeenCalledWith('cy');
  },
};

export const LockedWithReasons: Story = {
  tags: ['interaction', '!autodocs'],
  args: {
    label: 'Judge',
    placeholder: 'Add a judge',
    options: [
      ...judgeOptions,
      {
        value: 'di',
        label: 'Di Park',
        sub: '1 panel',
        detail: ['Cannot add: On Midday panel 1 at the same time', 'No matching industry'],
        group: 'Other judges',
        disabled: true,
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('combobox'));
    const listbox = await within(document.body).findByRole('listbox');
    await expect(within(listbox).getByText('No matching industry')).toBeVisible();
    await userEvent.click(within(listbox).getByText('Di Park'));
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};
