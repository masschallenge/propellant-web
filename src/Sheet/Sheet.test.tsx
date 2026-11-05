import * as React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Sheet } from './Sheet';
import { Tooltip, TooltipTrigger } from '../Tooltip/Tooltip';

afterEach(cleanup);

const Launcher = ({ onClose = () => {} }: { onClose?: () => void }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open modal
      </button>
      <Sheet
        open={open}
        title="Pitch deck"
        onClose={() => {
          onClose();
          setOpen(false);
        }}
      >
        <button type="button">Inside</button>
      </Sheet>
    </>
  );
};

describe('Sheet role and size', () => {
  it('defaults to a dialog and can be an alertdialog', () => {
    const { rerender } = render(<Sheet open title="Title" onClose={() => {}} />);
    expect(screen.getByRole('dialog', { name: 'Title' })).toBeInTheDocument();
    rerender(<Sheet open title="Title" role="alertdialog" onClose={() => {}} />);
    expect(screen.getByRole('alertdialog', { name: 'Title' })).toBeInTheDocument();
  });

  it('fills the viewport and lets the body grow at full size', () => {
    render(
      <Sheet open size="full" title="Deck" onClose={() => {}}>
        Body
      </Sheet>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Deck' });
    expect(dialog.className).toContain('max-w-none');
    expect(dialog.className).toContain('h-full');
    expect(screen.getByText('Body').className).toContain('flex-1');
  });
});

describe('Sheet xl size', () => {
  it('widens for a multi-column form and still scrolls only the body', () => {
    render(
      <Sheet open size="xl" title="Round settings" onClose={() => {}}>
        Wide body
      </Sheet>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Round settings' });
    expect(dialog.className).toContain('max-w-[1152px]');
    expect(dialog.className).toContain('max-h-full');
    expect(screen.getByText('Wide body').className).toContain('overflow-y-auto');
  });
});

describe('Sheet tall content', () => {
  it('keeps the panel inside the viewport and scrolls only the body', () => {
    render(
      <Sheet open title="Settings" footer={<button type="button">Save</button>} onClose={() => {}}>
        Long body
      </Sheet>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Settings' });
    expect(dialog.className).toContain('max-h-full');
    expect(screen.getByText('Long body').className).toContain('overflow-y-auto');
    expect(screen.getByRole('button', { name: 'Save' }).parentElement?.className).toContain(
      'shrink-0',
    );
    expect(screen.getByRole('heading', { name: 'Settings' }).closest('.shrink-0')).not.toBeNull();
  });

  it('leaves the full size and side layouts to size themselves', () => {
    render(
      <Sheet open size="full" title="Deck" onClose={() => {}}>
        Deck body
      </Sheet>,
    );
    expect(screen.getByRole('dialog', { name: 'Deck' }).className).not.toContain('max-h-full');
    expect(screen.getByText('Deck body').className).not.toContain('overflow-y-auto');
  });
});

describe('Sheet long text', () => {
  it('wraps a long unbroken title and description instead of overflowing', () => {
    render(
      <Sheet
        open
        title={'Supercalifragilistic'.repeat(4)}
        description={'x'.repeat(80)}
        onClose={() => {}}
      />,
    );
    expect(screen.getByRole('heading').className).toContain('[overflow-wrap:anywhere]');
    expect(screen.getByText('x'.repeat(80)).className).toContain('[overflow-wrap:anywhere]');
  });
});

describe('Sheet focus', () => {
  it('wraps Tab inside the panel and skips hidden controls', async () => {
    render(
      <Sheet open title="Title" onClose={() => {}}>
        <button type="button">Shown</button>
        <div hidden>
          <button type="button">Hidden</button>
        </div>
      </Sheet>,
    );
    expect(screen.getByRole('dialog')).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Shown' })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  });

  it('wraps Tab past trailing controls that sit out of the tab order', async () => {
    render(
      <Sheet open title="Title" onClose={() => {}}>
        <button type="button">Shown</button>
        <button type="button" tabIndex={-1}>
          Roving
        </button>
      </Sheet>,
    );
    screen.getByRole('button', { name: 'Shown' }).focus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  });

  it('closes on a scrim press, blocks the default blur, and returns focus to the trigger', async () => {
    const onClose = vi.fn();
    render(<Launcher onClose={onClose} />);
    const trigger = screen.getByRole('button', { name: 'Open modal' });
    await userEvent.click(trigger);
    const scrim = screen.getByRole('dialog').parentElement as HTMLElement;
    const press = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    scrim.dispatchEvent(press);
    expect(press.defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole('button', { name: 'Open modal' })).toHaveFocus();
  });

  it('ignores presses inside the panel', async () => {
    const onClose = vi.fn();
    render(<Launcher onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open modal' }));
    const press = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    screen.getByRole('button', { name: 'Inside' }).dispatchEvent(press);
    expect(press.defaultPrevented).toBe(false);
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('Sheet Escape', () => {
  it('lets an open tooltip inside take the first Escape, then closes on the next', async () => {
    const onClose = vi.fn();
    render(
      <div data-propellant>
        <Sheet open title="Can't make it?" onClose={onClose}>
          <Tooltip content="Only the program team sees it.">
            <TooltipTrigger aria-label="About the reason" />
          </Tooltip>
        </Sheet>
      </div>,
    );
    await userEvent.hover(screen.getByRole('button', { name: 'About the reason' }));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();

    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape through the onClose of the latest render', async () => {
    const firstOnClose = vi.fn();
    const latestOnClose = vi.fn();
    const { rerender } = render(<Sheet open title="Title" onClose={firstOnClose} />);
    rerender(<Sheet open title="Title" onClose={latestOnClose} />);

    await userEvent.keyboard('{Escape}');

    expect(firstOnClose).not.toHaveBeenCalled();
    expect(latestOnClose).toHaveBeenCalledTimes(1);
  });

  it('ignores an Escape another layer already handled', () => {
    const onClose = vi.fn();
    render(<Sheet open title="Title" onClose={onClose} />);
    const handled = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    handled.preventDefault();

    document.dispatchEvent(handled);

    expect(onClose).not.toHaveBeenCalled();
  });

  const StackedModals = ({ onOuterClose }: { onOuterClose: () => void }) => {
    const [isInnerOpen, setIsInnerOpen] = React.useState(false);
    return (
      <>
        <Sheet open title="Outer" onClose={onOuterClose}>
          <button type="button" onClick={() => setIsInnerOpen(true)}>
            Open inner
          </button>
        </Sheet>
        <Sheet open={isInnerOpen} title="Inner" onClose={() => setIsInnerOpen(false)}>
          <button type="button">Inner action</button>
        </Sheet>
      </>
    );
  };

  it('closes only the newest of two stacked modals, then the one beneath on the next Escape', async () => {
    const onOuterClose = vi.fn();
    render(<StackedModals onOuterClose={onOuterClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open inner' }));

    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('dialog', { name: 'Inner' })).not.toBeInTheDocument();
    expect(onOuterClose).not.toHaveBeenCalled();
    await userEvent.keyboard('{Escape}');
    expect(onOuterClose).toHaveBeenCalledTimes(1);
  });

  it('traps Tab only in the newest of two stacked modals', async () => {
    render(<StackedModals onOuterClose={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open inner' }));
    const inner = screen.getByRole('dialog', { name: 'Inner' });

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab({ shift: true });

    expect(inner.contains(document.activeElement)).toBe(true);
  });
});

describe('Sheet surface', () => {
  it('sits on the elevated surface with the sheet shadow over the scrim', () => {
    render(<Sheet open title="Round settings" onClose={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: 'Round settings' });
    expect(dialog).toHaveClass(
      'bg-[var(--bg-elevated)]',
      'shadow-[var(--shadow-sheet)]',
      'rounded-[var(--corner-xl)]',
    );
    expect(dialog.parentElement).toHaveClass('bg-[var(--scrim)]');
    expect(screen.getByRole('heading', { name: 'Round settings' })).toHaveClass('text-title2');
  });

  it('shows the tone as a plain coloured glyph that keeps its tone attribute', () => {
    render(<Sheet open tone="success" title="Cohort published" onClose={() => {}} />);
    const glyph = screen.getByRole('dialog').querySelector('[data-tone="success"]');
    expect(glyph).toHaveClass('text-[var(--success)]');
    expect(glyph?.querySelector('svg')).not.toBeNull();
  });

  it('drops the glyph when hidden and shows an avatar instead when given one', () => {
    const { rerender } = render(<Sheet open hideIcon title="Deck" onClose={() => {}} />);
    expect(screen.getByRole('dialog').querySelector('[data-tone]')).toBeNull();
    rerender(<Sheet open avatar="/priya.png" title="Access request" onClose={() => {}} />);
    expect(screen.getByRole('dialog').querySelector('img')).toHaveAttribute('src', '/priya.png');
    expect(screen.getByRole('dialog').querySelector('[data-tone]')).toBeNull();
  });

  it('stacks footer actions full width on narrow screens and rows them on wider ones', () => {
    const { rerender } = render(
      <Sheet
        open
        title="Delete round"
        footer={<button type="button">Delete</button>}
        onClose={() => {}}
      />,
    );
    const rowFooter = screen.getByRole('button', { name: 'Delete' }).parentElement;
    expect(rowFooter).toHaveClass('flex-col-reverse', 'sm:flex-row', 'sm:justify-end');
    rerender(
      <Sheet
        open
        title="Delete round"
        footerLayout="wide"
        footer={<button type="button">Delete</button>}
        onClose={() => {}}
      />,
    );
    const wideFooter = screen.getByRole('button', { name: 'Delete' }).parentElement;
    expect(wideFooter).toHaveClass('flex-col-reverse');
    expect(wideFooter).not.toHaveClass('sm:flex-row');
  });

  it('closes from the close button', async () => {
    const onClose = vi.fn();
    render(<Sheet open title="Round settings" onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
