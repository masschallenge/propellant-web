import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
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
          'A small tag that names the role a destination belongs to, such as the Admin tag beside an admin console in the sidebar. It is set in sentence case at 12px. Each role reads its own `--role-tag-*` tokens, so roles can change color without touching status. For now those tokens still map to the tint and status hues, until design picks role colors. The word always names the role, so color is never the only signal. Use the `evaluator` and `founder` tones for Accelerate roles; `judge` and `startup` remain as aliases. Pass it to the `accessory` of a `SidebarItem`.',
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

export const NestedDarkTheme: Story = {
  tags: ['interaction', '!autodocs'],
  render: () => (
    <div data-theme="light" className="flex flex-col gap-3 p-4">
      <RoleTag tone="evaluator" data-testid="light-tag">
        Evaluator
      </RoleTag>
      <div data-theme="dark" className="flex gap-3 p-4">
        <RoleTag tone="evaluator" data-testid="dark-tag">
          Evaluator
        </RoleTag>
        <span data-testid="dark-warning" className="text-[var(--warning)]">
          Warning
        </span>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const colorOf = (testId: string) => getComputedStyle(canvas.getByTestId(testId)).color;
    await expect(colorOf('dark-tag')).toBe(colorOf('dark-warning'));
    await expect(colorOf('dark-tag')).not.toBe(colorOf('light-tag'));
  },
};
