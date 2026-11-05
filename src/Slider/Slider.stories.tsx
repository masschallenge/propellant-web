import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Slider } from './Slider';
import { appearance, content, events, hide, state } from '../../.storybook/controls';
import { field } from '../../.storybook/stack';

const meta = {
  title: 'Components/Inputs/Slider',
  component: Slider,
  tags: ['autodocs'],
  decorators: [field],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Single-value or range slider with an optional chip and label.',
          '',
          "Import: `import { Slider } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    label: 'Market opportunity score',
    min: 0,
    max: 10,
    defaultValue: 6,
    showChip: true,
    'aria-label': 'Market opportunity score',
    onChange: fn(),
  },
  argTypes: {
    min: { control: 'number', ...appearance },
    max: { control: 'number', ...appearance },
    step: { control: 'number', ...appearance },
    showChip: { control: 'boolean', ...appearance },
    showLabel: { control: 'boolean', ...appearance },
    disabled: { control: 'boolean', ...state },
    label: { control: 'text', ...content },
    onChange: { ...events },
    className: hide,
  },
} satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Range: Story = {
  args: {
    label: 'Team size',
    'aria-label': undefined,
    min: 1,
    max: 50,
    showChip: false,
    showLabel: true,
    rangeValue: undefined,
    defaultRangeValue: [3, 12],
    onRangeChange: fn(),
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const Keyboard: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    const thumb = within(canvasElement).getByRole('slider', { name: 'Market opportunity score' });
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(thumb).toHaveAttribute('aria-valuenow', '7');
    await userEvent.keyboard('{End}');
    await expect(args.onChange).toHaveBeenLastCalledWith(10);
  },
};
