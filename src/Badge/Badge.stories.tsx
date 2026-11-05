import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { HStack, VStack } from '../../.storybook/stack';
import { appearance, content, hide, state } from '../../.storybook/controls';
import { icons, iconOptions } from '../../.storybook/icons';

const TONES = ['neutral', 'info', 'success', 'warning', 'critical'] as const;
const LABELS: Record<(typeof TONES)[number], string> = {
  neutral: 'Draft',
  info: 'In review',
  success: 'Scored',
  warning: 'Needs judge',
  critical: 'Withdrawn',
};

const meta = {
  title: 'Components/Data display/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A read-only status label. The label names the state, so color is never the only signal. Badges are capsules with a soft fill and no border; `emphasis="strong"` fills them solid for the one status that matters most on a row.',
          '',
          "Import: `import { Badge } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { tone: 'info', size: 'md', children: 'In review', icon: 'none' },
  argTypes: {
    tone: { control: 'inline-radio', options: TONES, ...appearance },
    size: { control: 'inline-radio', options: ['sm', 'md'], ...appearance },
    emphasis: { control: 'inline-radio', options: ['default', 'strong'], ...appearance },
    dot: { control: 'boolean', ...appearance },
    pulse: { control: 'boolean', ...state },
    icon: { control: 'select', options: iconOptions, mapping: icons, ...content },
    iconPosition: { control: 'inline-radio', options: ['leading', 'trailing'], ...appearance },
    children: { control: 'text', ...content },
    iconOnly: hide,
    truncate: hide,
    className: hide,
  },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: (args) => (
    <VStack>
      <HStack>
        {TONES.map((tone) => (
          <Badge key={tone} {...args} tone={tone}>
            {LABELS[tone]}
          </Badge>
        ))}
      </HStack>
      <HStack>
        {TONES.map((tone) => (
          <Badge key={tone} {...args} tone={tone} dot>
            {LABELS[tone]}
          </Badge>
        ))}
      </HStack>
      <HStack>
        {TONES.map((tone) => (
          <Badge key={tone} {...args} tone={tone} emphasis="strong">
            {LABELS[tone]}
          </Badge>
        ))}
      </HStack>
    </VStack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <HStack>
      <Badge {...args} size="sm">
        3 of 3 judges
      </Badge>
      <Badge {...args} size="md">
        3 of 3 judges
      </Badge>
    </HStack>
  ),
};

export const WithIcon: Story = { args: { tone: 'success', icon: 'check', children: 'Scored' } };

export const Live: Story = {
  args: { tone: 'warning', dot: true, pulse: true, children: 'Live now' },
};
