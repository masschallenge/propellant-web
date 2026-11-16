import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Menu } from './Menu';
import type { MenuItem } from './Menu';
import { Button } from '../Button/Button';
import { appearance, hide } from '../../.storybook/controls';

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
