import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('titles with an h2 by default', () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Nothing here' })).toBeInTheDocument();
  });

  it('titles with the requested heading level inside a section', () => {
    render(<EmptyState title="No panels yet" titleAs="h4" />);
    expect(screen.getByRole('heading', { level: 4, name: 'No panels yet' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });

  it('sets the title in title 3 and the description in callout secondary', () => {
    render(<EmptyState title="No judges yet" description="Invite judges to start round 1." />);
    expect(screen.getByRole('heading', { name: 'No judges yet' }).className).toContain(
      'text-title3',
    );
    const description = screen.getByText('Invite judges to start round 1.');
    expect(description.className).toContain('text-callout');
    expect(description.className).toContain('text-[var(--label-secondary)]');
  });

  it('shows a plain tertiary symbol with no rings or tinted box', () => {
    const { container } = render(<EmptyState title="No results" />);
    const symbol = container.querySelector('[data-tone]') as HTMLElement;
    expect(symbol.getAttribute('data-tone')).toBe('neutral');
    expect(symbol.className).toContain('text-[var(--label-tertiary)]');
    expect(container.querySelector('.rounded-full.border')).toBeNull();
    expect(container.innerHTML).not.toContain('--tint');
  });

  it('keeps the live visual calm and decorative so only the copy is announced', () => {
    const { container } = render(
      <EmptyState live title="Your queue is empty" description="Panels show up here." />,
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'Your queue is empty' }),
    ).toBeInTheDocument();
    expect(container.querySelector('[data-live="true"]')).not.toBeNull();
    expect(container.querySelector('[class*="animate-"]')).toBeNull();
    expect(container.querySelector('[aria-hidden="true"] [data-tone]')).not.toBeNull();
  });

  it('renders avatar visuals as a quiet stack', () => {
    const { container } = render(
      <EmptyState visual="avatar-row" avatars={['/a.png', '/b.png']} title="No mentors yet" />,
    );
    expect(container.querySelectorAll('img')).toHaveLength(2);
  });

  it('frames on a white group without a border or shadow', () => {
    const { container } = render(<EmptyState title="No sessions" />);
    const frame = container.firstElementChild as HTMLElement;
    expect(frame.className).toContain('bg-[var(--bg)]');
    expect(frame.className).toContain('rounded-[var(--corner-lg)]');
    expect(frame.className).not.toContain('shadow');
  });
});
