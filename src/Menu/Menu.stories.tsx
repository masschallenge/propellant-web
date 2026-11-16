import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Menu } from './Menu';
import type { MenuItem } from './Menu';
import { Button } from '../Button/Button';
import { Tooltip } from '../Tooltip/Tooltip';
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
          'Portalled action menu anchored to a trigger, on the elevated surface. Rows highlight with the tint, destructive rows read in critical, and sections use footnote headers. Optional search field and account summary. `onOpenChange` reports each open and close, so a `Tooltip` around the trigger can be disabled while the menu is open and never covers it.',
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
    onOpenChange: hide,
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

const MenuInTooltip = ({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <Tooltip content="Actions for this round" disabled={isMenuOpen} placement="bottom">
      <Menu
        trigger={<Button variant="gray">Round actions</Button>}
        items={items}
        onOpenChange={(isOpen) => {
          setIsMenuOpen(isOpen);
          onOpenChange?.(isOpen);
        }}
      />
    </Tooltip>
  );
};

export const TooltipOnTrigger: Story = {
  tags: ['interaction', '!autodocs'],
  args: { onOpenChange: fn() },
  render: (args) => <MenuInTooltip onOpenChange={args.onOpenChange} />,
  play: async ({ args, canvasElement }) => {
    const body = within(document.body);
    const trigger = within(canvasElement).getByRole('button', { name: 'Round actions' });
    await userEvent.hover(trigger);
    await expect(await body.findByRole('tooltip')).toHaveTextContent('Actions for this round');

    await userEvent.click(trigger);
    await expect(await body.findByRole('menu')).toBeVisible();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await expect(body.queryByRole('tooltip')).toBeNull();

    await userEvent.keyboard('{ArrowDown}');
    await expect(body.queryByRole('tooltip')).toBeNull();

    await userEvent.keyboard('{Escape}');
    await expect(body.queryByRole('menu')).toBeNull();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expect(args.onOpenChange).toHaveBeenCalledTimes(2);
  },
};
