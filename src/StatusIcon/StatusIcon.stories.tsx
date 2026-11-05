import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusIcon } from './StatusIcon';
import { HStack } from '../../.storybook/stack';
import { appearance, hide } from '../../.storybook/controls';
import { AlertCircleIcon, CheckCircleIcon, MailIcon } from '../assets/icons';

const meta = {
  title: 'Components/Feedback/StatusIcon',
  component: StatusIcon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A large symbol in a status color, shown above the title of a confirmation or error screen. It has no tinted box behind it: the symbol carries the meaning and the title says it in words.',
          '',
          "Import: `import { StatusIcon } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { tone: 'info', size: 'lg', children: <MailIcon /> },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'info', 'success', 'warning', 'critical'],
      ...appearance,
    },
    size: { control: 'inline-radio', options: ['md', 'lg'], ...appearance },
    children: hide,
    className: hide,
  },
} satisfies Meta<typeof StatusIcon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <HStack>
      <StatusIcon tone="info">
        <MailIcon />
      </StatusIcon>
      <StatusIcon tone="success">
        <CheckCircleIcon />
      </StatusIcon>
      <StatusIcon tone="critical">
        <AlertCircleIcon />
      </StatusIcon>
    </HStack>
  ),
};
