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
      'enabled:hover:bg-[var(--tint)]',
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
