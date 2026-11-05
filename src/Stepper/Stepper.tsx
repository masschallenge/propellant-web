import * as React from 'react';

export type StepperSize = 'sm' | 'md';

export interface StepperProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: StepperSize;
  disabled?: boolean;
  decrementLabel?: string;
  incrementLabel?: string;
  formatValue?: (value: number) => string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const BUTTON =
  'relative inline-flex items-center justify-center border-0 bg-transparent text-[var(--label)] cursor-pointer rounded-[var(--corner-capsule)] ' +
  'hover:not-disabled:bg-[var(--fill-tertiary)] active:not-disabled:bg-[var(--fill-secondary)] disabled:text-[var(--label-quaternary)] disabled:cursor-not-allowed ' +
  'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-1 focus-visible:outline-[var(--focus-color)] ' +
  "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[max(100%,var(--hit-target))] before:h-[max(100%,var(--hit-target))]";

const SIZES: Record<StepperSize, { button: string; value: string }> = {
  sm: { button: 'w-7 h-[calc(var(--control-sm)-4px)]', value: 'min-w-6 text-subheadline' },
  md: { button: 'w-8 h-[calc(var(--control-md)-4px)]', value: 'min-w-7 text-callout' },
};

const Glyph = ({ path }: { path: string }) => (
  <svg
    viewBox="0 0 24 24"
    className="w-[var(--icon-sm)] h-[var(--icon-sm)]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d={path} />
  </svg>
);

export const Stepper = ({
  value,
  defaultValue = 0,
  onChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  size = 'md',
  disabled = false,
  decrementLabel = 'Decrease',
  incrementLabel = 'Increase',
  formatValue = (current) => String(current),
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  className,
}: StepperProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const current = value === undefined ? internalValue : value;
  const sizing = SIZES[size];

  const change = (direction: number) => {
    const next = Math.min(max, Math.max(min, current + direction * step));
    if (next === current) return;
    if (value === undefined) setInternalValue(next);
    onChange?.(next);
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={joinClasses(
        'inline-flex items-center gap-0.5 p-0.5 rounded-[var(--corner-capsule)] bg-[var(--fill-secondary)]',
        disabled && 'opacity-[var(--opacity-disabled)]',
        className,
      )}
    >
      <button
        type="button"
        aria-label={decrementLabel}
        disabled={disabled || current <= min}
        onClick={() => change(-1)}
        className={joinClasses(BUTTON, sizing.button)}
      >
        <Glyph path="M6 12h12" />
      </button>
      <output
        aria-live="polite"
        className={joinClasses(
          'text-center font-semibold tabular-nums text-[var(--label)]',
          sizing.value,
        )}
      >
        {formatValue(current)}
      </output>
      <button
        type="button"
        aria-label={incrementLabel}
        disabled={disabled || current >= max}
        onClick={() => change(1)}
        className={joinClasses(BUTTON, sizing.button)}
      >
        <Glyph path="M12 6v12M6 12h12" />
      </button>
    </div>
  );
};
