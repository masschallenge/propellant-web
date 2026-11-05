import { render, cleanup, screen, fireEvent, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Calendar, type CalendarEvent } from './Calendar';

afterEach(cleanup);

const offeredEvent: CalendarEvent = {
  id: 'tuesday-morning',
  date: '2026-11-24',
  title: 'Offered',
  startHour: 9,
  endHour: 12,
  pressed: true,
  icon: <svg data-testid="offered-check" />,
};

const renderWeek = (showPeriodPill?: boolean) =>
  render(
    <Calendar
      view="week"
      date="2026-11-24"
      month="2026-11-01"
      events={[offeredEvent]}
      dayStartHour={9}
      dayEndHour={18}
      showPeriodPill={showPeriodPill}
    />,
  );

describe('Calendar week view', () => {
  it('shows the week pill by default', () => {
    renderWeek();
    expect(screen.getByText('Week 4')).toBeInTheDocument();
  });

  it('hides the period pill when asked', () => {
    renderWeek(false);
    expect(screen.queryByText('Week 4')).not.toBeInTheDocument();
  });

  it('renders the event icon before its title inside the toggle', () => {
    renderWeek();
    const chip = screen.getByRole('button', { name: 'Offered' });
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(chip).toContainElement(screen.getByTestId('offered-check'));
  });

  it('lets header and body columns shrink equally so events stay under their day', () => {
    const { container } = renderWeek();
    const templates = [...container.querySelectorAll<HTMLElement>('[style]')]
      .map((element) => element.style.gridTemplateColumns)
      .filter(Boolean);
    expect(templates).toHaveLength(2);
    templates.forEach((template) => expect(template).toBe('48px repeat(7, minmax(0, 1fr))'));
  });
});

describe('Calendar month view', () => {
  const kickoff: CalendarEvent = {
    id: 'kickoff',
    date: '2026-07-15',
    title: 'Cohort kickoff',
    tone: 'brand',
  };

  it('spells the date range out without dashes', () => {
    render(<Calendar month="2026-07-01" date="2026-07-15" events={[kickoff]} />);
    expect(screen.getByText('1 Jul 2026 to 31 Jul 2026')).toBeInTheDocument();
  });

  it('selects a day and an event and moves between months', () => {
    const onSelectDate = vi.fn();
    const onEventSelect = vi.fn();
    render(
      <Calendar
        month="2026-07-01"
        date="2026-07-15"
        events={[kickoff]}
        onSelectDate={onSelectDate}
        onEventSelect={onEventSelect}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Cohort kickoff/ }));
    expect(onEventSelect).toHaveBeenCalledWith(kickoff);
    expect(onSelectDate).toHaveBeenCalledWith('2026-07-15');
    fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('grid', { name: 'August 2026' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeInTheDocument();
  });

  it('keeps the brand event colours on the component tokens the app shares', () => {
    render(<Calendar month="2026-07-01" date="2026-07-15" events={[kickoff]} />);
    const chip = screen.getByRole('button', { name: /Cohort kickoff/ });
    expect(chip.className).toContain('--cal-ev-brand-bg');
  });

  it('cycles the view and offers the add event action', () => {
    const onViewChange = vi.fn();
    const onAddEvent = vi.fn();
    render(<Calendar month="2026-07-01" onViewChange={onViewChange} onAddEvent={onAddEvent} />);
    fireEvent.click(screen.getByRole('button', { name: /Month view/ }));
    expect(onViewChange).toHaveBeenCalledWith('week');
    fireEvent.click(screen.getByRole('button', { name: /Add event/ }));
    expect(onAddEvent).toHaveBeenCalled();
  });
});

describe('Calendar day view', () => {
  it('shows the selected event detail with its actions', () => {
    const onDeleteEvent = vi.fn();
    const pitch: CalendarEvent = {
      id: 'pitch',
      date: '2026-07-15',
      title: 'Pitch practice',
      time: '9:00 AM',
      startHour: 9,
      endHour: 10,
    };
    render(
      <Calendar
        view="day"
        month="2026-07-01"
        date="2026-07-15"
        events={[pitch]}
        dayStartHour={8}
        dayEndHour={12}
        onDeleteEvent={onDeleteEvent}
      />,
    );
    const detail = screen.getByRole('complementary', { name: 'Selected day detail' });
    expect(within(detail).getByText('Wednesday, 15 Jul 2026')).toBeInTheDocument();
    fireEvent.click(within(detail).getByRole('button', { name: 'Delete event' }));
    expect(onDeleteEvent).toHaveBeenCalledWith(pitch);
    expect(within(detail).getByRole('button', { name: '15' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
