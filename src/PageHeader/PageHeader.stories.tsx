import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PageHeader } from './PageHeader';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { IconTile } from '../IconTile/IconTile';
import { appearance, content, events, hide } from '../../.storybook/controls';

const AVATAR = '/avatars/avatar-3.svg';

const headerActions = (
  <>
    <Button variant="gray">Message</Button>
    <Button variant="filled">Edit profile</Button>
  </>
);

const documentIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);

const moreIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
);

const frame = (Story: React.ComponentType) => (
  <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
    <Story />
  </div>
);

const meta = {
  title: 'Components/Layout/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  decorators: [frame],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'In app title region: an optional flat cover and back button, a large title in label color, supporting meta and a subtitle in secondary text, an avatar with a verified mark, and actions on the trailing side.',
          'Framed (a white group), centered, and divided (a hairline under the header) treatments. Titles are never tinted and never set in capitals.',
          '',
          "Import: `import { PageHeader } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    title: 'Ada Lovelace',
    meta: 'ada@example.com',
    subtitle: 'Program lead, Boston 2026 cohort',
    banner: false,
    verified: false,
    centered: false,
    framed: false,
    divided: false,
    onBack: fn(),
  },
  argTypes: {
    title: { control: 'text', ...content },
    meta: { control: 'text', ...content },
    subtitle: { control: 'text', ...content },
    backLabel: { control: 'text', ...content },
    banner: { control: 'select', options: [false, true, 'lime'], ...appearance },
    avatarSrc: { control: 'text', ...content },
    avatarAlt: { control: 'text', ...content },
    verified: { control: 'boolean', ...appearance },
    centered: { control: 'boolean', ...appearance },
    framed: { control: 'boolean', ...appearance },
    divided: { control: 'boolean', ...appearance },
    onBack: { ...events },
    leading: hide,
    above: hide,
    actions: hide,
    toolbar: hide,
    className: hide,
  },
} satisfies Meta<typeof PageHeader>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithAvatar: Story = {
  args: { avatarSrc: AVATAR, avatarAlt: 'Ada Lovelace', verified: true },
};

export const WithActions: Story = {
  args: { avatarSrc: AVATAR, avatarAlt: 'Ada Lovelace', actions: headerActions },
};

export const Framed: Story = {
  args: {
    framed: true,
    avatarSrc: AVATAR,
    avatarAlt: 'Ada Lovelace',
    verified: true,
    actions: headerActions,
  },
};

export const WithBanner: Story = {
  args: {
    banner: 'lime',
    framed: true,
    avatarSrc: AVATAR,
    avatarAlt: 'Ada Lovelace',
    verified: true,
    actions: headerActions,
  },
};

export const Centered: Story = {
  args: { centered: true, avatarSrc: AVATAR, avatarAlt: 'Ada Lovelace', verified: true },
};

export const Divided: Story = { args: { divided: true, actions: headerActions } };

export const WithBackLink: Story = {
  args: { backLabel: 'All judges' },
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'All judges' }));
    await expect(args.onBack).toHaveBeenCalledTimes(1);
  },
};

export const WithLeading: Story = {
  args: {
    title: 'Setup',
    meta: undefined,
    subtitle: undefined,
    leading: <IconTile tone="application" size="lg" icon={documentIcon} />,
    actions: (
      <>
        <Button variant="filled">Accept applications</Button>
        <IconButton variant="gray" shape="capsule" aria-label="More actions">
          {moreIcon}
        </IconButton>
      </>
    ),
  },
};
