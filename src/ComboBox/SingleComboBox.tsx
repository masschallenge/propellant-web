import * as React from 'react';
import type { ReactNode } from 'react';
import {
  ANCHORED_SECTION_CLASSES,
  ANCHORED_SURFACE_CLASSES,
  AnchoredLayer,
  AnchoredSearchField,
  FieldChevron,
  OptionCheckmark,
  anchoredOptionClasses,
  anchoredPanelStyle,
  useAnchoredPosition,
} from '../internal/anchoredLayer';
import { FieldHint, FieldLabel } from '../TextField/fieldText';

export interface ComboBoxOption {
  value: string;
  label: string;
  sub?: string;
  short?: string;
  detail?: string | readonly string[];
  group?: string;
  keywords?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export type ComboBoxSize = 'sm' | 'md' | 'lg';

export interface SingleComboBoxProps {
  options: ComboBoxOption[];
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string | null) => void;
  label?: string;
  hideLabel?: boolean;
  ariaLabel?: string;
  footer?: (close: (refocus?: boolean) => void) => ReactNode;
  overline?: string;
  hint?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  size?: ComboBoxSize;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  id?: string;
  isPrivate?: boolean;
  className?: string;
}

interface OptionGroup {
  name: string;
  options: ComboBoxOption[];
}

const TRIGGER_SIZES: Record<ComboBoxSize, string> = {
  sm: 'gap-2 min-h-[var(--control-sm)] px-2.5 text-subheadline',
  md: 'gap-2 min-h-[var(--control-md)] px-3 text-callout',
  lg: 'gap-2.5 min-h-[var(--control-lg)] px-3.5 text-body',
};

const ICON_CLASSES =
  'flex-none flex items-center [&>svg]:w-[var(--icon-md)] [&>svg]:h-[var(--icon-md)] [&>svg]:block';

const FOOTER_FOCUSABLE_SELECTOR = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

const SINGLE_LINE = 'whitespace-nowrap overflow-hidden text-ellipsis';

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const detailLines = (detail: ComboBoxOption['detail']): readonly string[] => {
  if (!detail) return [];
  return typeof detail === 'string' ? [detail] : detail;
};

const groupOptions = (options: ComboBoxOption[]): OptionGroup[] => {
  const groups: OptionGroup[] = [];
  options.forEach((option) => {
    const name = option.group || '';
    const existing = groups.find((group) => group.name === name);
    if (existing) existing.options.push(option);
    else groups.push({ name, options: [option] });
  });
  return groups;
};

export const SingleComboBox = ({
  options,
  value,
  defaultValue,
  onChange,
  label,
  hideLabel = false,
  ariaLabel,
  footer,
  overline,
  hint,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  emptyText = 'No results',
  size = 'md',
  invalid = false,
  disabled = false,
  required = false,
  clearable = true,
  id,
  isPrivate = false,
  className,
}: SingleComboBoxProps) => {
  const generatedId = React.useId();
  const fieldId = id || generatedId;
  const listId = `${fieldId}-list`;
  const labelId = `${fieldId}-label`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const accessibleName = label || ariaLabel;
  const [internalValue, setInternalValue] = React.useState<string | null>(defaultValue ?? null);
  const currentValue = value === undefined ? internalValue : value;
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const footerRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [layerHost, setLayerHost] = React.useState<Element | null>(null);

  const selectedOption = options.find((option) => option.value === currentValue) || null;
  const normalizedQuery = query.trim().toLowerCase();
  const matching = normalizedQuery
    ? options.filter((option) =>
        [option.label, option.sub, ...detailLines(option.detail), option.keywords]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : options;
  const groups = groupOptions(matching);
  const isGrouped = groups.some((group) => group.name !== '');
  const filtered = groups.flatMap((group) => group.options);
  const optionId = (index: number) => `${listId}-opt-${index}`;
  const activeId = isOpen && filtered.length ? optionId(activeIndex) : undefined;
  const position = useAnchoredPosition(isOpen, wrapperRef, panelRef);
  const isPanelPlaced = Boolean(position);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInside = wrapperRef.current?.contains(target) || panelRef.current?.contains(target);
      if (!isInside) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen && isPanelPlaced) inputRef.current?.focus();
  }, [isOpen, isPanelPlaced]);

  const openMenu = (seed?: string) => {
    if (disabled) return;
    setQuery(seed || '');
    setActiveIndex(
      seed
        ? 0
        : Math.max(
            0,
            options.findIndex((option) => option.value === currentValue),
          ),
    );
    setLayerHost(wrapperRef.current?.closest('[data-propellant-layer-host]') ?? null);
    setIsOpen(true);
  };

  const close = (shouldRefocus?: boolean) => {
    setIsOpen(false);
    setQuery('');
    if (shouldRefocus) triggerRef.current?.focus();
  };

  React.useEffect(() => {
    if (!isOpen) return undefined;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      if (query && event.target === inputRef.current) {
        setQuery('');
        setActiveIndex(0);
      } else close(true);
    };
    window.addEventListener('keydown', handleEscape, true);
    return () => window.removeEventListener('keydown', handleEscape, true);
  }, [isOpen, query]);

  const commit = (option: ComboBoxOption | undefined) => {
    if (!option || option.disabled) return;
    if (value === undefined) setInternalValue(option.value);
    onChange?.(option.value);
    close(true);
  };

  const clear = () => {
    if (value === undefined) setInternalValue(null);
    onChange?.(null);
  };

  const move = (direction: number) => {
    if (!filtered.length) return;
    setActiveIndex((index) => (index + direction + filtered.length) % filtered.length);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      openMenu();
    } else if (
      (event.key === 'Backspace' || event.key === 'Delete') &&
      clearable &&
      selectedOption
    ) {
      event.preventDefault();
      clear();
    } else if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      openMenu(event.key);
    }
  };

  const footerFocusables = (): HTMLElement[] =>
    footerRef.current
      ? Array.from(footerRef.current.querySelectorAll<HTMLElement>(FOOTER_FOCUSABLE_SELECTOR))
      : [];

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      move(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      commit(filtered[activeIndex]);
    } else if (event.key === 'Tab') {
      const firstFooterItem = event.shiftKey ? undefined : footerFocusables()[0];
      if (firstFooterItem) {
        event.preventDefault();
        firstFooterItem.focus();
      } else if (event.shiftKey) {
        event.preventDefault();
        close(true);
      } else close();
    }
  };

  const handleFooterKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const items = footerFocusables();
    const focusIndex = items.indexOf(document.activeElement as HTMLElement);
    if (event.key === 'Tab' && event.shiftKey && focusIndex === 0) {
      event.preventDefault();
      inputRef.current?.focus();
    } else if (event.key === 'Tab' && !event.shiftKey && focusIndex === items.length - 1) {
      event.preventDefault();
      close(true);
    }
  };

  const showsClear = clearable && Boolean(selectedOption) && !disabled;

  const renderOption = (option: ComboBoxOption) => {
    const index = filtered.indexOf(option);
    const isSelected = option.value === currentValue;
    const dimmed = option.disabled && 'opacity-[var(--opacity-disabled)]';
    const lines = detailLines(option.detail);
    const optionLabel = (
      <span title={option.label} className={joinClasses('min-w-0 truncate', dimmed)}>
        {option.label}
      </span>
    );
    const optionSub = option.sub ? (
      <span className={joinClasses('shrink-0 text-(--option-secondary)', dimmed)}>
        {option.sub}
      </span>
    ) : null;
    return (
      <li
        key={option.value}
        id={optionId(index)}
        role="option"
        aria-selected={isSelected}
        aria-disabled={option.disabled || undefined}
        onMouseEnter={() => setActiveIndex(index)}
        onClick={() => commit(option)}
        className={anchoredOptionClasses({
          isHighlighted: index === activeIndex,
          isDisabled: option.disabled,
        })}
      >
        {option.icon ? (
          <span
            className={joinClasses(ICON_CLASSES, 'text-(--option-secondary)', dimmed)}
            aria-hidden="true"
          >
            {option.icon}
          </span>
        ) : null}
        {lines.length > 0 ? (
          <span className="flex flex-col min-w-0">
            <span className="flex min-w-0 items-baseline gap-2">
              {optionLabel}
              {optionSub}
            </span>
            {lines.map((line, lineIndex) => (
              <span
                key={`${lineIndex}-${line}`}
                className={joinClasses(
                  'text-footnote',
                  option.disabled ? 'text-[var(--warning)]' : 'text-(--option-secondary)',
                )}
              >
                {line}
              </span>
            ))}
          </span>
        ) : (
          <>
            {optionLabel}
            {optionSub}
          </>
        )}
        <OptionCheckmark isVisible={isSelected} />
      </li>
    );
  };

  const listName = {
    'aria-labelledby': label ? labelId : undefined,
    'aria-label': label ? undefined : ariaLabel,
  };

  const overlineElement = overline ? (
    <span id={`${fieldId}-overline`} className="text-footnote text-[var(--label-secondary)]">
      {overline}
    </span>
  ) : null;

  return (
    <div
      className={joinClasses('flex flex-col gap-1.5 min-w-0', isPrivate && 'fs-mask', className)}
    >
      {label ? (
        <FieldLabel
          id={labelId}
          htmlFor={fieldId}
          required={required}
          className={hideLabel ? 'sr-only' : undefined}
        >
          {label}
        </FieldLabel>
      ) : null}
      <div className="relative" ref={wrapperRef}>
        <div
          id={fieldId}
          ref={triggerRef}
          role="combobox"
          tabIndex={disabled ? -1 : 0}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listId : undefined}
          aria-labelledby={
            label
              ? labelId
              : !ariaLabel && overline
                ? `${fieldId}-overline ${fieldId}-value`
                : undefined
          }
          aria-label={label ? undefined : ariaLabel}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          aria-disabled={disabled || undefined}
          aria-describedby={hintId}
          className={joinClasses(
            'propellant-field items-center w-full text-left text-[var(--label)]',
            TRIGGER_SIZES[size],
            disabled ? 'opacity-[var(--opacity-disabled)] cursor-not-allowed' : 'cursor-pointer',
          )}
          onClick={() => {
            if (disabled) return;
            if (isOpen) close();
            else openMenu();
          }}
          onKeyDown={handleTriggerKeyDown}
          data-invalid={invalid ? 'true' : undefined}
          data-open={isOpen ? 'true' : undefined}
        >
          <span className="propellant-field-ring" aria-hidden="true" />
          {selectedOption?.icon ? (
            <span
              className={joinClasses(ICON_CLASSES, 'text-[var(--label-secondary)]')}
              aria-hidden="true"
            >
              {selectedOption.icon}
            </span>
          ) : null}
          <span className={joinClasses('flex flex-col min-w-0', overline && 'py-1')}>
            {overlineElement}
            {selectedOption ? (
              <span className="flex items-baseline gap-2 min-w-0">
                <span id={`${fieldId}-value`} title={selectedOption.label} className={SINGLE_LINE}>
                  {selectedOption.short ? (
                    <>
                      {selectedOption.short}
                      <span className="sr-only"> {selectedOption.label}</span>
                    </>
                  ) : (
                    selectedOption.label
                  )}
                </span>
                {selectedOption.sub && !selectedOption.short ? (
                  <span
                    className={joinClasses('min-w-0 text-[var(--label-secondary)]', SINGLE_LINE)}
                  >
                    {selectedOption.sub}
                  </span>
                ) : null}
              </span>
            ) : (
              <span
                id={`${fieldId}-value`}
                className={joinClasses('text-[var(--label-tertiary)]', SINGLE_LINE)}
              >
                {placeholder}
              </span>
            )}
          </span>
          {showsClear ? (
            <button
              type="button"
              aria-label="Clear selection"
              onClick={(event) => {
                event.stopPropagation();
                clear();
              }}
              onKeyDown={(event) => event.stopPropagation()}
              className="relative ml-auto flex-none flex items-center justify-center w-[var(--icon-md)] h-[var(--icon-md)] p-0 border-0 bg-transparent cursor-pointer rounded-full text-[var(--label-tertiary)] hover:text-[var(--label-secondary)] focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-[var(--hit-target)] before:h-[var(--hit-target)] before:-translate-x-1/2 before:-translate-y-1/2"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-[var(--icon-sm)] h-[var(--icon-sm)]"
                fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path
                  d="m9 9 6 6M15 9l-6 6"
                  className="stroke-[var(--bg)]"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : null}
          <FieldChevron className={showsClear ? undefined : 'ml-auto'} />
        </div>
        {isOpen ? (
          <AnchoredLayer host={layerHost} isPrivate={isPrivate}>
            <div
              ref={panelRef}
              style={anchoredPanelStyle(position, { matchWidth: true, capsHeight: false })}
              className={joinClasses(ANCHORED_SURFACE_CLASSES, 'overflow-hidden text-callout')}
            >
              <div className="px-1.5 pt-1.5 pb-1">
                <AnchoredSearchField
                  ref={inputRef}
                  value={query}
                  placeholder={searchPlaceholder}
                  aria-label={
                    accessibleName ? `Filter ${accessibleName.toLowerCase()}` : 'Filter options'
                  }
                  aria-autocomplete="list"
                  aria-controls={listId}
                  aria-activedescendant={activeId}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleInputKeyDown}
                />
              </div>
              {filtered.length && isGrouped ? (
                <div
                  id={listId}
                  role="listbox"
                  {...listName}
                  className="m-0 p-1 max-h-70 overflow-auto"
                >
                  {groups.map((group, groupIndex) => {
                    const headingId = `${listId}-group-${groupIndex}`;
                    return (
                      <ul
                        key={group.name || headingId}
                        role="group"
                        aria-labelledby={group.name ? headingId : undefined}
                        className="list-none m-0 p-0"
                      >
                        {group.name ? (
                          <li
                            role="presentation"
                            id={headingId}
                            className={ANCHORED_SECTION_CLASSES}
                          >
                            {group.name}
                          </li>
                        ) : null}
                        {group.options.map(renderOption)}
                      </ul>
                    );
                  })}
                </div>
              ) : filtered.length ? (
                <ul
                  id={listId}
                  role="listbox"
                  {...listName}
                  className="list-none m-0 p-1 max-h-70 overflow-auto"
                >
                  {filtered.map(renderOption)}
                </ul>
              ) : (
                <div
                  id={listId}
                  role="listbox"
                  {...listName}
                  className="m-0 px-3 py-3 text-[var(--label-secondary)]"
                >
                  {emptyText}
                </div>
              )}
              {footer ? (
                <div
                  ref={footerRef}
                  onKeyDown={handleFooterKeyDown}
                  className="p-1 border-t-[length:var(--hairline)] border-solid border-[var(--separator)]"
                >
                  {footer(close)}
                </div>
              ) : null}
            </div>
          </AnchoredLayer>
        ) : null}
      </div>
      {hint ? (
        <FieldHint id={hintId} invalid={invalid}>
          {hint}
        </FieldHint>
      ) : null}
    </div>
  );
};
