import * as React from 'react';
import {
  ANCHORED_SURFACE_CLASSES,
  AnchoredLayer,
  AnchoredSearchField,
  FieldChevron,
  anchoredOptionClasses,
  anchoredPanelStyle,
  useAnchoredPosition,
} from '../internal/anchoredLayer';
import { Button } from '../Button/Button';
import { FieldHint, FieldLabel } from '../TextField/fieldText';
import { Token } from '../Token/Token';

const COLLAPSED_CHIP_LIMIT = 5;

export interface MultiComboBoxOption {
  value: string;
  label: string;
  sub?: string;
  disabled?: boolean;
  parent?: string;
}

type MultiComboBoxSize = 'sm' | 'md' | 'lg';

export interface MultiComboBoxProps {
  options: MultiComboBoxOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  label?: string;
  ariaLabel?: string;
  labelHelp?: string;
  hint?: string;
  placeholder?: string;
  size?: MultiComboBoxSize;
  searchable?: boolean;
  summarySecondary?: string;
  footer?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  isPrivate?: boolean;
  className?: string;
}

const FIELD_SIZES: Record<MultiComboBoxSize, string> = {
  sm: 'min-h-[var(--control-sm)] text-subheadline',
  md: 'min-h-[var(--control-md)] text-callout',
  lg: 'min-h-[var(--control-lg)] text-body',
};

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const SearchSymbol = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-[var(--icon-xl)] h-[var(--icon-xl)]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

export const MultiComboBox = ({
  options,
  value,
  defaultValue = [],
  onChange,
  label,
  ariaLabel,
  labelHelp,
  hint,
  placeholder = 'Select…',
  size = 'md',
  searchable = true,
  summarySecondary,
  footer = true,
  invalid = false,
  disabled = false,
  required = false,
  id,
  isPrivate = false,
  className,
}: MultiComboBoxProps) => {
  const generatedId = React.useId();
  const fieldId = id || generatedId;
  const listId = `${fieldId}-list`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue);
  const chosen: string[] = value === undefined ? internalValue : Array.isArray(value) ? value : [];
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [areChipsExpanded, setAreChipsExpanded] = React.useState(false);
  const [toggledParents, setToggledParents] = React.useState<string[]>([]);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const position = useAnchoredPosition(isOpen, wrapperRef, panelRef);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInside = wrapperRef.current?.contains(target) || panelRef.current?.contains(target);
      if (!isInside) setIsOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleEscape, true);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleEscape, true);
    };
  }, [isOpen]);

  const update = (next: string[]) => {
    if (value === undefined) setInternalValue(next);
    onChange?.(next);
  };

  const toggle = (option: MultiComboBoxOption) => {
    if (option.disabled) return;
    update(
      chosen.includes(option.value)
        ? chosen.filter((chosenValue) => chosenValue !== option.value)
        : [...chosen, option.value],
    );
  };

  const optionValues = new Set(options.map((option) => option.value));
  const parentOf = (option: MultiComboBoxOption) =>
    option.parent && optionValues.has(option.parent) ? option.parent : null;
  const childrenOf = (parentValue: string) =>
    options.filter((option) => parentOf(option) === parentValue);
  const hasChosenChild = (optionValue: string) =>
    childrenOf(optionValue).some((child) => chosen.includes(child.value));
  const isExpanded = (optionValue: string) =>
    hasChosenChild(optionValue) !== toggledParents.includes(optionValue);
  const setOptionExpanded = (optionValue: string, shouldExpand: boolean) => {
    if (isExpanded(optionValue) === shouldExpand) return;
    setToggledParents((current) =>
      current.includes(optionValue)
        ? current.filter((toggledValue) => toggledValue !== optionValue)
        : [...current, optionValue],
    );
  };

  const shown = query
    ? options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))
    : options
        .filter((option) => !parentOf(option))
        .flatMap((option) =>
          isExpanded(option.value) ? [option, ...childrenOf(option.value)] : [option],
        );

  const labelFor = (chipValue: string) =>
    options.find((option) => option.value === chipValue)?.label ?? chipValue;
  const isCollapsible = chosen.length > COLLAPSED_CHIP_LIMIT;
  const visibleChips =
    isCollapsible && !areChipsExpanded ? chosen.slice(0, COLLAPSED_CHIP_LIMIT) : chosen;
  const hiddenChipCount = chosen.length - COLLAPSED_CHIP_LIMIT;
  const optionId = (index: number) => `${listId}-opt-${index}`;

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex(0);
      return;
    }
    if (!isOpen) return;
    const activeOption = shown[activeIndex];
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, shown.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    } else if (
      (event.key === 'ArrowRight' || event.key === 'ArrowLeft') &&
      !query &&
      activeOption
    ) {
      const parentValue = parentOf(activeOption);
      if (event.key === 'ArrowRight' && childrenOf(activeOption.value).length) {
        event.preventDefault();
        setOptionExpanded(activeOption.value, true);
      } else if (event.key === 'ArrowLeft' && isExpanded(activeOption.value)) {
        event.preventDefault();
        setOptionExpanded(activeOption.value, false);
      } else if (event.key === 'ArrowLeft' && parentValue) {
        event.preventDefault();
        setActiveIndex(shown.findIndex((option) => option.value === parentValue));
      }
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (activeOption) toggle(activeOption);
    }
  };

  const renderOption = (option: MultiComboBoxOption, index: number) => {
    const isChosen = chosen.includes(option.value);
    const childCount = query ? 0 : childrenOf(option.value).length;
    const isNested = !query && parentOf(option) !== null;
    const isOptionExpanded = isExpanded(option.value);
    const sub = isNested && option.sub === labelFor(option.parent ?? '') ? '' : option.sub;
    return (
      <li
        key={option.value}
        id={optionId(index)}
        role="option"
        aria-checked={isChosen}
        aria-selected={isChosen}
        aria-disabled={option.disabled || undefined}
        onMouseEnter={() => setActiveIndex(index)}
        onClick={() => toggle(option)}
        className={joinClasses(
          anchoredOptionClasses({
            isHighlighted: index === activeIndex,
            isDisabled: option.disabled,
          }),
          isNested && 'pl-8',
          option.disabled && 'opacity-[var(--opacity-disabled)]',
        )}
      >
        <span
          aria-hidden="true"
          className={joinClasses(
            'flex-none flex items-center justify-center w-4 h-4 rounded-[var(--corner-sm)]',
            isChosen
              ? 'bg-[var(--tint)] text-[var(--on-tint)] shadow-[inset_0_0_0_1px_var(--option-check)]'
              : 'bg-[var(--bg)] text-transparent shadow-[inset_0_0_0_1px_var(--control-border)]',
          )}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <span className="min-w-0 truncate">{option.label}</span>
        {childCount ? (
          <span className="sr-only">
            {`, ${childCount} ${childCount === 1 ? 'sub-option' : 'sub-options'}, ${
              isOptionExpanded ? 'expanded' : 'collapsed, Arrow Right to expand'
            }`}
          </span>
        ) : null}
        {sub ? (
          <span className="ml-auto shrink-0 text-footnote text-(--option-secondary)">{sub}</span>
        ) : null}
        {childCount ? (
          <span
            aria-hidden="true"
            data-testid={`ms-expand-${option.value}`}
            onClick={(event: React.MouseEvent<HTMLSpanElement>) => {
              event.stopPropagation();
              setOptionExpanded(option.value, !isOptionExpanded);
            }}
            className={joinClasses(
              'flex-none inline-flex items-center gap-0.5 min-h-6 px-1.5 rounded-[var(--corner-sm)] cursor-pointer text-footnote tabular-nums text-(--option-secondary) hover:bg-[var(--fill-tertiary)]',
              !sub && 'ml-auto',
            )}
          >
            {childCount}
            <svg
              viewBox="0 0 24 24"
              className={joinClasses(
                'block w-[var(--icon-sm)] h-[var(--icon-sm)] transition-transform duration-[var(--spring-snappy-duration)] ease-[var(--spring-snappy)]',
                isOptionExpanded && 'rotate-180',
              )}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        ) : null}
      </li>
    );
  };

  return (
    <div
      className={joinClasses('flex flex-col gap-1.5 min-w-0', isPrivate && 'fs-mask', className)}
    >
      {label ? (
        <FieldLabel htmlFor={fieldId} required={required} help={labelHelp}>
          {label}
        </FieldLabel>
      ) : null}
      <div className="relative" ref={wrapperRef}>
        <div
          data-invalid={invalid ? 'true' : undefined}
          data-open={isOpen ? 'true' : undefined}
          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            if (event.target === event.currentTarget && !disabled) setIsOpen(!isOpen);
          }}
          className={joinClasses(
            'propellant-field flex-wrap items-center gap-1 w-full py-1 pl-1.5 pr-3 text-[var(--label)]',
            FIELD_SIZES[size],
            disabled ? 'opacity-[var(--opacity-disabled)] cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          <span className="propellant-field-ring" aria-hidden="true" />
          {visibleChips.map((chipValue) => {
            const chipLabel = labelFor(chipValue);
            return (
              <Token
                key={chipValue}
                size="sm"
                wrap
                label={chipLabel}
                disabled={disabled}
                onRemove={() => update(chosen.filter((chosenValue) => chosenValue !== chipValue))}
              />
            );
          })}
          {isCollapsible ? (
            <button
              type="button"
              aria-expanded={areChipsExpanded}
              disabled={disabled}
              onClick={() => setAreChipsExpanded(!areChipsExpanded)}
              className="min-h-6 px-2 border-0 rounded-[var(--corner-capsule)] bg-transparent font-[inherit] text-subheadline font-medium text-[var(--tint)] cursor-pointer hover:bg-[var(--tint-fill)] disabled:cursor-not-allowed focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]"
            >
              {areChipsExpanded ? 'Show fewer' : `+${hiddenChipCount} more`}
            </button>
          ) : null}
          <button
            ref={triggerRef}
            id={fieldId}
            type="button"
            role="combobox"
            disabled={disabled}
            aria-label={label ? undefined : ariaLabel}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={isOpen ? listId : undefined}
            aria-invalid={invalid || undefined}
            aria-describedby={hintId}
            aria-activedescendant={isOpen && shown.length ? optionId(activeIndex) : undefined}
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={handleTriggerKeyDown}
            className="flex flex-1 items-center gap-2 min-w-24 min-h-6 p-0 pl-1 border-0 bg-transparent text-left cursor-pointer font-[inherit] text-[inherit] text-[var(--label)] outline-none disabled:cursor-not-allowed"
          >
            {chosen.length === 0 ? (
              <span className="text-[var(--label-tertiary)]">{placeholder}</span>
            ) : (
              <span className="sr-only">{`${chosen.length} selected`}</span>
            )}
            {summarySecondary && chosen.length ? (
              <span className="text-[var(--label-secondary)]">{summarySecondary}</span>
            ) : null}
            <FieldChevron className="ml-auto" />
          </button>
        </div>

        {isOpen ? (
          <AnchoredLayer isPrivate={isPrivate}>
            <div
              ref={panelRef}
              style={anchoredPanelStyle(position, { matchWidth: true, capsHeight: false })}
              className={joinClasses(
                ANCHORED_SURFACE_CLASSES,
                'min-w-[16.25rem] overflow-hidden text-callout',
              )}
            >
              {searchable ? (
                <div className="px-1.5 pt-1.5 pb-1">
                  <AnchoredSearchField
                    autoFocus
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setActiveIndex(0);
                    }}
                    placeholder="Search options"
                    aria-label="Search options"
                  />
                </div>
              ) : null}
              {shown.length === 0 ? (
                <div className="flex flex-col items-center text-center gap-1 px-4 py-5">
                  <span className="mb-1 flex text-[var(--label-tertiary)]">
                    <SearchSymbol />
                  </span>
                  <span className="text-headline text-[var(--label)]">No results found</span>
                  <span className="text-subheadline text-[var(--label-secondary)]">
                    Try a different search term.
                  </span>
                  <Button variant="plain" size="sm" className="mt-1" onClick={() => setQuery('')}>
                    Clear search
                  </Button>
                </div>
              ) : (
                <ul
                  id={listId}
                  role="listbox"
                  aria-multiselectable="true"
                  aria-labelledby={fieldId}
                  className="list-none m-0 p-1 max-h-62 overflow-auto"
                >
                  {shown.map(renderOption)}
                </ul>
              )}
              {footer && shown.length ? (
                <div className="flex items-center justify-between gap-3 px-2 py-1.5 border-t-[length:var(--hairline)] border-solid border-[var(--separator)]">
                  <Button variant="plain" size="sm" onClick={() => update([])}>
                    Reset
                  </Button>
                  <Button
                    variant="plain"
                    size="sm"
                    onClick={() =>
                      update(
                        options.filter((option) => !option.disabled).map((option) => option.value),
                      )
                    }
                  >
                    Select all
                  </Button>
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
