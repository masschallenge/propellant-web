import { render, cleanup, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ActivityFeed } from './ActivityFeed';
import type { ActivityItem } from './ActivityFeed';

afterEach(cleanup);

const ITEMS: ActivityItem[] = [
  {
    id: 'a1',
    name: 'Amara Okafor',
    action: 'scored an application',
    when: '2 hours ago',
    initials: 'AO',
  },
  {
    id: 'a2',
    name: 'Diego Ramos',
    action: 'booked office hours',
    when: 'Yesterday',
    initials: 'DR',
    unread: true,
    online: true,
  },
];

describe('ActivityFeed', () => {
  it('lists each event with its actor, action and time on a white group', () => {
    render(<ActivityFeed items={ITEMS} aria-label="Judging activity" />);
    const list = screen.getByRole('list', { name: 'Judging activity' });
    expect(list.className).toContain('bg-[var(--bg)]');
    expect(list.className).toContain('rounded-[var(--corner-lg)]');
    expect(list.className).not.toContain('shadow');
    const rows = within(list).getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(within(rows[0]).getByText('scored an application')).toBeTruthy();
    expect(within(rows[0]).getByText('2 hours ago').className).toContain('text-footnote');
  });

  it('draws inset hairlines between divided rows only', () => {
    render(<ActivityFeed items={ITEMS} />);
    const rows = screen.getAllByRole('listitem');
    expect(rows[0].className).not.toContain('after:');
    expect(rows[1].className).toContain('after:h-[var(--hairline)]');
  });

  it('marks unread rows with a named dot and a bolder name, and presence with text', () => {
    render(<ActivityFeed items={ITEMS} />);
    expect(screen.getByRole('img', { name: 'Unread' })).toBeTruthy();
    expect(screen.getByText('Diego Ramos').className).toContain('font-semibold');
    expect(screen.getByText('Online')).toBeTruthy();
  });

  it('puts initials on a neutral fill', () => {
    render(<ActivityFeed items={ITEMS} />);
    expect(screen.getByText('AO').className).toContain('bg-[var(--fill)]');
  });

  it('shows messages with a handle and the time inline', () => {
    render(
      <ActivityFeed
        items={[
          {
            id: 'm1',
            name: 'Priya Nair',
            handle: '@priya',
            message: 'Deck is ready',
            when: '9:41 AM',
          },
        ]}
      />,
    );
    expect(screen.getByText('@priya')).toBeTruthy();
    expect(screen.getByText('Deck is ready').className).toContain('fs-mask');
    expect(screen.getByText('9:41 AM').className).toContain("before:content-['·']");
  });

  it('defaults its accessible name to Activity', () => {
    render(<ActivityFeed items={ITEMS} variant="connected" />);
    expect(screen.getByRole('list', { name: 'Activity' })).toBeTruthy();
  });
});
