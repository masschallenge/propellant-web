import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Toolbar } from './Toolbar';
import type { ToolbarProps } from './Toolbar';
import { AppShell } from '../AppShell/AppShell';
import { Sidebar, SidebarItem, SidebarSection } from '../Sidebar/Sidebar';

const stubWide = (isWide: boolean) =>
  vi.stubGlobal('matchMedia', () => ({
    matches: isWide,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  document.documentElement.style.scrollPaddingTop = '';
});

const renderInShell = (props: ToolbarProps = {}) =>
  render(
    <AppShell
      sidebar={
        <Sidebar label="Console">
          <SidebarSection>
            <SidebarItem href="/overview">Overview</SidebarItem>
          </SidebarSection>
        </Sidebar>
      }
      toolbar={<Toolbar title="Round 1" {...props} />}
    >
      <p>Applications to review</p>
    </AppShell>,
  );

describe('Toolbar', () => {
  it('renders leading, title, trailing and accessory content in a banner', () => {
    render(
      <Toolbar
        leading={<button type="button">Cohort Alpha</button>}
        title="Round 1"
        trailing={<button type="button">Export</button>}
        accessory={<div role="radiogroup" aria-label="Program stage" />}
      />,
    );
    const banner = screen.getByRole('banner');
    expect(banner).toHaveTextContent('Round 1');
    expect(screen.getByRole('button', { name: 'Cohort Alpha' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: 'Program stage' })).toBeInTheDocument();
  });

  it('sticks to the top by default and can scroll away', () => {
    const { rerender } = render(<Toolbar title="Round 1" />);
    expect(screen.getByRole('banner')).toHaveClass('sticky', 'top-0');
    rerender(<Toolbar title="Round 1" sticky={false} />);
    expect(screen.getByRole('banner')).not.toHaveClass('sticky');
  });

  it('marks itself as the app header that sticky page frames clear', () => {
    render(<Toolbar title="Round 1" />);
    expect(screen.getByRole('banner')).toHaveAttribute('data-propellant-app-header');
  });

  it('shows no sidebar toggle outside an app shell', () => {
    render(<Toolbar title="Round 1" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('draws the sidebar glyph on the sidebar toggle by default', () => {
    renderInShell();
    const toggle = screen.getByRole('button', { name: 'Show sidebar' });
    expect(toggle.querySelector('svg rect')).toBeInTheDocument();
    expect(toggle.querySelectorAll('svg path')).toHaveLength(1);
  });

  it('draws the menu glyph when asked and keeps the accessible name', () => {
    renderInShell({ sidebarToggleIcon: 'menu', sidebarToggleLabel: 'Show navigation' });
    const toggle = screen.getByRole('button', { name: 'Show navigation' });
    const glyph = toggle.querySelector('svg');
    expect(glyph).toHaveAttribute('aria-hidden', 'true');
    expect(glyph?.querySelector('rect')).not.toBeInTheDocument();
    expect(glyph?.querySelector('path')).toHaveAttribute('d', 'M4 6.5h16M4 12h16M4 17.5h16');
  });

  it.each([
    ['hide', true, true],
    ['rail', true, false],
    ['rail', false, true],
  ] as const)(
    'in %s mode on a wide window (%s) shows the sidebar toggle: %s',
    (mode, isWide, showsToggle) => {
      stubWide(isWide);
      render(
        <AppShell sidebar={<Sidebar />} sidebarCollapse={mode} toolbar={<Toolbar />}>
          <p>Page</p>
        </AppShell>,
      );
      const toggle = screen.queryByRole('button', { name: 'Show sidebar' });
      expect(Boolean(toggle)).toBe(showsToggle);
    },
  );

  it('reserves its height as scroll padding so focus never lands under it', () => {
    const measurements: Array<() => void> = [];
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          measurements.push(callback);
        }
        observe = observe;
        disconnect = disconnect;
      },
    );
    const heightSpy = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(52);
    const root = document.documentElement;
    const { unmount } = render(<Toolbar title="Round 1" />);
    expect(observe).toHaveBeenCalledWith(screen.getByRole('banner'));
    expect(root.style.scrollPaddingTop).toBe('52px');

    heightSpy.mockReturnValue(96);
    act(() => measurements.forEach((measure) => measure()));
    expect(root.style.scrollPaddingTop).toBe('96px');

    unmount();
    expect(disconnect).toHaveBeenCalled();
    expect(root.style.scrollPaddingTop).toBe('');
    heightSpy.mockRestore();
  });

  it('leaves scroll padding alone when it scrolls away with the page', () => {
    const root = document.documentElement;
    root.style.scrollPaddingTop = '12px';
    render(<Toolbar title="Round 1" sticky={false} />);
    expect(root.style.scrollPaddingTop).toBe('12px');
  });

  it('shares the page padding with another toolbar and restores it whichever unmounts first', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    const heightSpy = vi
      .spyOn(HTMLElement.prototype, 'offsetHeight', 'get')
      .mockImplementation(function (this: HTMLElement) {
        return this.textContent?.includes('Console') ? 52 : 96;
      });
    const root = document.documentElement;
    root.style.scrollPaddingTop = '8px';
    const appToolbar = render(<Toolbar title="Console" />);
    const pageToolbar = render(<Toolbar title="Round 1" />);
    expect(root.style.scrollPaddingTop).toBe('96px');

    appToolbar.unmount();
    expect(root.style.scrollPaddingTop).toBe('96px');
    pageToolbar.unmount();
    expect(root.style.scrollPaddingTop).toBe('8px');
    heightSpy.mockRestore();
  });

  it('pads the scrolling frame it sticks in, not the page', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    const heightSpy = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(52);
    const root = document.documentElement;
    const { unmount } = render(
      <div data-testid="story-frame" style={{ overflowY: 'auto' }}>
        <Toolbar title="Round 1" />
      </div>,
    );
    const frame = screen.getByTestId('story-frame');
    expect(frame.style.scrollPaddingTop).toBe('52px');
    expect(root.style.scrollPaddingTop).toBe('');
    unmount();
    heightSpy.mockRestore();
  });

  it('still reserves its height where ResizeObserver is missing', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    const heightSpy = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(52);
    render(<Toolbar title="Round 1" />);
    expect(document.documentElement.style.scrollPaddingTop).toBe('52px');
    heightSpy.mockRestore();
  });
});
