import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from './Button';
import { HStack, VStack } from '../../.storybook/stack';
import { appearance, content, events, hide, state } from '../../.storybook/controls';
import { icons, iconOptions } from '../../.storybook/icons';

const VARIANTS = ['filled', 'tinted', 'gray', 'plain'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

const meta = {
  title: 'Components/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Four styles in order of prominence (filled, tinted, gray, plain) and a destructive role that applies to any of them. Three sizes, icons, loading, and a soft disabled state. Renders an `<a>` when `href` is set.',
          '',
          "Import: `import { Button } from '@masschallenge/propellant-web'`",
          '',
          'Use one filled button per view for the most likely action. Buttons in a row are capsules; use `inline` on a plain button that sits inside running text.',
        ].join('\n'),
      },
    },
  },
  args: {
    children: 'Save round',
    variant: 'filled',
    size: 'md',
    destructive: false,
    iconLeading: 'none',
    iconTrailing: 'none',
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS, ...appearance },
    destructive: { control: 'boolean', ...appearance },
    size: { control: 'inline-radio', options: SIZES, ...appearance },
    inline: { control: 'boolean', ...appearance },
    href: { control: 'text', ...appearance },
    iconOnly: { control: 'boolean', ...appearance },
    wrap: { control: 'boolean', ...appearance },
    truncate: { control: 'boolean', ...appearance },
    loading: { control: 'boolean', ...state },
    disabled: { control: 'boolean', ...state },
    focusableWhenDisabled: { control: 'boolean', ...state },
    children: { control: 'text', ...content },
    iconLeading: { control: 'select', options: iconOptions, mapping: icons, ...content },
    iconTrailing: { control: 'select', options: iconOptions, mapping: icons, ...content },
    type: { control: 'inline-radio', options: ['button', 'submit', 'reset'], ...appearance },
    onClick: { ...events },
    className: hide,
    linkAs: hide,
  },
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <VStack>
      <HStack>
        <Button {...args} variant="filled">
          Save round
        </Button>
        <Button {...args} variant="tinted">
          Preview as judge
        </Button>
        <Button {...args} variant="gray">
          Duplicate
        </Button>
        <Button {...args} variant="plain">
          Cancel
        </Button>
      </HStack>
      <HStack>
        <Button {...args} variant="filled" destructive>
          Remove judge
        </Button>
        <Button {...args} variant="tinted" destructive>
          Withdraw
        </Button>
        <Button {...args} variant="gray" destructive>
          Delete draft
        </Button>
        <Button {...args} variant="plain" destructive>
          Discard
        </Button>
      </HStack>
    </VStack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <HStack>
      {SIZES.map((size) => (
        <Button key={size} {...args} size={size}>
          {size === 'sm' ? 'Small' : size === 'md' ? 'Regular' : 'Large'}
        </Button>
      ))}
    </HStack>
  ),
};

export const WithIcons: Story = {
  args: { variant: 'tinted', iconLeading: 'plus', children: 'Add judge' },
};

export const IconOnly: Story = {
  args: { iconOnly: true, iconLeading: 'plus', 'aria-label': 'Add judge', variant: 'gray' },
};

export const Inline: Story = {
  render: (args) => (
    <p className="m-0 text-body text-[var(--label)] max-w-[52ch]">
      Judges see a startup after its application is complete.{' '}
      <Button {...args} variant="plain" inline href="#">
        Review the rubric
      </Button>{' '}
      before scoring opens.
    </p>
  ),
};

export const Loading: Story = { args: { loading: true } };

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button');
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const FocusableWhenDisabled: Story = {
  args: { disabled: true, focusableWhenDisabled: true, children: 'Publish round' },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Publish round' });
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    button.focus();
    await expect(button).toHaveFocus();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const AsLink: Story = { args: { href: '#', variant: 'gray', children: 'Open rubric' } };

export const Wrapping: Story = {
  render: (args) => (
    <div style={{ width: 192 }}>
      <Button {...args} wrap>
        Review the updated judging rubric for Round 2
      </Button>
    </div>
  ),
};

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Save round' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};
