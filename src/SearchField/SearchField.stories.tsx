import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SearchField } from './SearchField';
import { ListRow, ListSection } from '../List/List';
import { VStack } from '../../.storybook/stack';
import { appearance, content, events, hide, state } from '../../.storybook/controls';

const meta = {
  title: 'Components/Inputs/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A capsule search field with a magnifying glass, a clear button once there is text, and Escape to clear. Values are masked from session replay by default because searches often contain names.',
          '`variant="inset"` drops the border and corners and takes the full row height, so the field can sit as the first row of a list it filters, with an inset focus ring.',
          '',
          "Import: `import { SearchField } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    'aria-label': 'Search startups',
    placeholder: 'Search startups',
    size: 'md',
    onChange: fn(),
    onClear: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], ...appearance },
    variant: { control: 'inline-radio', options: ['outlined', 'inset'], ...appearance },
    placeholder: { control: 'text', ...content },
    disabled: { control: 'boolean', ...state },
    onChange: { ...events },
    onClear: { ...events },
    isPrivate: hide,
    className: hide,
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { className: 'w-full' } };

export const Sizes: Story = {
  render: (args) => (
    <VStack>
      <SearchField {...args} size="sm" className="w-full" />
      <SearchField {...args} size="md" className="w-full" />
      <SearchField {...args} size="lg" className="w-full" defaultValue="Solar" />
    </VStack>
  ),
};

export const InAList: Story = {
  args: { variant: 'inset', placeholder: 'Search all programs', 'aria-label': 'Search programs' },
  render: (args) => (
    <div className="flex flex-col rounded-[var(--corner-lg)] overflow-hidden shadow-[inset_0_0_0_1px_var(--separator)]">
      <SearchField {...args} />
      <ListSection className="border-t border-[var(--separator)]">
        <ListRow title="Healthcare & Life Sciences Traction Program 2026" />
        <ListRow title="MassMutual Challenge 2027" />
      </ListSection>
    </div>
  ),
};

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  args: { className: 'w-full' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole('searchbox', { name: 'Search startups' });
    await userEvent.type(field, 'solar');
    await expect(args.onChange).toHaveBeenLastCalledWith('solar');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await expect(field).toHaveValue('');
    await expect(args.onClear).toHaveBeenCalled();
  },
};
