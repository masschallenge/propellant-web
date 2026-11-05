import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { MultiComboBox } from './MultiComboBox';
import { appearance, content, events, hide, state } from '../../.storybook/controls';

const options = [
  { value: 'health', label: 'Healthcare' },
  { value: 'digital-health', label: 'Digital health', parent: 'health' },
  { value: 'devices', label: 'Medical devices', parent: 'health' },
  { value: 'climate', label: 'Climate' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'edtech', label: 'Education' },
];

const meta = {
  title: 'Components/Inputs/MultiComboBox',
  component: MultiComboBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Multiple select on the field shell. Chosen values show as removable tokens (collapsing past five), and the portalled menu lists checkbox rows with nested options, optional search, and a reset and select all footer.',
          '',
          "Import: `import { MultiComboBox } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
      canvas: { layout: 'padded' },
      story: { height: '480px' },
    },
  },
  args: { label: 'Industries', placeholder: 'Choose industries', options, onChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], ...appearance },
    searchable: { control: 'boolean', ...appearance },
    invalid: { control: 'boolean', ...state },
    disabled: { control: 'boolean', ...state },
    label: { control: 'text', ...content },
    onChange: { ...events },
    className: hide,
  },
} satisfies Meta<typeof MultiComboBox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Searchable: Story = { args: { searchable: true } };
export const Invalid: Story = { args: { invalid: true, hint: 'Choose at least one industry' } };
export const WithChoices: Story = { args: { defaultValue: ['climate', 'digital-health'] } };
export const Disabled: Story = { args: { disabled: true } };
export const OpenAndSelect: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('combobox'));
    const listbox = await within(document.body).findByRole('listbox');
    await userEvent.click(within(listbox).getByText('Climate'));
    await expect(args.onChange).toHaveBeenCalled();
    await userEvent.keyboard('{Escape}');
  },
};
