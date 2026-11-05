import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox } from './Checkbox';
import { appearance, content, hide, state } from '../../.storybook/controls';

const meta = {
  title: 'Components/Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Boolean choice with label, hint, indeterminate, and error states.',
          '',
          "Import: `import { Checkbox } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { label: 'Notify me when scores are due' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'], ...appearance },
    checked: { control: 'boolean', ...state },
    indeterminate: { control: 'boolean', ...state },
    error: { control: 'boolean', ...state },
    disabled: { control: 'boolean', ...state },
    label: { control: 'text', ...content },
    hint: { control: 'text', ...content },
    className: hide,
  },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = { args: { indeterminate: true } };
export const Error: Story = {
  args: {
    label: 'I have no conflict of interest with this startup',
    error: true,
    hint: 'Confirm before you score this application.',
  },
};
export const WithHint: Story = {
  args: { hint: 'We email you two days before the round closes.' },
};
export const Disabled: Story = { args: { disabled: true } };
export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole('checkbox');
    await expect(box).not.toBeChecked();
    await userEvent.click(box);
    await expect(box).toBeChecked();
  },
};
