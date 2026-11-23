import type { ComponentPropsWithoutRef } from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Menu } from './Menu';

afterEach(cleanup);

const renderMenu = (onSelect = vi.fn()) =>
  render(
    <Menu
      trigger={<button type="button">Account</button>}
      items={[
        { label: 'Open hub', onSelect },
        { label: 'More', submenu: [{ label: 'Nested action', onSelect }] },
      ]}
    />,
  );

describe('Menu focus', () => {
  it('runs the item and returns focus to the trigger', async () => {
    const onSelect = vi.fn();
    renderMenu(onSelect);
    const trigger = screen.getByRole('button', { name: 'Account' });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Open hub' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('returns focus to the trigger from a submenu item and on Escape', async () => {
    const onSelect = vi.fn();
    renderMenu(onSelect);
    const trigger = screen.getByRole('button', { name: 'Account' });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Nested action' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    screen.getByRole('menuitem', { name: 'Open hub' }).focus();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

describe('Menu keyboard', () => {
  const renderList = () =>
    render(
      <Menu
        trigger={<button type="button">Round actions</button>}
        items={[
          { label: 'Assign judges' },
          { separator: true },
          { label: 'Export scores' },
          { label: 'Archive', disabled: true },
          { label: 'Delete round', destructive: true },
        ]}
      />,
    );

  it('moves through enabled items with the arrow keys, Home and End', async () => {
    renderList();
    await userEvent.click(screen.getByRole('button', { name: 'Round actions' }));
    const first = screen.getByRole('menuitem', { name: 'Assign judges' });
    const middle = screen.getByRole('menuitem', { name: 'Export scores' });
    const last = screen.getByRole('menuitem', { name: 'Delete round' });
    expect(first).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(middle).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(last).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(first).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(last).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(first).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(last).toHaveFocus();
  });

  it('opens from the trigger with the arrow keys', async () => {
    renderList();
    const trigger = screen.getByRole('button', { name: 'Round actions' });
    trigger.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Delete round' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Assign judges' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes on Tab and returns focus to the trigger', async () => {
    renderList();
    const trigger = screen.getByRole('button', { name: 'Round actions' });
    await userEvent.click(trigger);
    await userEvent.tab();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes when the trigger is pressed again', async () => {
    renderList();
    const trigger = screen.getByRole('button', { name: 'Round actions' });
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

describe('Menu rows', () => {
  it('reads destructive and its danger alias in the critical tone', async () => {
    render(
      <Menu
        trigger={<button type="button">Account</button>}
        items={[
          { label: 'Delete round', destructive: true },
          { label: 'Log out', danger: true },
          { label: 'Profile' },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Account' }));
    expect(screen.getByRole('menuitem', { name: 'Delete round' })).toHaveClass(
      '[--row-label:var(--critical)]',
    );
    expect(screen.getByRole('menuitem', { name: 'Log out' })).toHaveClass(
      '[--row-label:var(--critical)]',
    );
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveClass(
      '[--row-label:var(--label)]',
      'not-disabled:hover:bg-[var(--tint)]',
    );
  });

  it('renders checkbox rows, sections and separators with menu roles', async () => {
    render(
      <Menu
        trigger={<button type="button">Columns</button>}
        items={[
          { section: 'Show' },
          { label: 'Judges', checkbox: true, selected: true },
          { label: 'Mentors', checkbox: true },
          { separator: true },
          { label: 'Reset' },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Columns' }));
    expect(screen.getByRole('menu')).toHaveClass(
      'bg-[var(--bg-elevated)]',
      'shadow-[var(--shadow-float)]',
      'rounded-[var(--corner-lg)]',
    );
    expect(screen.getByRole('menuitemcheckbox', { name: 'Judges' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('menuitemcheckbox', { name: 'Mentors' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    expect(screen.getByText('Show')).toHaveAttribute('role', 'presentation');
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('filters rows by the search query and clears it on close', async () => {
    render(
      <Menu
        search
        searchPlaceholder="Search judges"
        trigger={<button type="button">Judges</button>}
        items={[{ label: 'Priya Raman' }, { label: 'Marcus Chen' }]}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Judges' });
    await userEvent.click(trigger);
    await userEvent.type(screen.getByRole('textbox', { name: 'Search judges' }), 'pri');
    expect(screen.getByRole('menuitem', { name: 'Priya Raman' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Marcus Chen' })).not.toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await userEvent.click(trigger);
    expect(screen.getByRole('textbox', { name: 'Search judges' })).toHaveValue('');
  });

  it('ignores disabled rows and keeps the menu open', async () => {
    const onSelect = vi.fn();
    render(
      <Menu
        trigger={<button type="button">Round</button>}
        items={[{ label: 'Archive round', disabled: true, onSelect }]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Round' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Archive round' }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});

describe('Menu selection and layering', () => {
  it('exposes the selected choice as a checked radio item', async () => {
    render(
      <Menu
        trigger={<button type="button">Program</button>}
        items={[
          { label: 'Boston 2026', selected: true },
          { label: 'Israel 2026', selected: false },
          { label: 'Manage programs' },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Program' }));
    expect(screen.getByRole('menuitemradio', { name: 'Boston 2026' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('menuitemradio', { name: 'Israel 2026' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    expect(screen.getByRole('menuitem', { name: 'Manage programs' })).not.toHaveAttribute(
      'aria-checked',
    );
  });

  it('opens inside the nearest layer host so it stacks above a modal overlay', async () => {
    render(
      <div data-propellant-layer-host="" data-testid="host">
        <Menu trigger={<button type="button">Account</button>} items={[{ label: 'Log out' }]} />
      </div>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Account' }));
    expect(screen.getByTestId('host')).toContainElement(screen.getByRole('menu'));
  });
});

describe('Menu account avatar, counts and links', () => {
  it('shows the account avatar beside the name and email', async () => {
    const { rerender } = render(
      <Menu
        trigger={<button type="button">Account</button>}
        accountBand={{
          title: 'Joe Schwendt',
          sub: 'joe@masschallenge.org',
          avatar: { initials: 'JS' },
        }}
        items={[{ label: 'Help' }]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Account' }));
    const initials = screen.getByText('JS');
    expect(initials).toHaveAttribute('aria-hidden', 'true');
    expect(initials.parentElement).toHaveClass('w-[var(--avatar-md)]', 'fs-exclude');
    expect(screen.getByText('joe@masschallenge.org')).toBeInTheDocument();
    rerender(
      <Menu
        trigger={<button type="button">Account</button>}
        accountBand={{ title: 'Joe Schwendt', avatar: { src: '/joe.png' } }}
        items={[{ label: 'Help' }]}
      />,
    );
    expect(screen.getByRole('menu').querySelector('img')).toHaveAttribute('src', '/joe.png');
  });

  it('paints the account band avatar in its tone', async () => {
    render(
      <Menu
        trigger={<button type="button">Account</button>}
        accountBand={{ title: 'Joe Schwendt', avatar: { initials: 'JS', tone: 'teal' } }}
        items={[{ label: 'Help' }]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Account' }));
    expect(screen.getByText('JS')).toHaveClass(
      'bg-[var(--avatar-teal-bg)]',
      'text-[var(--avatar-teal-fg)]',
    );
  });

  it('leaves the account band without an avatar unchanged', async () => {
    render(
      <Menu
        trigger={<button type="button">Account</button>}
        accountBand={{ title: 'Jordan Lee' }}
        items={[{ label: 'Help' }]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Account' }));
    expect(screen.getByRole('menu').querySelector('img')).toBeNull();
    expect(screen.getByText('Jordan Lee').closest('li')).toHaveClass('pt-1.5');
  });

  it('renders rich title and sub content in the account band type', async () => {
    render(
      <Menu
        trigger={<button type="button">Account</button>}
        accountBand={{
          title: (
            <>
              Joe Schwendt <em>Admin</em>
            </>
          ),
          sub: (
            <>
              joe@masschallenge.org <strong>Verified</strong>
            </>
          ),
        }}
        items={[{ label: 'Help' }]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Account' }));
    const role = screen.getByText('Admin');
    expect(role.tagName).toBe('EM');
    expect(role.parentElement).toHaveClass('text-callout', 'font-semibold');
    const marker = screen.getByText('Verified');
    expect(marker.tagName).toBe('STRONG');
    expect(marker.parentElement).toHaveClass('text-footnote', 'text-[var(--label-secondary)]');
  });

  it('keeps string title and sub in the account band type', async () => {
    render(
      <Menu
        trigger={<button type="button">Account</button>}
        accountBand={{ title: 'Jordan Lee', sub: 'Program lead, Boston 2026' }}
        items={[{ label: 'Help' }]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Account' }));
    expect(screen.getByText('Jordan Lee')).toHaveClass('text-callout', 'font-semibold');
    expect(screen.getByText('Program lead, Boston 2026')).toHaveClass('text-footnote');
  });

  it('reads the unread count as part of the item name and hides it at 0', async () => {
    render(
      <Menu
        trigger={<button type="button">Account</button>}
        items={[
          { label: 'Inbox', badge: { count: 3 } },
          { label: 'Requests', badge: { count: 2, label: '2 new requests' } },
          { label: 'Messages', badge: { count: 0 } },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Account' }));
    const inbox = screen.getByRole('menuitem', { name: 'Inbox 3 unread' });
    const capsule = inbox.querySelector('[data-count]');
    expect(capsule).toHaveTextContent('3');
    expect(capsule).toHaveAttribute('aria-hidden', 'true');
    expect(capsule).toHaveClass('bg-[var(--critical-solid)]', 'text-[var(--on-critical)]');
    expect(screen.getByRole('menuitem', { name: 'Requests 2 new requests' })).toBeInTheDocument();
    const messages = screen.getByRole('menuitem', { name: 'Messages' });
    expect(messages.querySelector('[data-count]')).toBeNull();
  });

  it('renders href items as menuitem links that keep keyboard focus and close', async () => {
    const onSelect = vi.fn();
    render(
      <Menu
        trigger={<button type="button">Account</button>}
        items={[
          { label: 'Inbox', href: '#inbox', onSelect },
          { label: 'Remind me tomorrow' },
          { label: 'Archived', href: '#archived', disabled: true },
          { separator: true },
          { label: 'Sign out', href: '#sign-out' },
        ]}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Account' });
    await userEvent.click(trigger);
    const inbox = screen.getByRole('menuitem', { name: 'Inbox' });
    const signOut = screen.getByRole('menuitem', { name: 'Sign out' });
    expect(inbox.tagName).toBe('A');
    expect(inbox).toHaveAttribute('href', '#inbox');
    expect(inbox).toHaveClass('no-underline', 'not-disabled:hover:bg-[var(--tint)]');
    expect(screen.getByRole('menuitem', { name: 'Archived' }).tagName).toBe('BUTTON');
    expect(screen.getByRole('menuitem', { name: 'Archived' })).toBeDisabled();
    expect(inbox).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Remind me tomorrow' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(signOut).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(inbox).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('renders link items with linkAs', async () => {
    const RouterLink = ({ href, ...rest }: ComponentPropsWithoutRef<'a'>) => (
      <a data-router-link="" href={href} {...rest} />
    );
    render(
      <Menu
        trigger={<button type="button">Account</button>}
        items={[{ label: 'Your profile', href: '/profile', linkAs: RouterLink }]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Account' }));
    const profile = screen.getByRole('menuitem', { name: 'Your profile' });
    expect(profile).toHaveAttribute('data-router-link');
    expect(profile).toHaveAttribute('href', '/profile');
  });
});

describe('Menu item description', () => {
  it('names the item by its label and describes it with the second line', async () => {
    render(
      <Menu
        trigger={<button type="button">More actions</button>}
        items={[
          {
            label: 'Reset preview link',
            description: 'Anyone with the old link loses access.',
            onSelect: vi.fn(),
          },
          { label: 'Inbox', description: 'Messages for you', badge: { count: 2 } },
          { label: 'Copy preview link' },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));
    const reset = screen.getByRole('menuitem', { name: 'Reset preview link' });
    expect(reset).toHaveAccessibleDescription('Anyone with the old link loses access.');
    expect(reset).toHaveClass('items-start');
    expect(screen.getByText('Anyone with the old link loses access.')).toHaveClass(
      'text-footnote',
      'text-(--row-description)',
    );
    expect(screen.getByRole('menuitem', { name: 'Inbox 2 unread' })).toBeInTheDocument();
    const plain = screen.getByRole('menuitem', { name: 'Copy preview link' });
    expect(plain).not.toHaveAttribute('aria-describedby');
    expect(plain).not.toHaveAttribute('aria-labelledby');
    expect(plain).not.toHaveClass('items-start');
  });
});

describe('Menu panel width', () => {
  it('widens the panel to the given minimum and keeps the default otherwise', async () => {
    const { unmount } = render(
      <Menu
        trigger={<button type="button">More actions</button>}
        minWidth="17.5rem"
        items={[{ label: 'Copy preview link' }]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));
    expect(screen.getByRole('menu')).toHaveStyle({ minWidth: '17.5rem' });
    unmount();
    render(
      <Menu
        trigger={<button type="button">More actions</button>}
        items={[{ label: 'Copy preview link' }]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));
    const panel = screen.getByRole('menu');
    expect(panel.style.minWidth).toBe('');
    expect(panel).toHaveClass('min-w-[13.5rem]');
  });
});

describe('Menu size', () => {
  const renderSized = (size?: 'sm' | 'md') =>
    render(
      <Menu
        trigger={<button type="button">More actions</button>}
        size={size}
        items={[
          { label: 'Copy preview link' },
          { separator: true },
          { label: 'Reset preview link', description: 'Anyone with the old link loses access.' },
        ]}
      />,
    );

  it('keeps the small panel, rows and separator unless md is asked for', async () => {
    renderSized();
    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));
    expect(screen.getByRole('menu')).toHaveClass('min-w-[13.5rem]');
    expect(screen.getByRole('menuitem', { name: 'Copy preview link' })).toHaveClass(
      'min-h-[var(--control-sm)]',
      'px-2',
      'py-1',
    );
    expect(screen.getByRole('separator')).toHaveClass('mx-2');
  });

  it('draws the md panel at 232px with 32px rows and a narrower separator inset', async () => {
    renderSized('md');
    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));
    const panel = screen.getByRole('menu');
    expect(panel).toHaveClass('min-w-[14.5rem]');
    expect(panel).not.toHaveClass('min-w-[13.5rem]');
    expect(screen.getByRole('menuitem', { name: 'Copy preview link' })).toHaveClass(
      'min-h-[var(--control-md)]',
      'px-2.5',
      'py-1.5',
    );
    expect(screen.getByRole('menuitem', { name: 'Reset preview link' })).toHaveClass('py-2');
    expect(screen.getByRole('separator')).toHaveClass('mx-1.5');
  });
});
