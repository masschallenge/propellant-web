import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Menu } from './Menu';
import type { MenuItem } from './Menu';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { appearance, hide } from '../../.storybook/controls';

const lineIcon = (...paths: string[]) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {paths.map((path) => (
      <path key={path} d={path} />
    ))}
  </svg>
);

const accountIcons = {
  inbox: lineIcon(
    'M22 12h-6l-2 3h-4l-2-3H2',
    'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
  ),
  profile: lineIcon('M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M4 21a8 8 0 0 1 16 0'),
  settings: lineIcon(
    'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    'M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  ),
  help: lineIcon(
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
    'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01',
  ),
  signOut: lineIcon('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'm16 17 5-5-5-5M21 12H9'),
  review: lineIcon(
    'M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z',
    'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2',
    'm9 14 2 2 4-4',
  ),
  program: lineIcon('m12 2 10 5-10 5L2 7z', 'm2 17 10 5 10-5', 'm2 12 10 5 10-5'),
  remind: lineIcon('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M12 6v6l4 2'),
  preview: lineIcon(
    'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z',
    'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  ),
  reset: lineIcon('M3 12a9 9 0 1 0 3-6.7L3 8', 'M3 3v5h5'),
  edit: lineIcon('M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'),
  duplicate: lineIcon(
    'M10 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z',
    'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2',
  ),
  trash: lineIcon(
    'M3 6h18',
    'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6',
    'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2',
  ),
  more: lineIcon(
    'M12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
    'M19 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
    'M5 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  ),
};

const accountMenuItems: MenuItem[] = [
  { label: 'Inbox', icon: accountIcons.inbox, href: '#inbox', badge: { count: 3 } },
  { label: 'Your profile', icon: accountIcons.profile, href: '#profile' },
  { label: 'User settings', icon: accountIcons.settings, href: '#settings' },
  { label: 'Help', icon: accountIcons.help, href: '#help' },
  { separator: true },
  { label: 'Sign out', icon: accountIcons.signOut, href: '#sign-out' },
];

const itemMenuItems: MenuItem[] = [
  { label: 'Review progress', icon: accountIcons.review, href: '#review-progress' },
  { label: 'Open program', icon: accountIcons.program, href: '#program' },
  { label: 'Remind me tomorrow', icon: accountIcons.remind, onSelect: fn() },
];

const items: MenuItem[] = [
  { section: 'Round 2' },
  { label: 'Edit schedule', shortcut: '⌘E', onSelect: fn() },
  { label: 'Duplicate round', onSelect: fn() },
  {
    label: 'Move to cohort',
    submenu: [
      { label: 'Healthcare', onSelect: fn() },
      { label: 'Climate', selected: true, onSelect: fn() },
    ],
  },
  { separator: true },
  { section: 'Show' },
  { label: 'Judges', checkbox: true, selected: true, onSelect: fn() },
  { label: 'Mentors', checkbox: true, onSelect: fn() },
  { separator: true },
  { label: 'Archive round', disabled: true },
  { label: 'Delete round', destructive: true, onSelect: fn() },
];

const meta = {
  title: 'Components/Overlays/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Portalled action menu anchored to a trigger, on the elevated surface. Rows highlight with the tint, destructive rows read in critical, and sections use footnote headers. Optional search field and account summary.',
          '',
          "Import: `import { Menu } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
      canvas: { layout: 'padded' },
      story: { height: '480px' },
    },
  },
  args: { trigger: <Button variant="gray">Round actions</Button>, items },
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'end'], ...appearance },
    search: { control: 'boolean', ...appearance },
    minWidth: { control: 'text', ...appearance },
    size: { control: 'inline-radio', options: ['sm', 'md'], ...appearance },
    className: hide,
  },
} satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithSearch: Story = {
  args: {
    search: true,
    searchPlaceholder: 'Search judges',
    items: [
      { label: 'Priya Raman', dot: 'online', onSelect: fn() },
      { label: 'Marcus Chen', dot: 'offline', onSelect: fn() },
      { label: 'Elena Torres', dot: 'online', onSelect: fn() },
    ],
  },
};

export const AccountMenu: Story = {
  args: {
    align: 'end',
    trigger: <Button variant="gray">Jordan Lee</Button>,
    accountBand: { title: 'Jordan Lee', sub: 'Program lead, Boston 2026' },
    items: [
      { label: 'Profile settings', onSelect: fn() },
      { label: 'Notification preferences', onSelect: fn() },
      { separator: true },
      { label: 'Log out', destructive: true, onSelect: fn() },
    ],
  },
};

export const AccountMenuWithAvatar: Story = {
  args: {
    align: 'end',
    trigger: <Button variant="gray">Joe Schwendt</Button>,
    accountBand: {
      title: 'Joe Schwendt',
      sub: 'joe@masschallenge.org',
      avatar: { initials: 'JS', tone: 'teal' },
    },
    items: accountMenuItems,
  },
};

export const ItemMenuWithLinks: Story = {
  args: {
    align: 'end',
    trigger: <Button variant="gray">Judging round</Button>,
    items: itemMenuItems,
  },
};

export const WithDescriptions: Story = {
  args: {
    align: 'end',
    trigger: (
      <IconButton size="sm" shape="capsule" aria-label="More actions">
        {accountIcons.more}
      </IconButton>
    ),
    items: [
      { label: 'Copy preview link', icon: accountIcons.preview, onSelect: fn() },
      { separator: true },
      {
        label: 'Reset preview link',
        description: 'Anyone with the old link loses access.',
        icon: accountIcons.reset,
        onSelect: fn(),
      },
      {
        label: 'Send back for edits',
        description: 'Unsubmits it and emails the founder so they can make changes.',
        destructive: true,
        onSelect: fn(),
      },
    ],
  },
};

export const WideMenu: Story = {
  args: {
    ...WithDescriptions.args,
    minWidth: '17.5rem',
    items: (WithDescriptions.args?.items ?? []).slice(0, 3),
  },
};

export const MediumSize: Story = {
  args: {
    align: 'end',
    size: 'md',
    trigger: (
      <IconButton size="sm" shape="capsule" aria-label="More for Pitch video">
        {accountIcons.more}
      </IconButton>
    ),
    items: [
      { label: 'Edit', icon: accountIcons.edit, onSelect: fn() },
      { label: 'Duplicate', icon: accountIcons.duplicate, onSelect: fn() },
      { separator: true },
      { label: 'Delete question', icon: accountIcons.trash, destructive: true, onSelect: fn() },
    ],
  },
};

export const MediumSizeWithDescriptions: Story = {
  args: { ...WideMenu.args, size: 'md' },
};

export const OpenMenuWithDescriptions: Story = {
  tags: ['interaction', '!autodocs'],
  args: WithDescriptions.args,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'More actions' });
    await userEvent.click(trigger);
    const menu = await within(document.body).findByRole('menu');
    const reset = within(menu).getByRole('menuitem', { name: 'Reset preview link' });
    await expect(reset).toHaveAccessibleDescription('Anyone with the old link loses access.');
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
  },
};

export const IconButtonTrigger: Story = {
  args: {
    align: 'end',
    trigger: (
      <IconButton size="sm" shape="capsule" aria-label="More actions for this item">
        {accountIcons.more}
      </IconButton>
    ),
    items: itemMenuItems,
  },
};

export const IconButtonTriggerOpenStyle: Story = {
  tags: ['interaction', '!autodocs'],
  args: IconButtonTrigger.args,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'More actions for this item',
    });
    const probe = document.createElement('span');
    probe.style.backgroundColor = 'var(--fill)';
    trigger.parentElement?.append(probe);
    const openFill = getComputedStyle(probe).backgroundColor;
    probe.remove();
    const restingFill = getComputedStyle(trigger).backgroundColor;
    await expect(restingFill).not.toBe(openFill);

    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await within(document.body).findByRole('menu');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(getComputedStyle(trigger).backgroundColor).toBe(openFill));

    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(getComputedStyle(trigger).backgroundColor).not.toBe(openFill));
  },
};

export const OpenAccountMenu: Story = {
  tags: ['interaction', '!autodocs'],
  args: AccountMenuWithAvatar.args,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Joe Schwendt' });
    await userEvent.click(trigger);
    const menu = await within(document.body).findByRole('menu');
    const inbox = within(menu).getByRole('menuitem', { name: 'Inbox 3 unread' });
    await expect(inbox).toHaveAttribute('href', '#inbox');
    inbox.focus();
    await userEvent.keyboard('{End}');
    await expect(within(menu).getByRole('menuitem', { name: 'Sign out' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
  },
};

export const OpenMenu: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Round actions' });
    await userEvent.click(trigger);
    const menu = await within(document.body).findByRole('menu');
    await expect(menu).toBeVisible();
    await expect(within(menu).getByRole('menuitemcheckbox', { name: 'Judges' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
  },
};

export const SearchFieldFocus: Story = {
  tags: ['interaction', '!autodocs'],
  args: WithSearch.args,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Round actions' });
    await userEvent.click(trigger);
    const menu = await within(document.body).findByRole('menu');
    await waitFor(() =>
      expect(within(menu).getByRole('textbox', { name: 'Search judges' })).toHaveFocus(),
    );
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
  },
};

export const KeyboardNavigation: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Round actions' });
    const findItem = (menu: HTMLElement, name: string) =>
      within(menu).getByRole('menuitem', { name });

    await userEvent.click(trigger);
    let menu = await within(document.body).findByRole('menu');
    await waitFor(() => expect(findItem(menu, 'Edit schedule ⌘E')).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(findItem(menu, 'Duplicate round')).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(findItem(menu, 'Delete round')).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(findItem(menu, 'Edit schedule ⌘E')).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    menu = await within(document.body).findByRole('menu');
    await waitFor(() => expect(findItem(menu, 'Edit schedule ⌘E')).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    menu = await within(document.body).findByRole('menu');
    await waitFor(() => expect(findItem(menu, 'Edit schedule ⌘E')).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(findItem(menu, 'Duplicate round')).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
  },
};
