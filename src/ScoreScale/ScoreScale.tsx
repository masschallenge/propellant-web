import * as React from 'react';
import type { ReactNode } from 'react';

export type ScoreScaleValue = number | 'not-applicable';

export interface ScoreScaleProps {
  min: number;
  max: number;
  value?: ScoreScaleValue | null;
  defaultValue?: ScoreScaleValue | null;
  onChange?: (value: ScoreScaleValue) => void;
  allowNotApplicable?: boolean;
  notApplicableLabel?: string;
  lowLabel?: ReactNode;
  highLabel?: ReactNode;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

const NOT_APPLICABLE = 'not-applicable';

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const HIDDEN_INPUT = 'absolute top-0 left-0 w-px h-px m-0 p-0 border-0 overflow-hidden opacity-0';

const FOCUS_WITHIN =
  'has-[input:focus-visible]:outline-[length:var(--focus-width)] has-[input:focus-visible]:outline-solid has-[input:focus-visible]:outline-offset-[var(--focus-offset)] has-[input:focus-visible]:outline-[var(--focus-color)]';

const OPTION_BASE =
  'relative flex-none inline-flex items-center justify-center h-8.5 rounded-[var(--corner-md)] text-callout font-semibold tabular-nums select-none transition-[background-color,box-shadow,color] duration-[var(--duration-fade)] ease-[var(--ease-standard)]';

const SELECTED_OPTION = 'bg-[var(--tint)] text-[var(--on-tint)]';

const RESTING_OPTION = 'bg-[var(--bg)] shadow-[inset_0_0_0_1px_var(--separator)]';

const buildScores = (min: number, max: number) =>
  Array.from({ length: Math.max(0, max - min + 1) }, (_unused, offset) => min + offset);

export const ScoreScale = ({
  min,
  max,
  value,
  defaultValue = null,
  onChange,
  allowNotApplicable = false,
  notApplicableLabel = 'N/A',
  lowLabel,
  highLabel,
  disabled = false,
  name,
  id,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}: ScoreScaleProps) => {
  const generatedId = React.useId();
  const groupId = id || generatedId;
  const groupName = name || groupId;
  const [internalValue, setInternalValue] = React.useState<ScoreScaleValue | null>(defaultValue);
  const currentValue = value === undefined ? internalValue : value;
  const hasCaptions = Boolean(lowLabel || highLabel);
  const lowLabelId = lowLabel ? `${groupId}-low` : undefined;
  const highLabelId = highLabel ? `${groupId}-high` : undefined;
  const describedBy =
    [ariaDescribedBy, lowLabelId, highLabelId].filter(Boolean).join(' ') || undefined;

  const select = (nextValue: ScoreScaleValue) => {
    if (disabled) return;
    if (value === undefined) setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  const renderOption = (optionValue: ScoreScaleValue, text: string) => {
    const isOn = currentValue === optionValue;
    const isNotApplicable = optionValue === NOT_APPLICABLE;
    return (
      <label
        key={String(optionValue)}
        className={joinClasses(
          OPTION_BASE,
          isNotApplicable ? 'min-w-8.5 px-[var(--space-2-5)]' : 'w-8.5',
          isOn
            ? SELECTED_OPTION
            : joinClasses(
                RESTING_OPTION,
                isNotApplicable ? 'text-[var(--label-tertiary)]' : 'text-[var(--label)]',
                !disabled && 'hover:bg-[var(--bg-secondary)]',
              ),
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          FOCUS_WITHIN,
        )}
      >
        <input
          type="radio"
          name={groupName}
          value={String(optionValue)}
          checked={isOn}
          disabled={disabled}
          onChange={() => select(optionValue)}
          className={HIDDEN_INPUT}
        />
        {text}
      </label>
    );
  };

  return (
    <div
      id={groupId}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={describedBy}
      aria-invalid={ariaInvalid}
      aria-disabled={disabled || undefined}
      className={joinClasses(
        'flex flex-wrap items-start gap-1.5',
        disabled && 'opacity-[var(--opacity-disabled)]',
        className,
      )}
    >
      <div className="inline-flex flex-col gap-1.5">
        <div className="flex flex-wrap gap-1.5">
          {buildScores(min, max).map((score) => renderOption(score, String(score)))}
        </div>
        {hasCaptions ? (
          <div className="flex justify-between gap-3 w-0 min-w-full text-footnote text-[var(--label-tertiary)]">
            {lowLabel ? <span id={lowLabelId}>{lowLabel}</span> : null}
            {highLabel ? (
              <span id={highLabelId} className="ml-auto text-right">
                {highLabel}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
      {allowNotApplicable ? renderOption(NOT_APPLICABLE, notApplicableLabel) : null}
    </div>
  );
};
