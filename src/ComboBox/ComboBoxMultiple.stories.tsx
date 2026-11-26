import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
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
          '`chipTone="tint"` colors the chosen tokens with the tint and keeps their weight, and an option `marker` (an icon and a label) shows on its row and its token, with the label added to the accessible name, for example to mark values that came from a search.',
          '',
          "Import: `import { ComboBox } from '@masschallenge/propellant-web'`, rendered as `<ComboBox multiple />`",
        ].join('\n'),
      },
      canvas: { layout: 'padded' },
      story: { height: '480px' },
    },
  },
  args: { label: 'Industries', placeholder: 'Choose industries', options, onChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], ...appearance },
    panelWidth: { control: 'inline-radio', options: ['trigger', 'content'], ...appearance },
    searchable: { control: 'boolean', ...appearance },
    chipTone: { control: 'inline-radio', options: ['neutral', 'tint'], ...appearance },
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
export const SearchFieldFocus: Story = {
  tags: ['interaction', '!autodocs'],
  args: { searchable: true },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox');
    await userEvent.click(trigger);
    const search = await within(document.body).findByRole('textbox', { name: 'Search options' });
    await waitFor(() => expect(search).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
  },
};
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

const SearchMark = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

const markedOptions = [
  {
    value: 'climate',
    label: 'Climate',
    marker: { icon: <SearchMark />, label: 'from search' },
  },
  { value: 'fintech', label: 'Fintech' },
  { value: 'health', label: 'Healthcare' },
];

export const TintChipsWithMarkers: Story = {
  args: {
    label: 'Tags',
    chipTone: 'tint',
    options: markedOptions,
    defaultValue: ['climate', 'fintech'],
  },
};

export const MarkerNames: Story = {
  tags: ['interaction', '!autodocs'],
  args: { label: 'Tags', chipTone: 'tint', options: markedOptions, defaultValue: ['climate'] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('button', { name: 'Remove Climate, from search' }),
    ).toBeInTheDocument();
    await expect(getComputedStyle(canvas.getByText('Climate')).fontWeight).toBe('400');
    await userEvent.click(canvas.getByRole('combobox'));
    const listbox = await within(document.body).findByRole('listbox');
    await expect(
      within(listbox).getByRole('option', { name: 'Climate, from search' }),
    ).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(within(listbox).getByRole('option', { name: 'Healthcare' }));
    await expect(args.onChange).toHaveBeenCalledWith(['climate', 'health']);
    await userEvent.keyboard('{Escape}');
  },
};

export const ContentWidthPanel: Story = {
  tags: ['interaction', '!autodocs'],
  args: {
    label: 'Sub-industries',
    placeholder: 'All sub-industries',
    size: 'sm',
    panelWidth: 'content',
    options: [
      { value: 'health-it', label: 'Healthcare IT and digital health' },
      { value: 'devices', label: 'Medical devices and diagnostics' },
      { value: 'biotech', label: 'Biotechnology and pharmaceuticals' },
    ],
    className: 'w-44',
  },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox');
    await userEvent.click(trigger);
    const listbox = await within(document.body).findByRole('listbox');
    const panel = listbox.parentElement as HTMLElement;
    const label = within(listbox).getByText('Healthcare IT and digital health');
    await waitFor(() => expect(panel.style.visibility).toBe('visible'));
    const panelRect = panel.getBoundingClientRect();
    await expect(panelRect.right).toBeLessThanOrEqual(window.innerWidth);
    await expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth);
  },
};
