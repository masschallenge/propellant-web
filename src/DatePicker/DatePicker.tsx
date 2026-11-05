import * as React from 'react';
import { AnchoredLayer, anchoredPanelStyle, useAnchoredPosition } from '../internal/anchoredLayer';
import { Button } from '../Button/Button';
import { FIELD_LABEL_TONE, FieldHint } from '../TextField/fieldText';

export type DateRange = [string, string];

export interface DatePickerPreset {
  id: string;
  label: string;
  onSelect?: () => void;
  selected?: boolean;
}

export interface DatePickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  rangeValue?: DateRange;
  onRangeChange?: (value: DateRange) => void;
  label?: string;
  placeholder?: string;
  presets?: DatePickerPreset[];
  withFooter?: boolean;
  inline?: boolean;
  disabled?: boolean;
  timeSlots?: string[];
  timeValue?: string;
  defaultTimeValue?: string;
  onTimeChange?: (value: string) => void;
  timeSlotsLabel?: string;
  dualMonth?: boolean;
  showToday?: boolean;
  showInput?: boolean;
  onCancel?: () => void;
  onApply?: () => void;
  hint?: string;
  invalid?: boolean;
  min?: string;
  max?: string;
  clearable?: boolean;
  required?: boolean;
  hideLabel?: boolean;
  className?: string;
}

type CalendarView = 'day' | 'month' | 'year';
type NavigationEdge = 'both' | 'prev' | 'next';

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

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const padTwo = (amount: number) => String(amount).padStart(2, '0');

const toIsoDay = (date: Date) =>
  `${date.getFullYear()}-${padTwo(date.getMonth() + 1)}-${padTwo(date.getDate())}`;

const parseIsoDay = (isoDay?: string) => (isoDay ? new Date(`${isoDay}T00:00:00`) : null);

const formatTriggerDate = (isoDay?: string) => {
  const date = parseIsoDay(isoDay);
  return date
    ? `${MONTHS[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()}`
    : '';
};

const formatReadoutDate = (isoDay?: string) => {
  const date = parseIsoDay(isoDay);
  return date
    ? `${padTwo(date.getMonth() + 1)}/${padTwo(date.getDate())}/${date.getFullYear()}`
    : 'MM/DD/YYYY';
};

const firstOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const FOCUS_RING =
  'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]';

const HIT_AREA =
  "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[max(100%,var(--hit-target))] before:h-[max(100%,var(--hit-target))]";

const HEADER_BUTTON = joinClasses(
  'relative inline-flex items-center min-h-[var(--control-sm)] px-1.5 border-0 rounded-[var(--corner-md)] bg-transparent cursor-pointer font-[inherit] text-callout font-semibold text-[var(--label)] hover:bg-[var(--fill-tertiary)] active:bg-[var(--fill-secondary)]',
  HIT_AREA,
  FOCUS_RING,
);

const LIST_ROW = joinClasses(
  'flex-none w-full min-h-[var(--control-md)] px-3 border-0 rounded-[var(--corner-md)] cursor-pointer text-left font-[inherit] text-callout',
  FOCUS_RING,
);

const listRowTone = (isSelected: boolean) =>
  isSelected
    ? 'bg-[var(--tint)] text-[var(--on-tint)] font-semibold'
    : 'bg-transparent text-[var(--label)] font-normal hover:bg-[var(--fill-tertiary)]';

export const DatePicker = ({
  value,
  defaultValue,
  onChange,
  rangeValue,
  onRangeChange,
  label,
  placeholder = 'Select date',
  presets,
  withFooter = false,
  inline = false,
  disabled = false,
  timeSlots,
  timeValue,
  defaultTimeValue,
  onTimeChange,
  timeSlotsLabel = 'Available',
  dualMonth = false,
  showToday = false,
  showInput = false,
  onCancel,
  onApply,
  hint,
  invalid = false,
  min,
  max,
  clearable = false,
  required = false,
  hideLabel = false,
  className,
}: DatePickerProps) => {
  const isRange = Boolean(rangeValue);
  const [rangeStart, rangeEnd] = rangeValue ?? ['', ''];
  const fieldId = React.useId();
  const hintId = `${fieldId}-hint`;
  const labelId = `${fieldId}-label`;
  const valueId = `${fieldId}-value`;
  const timeId = `${fieldId}-time`;
  const dialogId = `${fieldId}-dialog`;
  const isOutOfRange = (isoDay: string) => Boolean((min && isoDay < min) || (max && isoDay > max));
  const clampDay = (isoDay: string) =>
    min && isoDay < min ? min : max && isoDay > max ? max : isoDay;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value === undefined ? internalValue : value;
  const [internalTime, setInternalTime] = React.useState(defaultTimeValue);
  const currentTime = timeValue === undefined ? internalTime : timeValue;
  const [isOpen, setIsOpen] = React.useState(inline);
  const seedDate =
    parseIsoDay(isRange ? rangeStart : currentValue) ||
    (parseIsoDay(clampDay(toIsoDay(new Date()))) as Date);
  const [visibleMonth, setVisibleMonth] = React.useState(firstOfMonth(seedDate));
  const [focusDay, setFocusDay] = React.useState<string | null>(null);
  const [view, setView] = React.useState<CalendarView>('day');
  const [yearPage, setYearPage] = React.useState(Math.floor(seedDate.getFullYear() / 12) * 12);
  const [focusedCell, setFocusedCell] = React.useState(0);
  const chooserRef = React.useRef<HTMLDivElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [layerHost, setLayerHost] = React.useState<Element | null>(null);
  const position = useAnchoredPosition(isOpen && !inline, wrapperRef, panelRef);
  const isPlaced = position !== null;

  const closeToTrigger = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  React.useEffect(() => {
    if (!isOpen || inline) return;
    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInside = wrapperRef.current?.contains(target) || panelRef.current?.contains(target);
      if (!isInside) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () => document.removeEventListener('mousedown', handleDocumentMouseDown);
  }, [isOpen, inline]);

  React.useEffect(() => {
    if (!isOpen || inline) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      if (view !== 'day') {
        setView(view === 'year' ? 'month' : 'day');
        return;
      }
      closeToTrigger();
    };
    window.addEventListener('keydown', handleEscape, true);
    return () => window.removeEventListener('keydown', handleEscape, true);
  }, [isOpen, inline, view]);

  React.useEffect(() => {
    if (!focusDay || !calendarRef.current) return;
    const dayButton = calendarRef.current.querySelector<HTMLElement>(`[data-iso="${focusDay}"]`);
    dayButton?.focus();
  }, [focusDay, visibleMonth]);

  React.useEffect(() => {
    if (isOpen) return;
    setView('day');
    setFocusDay(null);
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen || inline || !isPlaced || !calendarRef.current) return;
    const calendar = calendarRef.current;
    const dayButton =
      calendar.querySelector<HTMLElement>('[data-iso][tabindex="0"]') ||
      calendar.querySelector<HTMLElement>('[data-iso]:not([data-outside])');
    if (!dayButton) return;
    setFocusDay(dayButton.getAttribute('data-iso'));
    dayButton.focus();
  }, [isOpen, inline, isPlaced]);

  React.useEffect(() => {
    if (view === 'day' || !chooserRef.current) return;
    chooserRef.current.querySelector<HTMLElement>(`[data-cell="${focusedCell}"]`)?.focus();
  }, [view, focusedCell, yearPage]);

  const today = toIsoDay(new Date());
  const anchorDay = clampDay(today);
  const isInBand = (isoDay: string) =>
    isRange && Boolean(rangeStart) && Boolean(rangeEnd) && isoDay > rangeStart && isoDay < rangeEnd;
  const isSelected = (isoDay: string) =>
    isRange ? isoDay === rangeStart || isoDay === rangeEnd : isoDay === currentValue;

  const pick = (date: Date) => {
    const isoDay = toIsoDay(date);
    if (isOutOfRange(isoDay)) return;
    if (isRange) {
      const nextRange: DateRange =
        !rangeStart || (rangeStart && rangeEnd)
          ? [isoDay, '']
          : isoDay < rangeStart
            ? [isoDay, rangeStart]
            : [rangeStart, isoDay];
      onRangeChange?.(nextRange);
      return;
    }
    if (value === undefined) setInternalValue(isoDay);
    onChange?.(isoDay);
    if (!withFooter && !inline && !timeSlots) closeToTrigger();
  };

  const revealDay = (date: Date) => {
    const firstShown = firstOfMonth(visibleMonth);
    const lastShown = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + (dualMonth ? 2 : 1),
      0,
    );
    if (date < firstShown || date > lastShown) setVisibleMonth(firstOfMonth(date));
  };

  const goToday = () => {
    const now = new Date();
    setVisibleMonth(firstOfMonth(now));
    pick(now);
  };

  const handleGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const origin = parseIsoDay(focusDay || (isRange ? rangeStart : currentValue) || anchorDay);
    if (!origin) return;
    const moveBy = (amount: number, unit: 'day' | 'month') => {
      const nextDate = new Date(origin);
      if (unit === 'day') nextDate.setDate(nextDate.getDate() + amount);
      else nextDate.setMonth(nextDate.getMonth() + amount);
      revealDay(nextDate);
      setFocusDay(toIsoDay(nextDate));
    };
    const keyActions: Record<string, () => void> = {
      ArrowLeft: () => moveBy(-1, 'day'),
      ArrowRight: () => moveBy(1, 'day'),
      ArrowUp: () => moveBy(-7, 'day'),
      ArrowDown: () => moveBy(7, 'day'),
      PageUp: () => moveBy(-1, 'month'),
      PageDown: () => moveBy(1, 'month'),
      Home: () => setFocusDay(toIsoDay(firstOfMonth(origin))),
      End: () => setFocusDay(toIsoDay(new Date(origin.getFullYear(), origin.getMonth() + 1, 0))),
    };
    const action = keyActions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };

  const renderNavButton = (
    direction: -1 | 1,
    accessibleName: string,
    chevronPath: string,
    isHidden = false,
  ) => (
    <button
      type="button"
      aria-label={accessibleName}
      onClick={() => {
        if (view === 'year') {
          setYearPage(yearPage + direction * 12);
          return;
        }
        if (view === 'month') {
          setVisibleMonth(
            new Date(visibleMonth.getFullYear() + direction, visibleMonth.getMonth(), 1),
          );
          return;
        }
        setVisibleMonth(
          new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + direction, 1),
        );
      }}
      className={joinClasses(
        isHidden && 'invisible',
        'relative inline-flex items-center justify-center w-[var(--control-sm)] h-[var(--control-sm)] border-0 bg-transparent rounded-full cursor-pointer text-[var(--tint)] hover:bg-[var(--fill-tertiary)] active:bg-[var(--fill-secondary)]',
        HIT_AREA,
        FOCUS_RING,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="relative z-[1] w-[var(--icon-md)] h-[var(--icon-md)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={chevronPath} />
      </svg>
    </button>
  );

  const dayButtonTone = (isoDay: string, isOutsideMonth: boolean, isPicked: boolean) => {
    if (isPicked) return 'bg-[var(--tint)] text-[var(--on-tint)] font-semibold';
    if (isOutOfRange(isoDay))
      return 'bg-transparent text-[var(--label-quaternary)] font-normal line-through';
    if (isoDay === today)
      return 'bg-transparent text-[var(--tint)] font-semibold hover:bg-[var(--fill-tertiary)]';
    if (isOutsideMonth)
      return 'bg-transparent text-[var(--label-tertiary)] font-normal hover:bg-[var(--fill-tertiary)] hover:text-[var(--label)]';
    return 'bg-transparent text-[var(--label)] font-normal hover:bg-[var(--fill-tertiary)]';
  };

  const renderMonthGrid = (month: Date, edge: NavigationEdge) => {
    const first = firstOfMonth(month);
    const gridStart = new Date(first);
    gridStart.setDate(1 - first.getDay());
    const days = Array.from({ length: 42 }, (_unused, offset) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + offset);
      return date;
    });
    const monthTitle = `${MONTHS[month.getMonth()]} ${month.getFullYear()}`;
    const focusableDay = focusDay || (isRange ? rangeStart : currentValue) || anchorDay;
    const firstShown = toIsoDay(firstOfMonth(visibleMonth));
    const lastShown = toIsoDay(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 2, 0),
    );
    const isShownInOtherMonth = (isoDay: string) =>
      dualMonth && isoDay >= firstShown && isoDay <= lastShown;
    return (
      <div className="w-max" key={monthTitle}>
        <div className="flex items-center justify-between mb-2">
          {renderNavButton(-1, 'Previous month', 'm15 18-6-6 6-6', edge === 'next')}
          <span className="flex items-center gap-0.5">
            <button
              type="button"
              aria-label={`Choose month, currently ${MONTHS[month.getMonth()]}`}
              onClick={() => {
                setVisibleMonth(firstOfMonth(month));
                setFocusedCell(month.getMonth());
                setView('month');
              }}
              className={HEADER_BUTTON}
            >
              {MONTHS[month.getMonth()]}
            </button>
            <button
              type="button"
              aria-label={`Choose year, currently ${month.getFullYear()}`}
              onClick={() => {
                setVisibleMonth(firstOfMonth(month));
                const pageStart = Math.floor(month.getFullYear() / 12) * 12;
                setYearPage(pageStart);
                setFocusedCell(month.getFullYear() - pageStart);
                setView('year');
              }}
              className={HEADER_BUTTON}
            >
              {month.getFullYear()}
            </button>
          </span>
          {renderNavButton(1, 'Next month', 'm9 6 6 6-6 6', edge === 'prev')}
        </div>
        <div
          role="grid"
          aria-label={monthTitle}
          className="grid grid-cols-7"
          onKeyDown={handleGridKeyDown}
        >
          {WEEKDAYS.map((weekday) => (
            <span
              key={weekday}
              role="columnheader"
              className="py-1 text-center text-footnote font-medium text-[var(--label-tertiary)]"
            >
              {weekday}
            </span>
          ))}
          {days.map((date) => {
            const isoDay = toIsoDay(date);
            const isOutsideMonth = date.getMonth() !== month.getMonth();
            const isDuplicate = isOutsideMonth && isShownInOtherMonth(isoDay);
            const isPicked = !isDuplicate && isSelected(isoDay);
            const isBand = !isDuplicate && isInBand(isoDay);
            const isStartCap =
              !isDuplicate && isRange && isoDay === rangeStart && Boolean(rangeEnd);
            const isEndCap = !isDuplicate && isRange && isoDay === rangeEnd && Boolean(rangeStart);
            const isBlocked = isOutOfRange(isoDay);
            return (
              <span
                key={isoDay}
                role="gridcell"
                aria-selected={isDuplicate ? undefined : isPicked}
                className={joinClasses(
                  'relative flex items-center justify-center p-0.5',
                  isBand && 'bg-[var(--tint-fill)]',
                  isStartCap &&
                    'bg-[linear-gradient(to_right,transparent_50%,var(--tint-fill)_50%)]',
                  isEndCap && 'bg-[linear-gradient(to_left,transparent_50%,var(--tint-fill)_50%)]',
                )}
              >
                {isDuplicate ? (
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center justify-center w-[var(--control-md)] h-[var(--control-md)] rounded-full text-callout tabular-nums text-[var(--label-tertiary)]"
                  >
                    {date.getDate()}
                  </span>
                ) : (
                  <button
                    type="button"
                    data-iso={isoDay}
                    data-outside={isOutsideMonth ? 'true' : undefined}
                    tabIndex={isoDay === focusableDay ? 0 : -1}
                    aria-label={`${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}
                    aria-current={isoDay === today ? 'date' : undefined}
                    aria-pressed={isPicked}
                    aria-disabled={isBlocked || undefined}
                    onClick={() => {
                      setFocusDay(isoDay);
                      if (isBlocked) return;
                      revealDay(date);
                      pick(date);
                    }}
                    className={joinClasses(
                      'relative inline-flex items-center justify-center w-[var(--control-md)] h-[var(--control-md)] border-0 rounded-full font-[inherit] text-callout tabular-nums',
                      isBlocked ? 'cursor-not-allowed' : 'cursor-pointer',
                      dayButtonTone(isoDay, isOutsideMonth, isPicked),
                      FOCUS_RING,
                    )}
                  >
                    {date.getDate()}
                  </button>
                )}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  const renderChooserGrid = () => {
    const isYearView = view === 'year';
    const now = new Date();
    const cells = Array.from({ length: 12 }, (_unused, index) =>
      isYearView ? yearPage + index : index,
    );
    const heading = isYearView
      ? `${yearPage} to ${yearPage + 11}`
      : String(visibleMonth.getFullYear());
    const handleChooserKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setView(isYearView ? 'month' : 'day');
        return;
      }
      const moves: Record<string, number> = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -3,
        ArrowDown: 3,
      };
      if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        setFocusedCell(event.key === 'Home' ? 0 : 11);
        return;
      }
      if (!(event.key in moves)) return;
      event.preventDefault();
      setFocusedCell(Math.max(0, Math.min(11, focusedCell + moves[event.key])));
    };
    const choose = (index: number) => {
      if (isYearView) {
        setVisibleMonth(new Date(cells[index], visibleMonth.getMonth(), 1));
        setFocusedCell(visibleMonth.getMonth());
        setView('month');
        return;
      }
      setVisibleMonth(new Date(visibleMonth.getFullYear(), index, 1));
      setView('day');
    };
    return (
      <div className="w-64">
        <div className="flex items-center justify-between mb-2">
          {renderNavButton(-1, isYearView ? 'Previous years' : 'Previous year', 'm15 18-6-6 6-6')}
          <button
            type="button"
            aria-label={
              isYearView
                ? 'Back to day view'
                : `Choose year, currently ${visibleMonth.getFullYear()}`
            }
            onClick={() => {
              if (isYearView) {
                setView('day');
                return;
              }
              const pageStart = Math.floor(visibleMonth.getFullYear() / 12) * 12;
              setYearPage(pageStart);
              setFocusedCell(visibleMonth.getFullYear() - pageStart);
              setView('year');
            }}
            className={HEADER_BUTTON}
          >
            {heading}
          </button>
          {renderNavButton(1, isYearView ? 'Next years' : 'Next year', 'm9 6 6 6-6 6')}
        </div>
        <div
          ref={chooserRef}
          role="grid"
          aria-label={isYearView ? 'Choose a year' : 'Choose a month'}
          onKeyDown={handleChooserKeyDown}
          className="grid grid-cols-3 gap-1"
        >
          {cells.map((cellValue, index) => {
            const isNow = isYearView
              ? cellValue === now.getFullYear()
              : cellValue === now.getMonth() && visibleMonth.getFullYear() === now.getFullYear();
            const isPicked = isYearView
              ? cellValue === visibleMonth.getFullYear()
              : cellValue === visibleMonth.getMonth();
            return (
              <button
                key={cellValue}
                type="button"
                role="gridcell"
                data-cell={index}
                tabIndex={index === focusedCell ? 0 : -1}
                aria-selected={isPicked}
                aria-current={isNow ? 'date' : undefined}
                onClick={() => {
                  setFocusedCell(index);
                  choose(index);
                }}
                className={joinClasses(
                  'inline-flex items-center justify-center min-h-[var(--control-lg)] border-0 rounded-[var(--corner-md)] cursor-pointer font-[inherit] text-callout tabular-nums',
                  isPicked
                    ? 'bg-[var(--tint)] text-[var(--on-tint)] font-semibold'
                    : isNow
                      ? 'bg-transparent text-[var(--tint)] font-semibold hover:bg-[var(--fill-tertiary)]'
                      : 'bg-transparent text-[var(--label)] font-normal hover:bg-[var(--fill-tertiary)]',
                  FOCUS_RING,
                )}
              >
                {isYearView ? cellValue : MONTHS[index].slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderReadout = (isoDay: string | undefined, accessibleName: string, isFixed = false) => (
    <span
      aria-label={accessibleName}
      className={joinClasses(
        isFixed ? 'w-28 flex-none' : 'flex-1 min-w-0',
        'flex items-center min-h-[var(--control-md)] px-3 rounded-[var(--corner-md)] bg-[var(--bg)] shadow-[inset_0_0_0_var(--hairline)_var(--control-border)] font-[family-name:var(--type-family-mono)] text-callout tabular-nums text-[var(--label)]',
      )}
    >
      {formatReadoutDate(isoDay)}
    </span>
  );

  const todayButton = showToday ? (
    <Button variant="plain" onClick={goToday}>
      Today
    </Button>
  ) : null;

  const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
  const viewAnnouncement =
    view === 'year'
      ? `Year view, ${yearPage} to ${yearPage + 11}`
      : view === 'month'
        ? `Month view, ${visibleMonth.getFullYear()}`
        : `Day view, ${MONTHS[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`;

  const calendar = (
    <div
      ref={inline ? undefined : panelRef}
      style={inline ? undefined : anchoredPanelStyle(position, { capsHeight: false })}
      id={inline ? undefined : dialogId}
      role={inline ? undefined : 'dialog'}
      aria-label={inline ? undefined : label || placeholder}
    >
      <div
        className={joinClasses(
          'flex p-3 rounded-[var(--corner-lg)]',
          inline ? 'w-max bg-[var(--bg)]' : 'bg-[var(--bg-elevated)] shadow-[var(--shadow-float)]',
        )}
      >
        {presets && presets.length ? (
          <ul
            role="group"
            aria-label="Range presets"
            className="flex flex-col gap-0.5 w-36 m-0 mr-3 p-0 pr-3 list-none border-r border-solid border-[var(--separator)]"
          >
            {presets.map((preset) => (
              <li key={preset.id}>
                <button
                  type="button"
                  aria-pressed={Boolean(preset.selected)}
                  onClick={preset.onSelect}
                  className={joinClasses(LIST_ROW, listRowTone(Boolean(preset.selected)))}
                >
                  {preset.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <div>
          <span aria-live="polite" className="sr-only">
            {viewAnnouncement}
          </span>
          {showInput && !withFooter && !isRange ? (
            <div className="flex items-center gap-2 mb-3">
              {renderReadout(currentValue, 'Selected date')}
              {todayButton}
            </div>
          ) : null}
          <div className="flex gap-3">
            {view !== 'day' ? (
              renderChooserGrid()
            ) : dualMonth ? (
              <div className="flex gap-6">
                {renderMonthGrid(visibleMonth, 'prev')}
                {renderMonthGrid(nextMonth, 'next')}
              </div>
            ) : (
              renderMonthGrid(visibleMonth, 'both')
            )}
            {timeSlots && timeSlots.length ? (
              <div
                role="listbox"
                aria-label="Available times"
                className="flex flex-col gap-0.5 w-32 max-h-74 overflow-auto pl-3 border-l border-solid border-[var(--separator)]"
              >
                <div className="pt-1 pb-2 text-footnote font-medium text-[var(--label-tertiary)]">
                  {timeSlotsLabel}
                </div>
                {timeSlots.map((slot) => {
                  const isChosen = slot === currentTime;
                  return (
                    <button
                      key={slot}
                      type="button"
                      role="option"
                      aria-selected={isChosen}
                      onClick={() => {
                        if (timeValue === undefined) setInternalTime(slot);
                        onTimeChange?.(slot);
                      }}
                      onKeyDown={(event) => {
                        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
                        event.preventDefault();
                        const sibling =
                          event.key === 'ArrowDown'
                            ? event.currentTarget.nextElementSibling
                            : event.currentTarget.previousElementSibling;
                        if (
                          sibling instanceof HTMLElement &&
                          sibling.getAttribute('role') === 'option'
                        )
                          sibling.focus();
                      }}
                      className={joinClasses(LIST_ROW, 'tabular-nums', listRowTone(isChosen))}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
          {withFooter ? (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-solid border-[var(--separator)]">
              {showInput && isRange ? (
                <>
                  {renderReadout(rangeStart, 'Start date', true)}
                  <span className="text-callout text-[var(--label-tertiary)]">to</span>
                  {renderReadout(rangeEnd, 'End date', true)}
                </>
              ) : showInput ? (
                renderReadout(currentValue, 'Selected date')
              ) : null}
              {todayButton}
              <span className="flex-1" />
              <Button
                variant="gray"
                onClick={() => {
                  if (!inline) closeToTrigger();
                  onCancel?.();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                onClick={() => {
                  if (!inline) closeToTrigger();
                  onApply?.();
                }}
              >
                Apply
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  const calendarHost = <div ref={calendarRef}>{calendar}</div>;
  if (inline) return <div className={className}>{calendarHost}</div>;

  const triggerText = isRange
    ? rangeStart
      ? `${formatTriggerDate(rangeStart)} to ${rangeEnd ? formatTriggerDate(rangeEnd) : '…'}`
      : placeholder
    : currentValue
      ? formatTriggerDate(currentValue)
      : placeholder;
  const isShowingClear = clearable && !isRange && !disabled && Boolean(currentValue);

  const clear = () => {
    if (value === undefined) setInternalValue(undefined);
    onChange?.('');
    closeToTrigger();
  };

  const toggle = () => {
    if (!isOpen && !isRange && !currentValue && (min || max)) {
      const anchor = parseIsoDay(anchorDay);
      if (anchor) setVisibleMonth(firstOfMonth(anchor));
      setFocusDay(null);
    }
    if (!isOpen && wrapperRef.current)
      setLayerHost(wrapperRef.current.closest('[aria-modal="true"]'));
    setIsOpen(!isOpen);
  };

  return (
    <div className={joinClasses('flex flex-col gap-1.5', className)} ref={wrapperRef}>
      {label ? (
        <span id={labelId} className={hideLabel ? 'sr-only' : FIELD_LABEL_TONE.default}>
          {label}
          {required ? (
            <span className="ml-1 text-[var(--critical)]" aria-hidden="true">
              *
            </span>
          ) : null}
        </span>
      ) : null}
      <div className={clearable ? 'relative w-fit' : 'relative'}>
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          role="combobox"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={isOpen ? dialogId : undefined}
          aria-labelledby={[label ? labelId : '', valueId, timeSlots && currentTime ? timeId : '']
            .filter(Boolean)
            .join(' ')}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          aria-describedby={hint ? hintId : undefined}
          onClick={toggle}
          data-open={isOpen ? 'true' : undefined}
          data-invalid={invalid ? 'true' : undefined}
          className={joinClasses(
            'propellant-field w-fit items-center gap-2 min-h-[var(--control-md)] px-3 border-0 whitespace-nowrap cursor-pointer font-[inherit] text-callout font-normal',
            'disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed',
            currentValue || rangeStart ? 'text-[var(--label)]' : 'text-[var(--label-tertiary)]',
            isShowingClear && 'pr-10',
          )}
        >
          <span className="propellant-field-ring" aria-hidden="true" />
          <svg
            viewBox="0 0 24 24"
            className="flex-none w-[var(--icon-sm)] h-[var(--icon-sm)] text-[var(--label-tertiary)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M8 3v4M16 3v4M3 10h18" />
          </svg>
          <span id={valueId}>{triggerText}</span>
          {timeSlots && currentTime ? (
            <span id={timeId} className="text-[var(--label-secondary)] tabular-nums">
              {currentTime}
            </span>
          ) : null}
        </button>
        {isShowingClear ? (
          <button
            type="button"
            aria-label={label ? `Clear ${label}` : 'Clear date'}
            onClick={clear}
            className={joinClasses(
              'absolute top-1/2 right-2 -translate-y-1/2 flex items-center justify-center w-6 h-6 p-0 border-0 bg-transparent rounded-full cursor-pointer text-[var(--label-tertiary)] hover:text-[var(--label-secondary)]',
              "after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[var(--hit-target)] after:h-[var(--hit-target)]",
              FOCUS_RING,
            )}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-[var(--icon-sm)] h-[var(--icon-sm)]"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" fill="currentColor" />
              <path
                d="M8.5 8.5l7 7M15.5 8.5l-7 7"
                className="stroke-[var(--bg)]"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : null}
        {isOpen ? <AnchoredLayer host={layerHost}>{calendarHost}</AnchoredLayer> : null}
      </div>
      {hint ? (
        <FieldHint id={hintId} invalid={invalid}>
          {hint}
        </FieldHint>
      ) : null}
    </div>
  );
};
