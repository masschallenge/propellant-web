import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Breadcrumb } from './Breadcrumb';

afterEach(cleanup);

describe('Breadcrumb crumbs', () => {
  it('renders an onClick crumb as a button that runs the handler', async () => {
    const onBack = vi.fn();
    render(
      <Breadcrumb
        items={[
          { label: 'Application Dashboard', onClick: onBack },
          { label: 'HeartPath AI', href: '/x' },
          { label: 'Feedback Report' },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Application Dashboard' }));
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('link', { name: 'HeartPath AI' })).toHaveAttribute('href', '/x');
    expect(screen.getByText('Feedback Report')).toHaveAttribute('aria-current', 'page');
  });

  it('renders a crumb with no href or handler as plain text, not a dead link', () => {
    render(
      <Breadcrumb
        items={[{ label: 'Dashboard', href: '/' }, { label: 'HeartPath AI' }, { label: 'Report' }]}
      />,
    );
    expect(screen.queryByRole('link', { name: 'HeartPath AI' })).toBeNull();
    expect(screen.getByText('HeartPath AI')).not.toHaveAttribute('aria-current');
  });

  it('lets a long unbroken crumb wrap inside the trail', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'AVeryLongUnbrokenCompanyName' },
          { label: 'Report' },
        ]}
      />,
    );
    expect(screen.getByText('AVeryLongUnbrokenCompanyName').closest('li')?.className).toContain(
      '[overflow-wrap:anywhere]',
    );
  });
});

describe('Breadcrumb styles', () => {
  it('renders ancestors as plain capsule links and the current page in label color', () => {
    render(
      <Breadcrumb items={[{ label: 'Programs', href: '/programs' }, { label: 'Boston 2026' }]} />,
    );
    const link = screen.getByRole('link', { name: 'Programs' });
    expect(link.className).toContain('rounded-[var(--corner-capsule)]');
    expect(link.className).toContain('text-[var(--tint)]');
    const current = screen.getByText('Boston 2026');
    expect(current.className).toContain('text-[var(--label)]');
    expect(current.className).not.toContain('--tint');
  });

  it('shows the current page as a tint fill capsule in the pill variant', () => {
    render(
      <Breadcrumb
        variant="pill"
        items={[{ label: 'Programs', href: '/programs' }, { label: 'Judging' }]}
      />,
    );
    const current = screen.getByText('Judging');
    expect(current.className).toContain('bg-[var(--tint-fill)]');
    expect(current.className).toContain('rounded-[var(--corner-capsule)]');
  });

  it('uses the given accessible name and a home link', () => {
    render(
      <Breadcrumb
        aria-label="Program trail"
        homeHref="/"
        items={[{ label: 'Cohort' }]}
        separator="slash"
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Program trail' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByText('/')).toBeTruthy();
  });
});

describe('Breadcrumb account switcher', () => {
  const ACCOUNTS = [
    { name: 'MassChallenge Boston', sub: 'Program manager' },
    { name: 'MassChallenge Texas', sub: 'Judge' },
  ];

  it('opens a radio menu, switches the account and closes', async () => {
    const user = userEvent.setup();
    render(<Breadcrumb account={ACCOUNTS} items={[{ label: 'Overview' }]} />);
    const trigger = screen.getByRole('button', { name: /MassChallenge Boston/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(screen.getByRole('menu', { name: 'Switch account' })).toBeTruthy();
    expect(screen.getByRole('menuitemradio', { name: /Boston/ })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await user.click(screen.getByRole('menuitemradio', { name: /Texas/ }));
    expect(screen.queryByRole('menu')).toBeNull();
    expect(screen.getByRole('button', { name: /MassChallenge Texas/ })).toBeTruthy();
  });

  it('picks with the keyboard and reports to a controlled owner', async () => {
    const user = userEvent.setup();
    const onAccountChange = vi.fn();
    render(
      <Breadcrumb
        account={ACCOUNTS}
        activeAccount={0}
        onAccountChange={onAccountChange}
        items={[{ label: 'Overview' }]}
      />,
    );
    await user.click(screen.getByRole('button', { name: /MassChallenge Boston/ }));
    screen.getByRole('menuitemradio', { name: /Texas/ }).focus();
    await user.keyboard('{Enter}');
    expect(onAccountChange).toHaveBeenCalledWith(1);
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    render(<Breadcrumb account={ACCOUNTS} items={[{ label: 'Overview' }]} />);
    await user.click(screen.getByRole('button', { name: /MassChallenge Boston/ }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
