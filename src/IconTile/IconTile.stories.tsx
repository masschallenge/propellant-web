import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconTile } from './IconTile';
import { HStack } from '../../.storybook/stack';
import { icons } from '../../.storybook/icons';
import { appearance, hide } from '../../.storybook/controls';

const TONES = ['teal', 'gray', 'orange'] as const;
const STAGE_TONES = ['application', 'prescreening', 'online', 'pitch', 'cohort', 'closed'] as const;

const meta = {
  title: 'Components/Data display/IconTile',
  component: IconTile,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A 36px rounded tile that holds an 18px icon at the start of a to do item or a list row. `size="lg"` draws the 44px stage tile with a 22px icon that leads a stage page title. Teal marks something to act on, gray something to read or that is scheduled, and orange something that needs attention. The stage tones match a program stage: application, prescreening, online, pitch, cohort and closed.',
          '',
          'The tile is decorative and hidden from assistive technology, since the text beside it says what it is. Give it an `aria-label` only when it stands alone, and it is announced as an image with that name.',
          '',
          "Import: `import { IconTile } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { tone: 'teal', icon: icons.calendar },
  argTypes: {
    tone: { control: 'select', options: [...TONES, ...STAGE_TONES], ...appearance },
    size: { control: 'inline-radio', options: ['md', 'lg'], ...appearance },
    icon: hide,
    className: hide,
  },
} satisfies Meta<typeof IconTile>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: (args) => (
    <HStack>
      {TONES.map((tone) => (
        <IconTile key={tone} {...args} tone={tone} />
      ))}
    </HStack>
  ),
};

export const StageTones: Story = {
  render: (args) => (
    <HStack>
      {STAGE_TONES.map((tone) => (
        <IconTile key={tone} {...args} tone={tone} icon={icons.star} />
      ))}
    </HStack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <HStack>
      <IconTile {...args} tone="application" size="md" />
      <IconTile {...args} tone="application" size="lg" />
    </HStack>
  ),
};
