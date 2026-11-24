import type { Meta, StoryObj } from '@storybook/react-vite';
import { RoleTag } from './RoleTag';
import { HStack } from '../../.storybook/stack';
import { appearance, content, hide } from '../../.storybook/controls';

const TONES = ['admin', 'pm', 'evaluator', 'founder', 'mentor', 'neutral'] as const;
const LABELS: Record<(typeof TONES)[number], string> = {
  admin: 'Admin',
  pm: 'Program manager',
  evaluator: 'Evaluator',
  founder: 'Founder',
  mentor: 'Mentor',
  neutral: 'Role',
};

const meta = {
  title: 'Components/Data display/RoleTag',
  component: RoleTag,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A small tag that names the role a destination belongs to, such as the Admin tag beside an admin console in the sidebar. It is set in sentence case at 12px. Each role has its own soft fill from the `--role-tag-*` tokens, kept apart from the status colors, and the word always names the role, so color is never the only signal. Use the `evaluator` and `founder` tones for Accelerate roles; `judge` and `startup` remain as aliases. Pass it to the `accessory` of a `SidebarItem`.',
          '',
          "Import: `import { RoleTag } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { tone: 'admin', children: 'Admin' },
  argTypes: {
    tone: { control: 'inline-radio', options: TONES, ...appearance },
    children: { control: 'text', ...content },
    className: hide,
  },
} satisfies Meta<typeof RoleTag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: (args) => (
    <HStack>
      {TONES.map((tone) => (
        <RoleTag key={tone} {...args} tone={tone}>
          {LABELS[tone]}
        </RoleTag>
      ))}
    </HStack>
  ),
};
