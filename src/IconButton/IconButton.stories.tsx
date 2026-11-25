import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { IconButton } from './IconButton';
import { HStack, VStack } from '../../.storybook/stack';
import { appearance, content, events, hide, state } from '../../.storybook/controls';
import { icons, iconOptions } from '../../.storybook/icons';

const VARIANTS = ['plain', 'gray', 'tinted', 'filled'] as const;
const ALL_VARIANTS = [...VARIANTS, 'inverse'] as const;

const MORE_GLYPH = (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="10" r="1.5" />
    <circle cx="10" cy="10" r="1.5" />
    <circle cx="15" cy="10" r="1.5" />
  </svg>
);
const SIZES = ['sm', 'md', 'lg'] as const;
const SHAPES = ['rounded', 'capsule'] as const;

const meta = {
  title: 'Components/Actions/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A compact action shown as a symbol. Plain icon buttons sit in toolbars and table rows and highlight on hover, and fill while the menu they open is open (`aria-haspopup` with `aria-expanded`, which `Menu` sets on its trigger); `shape="capsule"` makes a plain one circular, like the item menu trigger on Home. Gray, tinted and filled are circular and stand on their own. `inverse` is for a dark or colored band, such as a banner header: a white glyph on a 15% white fill that deepens to 30% on hover and while its menu is open. Its focus ring is white so it stands out on the band. It is a rounded rectangle like plain, and has no destructive style, so `destructive` with `inverse` is a type error. Always provide `aria-label`.',
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
    variant: { control: 'inline-radio', options: ALL_VARIANTS, ...appearance },
    size: { control: 'inline-radio', options: SIZES, ...appearance },
    shape: { control: 'inline-radio', options: SHAPES, ...appearance },
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

export const Shapes: Story = {
  render: (args) => (
    <VStack>
      <HStack>
        {SHAPES.map((shape) => (
          <IconButton key={shape} {...args} shape={shape} aria-label={`Add, ${shape}`}>
            {icons.plus}
          </IconButton>
        ))}
      </HStack>
      <HStack>
        {SHAPES.map((shape) => (
          <IconButton
            key={shape}
            {...args}
            shape={shape}
            aria-haspopup="menu"
            aria-expanded
            aria-label={`Add, ${shape}, open`}
          >
            {icons.plus}
          </IconButton>
        ))}
      </HStack>
    </VStack>
  ),
};

export const Inverse: Story = {
  render: ({ onClick }) => (
    <HStack>
      <div className="flex items-center gap-3 p-4 rounded-[var(--corner-lg)] bg-[var(--brand-surface)]">
        <IconButton variant="inverse" size="sm" aria-label="More actions" onClick={onClick}>
          {MORE_GLYPH}
        </IconButton>
        <IconButton
          variant="inverse"
          size="sm"
          aria-haspopup="menu"
          aria-expanded
          aria-label="More actions, open"
          onClick={onClick}
        >
          {MORE_GLYPH}
        </IconButton>
        <IconButton
          variant="inverse"
          size="sm"
          aria-label="More actions, focused"
          onClick={onClick}
        >
          {MORE_GLYPH}
        </IconButton>
      </div>
    </HStack>
  ),
  play: async ({ canvasElement }) => {
    within(canvasElement).getByRole('button', { name: 'More actions, focused' }).focus();
  },
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
