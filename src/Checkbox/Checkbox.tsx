import * as React from 'react';
import type { ReactNode } from 'react';
import {
  HIDDEN_INPUT,
  SelectionText,
  indicatorClasses,
  joinClasses,
  selectionRowClasses,
  type SelectionSize,
} from './selectionControl';

type NativeCheckboxProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'type'>;

export interface CheckboxProps extends NativeCheckboxProps {
  label?: ReactNode;
  hint?: ReactNode;
  size?: SelectionSize;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  error?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const MARK =
  'absolute inset-0 w-full h-full p-0.5 opacity-0 text-[var(--on-tint)] transition-opacity duration-[var(--duration-instant)] ease-[var(--ease-standard)]';

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      hint,
      size = 'md',
      indeterminate = false,
      error = false,
      disabled = false,
      id,
      className,
      ...rest
    },
    forwardedRef,
  ) => {
    const generatedId = React.useId();
    const fieldId = id || generatedId;
    const hintId = `${fieldId}-hint`;
    const labelId = `${fieldId}-label`;
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement);

    React.useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
      <label htmlFor={fieldId} className={selectionRowClasses(size, disabled, className)}>
        <input
          ref={inputRef}
          id={fieldId}
          type="checkbox"
          className={HIDDEN_INPUT}
          disabled={disabled}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={hint ? hintId : undefined}
          aria-invalid={error || undefined}
          {...rest}
        />
        <span
          aria-hidden="true"
          className={joinClasses(
            indicatorClasses(size, error),
            'rounded-[var(--corner-sm)]',
            'peer-checked:bg-[var(--tint)] peer-checked:shadow-none',
            'peer-indeterminate:bg-[var(--tint)] peer-indeterminate:shadow-none',
            'peer-checked:[&_.mark-check]:opacity-100 peer-indeterminate:[&_.mark-dash]:opacity-100',
          )}
        >
          <svg
            viewBox="0 0 24 24"
            className={joinClasses('mark-check', MARK)}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5.5 12.5l4 4 9-9.5" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            className={joinClasses('mark-dash', MARK)}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M6.5 12h11" />
          </svg>
        </span>
        <SelectionText
          label={label}
          hint={hint}
          labelId={labelId}
          hintId={hintId}
          size={size}
          hasError={error}
        />
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
