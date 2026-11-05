import * as React from 'react';
import type { ReactNode } from 'react';
import { Badge } from '../Badge/Badge';
import { ErrorGlyph, FIELD_LABEL_TONE } from '../TextField/fieldText';
import { INDICATOR_SIZES } from '../Checkbox/selectionControl';

export interface RadioCardLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface RadioCardOption {
  value: string;
  title: string;
  hint?: string;
  price?: string;
  per?: string;
  icon?: ReactNode;
  avatar?: string;
  handle?: string;
  mark?: string;
  links?: RadioCardLink[];
  badge?: string;
  disabled?: boolean;
  ariaLabel?: string;
  distinct?: boolean;
}

export type RadioCardSelection = string | string[];

export interface RadioCardGroupProps {
  options: RadioCardOption[];
  value?: RadioCardSelection;
  defaultValue?: RadioCardSelection;
  onChange?: (value: RadioCardSelection) => void;
  selectionMode?: 'single' | 'multiple';
  control?: 'auto' | 'check' | 'radio';
  layout?: 'row' | 'card' | 'tile';
  sideBySide?: boolean;
  legend?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  controlOnRight?: boolean;
  name?: string;
  emphasis?: 'default' | 'strong';
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const SELECTED_SURFACE =
  '[background:linear-gradient(var(--tint-fill),var(--tint-fill)),var(--bg)] shadow-[inset_0_0_0_var(--stroke-strong)_var(--tint)]';

const RESTING_EDGE = 'shadow-[inset_0_0_0_var(--hairline)_var(--control-border)]';

const ERROR_EDGE = 'shadow-[inset_0_0_0_var(--hairline)_var(--critical)]';

const FOCUS_WITHIN =
  'has-[input:focus-visible]:outline-[length:var(--focus-width)] has-[input:focus-visible]:outline-solid has-[input:focus-visible]:outline-offset-[var(--focus-offset)] has-[input:focus-visible]:outline-[var(--focus-color)]';

const SURFACE_TRANSITION =
  'transition-[background-color,box-shadow] duration-[var(--duration-fade)] ease-[var(--ease-standard)]';

const HIDDEN_INPUT = 'absolute top-0 left-0 w-px h-px m-0 p-0 border-0 overflow-hidden opacity-0';

const SelectionMark = ({ isSelected, isSquare }: { isSelected: boolean; isSquare: boolean }) => (
  <span
    aria-hidden="true"
    className={joinClasses(
      'relative flex-none mt-px flex items-center justify-center',
      INDICATOR_SIZES.md,
      isSquare ? 'rounded-[var(--corner-sm)]' : 'rounded-full',
      isSelected
        ? 'bg-[var(--tint)]'
        : 'bg-[var(--bg)] shadow-[inset_0_0_0_1px_var(--control-border)]',
      SURFACE_TRANSITION,
    )}
  >
    {isSquare ? (
      <svg
        viewBox="0 0 24 24"
        className={joinClasses(
          'absolute inset-0 w-full h-full p-0.5 text-[var(--on-tint)]',
          isSelected ? 'opacity-100' : 'opacity-0',
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5.5 12.5l4 4 9-9.5" />
      </svg>
    ) : (
      <span
        className={joinClasses(
          'w-2 h-2 rounded-full bg-[var(--on-tint)] transition-transform duration-[var(--spring-snappy-duration)] ease-[var(--spring-snappy)]',
          isSelected ? 'scale-100' : 'scale-0',
        )}
      />
    )}
  </span>
);

export const RadioCardGroup = ({
  options,
  value,
  defaultValue,
  onChange,
  selectionMode = 'single',
  control = 'auto',
  layout = 'row',
  sideBySide = false,
  legend,
  description,
  error,
  controlOnRight = false,
  name,
  emphasis = 'default',
  className,
}: RadioCardGroupProps) => {
  const generatedId = React.useId();
  const groupName = name || generatedId;
  const isMultiple = selectionMode === 'multiple';
  const isSquare = control === 'check' || (control === 'auto' && isMultiple);
  const [internalValue, setInternalValue] = React.useState<RadioCardSelection | undefined>(
    defaultValue !== undefined ? defaultValue : isMultiple ? [] : undefined,
  );
  const currentValue = value === undefined ? internalValue : value;
  const selectedValues = Array.isArray(currentValue) ? currentValue : [];

  const isSelected = (optionValue: string) =>
    isMultiple ? selectedValues.includes(optionValue) : currentValue === optionValue;

  const select = (option: RadioCardOption) => {
    if (option.disabled) return;
    const nextValue = isMultiple
      ? isSelected(option.value)
        ? selectedValues.filter((selected) => selected !== option.value)
        : [...selectedValues, option.value]
      : option.value;
    if (value === undefined) setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  const descriptionId = description ? `${groupName}-description` : undefined;
  const errorId = error ? `${groupName}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  const isTile = layout === 'tile';
  const isStrong = emphasis === 'strong';

  const cards = options.map((option) => {
    const isOn = isSelected(option.value);
    const isInteractive = !isOn && !option.disabled;
    const mark = <SelectionMark isSelected={isOn} isSquare={isSquare} />;
    const icon = option.icon ? (
      <span
        className="flex-none flex items-center justify-center mt-px text-[var(--label-secondary)] [&>svg]:block [&>svg]:w-[var(--icon-lg)] [&>svg]:h-[var(--icon-lg)]"
        aria-hidden="true"
      >
        {option.icon}
      </span>
    ) : null;
    const badge = option.badge ? (
      <Badge tone="success" size="sm" dot>
        {option.badge}
      </Badge>
    ) : null;
    const input = (
      <input
        type={isMultiple ? 'checkbox' : 'radio'}
        name={groupName}
        value={option.value}
        checked={isOn}
        disabled={option.disabled}
        onChange={() => select(option)}
        aria-label={option.ariaLabel}
        className={HIDDEN_INPUT}
      />
    );
    const cardClasses = joinClasses(
      'relative flex gap-3 p-[var(--space-4)] min-h-[var(--row)] rounded-[var(--corner-lg)] cursor-pointer',
      layout === 'card' ? 'flex-col' : 'items-start',
      SURFACE_TRANSITION,
      isOn ? SELECTED_SURFACE : joinClasses('bg-[var(--bg)]', error ? ERROR_EDGE : RESTING_EDGE),
      option.disabled && 'opacity-[var(--opacity-disabled)] cursor-not-allowed',
      isInteractive && 'hover:bg-[var(--bg-secondary)]',
      FOCUS_WITHIN,
    );

    if (isTile) {
      const restingTile = option.distinct
        ? joinClasses(
            'bg-[var(--bg)] outline-dashed outline-1 -outline-offset-1',
            error ? 'outline-[var(--critical)]' : 'outline-[var(--control-border)]',
          )
        : joinClasses('bg-[var(--bg)]', error ? ERROR_EDGE : RESTING_EDGE);
      return (
        <label
          key={option.value}
          className={joinClasses(
            'relative flex flex-col items-center justify-start gap-0.5 py-2 min-h-[var(--row)] text-center rounded-[var(--corner-md)] cursor-pointer',
            isStrong ? 'min-w-0 px-2' : 'px-1.5',
            SURFACE_TRANSITION,
            isOn ? SELECTED_SURFACE : restingTile,
            option.disabled && 'opacity-[var(--opacity-disabled)] cursor-not-allowed',
            isInteractive && 'hover:bg-[var(--bg-secondary)]',
            FOCUS_WITHIN,
          )}
        >
          {input}
          <span
            className={joinClasses(
              'text-callout tabular-nums text-[var(--label)]',
              isStrong ? 'font-bold' : 'font-semibold',
            )}
          >
            {option.title}
          </span>
          {option.hint ? (
            <span
              className={joinClasses(
                'text-footnote text-pretty',
                isStrong
                  ? 'max-w-full font-semibold text-[var(--label)]'
                  : 'font-normal text-[var(--label-tertiary)] hyphens-auto [overflow-wrap:break-word]',
              )}
            >
              {option.hint}
            </span>
          ) : null}
        </label>
      );
    }

    if (layout === 'card') {
      return (
        <label key={option.value} className={cardClasses}>
          {input}
          <span className="flex items-start gap-3 w-full">
            {icon}
            <span className="text-callout font-semibold text-[var(--label)]">{option.title}</span>
            <span className="ml-auto self-start">{mark}</span>
          </span>
          <span className="flex items-baseline gap-2 flex-wrap">
            {option.price ? (
              <span className="text-title1 tabular-nums text-[var(--label)]">{option.price}</span>
            ) : null}
            {option.per ? (
              <span className="text-subheadline text-[var(--label-secondary)]">{option.per}</span>
            ) : null}
            {badge}
          </span>
          {option.hint ? (
            <span className="text-subheadline text-[var(--label-secondary)] text-pretty">
              {option.hint}
            </span>
          ) : null}
        </label>
      );
    }

    return (
      <label key={option.value} className={cardClasses}>
        {input}
        {controlOnRight ? null : mark}
        {option.avatar ? (
          <img
            className="flex-none w-10 h-10 rounded-full object-cover bg-[var(--bg-secondary)]"
            src={option.avatar}
            alt=""
          />
        ) : (
          icon
        )}
        {option.mark ? (
          <span
            className="flex-none flex items-center justify-center w-12 h-8 rounded-[var(--corner-sm)] bg-[var(--bg-secondary)] text-footnote font-semibold text-[var(--label-secondary)]"
            aria-hidden="true"
          >
            {option.mark}
          </span>
        ) : null}
        <span className="flex flex-col gap-0.5 min-w-0">
          <span className="flex items-baseline gap-2 flex-wrap">
            <span className="text-callout font-semibold text-[var(--label)]">{option.title}</span>
            {option.handle ? (
              <span className="text-subheadline text-[var(--label-tertiary)]">{option.handle}</span>
            ) : null}
            {option.price ? (
              <span className="text-subheadline tabular-nums text-[var(--label-secondary)]">
                {option.price}
              </span>
            ) : null}
          </span>
          {option.hint ? (
            <span className="text-subheadline text-[var(--label-secondary)] text-pretty">
              {option.hint}
            </span>
          ) : null}
          {option.links && option.links.length ? (
            <span className="flex gap-4 mt-0.5">
              {option.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href || '#'}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (!link.href) event.preventDefault();
                    link.onClick?.();
                  }}
                  className="text-subheadline font-medium text-[var(--tint)] no-underline hover:underline hover:text-[var(--tint-hover)] focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)] rounded-[var(--corner-sm)]"
                >
                  {link.label}
                </a>
              ))}
            </span>
          ) : null}
          {badge ? <span className="mt-1">{badge}</span> : null}
        </span>
        {controlOnRight ? <span className="ml-auto self-start">{mark}</span> : null}
      </label>
    );
  });

  return (
    <fieldset
      aria-describedby={describedBy}
      className={joinClasses(
        'flex flex-col gap-[var(--space-3)] min-w-0 m-0 p-0 border-0',
        className,
      )}
    >
      {legend ? (
        <legend
          className={joinClasses('p-0 mb-2', FIELD_LABEL_TONE[isStrong ? 'strong' : 'default'])}
        >
          {legend}
        </legend>
      ) : null}
      {description ? (
        <p
          id={descriptionId}
          className={joinClasses(
            'm-0 -mt-1',
            isStrong
              ? 'text-subheadline font-medium text-[var(--label-secondary)]'
              : 'text-footnote text-[var(--label-tertiary)]',
          )}
        >
          {description}
        </p>
      ) : null}
      {isTile ? (
        <div
          className={joinClasses(
            'grid gap-1.5',
            isStrong
              ? 'grid-cols-[repeat(auto-fill,minmax(6.25rem,1fr))]'
              : 'grid-cols-[repeat(auto-fill,minmax(5rem,1fr))]',
          )}
        >
          {cards}
        </div>
      ) : sideBySide ? (
        <div className="grid gap-[var(--space-3)] grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]">
          {cards}
        </div>
      ) : (
        cards
      )}
      {error ? (
        <p id={errorId} className="flex items-start gap-1 m-0 text-footnote text-[var(--critical)]">
          <ErrorGlyph />
          {error}
        </p>
      ) : null}
    </fieldset>
  );
};
