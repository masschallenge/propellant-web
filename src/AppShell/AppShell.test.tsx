import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppShell, useAppShell } from './AppShell';
import { Toolbar } from '../Toolbar/Toolbar';
import { Sidebar, SidebarItem, SidebarSection, SidebarSeparator } from '../Sidebar/Sidebar';
import { RoleTag } from '../RoleTag/RoleTag';

type ChangeListener = () => void;

const stubWidth = (width: number) => {
  const listeners: ChangeListener[] = [];
  const query = {
    matches: width >= 1024,
    addEventListener: (_event: string, listener: ChangeListener) => listeners.push(listener),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal('matchMedia', () => query);
  return {
    resize: (nextWidth: number) => {
      query.matches = nextWidth >= 1024;
      act(() => listeners.forEach((listener) => listener()));
    },
  };
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
  window.localStorage.clear();
});

const sidebar = (
  <Sidebar label="Console">
    <SidebarSection title="Program">
      <SidebarItem current href="/overview">
        Overview
      </SidebarItem>
      <SidebarItem href="/startups">Startups</SidebarItem>
    </SidebarSection>
  </Sidebar>
);

const renderShell = (props: Partial<React.ComponentProps<typeof AppShell>> = {}) =>
  render(
    <AppShell sidebar={sidebar} toolbar={<Toolbar title="Round 1" />} {...props}>
      <p>Applications to review</p>
    </AppShell>,
  );

describe('AppShell', () => {
  it('lays out the sidebar, toolbar, banner, main content and footer', () => {
    stubWidth(1280);
    renderShell({
      banner: <div role="status">Viewing as Ada</div>,
      footer: <footer>Footer</footer>,
    });
    expect(screen.getByRole('navigation', { name: 'Console' })).toBeInTheDocument();
    expect(screen.getByRole('banner')).toHaveTextContent('Round 1');
    expect(screen.getByRole('status')).toHaveTextContent('Viewing as Ada');
    expect(screen.getByRole('main')).toHaveTextContent('Applications to review');
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Footer');
  });

  it('links the skip link to the main landmark', () => {
    stubWidth(1280);
    renderShell({ mainId: 'console-main' });
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      '#console-main',
    );
    expect(screen.getByRole('main')).toHaveAttribute('id', 'console-main');
  });

  it('pads the main area unless flush', () => {
    stubWidth(1280);
    const { unmount } = renderShell();
    expect(screen.getByRole('main').className).toContain('px-[var(--page-margin)]');
    unmount();
    renderShell({ flush: true });
    expect(screen.getByRole('main').className).not.toContain('px-[');
  });

  it('marks the requested appearance for the scoped theme', () => {
    stubWidth(1280);
    const { container } = renderShell({ appearance: 'light' });
    expect(container.querySelector('[data-appearance="light"]')).not.toBeNull();
  });

  it('collapses and restores the inline sidebar from the toolbar on wide screens', async () => {
    stubWidth(1280);
    renderShell();
    const toggle = screen.getByRole('button', { name: 'Show sidebar' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Console' })).not.toBeInTheDocument();
    await userEvent.click(toggle);
    expect(screen.getByRole('navigation', { name: 'Console' })).toBeInTheDocument();
  });

  it('opens the sidebar as a modal overlay on compact screens and closes it with Escape', async () => {
    stubWidth(800);
    renderShell();
    const toggle = screen.getByRole('button', { name: 'Show sidebar' });
    expect(screen.queryByRole('navigation', { name: 'Console' })).not.toBeInTheDocument();
    await userEvent.click(toggle);
    const overlay = screen.getByRole('dialog', { name: 'Navigation' });
    expect(overlay).toHaveAttribute('aria-modal', 'true');
    expect(overlay).toHaveAttribute('data-propellant-layer-host');
    expect(within(overlay).getByRole('link', { name: 'Overview' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });

  it('offers its own sidebar toggle on compact screens when there is no toolbar', async () => {
    stubWidth(800);
    renderShell({ toolbar: undefined, sidebarToggleLabel: 'Show navigation' });
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: 'Show navigation' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    const overlay = screen.getByRole('dialog', { name: 'Navigation' });
    expect(toggle).toHaveAttribute('aria-controls', overlay.id);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });

  it('leaves its toggle out when the product brings its own', () => {
    stubWidth(800);
    renderShell({ toolbar: undefined, showsSidebarToggle: false });
    expect(screen.queryByRole('button', { name: 'Show sidebar' })).not.toBeInTheDocument();
  });

  it('leaves the toggle to the toolbar, and shows none on wide screens without one', () => {
    stubWidth(800);
    renderShell();
    expect(screen.getAllByRole('button', { name: 'Show sidebar' })).toHaveLength(1);
    cleanup();
    stubWidth(1280);
    renderShell({ toolbar: undefined });
    expect(screen.queryByRole('button', { name: 'Show sidebar' })).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Console' })).toBeInTheDocument();
  });

  it('keeps Tab focus inside the overlay', async () => {
    stubWidth(800);
    renderShell();
    await userEvent.click(screen.getByRole('button', { name: 'Show sidebar' }));
    const overlay = screen.getByRole('dialog', { name: 'Navigation' });
    const first = within(overlay).getByRole('link', { name: 'Overview' });
    const last = within(overlay).getByRole('link', { name: 'Startups' });
    expect(first).toHaveFocus();
    await userEvent.tab();
    expect(last).toHaveFocus();
    await userEvent.tab();
    expect(first).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(last).toHaveFocus();
    screen.getByRole('button', { name: 'Show sidebar' }).focus();
    await userEvent.tab();
    expect(first).toHaveFocus();
    screen.getByRole('button', { name: 'Show sidebar' }).focus();
    await userEvent.tab({ shift: true });
    expect(last).toHaveFocus();
  });

  it('closes the overlay when a destination is chosen', async () => {
    stubWidth(800);
    renderShell();
    await userEvent.click(screen.getByRole('button', { name: 'Show sidebar' }));
    const overlay = screen.getByRole('dialog', { name: 'Navigation' });
    within(overlay)
      .getByRole('link', { name: 'Startups' })
      .addEventListener('click', (event) => event.preventDefault());
    await userEvent.click(within(overlay).getByRole('link', { name: 'Startups' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the overlay from the scrim and when the window grows wide', async () => {
    stubWidth(800);
    const viewport = stubWidth(800);
    const { container } = renderShell();
    await userEvent.click(screen.getByRole('button', { name: 'Show sidebar' }));
    const scrim = container.querySelector('.bg-\\[var\\(--scrim\\)\\]') as HTMLElement;
    await userEvent.click(scrim);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Show sidebar' }));
    viewport.resize(1280);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Console' })).toBeInTheDocument();
  });

  it('leaves the sidebar toggle out when there is no sidebar', () => {
    stubWidth(1280);
    render(
      <AppShell toolbar={<Toolbar title="Apply" />}>
        <p>Form</p>
      </AppShell>,
    );
    expect(screen.queryByRole('button', { name: 'Show sidebar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('starts wide when matchMedia is unavailable', () => {
    vi.stubGlobal('matchMedia', undefined);
    renderShell();
    expect(screen.getByRole('navigation', { name: 'Console' })).toBeInTheDocument();
  });

  describe('rail', () => {
    const treeSidebar = (
      <Sidebar label="Console" header={<span>Accelerate</span>}>
        <SidebarSection title="Program">
          <SidebarItem href="/home" icon={<svg />}>
            Home
          </SidebarItem>
          <SidebarItem
            href="/program"
            icon={<svg />}
            inTrail
            expanded
            count={3}
            accessory={<RoleTag tone="pm">PM</RoleTag>}
            subitems={
              <SidebarItem href="/program/judges" current>
                Judges
              </SidebarItem>
            }
          >
            Program Manager
          </SidebarItem>
        </SidebarSection>
      </Sidebar>
    );

    const ShellState = () => {
      const shell = useAppShell();
      return (
        <output
          data-testid="shell-state"
          data-mode={shell?.collapseMode}
          data-collapsed={String(shell?.isCollapsed)}
          data-rail={String(shell?.isRail)}
        />
      );
    };

    const renderRail = (props: Partial<React.ComponentProps<typeof AppShell>> = {}) =>
      render(
        <AppShell
          sidebar={treeSidebar}
          sidebarCollapse="rail"
          toolbar={<Toolbar title="Round 1" />}
          {...props}
        >
          <ShellState />
          <button type="button">Page action</button>
        </AppShell>,
      );

    const sidebarColumn = () =>
      screen.getByRole('navigation', { name: 'Console' }).closest('[data-sidebar-state]');

    const shellState = () => screen.getByTestId('shell-state');

    it('keeps the full sidebar until it is collapsed, and drops the toolbar toggle', async () => {
      stubWidth(1280);
      renderRail();
      expect(screen.queryByRole('button', { name: 'Show sidebar' })).not.toBeInTheDocument();
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'pinned');
      expect(shellState()).toHaveAttribute('data-mode', 'rail');
      expect(screen.getByRole('link', { name: 'Judges' })).toBeVisible();
      const collapse = screen.getByRole('button', { name: 'Collapse menu' });
      expect(collapse).toHaveAttribute('aria-expanded', 'true');
      expect(collapse).toHaveAttribute('aria-controls', sidebarColumn()?.id);
      await userEvent.click(collapse);
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'rail');
      expect(screen.getByRole('button', { name: 'Expand menu' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(shellState()).toHaveAttribute('data-collapsed', 'true');
      expect(shellState()).toHaveAttribute('data-rail', 'true');
      await userEvent.click(screen.getByRole('button', { name: 'Expand menu' }));
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'pinned');
      expect(shellState()).toHaveAttribute('data-collapsed', 'false');
      expect(screen.getByRole('link', { name: 'Judges' })).toBeVisible();
      expect(screen.getByRole('button', { name: 'Collapse menu' })).toBeInTheDocument();
    });

    it('eases the column between the tree and the rail only after a click', async () => {
      stubWidth(1280);
      renderRail({ sidebarStorageKey: 'console-sidebar-motion', defaultSidebarCollapsed: true });
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'rail');
      expect(sidebarColumn()?.className).not.toContain('transition-');

      await userEvent.click(screen.getByRole('button', { name: 'Expand menu' }));
      const column = sidebarColumn() as HTMLElement;
      expect(column).toHaveAttribute('data-sidebar-state', 'pinned');
      expect(column.className).toContain('transition-[width,background-color]');
      expect(column.className).toContain('duration-[var(--duration-resize)]');
      expect(column.className).toContain('ease-[var(--ease-in-out)]');
      expect(column.className).toContain('overflow-hidden');
      expect(column.firstElementChild?.className).toContain('w-[var(--sidebar-width)]');

      fireEvent.transitionEnd(column.firstElementChild as HTMLElement, { propertyName: 'width' });
      expect(column.className).toContain('transition-');
      fireEvent.transitionEnd(column, { propertyName: 'background-color' });
      expect(column.className).toContain('transition-');
      fireEvent.transitionEnd(column, { propertyName: 'width' });
      expect(column.className).not.toContain('transition-');
      expect(column.className).not.toContain('overflow-hidden');
      expect(column.firstElementChild?.className).not.toContain('w-[var(--sidebar-width)]');

      await userEvent.click(screen.getByRole('button', { name: 'Collapse menu' }));
      expect(column).toHaveAttribute('data-sidebar-state', 'rail');
      expect(column.className).toContain('duration-[var(--duration-resize)]');
      expect(column.firstElementChild?.className).not.toContain('w-[var(--sidebar-width)]');
    });

    it('stacks the column above page content so its menus can overhang the rail', () => {
      stubWidth(1280);
      renderRail({ defaultSidebarCollapsed: true });
      expect(sidebarColumn()?.className).toContain('z-[var(--layer-sticky)]');
    });

    it('settles the column even when the width transition never ends', () => {
      vi.useFakeTimers();
      stubWidth(1280);
      renderRail();
      fireEvent.click(screen.getByRole('button', { name: 'Collapse menu' }));
      expect(sidebarColumn()?.className).toContain('transition-');
      act(() => {
        vi.advanceTimersByTime(399);
      });
      expect(sidebarColumn()?.className).toContain('transition-');
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(sidebarColumn()?.className).not.toContain('transition-');
      vi.useRealTimers();
    });

    it('never animates the column in hide mode', async () => {
      stubWidth(1280);
      renderRail({ sidebarCollapse: 'hide' });
      const toggle = screen.getByRole('button', { name: 'Show sidebar' });
      await userEvent.click(toggle);
      await userEvent.click(toggle);
      expect(sidebarColumn()?.className).not.toContain('transition-');
    });

    it('starts in the rail when the product asks', () => {
      stubWidth(1280);
      renderRail({ defaultSidebarCollapsed: true });
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'rail');
      expect(sidebarColumn()).toHaveClass('w-[var(--sidebar-rail-width)]');
    });

    it('shows top level rows as icons that keep their names', () => {
      stubWidth(1280);
      renderRail({ defaultSidebarCollapsed: true });
      const program = screen.getByRole('button', { name: /^Program Manager, 3$/ });
      expect(program).not.toHaveAttribute('aria-expanded');
      expect(program).toHaveClass('bg-[var(--fill)]');
      expect(program).toHaveAttribute('aria-current', 'true');
      expect(screen.queryByRole('link', { name: 'Judges' })).not.toBeInTheDocument();
      expect(screen.queryByText('PM')).not.toBeInTheDocument();
      expect(screen.queryByText('Accelerate')).not.toBeInTheDocument();
      expect(screen.getByRole('list', { name: 'Program' })).toBeInTheDocument();
      expect(screen.getByText('Program')).toHaveClass('sr-only');
    });

    it('stays a rail when the mouse rests on it, focus moves in or Escape is pressed', () => {
      vi.useFakeTimers();
      stubWidth(1280);
      renderRail({ defaultSidebarCollapsed: true });
      const column = sidebarColumn() as HTMLElement;
      fireEvent.pointerEnter(column, { pointerType: 'mouse' });
      fireEvent.pointerMove(column, { pointerType: 'mouse', movementX: 3, movementY: 1 });
      act(() => vi.advanceTimersByTime(1000));
      const program = screen.getByRole('button', { name: /^Program Manager/ });
      act(() => program.focus());
      fireEvent.keyDown(program, { key: 'Escape' });
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'rail');
      expect(shellState()).toHaveAttribute('data-rail', 'true');
      expect(screen.queryByRole('link', { name: 'Judges' })).not.toBeInTheDocument();
    });

    it('navigates from a leaf icon and stays a rail', () => {
      stubWidth(1280);
      renderRail({ defaultSidebarCollapsed: true });
      const home = screen.getByRole('link', { name: 'Home' });
      expect(home).toHaveAttribute('href', '/home');
      home.addEventListener('click', (event) => event.preventDefault());
      fireEvent.click(home);
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'rail');
    });

    it('keeps the pinned tree open after a choice, Escape, a press outside or the mouse leaving', () => {
      stubWidth(1280);
      renderRail();
      const column = sidebarColumn() as HTMLElement;
      const judges = screen.getByRole('link', { name: 'Judges' });
      judges.addEventListener('click', (event) => event.preventDefault());
      fireEvent.click(judges);
      fireEvent.keyDown(judges, { key: 'Escape' });
      fireEvent.pointerDown(screen.getByRole('button', { name: 'Page action' }));
      fireEvent.pointerLeave(column, { pointerType: 'mouse' });
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'pinned');
      expect(screen.getByRole('link', { name: 'Judges' })).toBeVisible();
    });

    it('marks the trail row as the current location only in the rail', async () => {
      stubWidth(1280);
      renderRail();
      expect(screen.getByRole('button', { name: /^Program Manager/ })).not.toHaveAttribute(
        'aria-current',
      );
      expect(screen.getByRole('link', { name: 'Judges' })).toHaveAttribute('aria-current', 'page');
      await userEvent.click(screen.getByRole('button', { name: 'Collapse menu' }));
      expect(screen.getByRole('button', { name: /^Program Manager/ })).toHaveAttribute(
        'aria-current',
        'true',
      );
    });

    const networkSidebar = (
      <Sidebar label="Console">
        <SidebarSection>
          <SidebarItem
            href="/network"
            icon={<svg />}
            subitems={<SidebarItem href="/network/profile">Profile</SidebarItem>}
          >
            Network
          </SidebarItem>
          <SidebarSeparator />
          <SidebarItem href="/admin" icon={<svg />}>
            Admin
          </SidebarItem>
        </SidebarSection>
      </Sidebar>
    );

    const renderNetworkRail = (props: Partial<React.ComponentProps<typeof AppShell>> = {}) =>
      render(
        <AppShell
          sidebarCollapse="rail"
          defaultSidebarCollapsed
          sidebar={networkSidebar}
          {...props}
        />,
      );

    it('pins the tree with the parent expanded when a parent icon is clicked', () => {
      stubWidth(1280);
      renderNetworkRail();
      fireEvent.click(screen.getByRole('button', { name: 'Network' }));
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'pinned');
      expect(screen.getByRole('button', { name: 'Network' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(screen.getByRole('link', { name: 'Profile' })).toBeVisible();
      expect(screen.getByRole('button', { name: 'Collapse menu' })).toBeInTheDocument();
    });

    it('draws the rail as 32px buttons with 18px icons under a 32px menu button', () => {
      stubWidth(1280);
      renderNetworkRail();
      const network = screen.getByRole('button', { name: 'Network' });
      expect(network).toHaveClass(
        'w-[var(--control-md)]',
        'h-[var(--control-md)]',
        'mx-auto',
        'justify-center',
      );
      expect(network.closest('li')).toHaveClass('py-0.5');
      expect(network.querySelector('[aria-hidden="true"]')).toHaveClass(
        'w-[var(--icon-md)]',
        'h-[var(--icon-md)]',
      );
      const expand = screen.getByRole('button', { name: 'Expand menu' });
      expect(expand).toHaveClass(
        'w-[var(--control-md)]!',
        'h-[var(--control-md)]!',
        'text-[var(--label)]!',
      );
      expect(expand.parentElement).toHaveClass('justify-center', 'pb-2');
    });

    it('keeps an open parent open when its icon pins the tree', () => {
      stubWidth(1280);
      render(
        <AppShell
          sidebarCollapse="rail"
          defaultSidebarCollapsed
          sidebar={
            <Sidebar label="Console">
              <SidebarSection>
                <SidebarItem
                  icon={<svg />}
                  defaultExpanded
                  subitems={<SidebarItem href="/network/profile">Profile</SidebarItem>}
                >
                  Network
                </SidebarItem>
              </SidebarSection>
            </Sidebar>
          }
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Network' }));
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'pinned');
      expect(screen.getByRole('button', { name: 'Network' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });

    it('shows a small logo and names the stage state of a row in the rail', () => {
      stubWidth(1280);
      render(
        <AppShell
          sidebarCollapse="rail"
          defaultSidebarCollapsed
          sidebar={
            <Sidebar label="Console">
              <SidebarSection>
                <SidebarItem href="/program" media={{ src: '/logo.png', alt: '' }}>
                  HealthTech Traction 2027
                </SidebarItem>
                <SidebarItem href="/review" marker={{ state: 'now', label: 'in progress' }}>
                  Online review
                </SidebarItem>
              </SidebarSection>
            </Sidebar>
          }
        />,
      );
      const program = screen.getByRole('link', { name: 'HealthTech Traction 2027' });
      expect(program.querySelector('img')).toHaveClass(
        'w-8.5',
        'h-5',
        'rounded-[var(--corner-sm)]',
        'object-contain',
        'shadow-[inset_0_0_0_1px_var(--separator)]',
      );
      expect(screen.getByRole('link', { name: 'Online review, in progress' })).toBeInTheDocument();
    });

    it('stores the tree a parent icon pins', () => {
      stubWidth(1280);
      renderNetworkRail({ sidebarStorageKey: 'console-sidebar-parent' });
      fireEvent.click(screen.getByRole('button', { name: 'Network' }));
      expect(window.localStorage.getItem('console-sidebar-parent')).toBe('false');
    });

    it('keeps the pinned tree when a parent toggles or a leaf is chosen', () => {
      stubWidth(1280);
      renderNetworkRail();
      fireEvent.click(screen.getByRole('button', { name: 'Network' }));
      const network = screen.getByRole('button', { name: 'Network' });
      fireEvent.click(network);
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'pinned');
      expect(network).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(network);
      const profile = screen.getByRole('link', { name: 'Profile' });
      profile.addEventListener('click', (event) => event.preventDefault());
      fireEvent.click(profile);
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'pinned');
      expect(screen.getByRole('link', { name: 'Profile' })).toBeVisible();
    });

    it('drops separators from the rail and shows them in the pinned tree', () => {
      stubWidth(1280);
      renderNetworkRail();
      const separators = () =>
        (sidebarColumn() as HTMLElement).querySelectorAll('li[aria-hidden="true"]');
      expect(separators()).toHaveLength(0);
      fireEvent.click(screen.getByRole('button', { name: 'Network' }));
      expect(separators()).toHaveLength(1);
    });

    it('centers the footer in the rail without its hairline', () => {
      stubWidth(1280);
      render(
        <AppShell
          sidebarCollapse="rail"
          defaultSidebarCollapsed
          sidebar={
            <Sidebar label="Console" footer={<span>Ada</span>}>
              <SidebarSection>
                <SidebarItem href="/home" icon={<svg />}>
                  Home
                </SidebarItem>
              </SidebarSection>
            </Sidebar>
          }
        />,
      );
      const footer = screen.getByText('Ada').parentElement;
      expect(footer).toHaveClass('flex', 'justify-center');
      expect(footer).not.toHaveClass('border-t', 'mt-2', 'pt-2.5');
    });

    it('shows the full tree in the compact overlay', async () => {
      stubWidth(800);
      renderRail({ defaultSidebarCollapsed: true });
      await userEvent.click(screen.getByRole('button', { name: 'Show sidebar' }));
      const overlay = screen.getByRole('dialog', { name: 'Navigation' });
      expect(within(overlay).getByRole('link', { name: 'Judges' })).toBeInTheDocument();
      expect(within(overlay).queryByRole('button', { name: /menu$/ })).not.toBeInTheDocument();
      expect(shellState()).toHaveAttribute('data-rail', 'false');
    });

    it('keeps the compact overlay open when a branch opens or closes', async () => {
      stubWidth(800);
      render(
        <AppShell
          sidebar={
            <Sidebar label="Console">
              <SidebarSection>
                <SidebarItem subitems={<SidebarItem href="/emails">Email templates</SidebarItem>}>
                  Configuration
                </SidebarItem>
              </SidebarSection>
            </Sidebar>
          }
          toolbar={<Toolbar />}
        />,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Show sidebar' }));
      await userEvent.click(screen.getByRole('button', { name: 'Configuration' }));
      expect(screen.getByRole('dialog', { name: 'Navigation' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Email templates' })).toBeInTheDocument();
    });

    it('keeps Tab focus inside the overlay past a closed branch at the end', async () => {
      stubWidth(800);
      render(
        <AppShell
          sidebar={
            <Sidebar label="Console">
              <SidebarSection>
                <SidebarItem href="/home">Home</SidebarItem>
                <SidebarItem subitems={<SidebarItem href="/emails">Email templates</SidebarItem>}>
                  Configuration
                </SidebarItem>
              </SidebarSection>
            </Sidebar>
          }
          toolbar={<Toolbar />}
        />,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Show sidebar' }));
      const home = screen.getByRole('link', { name: 'Home' });
      const configuration = screen.getByRole('button', { name: 'Configuration' });
      expect(home).toHaveFocus();
      await userEvent.tab({ shift: true });
      expect(configuration).toHaveFocus();
      await userEvent.tab();
      expect(home).toHaveFocus();
    });

    it('keeps the compact overlay open for a parent and closes it on a leaf', async () => {
      stubWidth(800);
      render(<AppShell sidebar={networkSidebar} toolbar={<Toolbar />} />);
      await userEvent.click(screen.getByRole('button', { name: 'Show sidebar' }));
      await userEvent.click(screen.getByRole('button', { name: 'Network' }));
      expect(screen.getByRole('dialog', { name: 'Navigation' })).toBeInTheDocument();
      const profile = screen.getByRole('link', { name: 'Profile' });
      profile.addEventListener('click', (event) => event.preventDefault());
      await userEvent.click(profile);
      expect(screen.queryByRole('dialog', { name: 'Navigation' })).not.toBeInTheDocument();
    });

    it('remembers the collapsed choice under the storage key', async () => {
      stubWidth(1280);
      const { unmount } = renderRail({ sidebarStorageKey: 'console-sidebar-remember' });
      await userEvent.click(screen.getByRole('button', { name: 'Collapse menu' }));
      expect(window.localStorage.getItem('console-sidebar-remember')).toBe('true');
      unmount();
      renderRail({ sidebarStorageKey: 'console-sidebar-remember' });
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'rail');
    });

    it('prefers the stored choice over the default', () => {
      stubWidth(1280);
      window.localStorage.setItem('console-sidebar-stored', 'false');
      renderRail({ sidebarStorageKey: 'console-sidebar-stored', defaultSidebarCollapsed: true });
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'pinned');
    });

    it('follows a choice made in another tab', () => {
      stubWidth(1280);
      renderRail({ sidebarStorageKey: 'console-sidebar-tabs' });
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'pinned');
      act(() => {
        window.localStorage.setItem('console-sidebar-tabs', 'true');
        window.dispatchEvent(new StorageEvent('storage', { key: 'console-sidebar-tabs' }));
      });
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'rail');
    });

    it('still collapses when storage is blocked', async () => {
      stubWidth(1280);
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('blocked');
      });
      renderRail({ sidebarStorageKey: 'console-sidebar-blocked' });
      await userEvent.click(screen.getByRole('button', { name: 'Collapse menu' }));
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'rail');
    });

    it('starts from the default when storage cannot be read', () => {
      stubWidth(1280);
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('blocked');
      });
      renderRail({
        sidebarStorageKey: 'console-sidebar-unreadable',
        defaultSidebarCollapsed: true,
      });
      expect(sidebarColumn()).toHaveAttribute('data-sidebar-state', 'rail');
    });

    it('renders the default on the server, whatever is stored', () => {
      window.localStorage.setItem('console-sidebar-server', 'false');
      const markup = renderToString(
        <AppShell
          sidebar={treeSidebar}
          sidebarCollapse="rail"
          sidebarStorageKey="console-sidebar-server"
          defaultSidebarCollapsed
        />,
      );
      expect(markup).toContain('data-sidebar-state="rail"');
      const unstoredMarkup = renderToString(
        <AppShell sidebar={treeSidebar} sidebarCollapse="rail" defaultSidebarCollapsed />,
      );
      expect(unstoredMarkup).toContain('data-sidebar-state="rail"');
    });

    it('remembers a hidden sidebar in hide mode too', async () => {
      stubWidth(1280);
      const { unmount } = renderShell({ sidebarStorageKey: 'console-sidebar-hide' });
      await userEvent.click(screen.getByRole('button', { name: 'Show sidebar' }));
      unmount();
      renderShell({ sidebarStorageKey: 'console-sidebar-hide' });
      expect(screen.queryByRole('navigation', { name: 'Console' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Show sidebar' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });
  });
});
