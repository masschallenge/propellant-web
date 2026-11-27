import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Switch } from './Switch';
import { VStack, field } from '../../.storybook/stack';
import { appearance, content, events, hide, state } from '../../.storybook/controls';

const meta = {
  title: 'Components/Inputs/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'An on or off setting that takes effect immediately. The knob springs across the track; the off track keeps a 3:1 edge so the control is identifiable without color. Use a checkbox instead when the choice is submitted with a form.',
          '`labelPlacement="leading"` is for settings rows: a semibold label on the left and the switch pushed to the right edge of its container. Clicking the label still toggles it.',
          '`tone="success"` fills the on track with the success green, for lists of stages or assistants that are switched on. The green is light against white, so the on track keeps a 1px success edge.',
          '',
          "Import: `import { Switch } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { label: 'Email judges when assigned', size: 'md', onChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'compact', 'md'], ...appearance },
    tone: { control: 'inline-radio', options: ['tint', 'success'], ...appearance },
    labelPlacement: { control: 'inline-radio', options: ['trailing', 'leading'], ...appearance },
    checked: { control: 'boolean', ...state },
    disabled: { control: 'boolean', ...state },
    label: { control: 'text', ...content },
    hint: { control: 'text', ...content },
    onChange: { ...events },
    className: hide,
  },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <VStack>
      <Switch {...args} label="Off" />
      <Switch {...args} label="On" defaultChecked />
      <Switch {...args} label="Disabled" disabled />
      <Switch {...args} label="Small" size="sm" defaultChecked />
      <Switch
        {...args}
        label="Show other judges' scores"
        hint="Judges see each other's scores after they submit their own."
      />
    </VStack>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <VStack>
      <Switch {...args} label="Tint" defaultChecked />
      <Switch {...args} label="Success" tone="success" defaultChecked />
      <Switch {...args} label="Success, off" tone="success" />
    </VStack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <VStack>
      <Switch {...args} label="Small" size="sm" defaultChecked />
      <Switch {...args} label="Compact" size="compact" defaultChecked />
      <Switch {...args} label="Medium" size="md" defaultChecked />
    </VStack>
  ),
};

export const LabelLeading: Story = {
  decorators: [field],
  render: (args) => (
    <VStack>
      <Switch {...args} label="Allow N/A" labelPlacement="leading" defaultChecked />
      <Switch {...args} label="Required" labelPlacement="leading" />
    </VStack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('switch', { name: 'Required' });
    await userEvent.click(canvas.getByText('Required'));
    await expect(control).toHaveAttribute('aria-checked', 'true');
  },
};

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    const control = within(canvasElement).getByRole('switch', {
      name: 'Email judges when assigned',
    });
    await expect(control).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(control);
    await expect(control).toHaveAttribute('aria-checked', 'true');
    await expect(args.onChange).toHaveBeenCalledWith(true);
    await userEvent.keyboard(' ');
    await expect(control).toHaveAttribute('aria-checked', 'false');
  },
};
