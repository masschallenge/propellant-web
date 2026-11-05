import * as React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Inspector, InspectorRow } from './Inspector';

afterEach(cleanup);

const Launcher = ({ onClose = () => {} }: { onClose?: () => void }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open panel
      </button>
      <Inspector
        open={open}
        title="Filters"
        onClose={() => {
          onClose();
          setOpen(false);
        }}
      >
        <button type="button">First action</button>
        <button type="button">Last action</button>
      </Inspector>
    </>
  );
};

describe('Inspector width', () => {
  it('keeps the default and wide widths and caps every size at the viewport', () => {
    const { rerender } = render(<Inspector open onClose={() => {}} title="Panel" />);
    expect(screen.getByRole('dialog').className).toContain('w-[420px]');
    expect(screen.getByRole('dialog').className).toContain('max-w-full');
    rerender(<Inspector open onClose={() => {}} title="Panel" wide />);
    expect(screen.getByRole('dialog').className).toContain('w-[480px]');
    rerender(<Inspector open onClose={() => {}} title="Panel" wide size="xl" />);
    expect(screen.getByRole('dialog').className).toContain('w-[640px]');
  });
});

describe('Inspector focus', () => {
  it('wraps Tab inside the panel in both directions', async () => {
    render(<Launcher />);
    await userEvent.click(screen.getByRole('button', { name: 'Open panel' }));
    expect(screen.getByRole('dialog')).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Last action' })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Close panel' })).toHaveFocus();
  });

  it('returns focus to the trigger when it closes', async () => {
    render(<Launcher />);
    const trigger = screen.getByRole('button', { name: 'Open panel' });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: 'Close panel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('skips controls inside a hidden subtree when wrapping', async () => {
    render(
      <Inspector open onClose={() => {}} title="Panel">
        <button type="button">Shown action</button>
        <div hidden>
          <button type="button">Hidden action</button>
        </div>
      </Inspector>,
    );
    screen.getByRole('button', { name: 'Shown action' }).focus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Close panel' })).toHaveFocus();
  });

  it('uses the browser visibility check when it exists', async () => {
    const checkVisibility = vi.fn(() => true);
    Object.defineProperty(HTMLElement.prototype, 'checkVisibility', {
      value: checkVisibility,
      configurable: true,
    });
    render(<Launcher />);
    await userEvent.click(screen.getByRole('button', { name: 'Open panel' }));
    await userEvent.tab({ shift: true });
    expect(checkVisibility).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Last action' })).toHaveFocus();
    delete (HTMLElement.prototype as { checkVisibility?: unknown }).checkVisibility;
  });

  it('holds focus on the panel when it has nothing focusable', () => {
    render(<Inspector open onClose={() => {}} />);
    const dialog = screen.getByRole('dialog');
    dialog.querySelector('button')?.setAttribute('disabled', '');
    dialog.focus();
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    dialog.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(true);
    expect(dialog).toHaveFocus();
  });
});

describe('Inspector scrim', () => {
  it('closes on a scrim press, blocks the default blur, and refocuses the trigger', async () => {
    render(<Launcher />);
    const trigger = screen.getByRole('button', { name: 'Open panel' });
    await userEvent.click(trigger);
    const scrim = screen.getByRole('dialog').parentElement as HTMLElement;
    const press = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    scrim.dispatchEvent(press);
    expect(press.defaultPrevented).toBe(true);
    expect(await screen.findByRole('button', { name: 'Open panel' })).toHaveFocus();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('ignores presses inside the panel', async () => {
    const onClose = vi.fn();
    render(<Launcher onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open panel' }));
    const press = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    screen.getByRole('button', { name: 'First action' }).dispatchEvent(press);
    expect(press.defaultPrevented).toBe(false);
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('Inspector Escape', () => {
  it('closes on Escape', async () => {
    const onClose = vi.fn();
    render(<Launcher onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open panel' }));
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('leaves an Escape that a nested control already handled alone', () => {
    const onClose = vi.fn();
    render(
      <Inspector open onClose={onClose} title="Panel">
        <input
          aria-label="Search"
          onKeyDown={(event) => {
            if (event.key === 'Escape') event.preventDefault();
          }}
        />
      </Inspector>,
    );
    const search = screen.getByRole('textbox', { name: 'Search' });
    search.focus();
    search.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('Inspector surface', () => {
  it('sits on the elevated surface with a hairline edge and a title3 heading', () => {
    render(<Inspector open onClose={() => {}} title="Panel filters" description="Round 2" />);
    const dialog = screen.getByRole('dialog', { name: 'Panel filters' });
    expect(dialog).toHaveClass(
      'bg-[var(--bg-elevated)]',
      'shadow-[var(--shadow-sheet)]',
      'border-[var(--separator)]',
    );
    expect(dialog.parentElement).toHaveClass('bg-[var(--scrim)]');
    expect(screen.getByRole('heading', { name: 'Panel filters' })).toHaveClass('text-title3');
  });
});

describe('InspectorRow', () => {
  it('renders a static label and value row', () => {
    render(<InspectorRow label="Round" value="Round 2" />);
    expect(screen.getByText('Round')).toBeInTheDocument();
    expect(screen.getByText('Round 2')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('toggles as a pressed button when it is selectable', async () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <InspectorRow label="Only my cohorts" selected={false} onClick={onClick} />,
    );
    const row = screen.getByRole('button', { name: 'Only my cohorts' });
    expect(row).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(row);
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<InspectorRow label="Only my cohorts" selected onClick={onClick} />);
    expect(screen.getByRole('button', { name: 'Only my cohorts' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Only my cohorts' })).toHaveClass(
      'bg-[var(--tint-fill)]',
    );
  });

  it('stays a plain action button without a selection state', () => {
    render(<InspectorRow label="Open schedule" onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Open schedule' })).not.toHaveAttribute(
      'aria-pressed',
    );
  });
});

describe('Inspector close label', () => {
  it('names its close button from closeLabel', () => {
    render(<Inspector open onClose={() => {}} title="Filters" closeLabel="Close filters" />);
    expect(screen.getByRole('button', { name: 'Close filters' })).toBeInTheDocument();
  });
});
