import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { VerificationCodeInput, type VCSize } from './VerificationCodeInput';
import { VStack } from '../../.storybook/stack';
import { appearance, content, events, hide, state } from '../../.storybook/controls';

const SIZES: VCSize[] = ['xxxs', 'xxs', 'xs', 'sm', 'md', 'lg'];

const meta = {
  title: 'Components/Inputs/VerificationCodeInput',
  component: VerificationCodeInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'One-time-code field of single-character cells with auto-advance, backspace-to-previous, optional grouping separator, and six sizes.',
          '',
          "Import: `import { VerificationCodeInput } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { length: 6, label: 'Sign in code', size: 'sm', onChange: fn() },
  argTypes: {
    size: { control: 'select', options: SIZES, ...appearance },
    length: { control: { type: 'number', min: 2, max: 8 }, ...appearance },
    groupAfter: { control: { type: 'number', min: 0, max: 6 }, ...appearance },
    invalid: { control: 'boolean', ...state },
    disabled: { control: 'boolean', ...state },
    required: { control: 'boolean', ...state },
    label: { control: 'text', ...content },
    hint: { control: 'text', ...content },
    onChange: { ...events },
    className: hide,
  },
} satisfies Meta<typeof VerificationCodeInput>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <VStack>
      {SIZES.map((size) => (
        <VerificationCodeInput key={size} {...args} size={size} label={`Size ${size}`} />
      ))}
    </VStack>
  ),
};

export const Grouped: Story = {
  args: { groupAfter: 3, hint: 'Enter the 6 digit code we sent to judge@example.com.' },
};
export const Invalid: Story = {
  args: { invalid: true, defaultValue: '123', hint: 'That code is incorrect. Request a new one.' },
};
export const Disabled: Story = { args: { disabled: true, defaultValue: '4821' } };
export const Required: Story = { args: { required: true } };

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    const inputs = within(canvasElement).getAllByRole('textbox') as HTMLInputElement[];
    inputs[0].focus();
    await userEvent.keyboard('123456');
    await expect(args.onChange).toHaveBeenCalled();
    await expect(inputs[0]).toHaveValue('1');
    await expect(inputs[5]).toHaveValue('6');
  },
};
