import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Separator, SeparatorAddButton } from './Separator';
import { VStack } from '../../.storybook/stack';
import { appearance, content, hide } from '../../.storybook/controls';

const VARIANTS = ['single', 'dual', 'fill'] as const;
const ALIGNS = ['center', 'left'] as const;

const meta = {
  title: 'Components/Layout/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Hairline separator between content blocks, with an optional label in secondary footnote text. Single rule, rules above and below, or a quiet filled bar, with a centered or leading label and an optional action.',
          'The rules are drawn beside the label, so the separator works on any surface without a background patch.',
          '',
          "Import: `import { Separator, SeparatorAddButton } from '@masschallenge/propellant-web'`",
          '',
          'Companion: `SeparatorAddButton` is a small gray add button for the `action` slot.',
        ].join('\n'),
      },
    },
  },
  args: { label: 'Round 2', variant: 'single', align: 'center' },
  argTypes: {
    label: { control: 'text', ...content },
    variant: { control: 'inline-radio', options: VARIANTS, ...appearance },
    align: { control: 'inline-radio', options: ALIGNS, ...appearance },
    action: hide,
    className: hide,
  },
} satisfies Meta<typeof Separator>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <VStack>
      {VARIANTS.map((variant) => (
        <Separator key={variant} {...args} variant={variant} label={variant} />
      ))}
    </VStack>
  ),
};

export const Aligns: Story = {
  render: (args) => (
    <VStack>
      {ALIGNS.map((align) => (
        <Separator key={align} {...args} align={align} label={align} />
      ))}
    </VStack>
  ),
};

export const WithAction: Story = {
  args: {
    label: 'Add a judging round',
    align: 'left',
    action: <SeparatorAddButton aria-label="Add a judging round" />,
  },
};

const handleAdd = fn();

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  args: {
    label: 'Add a judging round',
    align: 'left',
    action: <SeparatorAddButton aria-label="Add a judging round" onClick={handleAdd} />,
  },
  play: async ({ canvasElement }) => {
    handleAdd.mockClear();
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Add a judging round' }),
    );
    await expect(handleAdd).toHaveBeenCalledTimes(1);
  },
};
