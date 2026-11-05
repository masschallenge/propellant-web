import * as React from 'react';
import type { ReactNode } from 'react';
import {
  ANCHORED_SURFACE_CLASSES,
  AnchoredLayer,
  AnchoredSearchField,
  FieldChevron,
  OptionCheckmark,
  anchoredOptionClasses,
  anchoredPanelStyle,
  useAnchoredPosition,
} from '../internal/anchoredLayer';
import { Button } from '../Button/Button';
import type { ButtonSize, ButtonVariant } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Inspector } from '../Inspector/Inspector';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { Token } from '../Token/Token';

type FilterGlyphName = 'cal' | 'sliders' | 'check' | 'x' | 'plus' | 'filterOff';

const GLYPH_PATHS: Record<FilterGlyphName, ReactNode> = {
  cal: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h8M16 18h4" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="14" cy="18" r="2" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M17 7 7 17M7 7l10 10" />,
  plus: <path d="M12 5v14M5 12h14" />,
  filterOff: <path d="M3 5h18M6 12h12M10 19h4" />,
};

const FilterGlyph = ({ name, className }: { name: FilterGlyphName; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className ?? 'block w-[var(--icon-sm)] h-[var(--icon-sm)]'}
  >
    {GLYPH_PATHS[name]}
  </svg>
);

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const FOCUS_RING =
  'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]';

const HIT_AREA =
  "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:h-[max(100%,var(--hit-target))] before:w-[max(100%,var(--hit-target))]";

const TEXT_ACTION = joinClasses(
  'relative inline-flex items-center min-h-[var(--control-md)] px-1 border-0 bg-transparent cursor-pointer rounded-[var(--corner-sm)] font-[inherit] text-callout font-medium whitespace-nowrap',
  'disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed',
  FOCUS_RING,
  HIT_AREA,
);

const textActionTone = (isActive: boolean) =>
  isActive
    ? 'text-[var(--tint)] hover:text-[var(--tint-hover)]'
    : 'text-[var(--label-secondary)] hover:text-[var(--label)]';

const FIELD_SHELL_INPUT =
  'fs-mask flex-1 min-w-0 border-0 bg-transparent outline-none font-[inherit] text-callout text-[var(--label)] placeholder:text-[var(--label-tertiary)]';

const EmptyFilters = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) => (
  <div className="flex flex-col items-center text-center gap-1 px-5 py-6">
    <span className="mb-1 flex text-[var(--label-tertiary)]">
      <FilterGlyph name="filterOff" className="block w-[var(--icon-xl)] h-[var(--icon-xl)]" />
    </span>
    <p className="m-0 text-headline text-[var(--label)]">{title}</p>
    <p className="m-0 max-w-[30ch] text-subheadline text-[var(--label-secondary)]">{description}</p>
    {action ? <div className="mt-2">{action}</div> : null}
  </div>
);

const RemoveConditionButton = ({ onClick }: { onClick: () => void }) => (
  <IconButton variant="plain" destructive aria-label="Remove filter" onClick={onClick}>
    <FilterGlyph name="x" />
  </IconButton>
);

const CountBadge = ({ count, isOnTint = false }: { count: number; isOnTint?: boolean }) => (
  <span
    className={joinClasses(
      'flex-none inline-flex items-center justify-center min-w-5 h-5 ml-1.5 px-1.5 rounded-[var(--corner-capsule)] text-caption font-semibold tabular-nums',
      isOnTint
        ? 'bg-[var(--on-tint)] text-[var(--tint)]'
        : 'bg-[var(--tint)] text-[var(--on-tint)]',
    )}
  >
    {count}
  </span>
);

export type FilterButtonTone = 'neutral' | 'primary' | 'active';

export interface FilterButtonProps extends Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'type' | 'children'
> {
  tone?: FilterButtonTone;
  size?: ButtonSize;
  icon?: 'cal' | 'sliders' | 'plus';
  count?: number;
  menu?: boolean;
  children?: ReactNode;
}

const BUTTON_VARIANT: Record<FilterButtonTone, ButtonVariant> = {
  neutral: 'gray',
  active: 'tinted',
  primary: 'filled',
};

export const FilterButton = ({
  tone = 'neutral',
  icon,
  count,
  menu,
  children,
  ...rest
}: FilterButtonProps) => (
  <Button
    variant={BUTTON_VARIANT[tone]}
    iconLeading={icon ? <FilterGlyph name={icon} /> : undefined}
    iconTrailing={menu ? <FieldChevron /> : undefined}
    {...rest}
  >
    {children}
    {count !== undefined ? <CountBadge count={count} isOnTint={tone === 'primary'} /> : null}
  </Button>
);

export interface FilterChip {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  active?: boolean;
  menu?: boolean;
  onClick?: () => void;
}

export interface FilterTab {
  id: string;
  label: string;
  count?: number;
}

export interface FilterSegment {
  id: string;
  label: string;
}

export interface FilterQuickChip {
  id: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  shortcut?: string;
  hideSearch?: boolean;
  tabs?: FilterTab[];
  tabValue?: string;
  onTabChange?: (id: string) => void;
  segments?: FilterSegment[];
  segmentValue?: string;
  onSegmentChange?: (id: string) => void;
  quickChips?: FilterQuickChip[];
  chips?: FilterChip[];
  children?: ReactNode;
  actions?: ReactNode;
  onClear?: () => void;
  clearLabel?: string;
  clearActive?: boolean;
  className?: string;
}

interface ScrollEdges {
  hasStart: boolean;
  hasEnd: boolean;
}

const REVEAL_PADDING = 12;

export const FilterBar = ({
  searchPlaceholder = 'Search…',
  searchValue,
  onSearchChange,
  shortcut = '⌘K',
  hideSearch = false,
  tabs,
  tabValue,
  onTabChange,
  segments,
  segmentValue,
  onSegmentChange,
  quickChips,
  chips = [],
  children,
  actions,
  onClear,
  clearLabel = 'Clear all',
  clearActive = false,
  className,
}: FilterBarProps) => {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const tabValueRef = React.useRef(tabValue);
  tabValueRef.current = tabValue;
  const [edges, setEdges] = React.useState<ScrollEdges>({ hasStart: false, hasEnd: false });

  const revealTab = (tabId: string | undefined) => {
    const scroller = scrollerRef.current;
    const tab = tabId ? tabRefs.current[tabId] : null;
    if (!scroller || !tab) return;
    const scrollerRect = scroller.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    if (tabRect.left < scrollerRect.left + REVEAL_PADDING) {
      scroller.scrollLeft += tabRect.left - scrollerRect.left - REVEAL_PADDING;
    } else if (tabRect.right > scrollerRect.right - REVEAL_PADDING) {
      scroller.scrollLeft += tabRect.right - scrollerRect.right + REVEAL_PADDING;
    }
  };

  React.useEffect(() => {
    revealTab(tabValue);
  }, [tabValue]);

  React.useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const syncEdges = () => {
      const hasStart = scroller.scrollLeft > 1;
      const hasEnd = scroller.scrollLeft < scroller.scrollWidth - scroller.clientWidth - 1;
      setEdges((previous) =>
        previous.hasStart === hasStart && previous.hasEnd === hasEnd
          ? previous
          : { hasStart, hasEnd },
      );
    };
    const refresh = () => {
      revealTab(tabValueRef.current);
      syncEdges();
    };
    scroller.addEventListener('scroll', syncEdges, { passive: true });
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(refresh);
    if (observer) {
      observer.observe(scroller);
      Array.from(scroller.children).forEach((child) => observer.observe(child));
    }
    refresh();
    return () => {
      scroller.removeEventListener('scroll', syncEdges);
      observer?.disconnect();
    };
  }, []);

  return (
    <div className={joinClasses('flex items-center gap-3 flex-nowrap', className)}>
      <div className="relative flex-1 min-w-0">
        <div
          ref={scrollerRef}
          className="flex items-center gap-2 flex-nowrap overflow-x-auto propellant-scroll-thin propellant-scroll-hidden"
        >
          {tabs && tabs.length ? (
            <div role="tablist" aria-label="Filter tabs" className="inline-flex gap-1">
              {tabs.map((tab) => {
                const isSelected = tab.id === tabValue;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => onTabChange?.(tab.id)}
                    ref={(element) => {
                      tabRefs.current[tab.id] = element;
                    }}
                    className={joinClasses(
                      'relative shrink-0 inline-flex items-center gap-1.5 whitespace-nowrap min-h-[var(--control-md)] px-3 border-0 bg-transparent font-[inherit] text-callout cursor-pointer',
                      isSelected
                        ? "font-semibold text-[var(--label)] after:content-[''] after:absolute after:left-2 after:right-2 after:bottom-0 after:h-0.5 after:rounded-[var(--corner-capsule)] after:bg-[var(--tint)]"
                        : 'font-medium text-[var(--label-secondary)] hover:text-[var(--label)]',
                      'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-[var(--focus-color)] focus-visible:rounded-[var(--corner-md)]',
                    )}
                  >
                    {tab.label}
                    {tab.count !== undefined ? (
                      <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-[var(--corner-capsule)] bg-[var(--fill-tertiary)] text-footnote font-medium tabular-nums text-[var(--label-secondary)]">
                        {tab.count}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}

          {segments && segments.length ? (
            <SegmentedControl
              aria-label="Range"
              className="shrink-0"
              items={segments}
              value={segmentValue}
              onChange={onSegmentChange}
            />
          ) : null}

          {quickChips
            ? quickChips.map((quickChip) => (
                <Token
                  key={quickChip.id}
                  className="shrink-0"
                  label={quickChip.label}
                  selected={Boolean(quickChip.active)}
                  onToggle={() => quickChip.onClick?.()}
                />
              ))
            : null}

          {!hideSearch ? (
            <label className="relative flex items-center gap-1.5 h-[var(--control-md)] pl-3 pr-1.5 min-w-[13.75rem] flex-[0_1_17.5rem] rounded-[var(--corner-capsule)] bg-[var(--bg)] text-[var(--label-tertiary)] shadow-[inset_0_0_0_var(--hairline)_var(--control-border)] focus-within:shadow-[inset_0_0_0_var(--stroke-strong)_var(--focus-color)]">
              <span className="sr-only">Search</span>
              <svg
                viewBox="0 0 24 24"
                className="flex-none block w-[var(--icon-sm)] h-[var(--icon-sm)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="M20 20l-4.2-4.2" />
              </svg>
              <input
                type="search"
                value={searchValue}
                placeholder={searchPlaceholder}
                onChange={(event) => onSearchChange?.(event.target.value)}
                className={joinClasses(
                  FIELD_SHELL_INPUT,
                  '[&::-webkit-search-cancel-button]:hidden',
                )}
              />
              {shortcut ? (
                <kbd
                  aria-hidden="true"
                  className="flex-none inline-flex items-center h-5 px-1.5 rounded-[var(--corner-sm)] font-[inherit] text-footnote text-[var(--label-tertiary)] bg-[var(--fill-tertiary)]"
                >
                  {shortcut}
                </kbd>
              ) : null}
            </label>
          ) : null}

          {chips.map((chip) => (
            <Button
              key={chip.id}
              variant={chip.active ? 'tinted' : 'gray'}
              className="shrink-0"
              aria-pressed={chip.active}
              onClick={chip.onClick}
              iconLeading={chip.icon}
              iconTrailing={chip.menu ? <FieldChevron /> : undefined}
            >
              {chip.label}
              {chip.count !== undefined ? <CountBadge count={chip.count} /> : null}
            </Button>
          ))}

          {children}
        </div>
        {edges.hasStart ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 z-[1] bg-linear-to-r from-[var(--bg-grouped)] to-transparent"
          />
        ) : null}
        {edges.hasEnd ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 z-[1] bg-linear-to-l from-[var(--bg-grouped)] to-transparent"
          />
        ) : null}
      </div>

      <div className="ml-auto flex items-center gap-3 flex-nowrap flex-none">
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            className={joinClasses(TEXT_ACTION, textActionTone(clearActive))}
          >
            {clearLabel}
          </button>
        ) : null}
        {actions}
      </div>
    </div>
  );
};

export interface FilterSelectOption {
  value: string;
  label: string;
  dot?: string;
}

export interface FilterSelectProps {
  label?: string;
  options: FilterSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  open?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  isPrivate?: boolean;
  className?: string;
}

const StatusDot = ({ color }: { color: string }) => (
  <span
    className="flex-none w-2 h-2 rounded-full"
    style={{ background: color }}
    aria-hidden="true"
  />
);

export const FilterSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  open: forcedOpen,
  searchable = false,
  disabled = false,
  isPrivate = false,
  className,
}: FilterSelectProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [query, setQuery] = React.useState('');
  const wrapperRef = React.useRef<HTMLSpanElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLUListElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const menuId = React.useId();
  const isForced = forcedOpen !== undefined;
  const isOpen = isForced ? forcedOpen : isMenuOpen;
  const position = useAnchoredPosition(isOpen, triggerRef, searchable ? panelRef : menuRef);
  const selectedOption = options.find((option) => option.value === value);
  const normalizedQuery = query.trim().toLowerCase();
  const shown =
    searchable && normalizedQuery
      ? options.filter((option) => option.label.toLowerCase().includes(normalizedQuery))
      : options;
  const optionId = (index: number) => `${menuId}-option-${index}`;
  const activeOptionId = activeIndex >= 0 && shown[activeIndex] ? optionId(activeIndex) : undefined;

  React.useEffect(() => {
    if (!isOpen || isForced) return;
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        wrapperRef.current?.contains(target) ||
        menuRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen]);

  React.useEffect(() => {
    if (isMenuOpen && !isForced) (searchable ? searchRef : menuRef).current?.focus();
  }, [isMenuOpen]);

  const openMenu = () => {
    if (isForced || disabled) return;
    setQuery('');
    setActiveIndex(
      Math.max(
        0,
        options.findIndex((option) => option.value === value),
      ),
    );
    setIsMenuOpen(true);
  };

  const closeMenu = (shouldRefocus: boolean) => {
    if (isForced) return;
    setIsMenuOpen(false);
    if (shouldRefocus) triggerRef.current?.focus();
  };

  const choose = (optionValue: string) => {
    onChange?.(optionValue);
    closeMenu(true);
  };

  React.useEffect(() => {
    if (!isOpen || isForced) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      closeMenu(true);
    };
    window.addEventListener('keydown', handleEscape, true);
    return () => window.removeEventListener('keydown', handleEscape, true);
  }, [isOpen]);

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu();
    }
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const lastIndex = shown.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: Math.min(lastIndex, activeIndex + 1),
      ArrowUp: Math.max(0, activeIndex - 1),
      ...(searchable ? {} : { Home: 0, End: lastIndex }),
    };
    if (event.key in moves) {
      event.preventDefault();
      setActiveIndex(moves[event.key]);
    } else if (event.key === 'Enter' || (event.key === ' ' && !searchable)) {
      event.preventDefault();
      if (shown[activeIndex]) choose(shown[activeIndex].value);
    } else if (event.key === 'Tab') {
      closeMenu(false);
    }
  };

  const optionItems = shown.map((option, index) => {
    const isSelected = option.value === value;
    return (
      <li
        key={option.value}
        id={optionId(index)}
        role="option"
        aria-selected={isSelected}
        onMouseEnter={() => setActiveIndex(index)}
        onClick={() => choose(option.value)}
        className={anchoredOptionClasses({ isHighlighted: index === activeIndex })}
      >
        {option.dot ? <StatusDot color={option.dot} /> : null}
        <span className="min-w-0 truncate">{option.label}</span>
        <OptionCheckmark isVisible={isSelected} />
      </li>
    );
  });

  const listbox = (
    <ul
      ref={menuRef}
      id={menuId}
      role="listbox"
      tabIndex={-1}
      aria-label={label || 'Options'}
      aria-activedescendant={activeOptionId}
      onKeyDown={handleMenuKeyDown}
      style={searchable ? undefined : anchoredPanelStyle(position)}
      className={joinClasses(
        'list-none m-0 p-1 outline-none',
        searchable
          ? 'flex-1 min-h-0 overflow-y-auto'
          : joinClasses('min-w-[13.75rem] overflow-y-auto text-callout', ANCHORED_SURFACE_CLASSES),
      )}
    >
      {optionItems}
    </ul>
  );

  return (
    <span
      ref={wrapperRef}
      className={joinClasses('relative inline-flex', isPrivate && 'fs-mask', className)}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onKeyDown={handleTriggerKeyDown}
        onClick={() => {
          if (isMenuOpen) closeMenu(false);
          else openMenu();
        }}
        data-open={isOpen ? 'true' : undefined}
        className={joinClasses(
          'propellant-field items-center gap-1.5 min-h-[var(--control-md)] pl-3 pr-2 border-0 font-[inherit] text-callout text-left cursor-pointer text-[var(--label)]',
          'disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]',
        )}
      >
        <span className="propellant-field-ring" aria-hidden="true" />
        {label ? (
          <>
            <span className="text-[var(--label-secondary)]">{label}</span>{' '}
          </>
        ) : null}
        {selectedOption?.dot ? <StatusDot color={selectedOption.dot} /> : null}
        <span
          className={joinClasses(
            'whitespace-nowrap',
            selectedOption ? 'font-medium text-[var(--label)]' : 'text-[var(--label-tertiary)]',
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FieldChevron shape="popup" className="ml-auto" />
      </button>
      {isOpen && searchable ? (
        <AnchoredLayer isPrivate={isPrivate}>
          <div
            ref={panelRef}
            style={anchoredPanelStyle(position)}
            className={joinClasses('min-w-60 flex flex-col text-callout', ANCHORED_SURFACE_CLASSES)}
          >
            <div className="flex-none px-1.5 pt-1.5">
              <AnchoredSearchField
                ref={searchRef}
                role="combobox"
                aria-label={`Search ${(label || 'options').toLowerCase()}`}
                aria-expanded={true}
                aria-controls={menuId}
                aria-autocomplete="list"
                aria-activedescendant={activeOptionId}
                placeholder="Search…"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleMenuKeyDown}
              />
            </div>
            {listbox}
            {shown.length === 0 ? (
              <p role="status" className="m-0 px-3 pb-3 text-[var(--label-secondary)]">
                No matches
              </p>
            ) : null}
          </div>
        </AnchoredLayer>
      ) : null}
      {isOpen && !searchable ? (
        <AnchoredLayer isPrivate={isPrivate}>{listbox}</AnchoredLayer>
      ) : null}
    </span>
  );
};

export interface FilterPopoverOption {
  id: string;
  label: string;
  count?: number;
  checked?: boolean;
}

export interface FilterPopoverProps {
  label?: string;
  title?: string;
  options?: FilterPopoverOption[];
  onToggle?: (id: string) => void;
  onApply?: () => void;
  onClear?: () => void;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onAddFilter?: () => void;
  open?: boolean;
  className?: string;
}

const CheckboxMark = ({ isChecked }: { isChecked: boolean }) => (
  <span
    aria-hidden="true"
    className={joinClasses(
      'flex-none flex items-center justify-center w-4 h-4 rounded-[var(--corner-sm)]',
      isChecked
        ? 'bg-[var(--tint)] text-[var(--on-tint)]'
        : 'bg-[var(--bg)] text-transparent shadow-[inset_0_0_0_1px_var(--control-border)]',
    )}
  >
    <FilterGlyph name="check" className="block w-3 h-3" />
  </span>
);

export const FilterPopover = ({
  label = 'Filters',
  title = 'Filters',
  options,
  onToggle,
  onApply,
  onClear,
  empty = false,
  emptyTitle = 'No filters applied',
  emptyDescription = 'Add a filter to narrow this list down.',
  onAddFilter,
  open: forcedOpen,
  className,
}: FilterPopoverProps) => {
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLSpanElement>(null);
  const isForced = forcedOpen !== undefined;
  const isOpen = isForced ? forcedOpen : isPanelOpen;
  const activeCount = (options || []).filter((option) => option.checked).length;
  const isEmpty = empty || !options || !options.length;

  React.useEffect(() => {
    if (!isOpen || isForced) return;
    const handleMouseDown = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsPanelOpen(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <span ref={wrapperRef} className={joinClasses('relative inline-flex', className)}>
      <FilterButton
        tone={isOpen || activeCount ? 'active' : 'neutral'}
        icon="sliders"
        count={activeCount || undefined}
        aria-expanded={isOpen}
        aria-label={activeCount ? `${label}, ${activeCount} active` : undefined}
        onClick={() => {
          if (!isForced) setIsPanelOpen(!isPanelOpen);
        }}
      >
        {label}
      </FilterButton>
      {isOpen ? (
        <div
          className={joinClasses(
            'absolute z-[var(--layer-dropdown)] top-[calc(100%+6px)] right-0 w-[18.5rem] overflow-hidden text-callout',
            ANCHORED_SURFACE_CLASSES,
          )}
        >
          <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 border-b-[length:var(--hairline)] border-solid border-[var(--separator)]">
            <p className="m-0 text-headline text-[var(--label)]">{title}</p>
            {activeCount && onClear ? (
              <button
                type="button"
                onClick={onClear}
                className={joinClasses(TEXT_ACTION, textActionTone(true))}
              >
                Clear all
              </button>
            ) : null}
          </div>
          {isEmpty ? (
            <EmptyFilters title={emptyTitle} description={emptyDescription} />
          ) : (
            <div className="p-1">
              {options.map((option) => (
                <div
                  key={option.id}
                  role="checkbox"
                  aria-checked={Boolean(option.checked)}
                  tabIndex={0}
                  onClick={() => onToggle?.(option.id)}
                  onKeyDown={(event) => {
                    if (event.key === ' ' || event.key === 'Enter') {
                      event.preventDefault();
                      onToggle?.(option.id);
                    }
                  }}
                  className="flex items-center gap-2 min-h-[var(--control-sm)] px-2 py-1 rounded-[var(--corner-md)] cursor-default text-[var(--label)] hover:bg-[var(--fill-tertiary)] focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-[var(--focus-color)]"
                >
                  <CheckboxMark isChecked={Boolean(option.checked)} />
                  <span className={option.checked ? 'font-medium' : undefined}>{option.label}</span>
                  {option.count !== undefined ? (
                    <span className="ml-auto text-footnote tabular-nums text-[var(--label-secondary)]">
                      {option.count}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-t-[length:var(--hairline)] border-solid border-[var(--separator)]">
            {isEmpty ? (
              <>
                <span />
                <FilterButton tone="primary" icon="plus" size="sm" onClick={onAddFilter}>
                  Add filter
                </FilterButton>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClear}
                  className={joinClasses(TEXT_ACTION, textActionTone(Boolean(activeCount)))}
                >
                  {activeCount ? 'Clear all' : 'Clear'}
                </button>
                <FilterButton tone="primary" size="sm" onClick={onApply}>
                  Apply
                </FilterButton>
              </>
            )}
          </div>
        </div>
      ) : null}
    </span>
  );
};

export interface FilterCondition {
  field: string;
  operator: string;
  value: string;
}

export interface FilterConditionsProps {
  rows: FilterCondition[];
  fieldOptions?: string[];
  operatorOptions?: string[];
  onChange?: (rows: FilterCondition[]) => void;
  onApply?: () => void;
  onClear?: () => void;
  onAdd?: () => void;
  clearActive?: boolean;
  className?: string;
}

const toSelectOptions = (labels: string[]): FilterSelectOption[] =>
  labels.map((optionLabel) => ({ value: optionLabel, label: optionLabel }));

const updateCondition = (
  rows: FilterCondition[],
  rowIndex: number,
  patch: Partial<FilterCondition>,
) => rows.map((row, index) => (index === rowIndex ? { ...row, ...patch } : row));

const removeCondition = (rows: FilterCondition[], rowIndex: number) =>
  rows.filter((row, index) => index !== rowIndex);

export const FilterConditions = ({
  rows,
  fieldOptions = [],
  operatorOptions = ['Equals', 'Contains', 'Does not contain'],
  onChange,
  onApply,
  onClear,
  onAdd,
  clearActive = false,
  className,
}: FilterConditionsProps) => (
  <div className={className}>
    <div className="flex flex-col gap-3">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-2 flex-wrap">
          <span className="min-w-13 text-subheadline font-medium text-[var(--label-secondary)]">
            {rowIndex === 0 ? 'Where' : 'And'}
          </span>
          <FilterSelect
            options={toSelectOptions(fieldOptions.length ? fieldOptions : [row.field])}
            value={row.field}
            onChange={(field) => onChange?.(updateCondition(rows, rowIndex, { field }))}
          />
          <FilterSelect
            options={toSelectOptions(operatorOptions)}
            value={row.operator}
            onChange={(operator) => onChange?.(updateCondition(rows, rowIndex, { operator }))}
          />
          <span className="propellant-field flex-1 min-w-40 items-center min-h-[var(--control-md)] px-3">
            <span className="propellant-field-ring" aria-hidden="true" />
            <input
              type="text"
              value={row.value}
              placeholder="Enter a value"
              aria-label="Filter value"
              onChange={(event) =>
                onChange?.(updateCondition(rows, rowIndex, { value: event.target.value }))
              }
              className={FIELD_SHELL_INPUT}
            />
          </span>
          {onChange && rows.length > 0 ? (
            <RemoveConditionButton onClick={() => onChange(removeCondition(rows, rowIndex))} />
          ) : null}
        </div>
      ))}
    </div>
    <div className="flex items-center gap-3 mt-5 pt-4 border-t-[length:var(--hairline)] border-solid border-[var(--separator)]">
      <button
        type="button"
        onClick={onClear}
        className={joinClasses(TEXT_ACTION, textActionTone(clearActive))}
      >
        Clear all
      </button>
      <div className="ml-auto flex items-center gap-3">
        {onAdd ? (
          <FilterButton icon="plus" onClick={onAdd}>
            Add condition
          </FilterButton>
        ) : null}
        <FilterButton tone="primary" onClick={onApply}>
          Apply filters
        </FilterButton>
      </div>
    </div>
  </div>
);

export interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  rows?: FilterCondition[];
  onRowsChange?: (rows: FilterCondition[]) => void;
  onAdd?: () => void;
  onApply?: () => void;
  onClear?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  inline?: boolean;
  className?: string;
}

export const FilterDrawer = ({
  open,
  onClose,
  title = 'Filters',
  description,
  rows,
  onRowsChange,
  onAdd,
  onApply,
  onClear,
  emptyTitle = 'No conditions yet',
  emptyDescription = 'Add your first condition to start filtering the results.',
  inline = false,
  className,
}: FilterDrawerProps) => {
  const conditions = rows ?? [];
  const hasRows = conditions.length > 0;
  const addConditionButton = onAdd ? (
    <FilterButton icon="plus" onClick={onAdd}>
      Add condition
    </FilterButton>
  ) : null;
  return (
    <Inspector
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      inline={inline}
      closeLabel={`Close ${title.toLowerCase()}`}
      className={className}
      footer={
        <>
          <Button variant="gray" disabled={!hasRows} onClick={onClear}>
            Clear all
          </Button>
          <Button variant="filled" disabled={!hasRows} onClick={onApply}>
            Apply filters
          </Button>
        </>
      }
    >
      {hasRows ? (
        <>
          <p className="m-0 mt-1 text-footnote font-semibold text-[var(--label-tertiary)]">
            Conditions
          </p>
          <div className="flex flex-col gap-3">
            {conditions.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <FilterSelect
                    className="flex-1 [&>button]:w-full"
                    options={toSelectOptions([row.field])}
                    value={row.field}
                    onChange={(field) =>
                      onRowsChange?.(updateCondition(conditions, rowIndex, { field }))
                    }
                  />
                  {onRowsChange ? (
                    <RemoveConditionButton
                      onClick={() => onRowsChange(removeCondition(conditions, rowIndex))}
                    />
                  ) : null}
                </div>
                <span className="propellant-field items-center min-h-[var(--control-md)] px-3">
                  <span className="propellant-field-ring" aria-hidden="true" />
                  <input
                    type="text"
                    value={`${row.operator} · ${row.value}`}
                    aria-label={`${row.field} value`}
                    onChange={(event) =>
                      onRowsChange?.(
                        updateCondition(conditions, rowIndex, { value: event.target.value }),
                      )
                    }
                    className={FIELD_SHELL_INPUT}
                  />
                </span>
              </div>
            ))}
          </div>
          {addConditionButton ? <div>{addConditionButton}</div> : null}
        </>
      ) : (
        <EmptyFilters
          title={emptyTitle}
          description={emptyDescription}
          action={addConditionButton}
        />
      )}
    </Inspector>
  );
};
