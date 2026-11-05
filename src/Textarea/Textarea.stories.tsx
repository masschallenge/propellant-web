import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Textarea } from './Textarea';
import { field } from '../../.storybook/stack';
import { appearance, content, hide, state } from '../../.storybook/controls';

const meta = {
  title: 'Components/Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  decorators: [field],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Multi-line text input with label, hint, and validation states.',
          '',
          "Import: `import { Textarea } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { label: 'Notes for the panel', placeholder: 'Add a note for the other judges', rows: 4 },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'], ...appearance },
    emphasis: { control: 'inline-radio', options: ['default', 'strong'], ...appearance },
    rows: { control: 'number', ...appearance },
    required: { control: 'boolean', ...state },
    invalid: { control: 'boolean', ...state },
    disabled: { control: 'boolean', ...state },
    label: { control: 'text', ...content },
    hint: { control: 'text', ...content },
    hintEnd: { control: 'text', ...content },
    className: hide,
  },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Invalid: Story = {
  args: { invalid: true, hint: 'Add a note before you submit your scores.' },
};
export const Disabled: Story = { args: { disabled: true } };
export const WithCounter: Story = {
  args: { hint: 'Visible to the program team.', hintEnd: '0/7500', maxLength: 7500 },
};
export const StrongLabel: Story = {
  args: {
    label: 'Feedback for the founders',
    emphasis: 'strong',
    hint: 'Shared with the founding team.',
    hintEnd: '150 characters remaining',
  },
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    const label = within(canvasElement).getByText('Feedback for the founders');
    await expect(label).toHaveClass('font-semibold');
  },
};
