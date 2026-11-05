import { act, cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppShell } from './AppShell';
import { Toolbar } from '../Toolbar/Toolbar';
import { Sidebar, SidebarItem, SidebarSection } from '../Sidebar/Sidebar';

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
    expect(within(overlay).getByRole('link', { name: 'Overview' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
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
});
