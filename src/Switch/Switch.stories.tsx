import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Switch } from './Switch';
import { VStack } from '../../.storybook/stack';
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
          '',
          "Import: `import { Switch } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { label: 'Email judges when assigned', size: 'md', onChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'], ...appearance },
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
