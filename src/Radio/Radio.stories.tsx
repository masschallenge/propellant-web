import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Radio, RadioGroup } from './Radio';
import { appearance, content, hide, state } from '../../.storybook/controls';

const meta = {
  title: 'Components/Inputs/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Single radio input. Use `RadioGroup` to manage a set.',
          '',
          "Import: `import { Radio } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { label: 'Morning session' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'], ...appearance },
    error: { control: 'boolean', ...state },
    disabled: { control: 'boolean', ...state },
    label: { control: 'text', ...content },
    hint: { control: 'text', ...content },
    className: hide,
  },
} satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Error: Story = {
  args: { error: true, hint: 'Choose a session for this panel.' },
};
export const Disabled: Story = { args: { disabled: true } };
export const Group: Story = {
  tags: ['interaction'],
  render: () => (
    <RadioGroup legend="Judging session">
      <Radio label="Morning session" hint="9:00 AM to 12:00 PM" value="morning" defaultChecked />
      <Radio label="Afternoon session" hint="1:00 PM to 4:00 PM" value="afternoon" />
      <Radio label="Either session" value="either" />
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const afternoon = canvas.getByRole('radio', { name: 'Afternoon session' });
    await userEvent.click(afternoon);
    await expect(afternoon).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Morning session' })).not.toBeChecked();
  },
};
