import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Stepper } from './Stepper';
import { VStack } from '../../.storybook/stack';
import { appearance, events, hide, state } from '../../.storybook/controls';

const meta = {
  title: 'Components/Inputs/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Adjusts a small number by a fixed step: judges per startup, pitch minutes, panel size. The value is announced as it changes, and each button disables at its bound. Use a text field when people need to type a large or exact number.',
          '',
          "Import: `import { Stepper } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    'aria-label': 'Judges per startup',
    defaultValue: 3,
    min: 1,
    max: 8,
    step: 1,
    size: 'md',
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'], ...appearance },
    disabled: { control: 'boolean', ...state },
    onChange: { ...events },
    formatValue: hide,
    className: hide,
  },
} satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variations: Story = {
  render: (args) => (
    <VStack>
      <Stepper {...args} />
      <Stepper
        {...args}
        aria-label="Pitch length"
        defaultValue={10}
        step={5}
        min={5}
        max={30}
        formatValue={(minutes) => `${minutes} min`}
      />
      <Stepper {...args} size="sm" />
      <Stepper {...args} disabled />
    </VStack>
  ),
};

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Increase' }));
    await expect(args.onChange).toHaveBeenCalledWith(4);
    await expect(canvas.getByRole('status')).toHaveTextContent('4');
  },
};
