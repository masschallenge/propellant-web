import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ListRow, ListSection } from './List';
import { Switch } from '../Switch/Switch';

afterEach(cleanup);

describe('ListSection', () => {
  it('names the section by its title and shows footer and trailing content', () => {
    render(
      <ListSection title="Notifications" footer="Sent at 9:00 AM." trailing={<button>Edit</button>}>
        <ListRow title="Email" />
      </ListSection>,
    );
    expect(screen.getByRole('region', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByText('Sent at 9:00 AM.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('list')).toHaveClass('rounded-[var(--corner-lg)]', 'bg-[var(--bg)]');
  });

  it('uses the requested heading level', () => {
    render(
      <ListSection title="Judges" titleAs="h2">
        <ListRow title="Ada" />
      </ListSection>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Judges' })).toBeInTheDocument();
  });

  it('shortens rows when dense', () => {
    render(
      <ListSection density="dense">
        <ListRow title="Ada" />
      </ListSection>,
    );
    expect(screen.getByText('Ada').closest('div')).toHaveClass('min-h-[var(--row-dense)]');
  });
});

describe('ListRow', () => {
  it('shows a title, subtitle and value', () => {
    render(
      <ListSection>
        <ListRow title="Round 1" subtitle="Online review" value="42 startups" />
      </ListSection>,
    );
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('Online review')).toBeInTheDocument();
    expect(screen.getByText('42 startups')).toBeInTheDocument();
  });

  it('navigates with a chevron and marks the current page', () => {
    render(
      <ListSection>
        <ListRow title="Judges" href="/judges" selected />
      </ListSection>,
    );
    const link = screen.getByRole('link', { name: 'Judges' });
    expect(link).toHaveAttribute('href', '/judges');
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('runs an action from a button row', async () => {
    const onClick = vi.fn();
    render(
      <ListSection>
        <ListRow title="Export scores" onClick={onClick} />
      </ListSection>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Export scores' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('marks a selected button row as pressed', () => {
    render(
      <ListSection>
        <ListRow title="Eastern time" onClick={() => undefined} selected />
      </ListSection>,
    );
    expect(screen.getByRole('button', { name: 'Eastern time' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('centers a destructive action and colors it critical', () => {
    render(
      <ListSection>
        <ListRow title="Remove judge" destructive onClick={() => undefined} />
      </ListSection>,
    );
    expect(screen.getByText('Remove judge')).toHaveClass('text-[var(--critical)]', 'text-center');
  });

  it('disables a row', () => {
    render(
      <ListSection>
        <ListRow title="Archive" disabled onClick={() => undefined} />
      </ListSection>,
    );
    expect(screen.getByRole('button', { name: 'Archive' })).toBeDisabled();
  });

  it('renders a disabled link row as plain content', () => {
    render(
      <ListSection>
        <ListRow title="Archive" disabled href="/archive" />
      </ListSection>,
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('labels an unlabelled accessory by the row title', () => {
    render(
      <ListSection>
        <ListRow title="Email judges" accessory={<Switch />} />
        <ListRow title="Text judges" accessory={<Switch label="SMS" />} />
      </ListSection>,
    );
    expect(screen.getByRole('switch', { name: 'Email judges' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'SMS' })).toBeInTheDocument();
  });

  it('insets separators past the icon', () => {
    render(
      <ListSection>
        <ListRow title="Plain" />
        <ListRow title="With icon" icon={<svg />} />
      </ListSection>,
    );
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveClass('[--row-inset:16px]');
    expect(items[1]).toHaveClass('[--row-inset:calc(var(--icon-md)+28px)]');
  });
});
