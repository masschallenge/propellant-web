import * as React from 'react';
import type { ReactNode } from 'react';
import {
  ANCHORED_SURFACE_CLASSES,
  AnchoredLayer,
  FieldChevron,
  OptionCheckmark,
  anchoredOptionClasses,
  anchoredPanelStyle,
  useAnchoredPosition,
} from '../internal/anchoredLayer';
import { FieldHint, FieldLabel } from '../TextField/fieldText';
import { Token } from '../Token/Token';
import { imageFitClass } from '../internal/imageFit';

export interface PopUpButtonOption {
  value: string;
  label: string;
  sub?: string;
  description?: string;
  icon?: ReactNode;
  avatar?: string;
  disabled?: boolean;
}

export type PopUpButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export type PopUpButtonTone = 'neutral' | 'success' | 'warning' | 'critical';

export interface PopUpButtonProps {
  options: PopUpButtonOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  labelHelp?: string;
  hint?: string;
  placeholder?: string;
  size?: PopUpButtonSize;
  ariaLabel?: string;
  tone?: PopUpButtonTone;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  tagValues?: string[];
  onTagsChange?: (values: string[]) => void;
  id?: string;
  isPrivate?: boolean;
  className?: string;
}

const TONE_BACKGROUND: Record<PopUpButtonTone, string | undefined> = {
  neutral: undefined,
  success: 'var(--success-fill)',
  warning: 'var(--warning-fill)',
  critical: 'var(--critical-fill)',
};

const TRIGGER_SIZES: Record<PopUpButtonSize, string> = {
  xs: 'gap-1.5 min-h-[var(--control-sm)] px-2 text-footnote',
  sm: 'gap-2 min-h-[var(--control-sm)] px-2.5 text-subheadline',
  md: 'gap-2 min-h-[var(--control-md)] px-3 text-callout',
  lg: 'gap-2.5 min-h-[var(--control-lg)] px-3.5 text-body',
};

const MENU_MAX_HEIGHT = 280;
const DESCRIBED_MENU_MIN_WIDTH = '16.25rem';
const TYPEAHEAD_RESET_MS = 600;

const LEADING_ICON_CLASSES =
  'flex-none flex items-center text-[var(--label-secondary)] [&>svg]:w-[var(--icon-md)] [&>svg]:h-[var(--icon-md)] [&>svg]:block';

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const isPrintableKey = (event: React.KeyboardEvent) =>
  event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey;

export const PopUpButton = ({
  options,
  value,
  defaultValue,
  onChange,
  label,
  labelHelp,
  hint,
  placeholder = 'Select…',
  size = 'md',
  ariaLabel,
  tone = 'neutral',
  required = false,
  invalid = false,
  disabled = false,
  icon,
  tagValues,
  onTagsChange,
  id,
  isPrivate = false,
  className,
}: PopUpButtonProps) => {
  const generatedId = React.useId();
  const fieldId = id || generatedId;
  const listId = `${fieldId}-list`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value === undefined ? internalValue : value;
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [query, setQuery] = React.useState('');
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLUListElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const tagInputRef = React.useRef<HTMLInputElement>(null);
  const typeaheadRef = React.useRef({ text: '', at: 0 });
  const isTagMode = tagValues !== undefined;
  const chosenValues = tagValues ?? [];
  const position = useAnchoredPosition(isOpen, wrapperRef, panelRef);
  const hasDescriptions = options.some((option) => Boolean(option.description));
  const isWideMenu = hasDescriptions || size === 'xs';
  const optionId = (index: number) => `${listId}-option-${index}`;
  const selectedIndex = options.findIndex((option) => option.value === currentValue);
  const selectedOption = options.find((option) => option.value === currentValue);

  React.useEffect(() => {
    if (!isOpen || isTagMode) return;
    document.getElementById(optionId(activeIndex))?.scrollIntoView?.({ block: 'nearest' });
  }, [isOpen, activeIndex]);

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

  const openMenu = () => {
    setActiveIndex(Math.max(0, selectedIndex));
    setIsOpen(true);
  };

  const commit = (option: PopUpButtonOption | undefined) => {
    if (!option || option.disabled) return;
    if (value === undefined) setInternalValue(option.value);
    onChange?.(option.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const findTypeaheadMatch = (key: string) => {
    const now = Date.now();
    const isFresh = now - typeaheadRef.current.at > TYPEAHEAD_RESET_MS;
    const text = (isFresh ? key : typeaheadRef.current.text + key).toLowerCase();
    typeaheadRef.current = { text, at: now };
    const start = isOpen ? activeIndex : Math.max(0, selectedIndex);
    const skipCurrent = text.length === 1 ? 1 : 0;
    const searchOrder = options.map(
      (option, offset) => (start + offset + skipCurrent) % options.length,
    );
    return searchOrder.find(
      (index) => !options[index].disabled && options[index].label.toLowerCase().startsWith(text),
    );
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) {
        openMenu();
        return;
      }
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((index) => (index + step + options.length) % options.length);
    } else if ((event.key === 'Home' || event.key === 'End') && isOpen) {
      event.preventDefault();
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (isOpen) {
        event.preventDefault();
        commit(options[activeIndex]);
      }
    } else if (event.key === 'Escape') {
      if (isOpen) {
        event.preventDefault();
        event.stopPropagation();
      }
      setIsOpen(false);
    } else if (event.key === 'Tab') {
      setIsOpen(false);
    } else if (isPrintableKey(event)) {
      event.preventDefault();
      const match = findTypeaheadMatch(event.key);
      if (match === undefined) return;
      setActiveIndex(match);
      setIsOpen(true);
    }
  };

  const chosenTags = chosenValues
    .map((tagValue) => options.find((option) => option.value === tagValue))
    .filter((option): option is PopUpButtonOption => Boolean(option));
  const normalizedQuery = query.trim().toLowerCase();
  const tagPool = isTagMode
    ? options.filter(
        (option) =>
          !chosenValues.includes(option.value) &&
          `${option.label} ${option.sub || ''}`.toLowerCase().includes(normalizedQuery),
      )
    : [];

  const addTag = (option: PopUpButtonOption | undefined) => {
    if (!option || option.disabled || !onTagsChange) return;
    onTagsChange([...chosenValues, option.value]);
    setQuery('');
    setActiveIndex(0);
  };

  const removeTag = (tagValue: string) => {
    if (onTagsChange && !disabled) {
      onTagsChange(chosenValues.filter((chosenValue) => chosenValue !== tagValue));
    }
  };

  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => Math.min(index + 1, Math.max(0, tagPool.length - 1)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      addTag(tagPool[activeIndex]);
    } else if (event.key === 'Backspace' && !query && chosenTags.length) {
      removeTag(chosenTags[chosenTags.length - 1].value);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const labelElement = label ? (
    <FieldLabel htmlFor={fieldId} required={required} help={labelHelp}>
      {label}
    </FieldLabel>
  ) : null;

  const hintElement = hint ? (
    <FieldHint id={hintId} invalid={invalid}>
      {hint}
    </FieldHint>
  ) : null;

  const renderOption = (
    option: PopUpButtonOption,
    index: number,
    onPick: (picked: PopUpButtonOption) => void,
    isSelected: boolean,
  ) => {
    const hasDescription = Boolean(option.description) && !isTagMode;
    return (
      <li
        key={option.value}
        id={isTagMode ? undefined : optionId(index)}
        role="option"
        aria-selected={isSelected}
        aria-disabled={option.disabled || undefined}
        aria-labelledby={hasDescription ? `${optionId(index)}-label` : undefined}
        aria-describedby={hasDescription ? `${optionId(index)}-description` : undefined}
        onMouseEnter={() => setActiveIndex(index)}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onPick(option)}
        className={joinClasses(
          anchoredOptionClasses({
            isHighlighted: index === activeIndex,
            isDisabled: option.disabled,
          }),
          option.disabled && 'opacity-[var(--opacity-disabled)]',
        )}
      >
        {option.avatar ? (
          <img
            className={`flex-none w-5 h-5 rounded-full ${imageFitClass()} bg-[var(--bg-secondary)]`}
            src={option.avatar}
            alt=""
          />
        ) : null}
        {!option.avatar && option.icon ? (
          <span
            className="flex-none flex text-(--option-secondary) [&>svg]:w-[var(--icon-md)] [&>svg]:h-[var(--icon-md)] [&>svg]:block"
            aria-hidden="true"
          >
            {option.icon}
          </span>
        ) : null}
        <span className="flex flex-col min-w-0">
          <span className="flex items-baseline gap-2 min-w-0">
            <span id={hasDescription ? `${optionId(index)}-label` : undefined} className="truncate">
              {option.label}
            </span>
            {option.sub ? (
              <span className="shrink-0 text-(--option-secondary)">{option.sub}</span>
            ) : null}
          </span>
          {option.description ? (
            <span
              id={hasDescription ? `${optionId(index)}-description` : undefined}
              className="text-footnote whitespace-normal text-(--option-secondary)"
            >
              {option.description}
            </span>
          ) : null}
        </span>
        <OptionCheckmark isVisible={isSelected} />
      </li>
    );
  };

  const listClasses = joinClasses(
    'list-none m-0 p-1 overflow-auto',
    ANCHORED_SURFACE_CLASSES,
    size === 'xs' ? 'text-footnote' : 'text-callout',
  );

  const wrapperClasses = joinClasses(
    'flex flex-col gap-1.5 min-w-0',
    isPrivate && 'fs-mask',
    className,
  );

  if (isTagMode) {
    return (
      <div className={wrapperClasses}>
        {labelElement}
        <div className="relative" ref={wrapperRef}>
          <div
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={isOpen ? listId : undefined}
            aria-haspopup="listbox"
            aria-invalid={invalid || undefined}
            className={joinClasses(
              'propellant-field flex-wrap items-center gap-1 w-full min-h-[var(--control-md)] py-1 px-1.5 cursor-text',
              disabled && 'opacity-[var(--opacity-disabled)] cursor-not-allowed',
            )}
            data-invalid={invalid ? 'true' : undefined}
            data-open={isOpen ? 'true' : undefined}
            onClick={() => {
              if (disabled) return;
              setIsOpen(true);
              tagInputRef.current?.focus();
            }}
          >
            <span className="propellant-field-ring" aria-hidden="true" />
            {chosenTags.map((option) => (
              <Token
                key={option.value}
                size="sm"
                label={option.label}
                disabled={disabled}
                icon={
                  option.avatar ? (
                    <img
                      className={`block w-3.5 h-3.5 rounded-full ${imageFitClass()} bg-[var(--bg-secondary)]`}
                      src={option.avatar}
                      alt=""
                    />
                  ) : undefined
                }
                onRemove={() => removeTag(option.value)}
              />
            ))}
            <input
              ref={tagInputRef}
              id={fieldId}
              type="text"
              value={query}
              disabled={disabled}
              placeholder={chosenTags.length ? '' : placeholder}
              aria-describedby={hintId}
              aria-autocomplete="list"
              onFocus={() => setIsOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
                setIsOpen(true);
              }}
              onKeyDown={handleTagKeyDown}
              className="fs-mask flex-1 min-w-24 min-h-[var(--control-sm)] px-1 border-0 bg-transparent outline-none text-callout text-[var(--label)] placeholder:text-[var(--label-tertiary)] disabled:cursor-not-allowed"
            />
          </div>
          {isOpen && tagPool.length ? (
            <AnchoredLayer isPrivate={isPrivate}>
              <ul
                ref={panelRef}
                id={listId}
                role="listbox"
                aria-labelledby={label ? undefined : fieldId}
                style={{
                  ...anchoredPanelStyle(position, { matchWidth: true, capsHeight: false }),
                  maxHeight: position ? Math.min(MENU_MAX_HEIGHT, position.available) : undefined,
                }}
                className={listClasses}
              >
                {tagPool.map((option, index) => renderOption(option, index, addTag, false))}
              </ul>
            </AnchoredLayer>
          ) : null}
        </div>
        {hintElement}
      </div>
    );
  }

  const leadingIcon = selectedOption?.icon || icon;

  return (
    <div className={wrapperClasses}>
      {labelElement}
      <div className="relative" ref={wrapperRef}>
        <button
          ref={triggerRef}
          id={fieldId}
          type="button"
          role="combobox"
          className={joinClasses(
            'propellant-field items-center w-full border-0 text-left cursor-pointer text-[var(--label)]',
            TRIGGER_SIZES[size],
            'disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed',
          )}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listId : undefined}
          aria-activedescendant={isOpen ? optionId(activeIndex) : undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={hintId}
          onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
          onKeyDown={handleTriggerKeyDown}
          data-invalid={invalid ? 'true' : undefined}
          data-open={isOpen ? 'true' : undefined}
          data-tone={tone}
          style={TONE_BACKGROUND[tone] ? { backgroundColor: TONE_BACKGROUND[tone] } : undefined}
        >
          <span className="propellant-field-ring" aria-hidden="true" />
          {selectedOption?.avatar ? (
            <img
              className={`flex-none w-5 h-5 rounded-full ${imageFitClass()} bg-[var(--bg-secondary)]`}
              src={selectedOption.avatar}
              alt=""
            />
          ) : leadingIcon ? (
            <span className={LEADING_ICON_CLASSES} aria-hidden="true">
              {leadingIcon}
            </span>
          ) : null}
          {selectedOption ? (
            <span className="flex items-baseline gap-2 min-w-0">
              <span className="truncate">{selectedOption.label}</span>
              {selectedOption.sub ? (
                <span className="min-w-0 truncate text-[var(--label-secondary)]">
                  {selectedOption.sub}
                </span>
              ) : null}
            </span>
          ) : (
            <span className="truncate text-[var(--label-tertiary)]">{placeholder}</span>
          )}
          <FieldChevron shape="popup" className="ml-auto" />
        </button>
        {isOpen ? (
          <AnchoredLayer isPrivate={isPrivate}>
            <ul
              ref={panelRef}
              id={listId}
              role="listbox"
              aria-labelledby={fieldId}
              style={{
                ...anchoredPanelStyle(position, { matchWidth: !isWideMenu, capsHeight: false }),
                minWidth:
                  isWideMenu && position
                    ? `max(${position.width}px, ${DESCRIBED_MENU_MIN_WIDTH})`
                    : undefined,
                maxHeight: position ? Math.min(MENU_MAX_HEIGHT, position.available) : undefined,
              }}
              className={joinClasses(listClasses, isWideMenu && 'max-w-[22.5rem]')}
            >
              {options.map((option, index) =>
                renderOption(option, index, commit, option.value === currentValue),
              )}
            </ul>
          </AnchoredLayer>
        ) : null}
      </div>
      {hintElement}
    </div>
  );
};
