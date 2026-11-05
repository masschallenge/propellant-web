import * as React from 'react';
import type { ReactNode } from 'react';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';

export type CalendarEventTone = 'neutral' | 'brand' | 'success' | 'danger';
export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  time?: string;
  tone?: CalendarEventTone;
  startHour?: number;
  endHour?: number;
  pressed?: boolean;
  ariaLabel?: string;
  icon?: ReactNode;
}

export interface CalendarProps {
  month?: string;
  events?: CalendarEvent[];
  title?: string;
  subtitle?: string;
  tools?: ReactNode;
  maxPerDay?: number;
  onSelectDate?: (date: string) => void;
  view?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  date?: string;
  showBadge?: boolean;
  showPeriodPill?: boolean;
  showSearch?: boolean;
  onSearch?: () => void;
  showNav?: boolean;
  onToday?: () => void;
  showViewSelect?: boolean;
  onAddEvent?: () => void;
  dayStartHour?: number;
  dayEndHour?: number;
  hourHeight?: number;
  showSidebar?: boolean;
  selectedEventId?: string;
  onEventSelect?: (event: CalendarEvent) => void;
  onCopyEvent?: (event: CalendarEvent) => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
  className?: string;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const WEEKDAY_INITIALS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const DEFAULT_HOUR_HEIGHT = 48;
const MINIMUM_EVENT_HEIGHT = 28;
const TIME_COLUMN = '48px';

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const padTwo = (amount: number) => String(amount).padStart(2, '0');

const toIsoDay = (date: Date) =>
  `${date.getFullYear()}-${padTwo(date.getMonth() + 1)}-${padTwo(date.getDate())}`;

const parseIsoDay = (isoDay: string) => new Date(`${isoDay}T00:00:00`);

const firstOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const formatHour = (hour: number) => {
  const clockHour = Math.floor(hour) % 12 || 12;
  return `${clockHour} ${hour < 12 ? 'am' : 'pm'}`;
};

const formatLongDate = (date: Date) =>
  `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;

const daysFrom = (start: Date, count: number) =>
  Array.from({ length: count }, (_unused, offset) => {
    const date = new Date(start);
    date.setDate(start.getDate() + offset);
    return date;
  });

const gridStartFor = (month: Date) => {
  const first = firstOfMonth(month);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  return start;
};

const EVENT_SURFACE: Record<CalendarEventTone, string> = {
  neutral: 'bg-[var(--bg-secondary)] shadow-[inset_3px_0_0_var(--label-tertiary)]',
  brand: 'bg-[var(--cal-ev-brand-bg)] shadow-[inset_3px_0_0_var(--teal-600)]',
  success: 'bg-[var(--success-fill)] shadow-[inset_3px_0_0_var(--success-solid)]',
  danger: 'bg-[var(--critical-fill)] shadow-[inset_3px_0_0_var(--critical-solid)]',
};

const EVENT_TEXT: Record<CalendarEventTone, string> = {
  neutral: 'text-[var(--label)]',
  brand: 'text-[var(--cal-ev-brand-fg)]',
  success: 'text-[var(--success)]',
  danger: 'text-[var(--critical)]',
};

const FOCUS_RING =
  'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]';

const Glyph = ({
  children,
  className = 'w-[var(--icon-sm)] h-[var(--icon-sm)]',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    className={joinClasses('block flex-none', className)}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const EventContent = ({ event, titleSize }: { event: CalendarEvent; titleSize: string }) => {
  const tone = event.tone || 'neutral';
  return (
    <>
      <span
        className={joinClasses(
          'flex items-center gap-1 font-semibold',
          titleSize,
          EVENT_TEXT[tone],
        )}
      >
        {event.icon ? (
          <span className="flex-none inline-flex [&>svg]:w-3 [&>svg]:h-3">{event.icon}</span>
        ) : null}
        <span className="truncate">{event.title}</span>
      </span>
      {event.time ? (
        <span className="block text-caption tabular-nums text-[var(--label-secondary)]">
          {event.time}
        </span>
      ) : null}
    </>
  );
};

export const Calendar = ({
  month = '2026-07-01',
  events = [],
  title,
  subtitle,
  tools,
  maxPerDay = 2,
  onSelectDate,
  view = 'month',
  onViewChange,
  date,
  showBadge = true,
  showPeriodPill = true,
  showSearch = true,
  onSearch,
  showNav = true,
  onToday,
  showViewSelect = true,
  onAddEvent,
  dayStartHour = 6,
  dayEndHour = 12,
  hourHeight = DEFAULT_HOUR_HEIGHT,
  showSidebar = true,
  selectedEventId,
  onEventSelect,
  onCopyEvent,
  onEditEvent,
  onDeleteEvent,
  className,
}: CalendarProps) => {
  const [visibleMonth, setVisibleMonth] = React.useState(firstOfMonth(parseIsoDay(month)));
  React.useEffect(() => {
    setVisibleMonth(firstOfMonth(parseIsoDay(month)));
  }, [month]);
  const [internalAnchor, setInternalAnchor] = React.useState(date || month);
  const anchor = parseIsoDay(date || internalAnchor);
  const today = toIsoDay(new Date());
  const dayStep = view === 'month' ? 0 : view === 'week' ? 7 : 1;

  const navigate = (direction: -1 | 1) => {
    if (view === 'month') {
      setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + direction, 1));
      return;
    }
    const nextAnchor = new Date(anchor);
    nextAnchor.setDate(nextAnchor.getDate() + direction * dayStep);
    setInternalAnchor(toIsoDay(nextAnchor));
    setVisibleMonth(firstOfMonth(nextAnchor));
  };

  const goToToday = () => {
    setInternalAnchor(today);
    setVisibleMonth(firstOfMonth(new Date()));
    onToday?.();
  };

  const weekStart = new Date(anchor);
  weekStart.setDate(anchor.getDate() - anchor.getDay());
  const weekDays = daysFrom(weekStart, 7);
  const weekNumber = Math.ceil(anchor.getDate() / 7);
  const hours = Array.from(
    { length: Math.max(1, Math.floor(dayEndHour - dayStartHour)) },
    (_unused, offset) => dayStartHour + offset,
  );

  const defaultTitle = `${MONTHS[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`;
  const monthEnd = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0);
  const defaultSubtitle =
    view === 'month'
      ? `${formatLongDate(visibleMonth)} to ${formatLongDate(monthEnd)}`
      : view === 'week'
        ? `${formatLongDate(weekDays[0])} to ${formatLongDate(weekDays[6])}`
        : WEEKDAYS_LONG[anchor.getDay()];
  const periodLabel = !showPeriodPill
    ? null
    : view === 'month'
      ? 'Month'
      : view === 'week'
        ? `Week ${weekNumber}`
        : null;
  const navigationUnit = view === 'month' ? 'month' : view === 'week' ? 'week' : 'day';
  const nextView: CalendarView = view === 'month' ? 'week' : view === 'week' ? 'day' : 'month';

  const header = (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-solid border-[var(--separator)]">
      {showBadge ? (
        <span
          aria-hidden="true"
          className="flex-none flex flex-col items-center justify-center gap-0.5 w-11 h-12 rounded-[var(--corner-md)] bg-[var(--bg-secondary)] leading-none"
        >
          <span className="text-caption font-semibold text-[var(--label-secondary)]">
            {MONTHS[anchor.getMonth()].slice(0, 3)}
          </span>
          <span className="text-title3 tabular-nums text-[var(--label)]">{anchor.getDate()}</span>
        </span>
      ) : null}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="flex items-center gap-2 text-title3 text-[var(--label)]">
          {title || defaultTitle}
          {periodLabel ? <Badge size="sm">{periodLabel}</Badge> : null}
        </span>
        <span className="text-subheadline text-[var(--label-secondary)]">
          {subtitle || defaultSubtitle}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 ml-auto">
        {showSearch ? (
          <IconButton aria-label="Search" onClick={onSearch}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.2-3.2" />
            </svg>
          </IconButton>
        ) : null}
        {showNav ? (
          <div
            role="group"
            aria-label={`Navigate ${navigationUnit}s`}
            className="inline-flex items-center gap-1"
          >
            <IconButton aria-label={`Previous ${navigationUnit}`} onClick={() => navigate(-1)}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </IconButton>
            <Button variant="gray" size="sm" onClick={goToToday}>
              Today
            </Button>
            <IconButton aria-label={`Next ${navigationUnit}`} onClick={() => navigate(1)}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </IconButton>
          </div>
        ) : null}
        {showViewSelect ? (
          <Button
            variant="gray"
            size="sm"
            aria-haspopup="menu"
            aria-expanded="false"
            onClick={() => onViewChange?.(nextView)}
            iconTrailing={
              <Glyph>
                <path d="M6 9l6 6 6-6" />
              </Glyph>
            }
          >
            {`${view.charAt(0).toUpperCase()}${view.slice(1)} view`}
          </Button>
        ) : null}
        {onAddEvent ? (
          <Button
            variant="filled"
            size="sm"
            onClick={onAddEvent}
            iconLeading={
              <Glyph>
                <path d="M12 5v14M5 12h14" />
              </Glyph>
            }
          >
            Add event
          </Button>
        ) : null}
        {tools}
      </div>
    </div>
  );

  const renderEventChip = (event: CalendarEvent) => (
    <button
      key={event.id}
      type="button"
      aria-pressed={event.pressed}
      aria-label={event.ariaLabel}
      onClick={() => onEventSelect?.(event)}
      className={joinClasses(
        'block w-full overflow-hidden px-2 py-1 border-0 rounded-[var(--corner-sm)] text-left cursor-pointer',
        EVENT_SURFACE[event.tone || 'neutral'],
        FOCUS_RING,
      )}
    >
      <EventContent event={event} titleSize="text-footnote" />
    </button>
  );

  const monthCells = daysFrom(gridStartFor(visibleMonth), 35);
  const monthGrid = (
    <div role="grid" aria-label={defaultTitle} className="grid grid-cols-7">
      <div role="row" className="contents">
        {WEEKDAYS_SHORT.map((weekday) => (
          <span
            key={weekday}
            role="columnheader"
            className="px-2 py-2 text-footnote font-medium text-[var(--label-tertiary)] border-b border-solid border-[var(--separator)]"
          >
            {weekday}
          </span>
        ))}
      </div>
      {Array.from({ length: monthCells.length / 7 }, (_unused, weekIndex) => (
        <div key={`week-${weekIndex}`} role="row" className="contents">
          {monthCells.slice(weekIndex * 7, weekIndex * 7 + 7).map((cellDate) => {
            const isoDay = toIsoDay(cellDate);
            const isOutsideMonth = cellDate.getMonth() !== visibleMonth.getMonth();
            const dayEvents = events.filter((event) => event.date === isoDay);
            return (
              <div
                key={isoDay}
                role="gridcell"
                onClick={() => onSelectDate?.(isoDay)}
                className={joinClasses(
                  'flex flex-col gap-1 min-h-26 p-1.5 border-b border-r border-solid border-[var(--separator)] [&:nth-child(7n+7)]:border-r-0',
                  Boolean(onSelectDate) && 'cursor-pointer hover:bg-[var(--fill-tertiary)]',
                )}
              >
                <span
                  className={joinClasses(
                    'self-start inline-flex items-center justify-center min-w-6 h-6 px-1 rounded-full text-callout tabular-nums',
                    isoDay === today
                      ? 'text-[var(--tint)] font-semibold'
                      : isOutsideMonth
                        ? 'text-[var(--label-tertiary)] font-normal'
                        : 'text-[var(--label)] font-normal',
                  )}
                >
                  {cellDate.getDate()}
                </span>
                {dayEvents.slice(0, maxPerDay).map(renderEventChip)}
                {dayEvents.length > maxPerDay ? (
                  <button
                    type="button"
                    className={joinClasses(
                      'self-start px-1 py-0.5 border-0 bg-transparent rounded-[var(--corner-sm)] cursor-pointer text-footnote font-medium text-[var(--tint)] hover:text-[var(--tint-hover)]',
                      FOCUS_RING,
                    )}
                  >
                    {dayEvents.length - maxPerDay} more…
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  const renderTimeGrid = (days: Date[]) => {
    const columns = {
      gridTemplateColumns: `${TIME_COLUMN} repeat(${days.length}, minmax(0, 1fr))`,
    };
    return (
      <div>
        <div className="grid" style={columns}>
          <div className="border-b border-solid border-[var(--separator)]" />
          {days.map((day) => {
            const isoDay = toIsoDay(day);
            return (
              <div
                key={isoDay}
                className="p-2 text-center border-b border-l border-solid border-[var(--separator)]"
              >
                <div className="text-footnote font-medium text-[var(--label-tertiary)]">
                  {WEEKDAYS_SHORT[day.getDay()]}
                </div>
                <div
                  className={joinClasses(
                    'mt-0.5 text-title3 tabular-nums',
                    isoDay === today ? 'text-[var(--tint)] font-semibold' : 'text-[var(--label)]',
                  )}
                >
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="relative grid" style={columns}>
          <div className="flex flex-col">
            {hours.map((hour) => (
              <span
                key={hour}
                style={{ height: hourHeight }}
                className="px-1.5 pt-0.5 text-right whitespace-nowrap text-caption tabular-nums text-[var(--label-tertiary)]"
              >
                {formatHour(hour)}
              </span>
            ))}
          </div>
          {days.map((day) => {
            const isoDay = toIsoDay(day);
            const timedEvents = events.filter(
              (event) => event.date === isoDay && event.startHour !== undefined,
            );
            return (
              <div
                key={isoDay}
                className="relative border-l border-solid border-[var(--separator)]"
              >
                {hours.map((hour) => (
                  <span
                    key={hour}
                    style={{ height: hourHeight }}
                    className="block border-b border-solid border-[var(--separator)]"
                  />
                ))}
                {timedEvents.map((event) => {
                  const startHour = event.startHour ?? dayStartHour;
                  const endHour = event.endHour ?? startHour + 1;
                  const top = (startHour - dayStartHour) * hourHeight;
                  const height = Math.max(
                    MINIMUM_EVENT_HEIGHT,
                    (endHour - startHour) * hourHeight - 4,
                  );
                  return (
                    <button
                      key={event.id}
                      type="button"
                      aria-pressed={event.pressed}
                      onClick={() => onEventSelect?.(event)}
                      aria-label={
                        event.ariaLabel || `${event.title}${event.time ? `, ${event.time}` : ''}`
                      }
                      style={{ top, height }}
                      className={joinClasses(
                        'absolute left-0.5 right-0.5 overflow-hidden px-2 py-1 border-0 rounded-[var(--corner-sm)] text-left cursor-pointer',
                        EVENT_SURFACE[event.tone || 'neutral'],
                        FOCUS_RING,
                      )}
                    >
                      <EventContent event={event} titleSize="text-subheadline" />
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const anchorDay = toIsoDay(anchor);
  const eventDays = new Set(events.map((event) => event.date));
  const miniMonth = (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-headline text-[var(--label)]">{defaultTitle}</span>
        <span className="inline-flex gap-0.5">
          <IconButton
            size="sm"
            aria-label="Previous month"
            onClick={() =>
              setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </IconButton>
          <IconButton
            size="sm"
            aria-label="Next month"
            onClick={() =>
              setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </IconButton>
        </span>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {WEEKDAY_INITIALS.map((initial) => (
          <span
            key={initial}
            className="py-0.5 text-center text-caption font-medium text-[var(--label-tertiary)]"
          >
            {initial}
          </span>
        ))}
        {daysFrom(gridStartFor(visibleMonth), 42).map((cellDate) => {
          const isoDay = toIsoDay(cellDate);
          const isToday = isoDay === today;
          const isAnchor = isoDay === anchorDay;
          const isOutsideMonth = cellDate.getMonth() !== visibleMonth.getMonth();
          return (
            <button
              key={isoDay}
              type="button"
              onClick={() => {
                setInternalAnchor(isoDay);
                onSelectDate?.(isoDay);
              }}
              aria-current={isToday ? 'date' : undefined}
              aria-pressed={isAnchor}
              className={joinClasses(
                'relative inline-flex items-center justify-center w-full aspect-square border-0 rounded-full cursor-pointer text-footnote tabular-nums',
                FOCUS_RING,
                isAnchor
                  ? 'bg-[var(--tint)] text-[var(--on-tint)] font-semibold'
                  : isToday
                    ? 'bg-transparent text-[var(--tint)] font-semibold hover:bg-[var(--fill-tertiary)]'
                    : isOutsideMonth
                      ? 'bg-transparent text-[var(--label-tertiary)] hover:bg-[var(--fill-tertiary)]'
                      : 'bg-transparent text-[var(--label)] hover:bg-[var(--fill-tertiary)]',
                eventDays.has(isoDay) &&
                  joinClasses(
                    "after:content-[''] after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full",
                    isAnchor ? 'after:bg-[var(--on-tint)]' : 'after:bg-[var(--label-tertiary)]',
                  ),
              )}
            >
              {cellDate.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );

  const selectedEvent =
    events.find((event) => event.id === selectedEventId) ||
    events.find((event) => event.date === anchorDay);
  const detail = selectedEvent ? (
    <div className="p-4 rounded-[var(--corner-lg)] bg-[var(--bg-secondary)]">
      <div className="flex items-start gap-2 mb-3">
        <span className="flex-1 text-headline text-[var(--label)]">{selectedEvent.title}</span>
        <span className="flex gap-1">
          <IconButton
            size="sm"
            aria-label="Copy event"
            onClick={() => onCopyEvent?.(selectedEvent)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
            </svg>
          </IconButton>
          <IconButton
            size="sm"
            aria-label="Edit event"
            onClick={() => onEditEvent?.(selectedEvent)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3zM14 6l4 4" />
            </svg>
          </IconButton>
          <IconButton
            size="sm"
            destructive
            aria-label="Delete event"
            onClick={() => onDeleteEvent?.(selectedEvent)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m2 0-1 13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7" />
            </svg>
          </IconButton>
        </span>
      </div>
      <div className="flex items-center gap-2.5 py-1 text-subheadline text-[var(--label-secondary)]">
        <Glyph>
          <rect x="3.5" y="5" width="17" height="16" rx="2" />
          <path d="M3.5 9h17M8 3v4M16 3v4" />
        </Glyph>
        {`${WEEKDAYS_LONG[parseIsoDay(selectedEvent.date).getDay()]}, ${formatLongDate(parseIsoDay(selectedEvent.date))}`}
      </div>
      {selectedEvent.time ? (
        <div className="flex items-center gap-2.5 py-1 text-subheadline tabular-nums text-[var(--label-secondary)]">
          <Glyph>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </Glyph>
          {selectedEvent.time}
        </div>
      ) : null}
    </div>
  ) : null;

  return (
    <div
      className={joinClasses(
        'overflow-hidden rounded-[var(--corner-lg)] bg-[var(--bg)]',
        className,
      )}
    >
      {header}
      {view === 'month' ? monthGrid : null}
      {view === 'week' ? renderTimeGrid(weekDays) : null}
      {view === 'day' ? (
        showSidebar ? (
          <div className="grid grid-cols-[1fr_300px] max-[860px]:grid-cols-1">
            <div className="min-w-0 border-r border-solid border-[var(--separator)]">
              {renderTimeGrid([anchor])}
            </div>
            <aside aria-label="Selected day detail" className="p-4">
              {miniMonth}
              {detail}
            </aside>
          </div>
        ) : (
          renderTimeGrid([anchor])
        )
      ) : null}
    </div>
  );
};
