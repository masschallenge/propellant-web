import * as React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Sheet } from './Sheet';
import { AppShell } from '../AppShell/AppShell';
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

describe('Sheet md-wide size', () => {
  it('caps the dialog at 540px for the email confirmation board', () => {
    render(
      <Sheet open size="md-wide" title="Email 52 founders?" onClose={() => {}}>
        Recipients
      </Sheet>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Email 52 founders?' });
    expect(dialog.className).toContain('max-w-[540px]');
    expect(dialog.className).not.toContain('max-w-[520px]');
  });

  it('keeps md at 520px', () => {
    render(<Sheet open title="Title" onClose={() => {}} />);
    expect(screen.getByRole('dialog', { name: 'Title' }).className).toContain('max-w-[520px]');
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

describe('Sheet side placement', () => {
  it('caps a md-wide side panel at 540px from the small breakpoint', () => {
    render(
      <Sheet open placement="side" size="md-wide" title="Recipients" onClose={() => {}}>
        Body
      </Sheet>,
    );
    expect(screen.getByRole('dialog', { name: 'Recipients' })).toHaveClass(
      'max-w-none',
      'sm:max-w-[540px]',
    );
  });

  it('opens as a full height panel on the right that scrolls its body', () => {
    render(
      <Sheet open placement="side" eyebrow="Preview" title="Traction 2026" onClose={() => {}}>
        Copied stages
      </Sheet>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Traction 2026' });
    expect(dialog).toHaveAttribute('data-placement', 'side');
    expect(dialog).toHaveClass('h-full', 'max-w-none', 'sm:max-w-[520px]');
    expect(dialog.className).not.toContain('rounded-[var(--corner-xl)]');
    expect(dialog.className).not.toContain('max-h-full');
    expect(dialog.parentElement).toHaveClass('justify-end', 'items-stretch', 'bg-[var(--scrim)]');
    expect(screen.getByText('Copied stages')).toHaveClass('flex-1', 'overflow-y-auto');
    expect(screen.getByText('Preview')).toHaveClass('text-subheadline');
  });

  it('closes on Escape and returns focus like the centred sheet', async () => {
    const SideLauncher = () => {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Preview
          </button>
          <Sheet open={open} placement="side" title="Traction 2026" onClose={() => setOpen(false)}>
            <button type="button">Inside</button>
          </Sheet>
        </>
      );
    };
    render(<SideLauncher />);
    const trigger = screen.getByRole('button', { name: 'Preview' });
    await userEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Traction 2026' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
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

describe('Sheet divided header', () => {
  it('keeps the stacked title2 header and floating close button by default', () => {
    render(<Sheet open title="Office hours added" description="Mon, Nov 23" onClose={() => {}} />);
    const title = screen.getByRole('heading', { name: 'Office hours added' });
    expect(title).toHaveClass('text-title2');
    expect(screen.getByText('Mon, Nov 23')).toHaveClass('text-callout');
    expect(screen.getByRole('button', { name: 'Close' }).parentElement).toHaveClass('absolute');
  });

  it('draws the icon, title and close in one row above a separator', () => {
    render(
      <Sheet
        open
        header="divided"
        closeButton="plain"
        icon={<svg data-testid="message-icon" />}
        title="Office hours added"
        description="Mon, Nov 23"
        onClose={() => {}}
      >
        <p>Body</p>
      </Sheet>,
    );
    const title = screen.getByRole('heading', { name: 'Office hours added' });
    expect(title).toHaveClass('text-title3');
    expect(screen.getByText('Mon, Nov 23')).toHaveClass('text-subheadline');
    const headerRow = title.parentElement?.parentElement as HTMLElement;
    expect(headerRow).toHaveClass('flex', 'items-center', 'border-b', 'border-[var(--separator)]');
    expect(headerRow).toContainElement(screen.getByTestId('message-icon'));
    const close = screen.getByRole('button', { name: 'Close' });
    expect(headerRow).toContainElement(close);
    expect(close.parentElement).not.toHaveClass('absolute');
    expect(headerRow).not.toContainElement(screen.getByText('Body'));
    expect(screen.getByRole('dialog')).toHaveAccessibleDescription('Mon, Nov 23');
  });

  it('closes from the close button in the divided header', async () => {
    const onClose = vi.fn();
    render(<Sheet open header="divided" title="Office hours added" onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('leaves the horizontal layout header as it was', () => {
    render(<Sheet open header="divided" layout="horizontal" title="Deck" onClose={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Deck' })).toHaveClass('text-title2');
    expect(screen.getByRole('button', { name: 'Close' }).parentElement).toHaveClass('absolute');
  });
});

describe('Sheet content placement', () => {
  const overlayOf = (dialog: HTMLElement) => dialog.parentElement as HTMLElement;
  const overlayClassesOf = (name: string) =>
    overlayOf(screen.getByRole('dialog', { name })).className.split(' ');

  const renderInShell = (
    sheet: React.ReactNode,
    shellProps: Partial<React.ComponentProps<typeof AppShell>> = {},
  ) =>
    render(
      <AppShell sidebar={<nav aria-label="Main">Links</nav>} {...shellProps}>
        {sheet}
      </AppShell>,
    );

  it('insets by the pinned sidebar and aligns to the top on wide screens', () => {
    renderInShell(<Sheet open placement="content" title="Archive stage?" onClose={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: 'Archive stage?' });
    expect(dialog).toHaveAttribute('data-placement', 'content');
    expect(dialog.className).not.toContain('translate-x');
    expect(dialog.className).toContain('max-h-full');
    const overlayClasses = overlayClassesOf('Archive stage?');
    expect(overlayClasses).toContain('lg:items-start');
    expect(overlayClasses).toContain('lg:pt-[var(--sheet-offset-sm)]');
    expect(overlayClasses).toContain('lg:pl-[calc(var(--sidebar-width)+var(--space-6))]');
  });

  it('insets by the rail width when the sidebar is a rail', () => {
    renderInShell(<Sheet open placement="content" title="Rail" onClose={() => {}} />, {
      sidebarCollapse: 'rail',
      defaultSidebarCollapsed: true,
    });
    const overlayClasses = overlayClassesOf('Rail');
    expect(overlayClasses).toContain('lg:pl-[calc(var(--sidebar-rail-width)+var(--space-6))]');
    expect(overlayClasses).not.toContain('lg:pl-[calc(var(--sidebar-width)+var(--space-6))]');
  });

  it.each([
    ['collapsed', { defaultSidebarCollapsed: true }],
    ['absent', { sidebar: undefined }],
  ] as const)('spans the window when the sidebar is %s', (_state, shellProps) => {
    renderInShell(<Sheet open placement="content" title="No sidebar" onClose={() => {}} />, {
      ...shellProps,
    });
    const overlayClasses = overlayClassesOf('No sidebar');
    expect(overlayClasses).toContain('lg:items-start');
    expect(overlayClasses.some((name) => name.startsWith('lg:pl-'))).toBe(false);
  });

  it.each([
    ['sm', 'lg:pt-[var(--sheet-offset-sm)]'],
    ['md', 'lg:pt-[var(--sheet-offset-md)]'],
    ['lg', 'lg:pt-[var(--sheet-offset-lg)]'],
    ['xl', 'lg:pt-[var(--sheet-offset-xl)]'],
  ] as const)('sets the %s top offset with %s', (topOffset, padding) => {
    renderInShell(
      <Sheet open placement="content" topOffset={topOffset} title="Offset" onClose={() => {}} />,
    );
    expect(overlayClassesOf('Offset')).toContain(padding);
  });

  it('falls back to center outside an AppShell', () => {
    render(<Sheet open placement="content" topOffset="xl" title="Loose" onClose={() => {}} />);
    expect(screen.getByRole('dialog', { name: 'Loose' })).toHaveAttribute(
      'data-placement',
      'center',
    );
    const overlayClasses = overlayClassesOf('Loose');
    expect(overlayClasses).not.toContain('lg:items-start');
    expect(overlayClasses).not.toContain('lg:pt-[var(--sheet-offset-xl)]');
  });

  it('leaves the center placement vertically centered and uninset in a shell', () => {
    renderInShell(<Sheet open topOffset="xl" title="Centered" onClose={() => {}} />);
    const overlayClasses = overlayClassesOf('Centered');
    expect(overlayClasses).not.toContain('lg:items-start');
    expect(overlayClasses.some((name) => name.startsWith('lg:pl-'))).toBe(false);
  });
});

describe('Sheet close button', () => {
  it('is a gray button with the regular glyph by default', () => {
    render(<Sheet open title="Gray close" onClose={() => {}} />);
    const close = screen.getByRole('button', { name: 'Close' });
    expect(close.className).toContain('bg-[var(--fill-secondary)]');
    expect(close.querySelector('svg')).toHaveAttribute('stroke-width', '2.2');
  });

  it('drops the fill and draws a 24px glyph at stroke 1.5 when plain', () => {
    render(<Sheet open closeButton="plain" title="Plain close" onClose={() => {}} />);
    const close = screen.getByRole('button', { name: 'Close' });
    expect(close.className.split(' ')).toContain('bg-transparent');
    expect(close.className.split(' ')).not.toContain('bg-[var(--fill-secondary)]');
    const glyphBox = close.firstElementChild as HTMLElement;
    expect(glyphBox.className).toContain('w-6');
    expect(glyphBox.className).toContain('h-6');
    expect(glyphBox.className).toContain('text-[var(--label)]');
    expect(close.querySelector('svg')).toHaveAttribute('stroke-width', '1.5');
  });

  it('still closes when plain', async () => {
    const onClose = vi.fn();
    render(<Sheet open closeButton="plain" title="Plain close" onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('Sheet sectioned layout', () => {
  const renderSectioned = (onClose = () => {}) =>
    render(
      <Sheet
        open
        inline
        layout="sectioned"
        size="xl"
        title="Suggest evaluators"
        onClose={onClose}
        footer={<button type="button">Invite</button>}
      >
        <button type="button">Inside</button>
      </Sheet>,
    );

  it('splits the panel into a header, a grouped body and a footer with no outer padding', () => {
    renderSectioned();
    const dialog = screen.getByRole('dialog', { name: 'Suggest evaluators' });
    expect(dialog).toHaveClass('overflow-hidden', 'rounded-[var(--corner-xl)]', 'max-w-[1152px]');
    expect(dialog).not.toHaveClass('p-6');
    const [header, body, footer] = Array.from(dialog.children) as HTMLElement[];
    expect(header).toHaveClass(
      'py-[var(--space-5)]',
      'px-[var(--space-6)]',
      'border-b-[length:var(--hairline)]',
    );
    expect(header).toContainElement(screen.getByRole('button', { name: 'Close' }));
    expect(screen.getByRole('heading', { name: 'Suggest evaluators' })).toHaveClass('text-title3');
    expect(body).toHaveClass(
      'overflow-y-auto',
      'bg-[var(--bg-grouped)]',
      'py-[var(--space-5)]',
      'px-[var(--space-6)]',
    );
    expect(body).toContainElement(screen.getByRole('button', { name: 'Inside' }));
    expect(footer).toHaveClass(
      'py-[var(--space-4)]',
      'px-[var(--space-6)]',
      'border-t-[length:var(--hairline)]',
      'bg-[var(--bg-elevated)]',
    );
    expect(footer).toContainElement(screen.getByRole('button', { name: 'Invite' }));
  });

  it('keeps the close button and the Tab trap', async () => {
    const onClose = vi.fn();
    renderSectioned(onClose);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Invite' })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('Sheet sectioned without body or footer', () => {
  it('renders only the header', () => {
    render(<Sheet open inline layout="sectioned" title="Suggest evaluators" onClose={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: 'Suggest evaluators' });
    expect(dialog.children).toHaveLength(1);
    expect(dialog).toContainElement(screen.getByRole('button', { name: 'Close' }));
  });
});

describe('Sheet split layout', () => {
  it('sets the media beside the heading', () => {
    render(
      <Sheet open inline layout="split" title="Welcome" media={<span>Art</span>} onClose={() => {}}>
        Body
      </Sheet>,
    );
    const mediaPanel = screen.getByText('Art').parentElement as HTMLElement;
    expect(mediaPanel).toHaveClass('w-45');
    expect(mediaPanel.nextElementSibling).toContainElement(
      screen.getByRole('heading', { name: 'Welcome' }),
    );
  });
});
