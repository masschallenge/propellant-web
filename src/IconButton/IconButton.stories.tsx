import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { IconButton } from './IconButton';
import { HStack, VStack } from '../../.storybook/stack';
import { appearance, content, events, hide, state } from '../../.storybook/controls';
import { icons, iconOptions } from '../../.storybook/icons';

const VARIANTS = ['plain', 'gray', 'tinted', 'filled'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

const meta = {
  title: 'Components/Actions/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A compact action shown as a symbol. Plain icon buttons sit in toolbars and table rows and highlight on hover; gray, tinted and filled are circular and stand on their own. Always provide `aria-label`.',
          '',
          "Import: `import { IconButton } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    'aria-label': 'Add judge',
    variant: 'plain',
    size: 'md',
    destructive: false,
    children: 'plus',
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS, ...appearance },
    size: { control: 'inline-radio', options: SIZES, ...appearance },
    destructive: { control: 'boolean', ...appearance },
    disabled: { control: 'boolean', ...state },
    'aria-label': { control: 'text', ...content },
    children: {
      control: 'select',
      options: iconOptions.filter((name) => name !== 'none'),
      mapping: icons,
      ...content,
    },
    onClick: { ...events },
    className: hide,
  },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <VStack>
      <HStack>
        {VARIANTS.map((variant) => (
          <IconButton key={variant} {...args} variant={variant} aria-label={`Add, ${variant}`}>
            {icons.plus}
          </IconButton>
        ))}
      </HStack>
      <HStack>
        {VARIANTS.map((variant) => (
          <IconButton
            key={variant}
            {...args}
            variant={variant}
            destructive
            aria-label={`Remove, ${variant}`}
          >
            {icons.trash}
          </IconButton>
        ))}
      </HStack>
    </VStack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <HStack>
      {SIZES.map((size) => (
        <IconButton key={size} {...args} size={size} variant="gray" aria-label={`Add, ${size}`}>
          {icons.plus}
        </IconButton>
      ))}
    </HStack>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Add judge' });
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Add judge' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
