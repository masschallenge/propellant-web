import * as React from 'react';
import type { ReactNode } from 'react';

export type SwitchSize = 'sm' | 'md';

type NativeSwitchProps = Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'onChange' | 'children' | 'type' | 'role'
>;

export interface SwitchProps extends NativeSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: SwitchSize;
  label?: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
}

const TRACKS: Record<SwitchSize, string> = {
  sm: 'w-8 h-5',
  md: 'w-10 h-6',
};

const KNOBS: Record<SwitchSize, { size: string; on: string }> = {
  sm: { size: 'w-4 h-4', on: 'translate-x-3' },
  md: { size: 'w-5 h-5', on: 'translate-x-4' },
};

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

export const Switch = ({
  checked,
  defaultChecked = false,
  onChange,
  size = 'md',
  label,
  hint,
  disabled = false,
  id,
  className,
  ...rest
}: SwitchProps) => {
  const generatedId = React.useId();
  const fieldId = id || generatedId;
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isOn = checked === undefined ? internalChecked : checked;
  const hasText = Boolean(label || hint);

  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInternalChecked(!isOn);
    onChange?.(!isOn);
  };

  const control = (
    <button
      type="button"
      role="switch"
      id={fieldId}
      aria-checked={isOn}
      aria-describedby={hint ? `${fieldId}-hint` : undefined}
      disabled={disabled}
      onClick={toggle}
      className={joinClasses(
        'group relative flex-none inline-flex items-center p-0 border-0 bg-transparent rounded-[var(--corner-capsule)]',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[max(100%,var(--hit-target))] before:h-[max(100%,var(--hit-target))]",
        'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]',
        hasText ? undefined : className,
      )}
      {...rest}
    >
      <span
        className={joinClasses(
          'relative inline-flex items-center p-0.5 rounded-[var(--corner-capsule)] transition-colors duration-[var(--duration-fade)] ease-[var(--ease-standard)]',
          TRACKS[size],
          isOn
            ? 'bg-[var(--tint)]'
            : 'bg-[var(--fill)] shadow-[inset_0_0_0_1px_var(--control-border)]',
        )}
      >
        <span
          className={joinClasses(
            'rounded-full bg-[var(--gray-0)] shadow-[0_1px_3px_rgb(0_0_0/0.22),0_0_0_0.5px_rgb(0_0_0/0.06)]',
            'transition-transform duration-[var(--spring-snappy-duration)] ease-[var(--spring-snappy)]',
            KNOBS[size].size,
            isOn ? KNOBS[size].on : 'translate-x-0',
          )}
        />
      </span>
    </button>
  );

  if (!hasText) return control;

  return (
    <div
      className={joinClasses(
        'flex items-start gap-3',
        disabled && 'opacity-[var(--opacity-disabled)]',
        className,
      )}
    >
      {control}
      <span className="flex flex-col gap-0.5 min-w-0">
        {label ? (
          <label
            htmlFor={fieldId}
            className={joinClasses(
              'text-callout text-[var(--label)]',
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            {label}
          </label>
        ) : null}
        {hint ? (
          <span id={`${fieldId}-hint`} className="text-subheadline text-[var(--label-secondary)]">
            {hint}
          </span>
        ) : null}
      </span>
    </div>
  );
};
