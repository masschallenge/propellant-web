import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Avatar, AvatarGroup } from './Avatar';
import { HStack } from '../../.storybook/stack';
import { appearance, content, hide, state } from '../../.storybook/controls';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const STATUSES = ['online', 'offline'] as const;

const PHOTO = '/avatars/avatar-1.svg';
const MONOGRAM =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="%23e11d48"/><text x="12" y="17" font-family="sans-serif" font-size="12" font-weight="700" fill="white" text-anchor="middle">MC</text></svg>',
  );

const meta = {
  title: 'Components/Data display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A person or organization image with initials and glyph fallbacks. Initials sit on a neutral fill, never the tint.',
          'Five sizes, circle or squircle, a presence pip paired with hidden text, a verified mark, and a company badge that sits outside the face at the bottom right corner so it never covers the initials.',
          '',
          "Import: `import { Avatar, AvatarGroup } from '@masschallenge/propellant-web'`",
          '',
          'Companion: `AvatarGroup` overlaps avatars into a stack with an optional +N overflow chip and an add person button.',
        ].join('\n'),
      },
    },
  },
  args: { initials: 'AK', alt: 'Amara Koroma', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES, ...appearance },
    squircle: { control: 'boolean', ...appearance },
    ring: { control: 'boolean', ...appearance },
    neutral: { control: 'boolean', ...appearance },
    status: { control: 'select', options: STATUSES, ...state },
    verified: { control: 'boolean', ...state },
    src: { control: 'text', ...content },
    initials: { control: 'text', ...content },
    alt: { control: 'text', ...content },
    companyBadge: hide,
    className: hide,
  },
} satisfies Meta<typeof Avatar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <HStack>
      {SIZES.map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </HStack>
  ),
};

export const Photo: Story = { args: { src: PHOTO, initials: undefined } };
export const NeutralGlyph: Story = { args: { initials: undefined, alt: 'Unknown user' } };
export const Squircle: Story = { args: { squircle: true, src: PHOTO } };
export const Neutral: Story = { args: { neutral: true } };

export const Statuses: Story = {
  render: (args) => (
    <HStack>
      {STATUSES.map((status) => (
        <Avatar key={status} {...args} status={status} src={PHOTO} initials={undefined} />
      ))}
    </HStack>
  ),
};

export const Verified: Story = { args: { verified: true, src: PHOTO, initials: undefined } };
export const CompanyBadge: Story = {
  args: { companyBadge: { src: MONOGRAM, alt: 'MassChallenge' }, size: 'lg' },
};

const handleAddJudge = fn();

export const Stack: Story = {
  tags: ['interaction', '!autodocs'],
  render: () => (
    <AvatarGroup overflow={3} onAdd={handleAddJudge} addLabel="Add judge">
      <Avatar initials="AK" ring alt="Amara Koroma" />
      <Avatar src={PHOTO} ring alt="Jonah Reyes" />
      <Avatar initials="TS" ring neutral alt="Tara Singh" />
    </AvatarGroup>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Add judge' }));
    await expect(handleAddJudge).toHaveBeenCalledTimes(1);
  },
};
