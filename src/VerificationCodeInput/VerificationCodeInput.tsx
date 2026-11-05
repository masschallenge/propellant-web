import * as React from 'react';
import { FIELD_LABEL_TONE, FieldHint } from '../TextField/fieldText';

export type VCSize = 'xxxs' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg';

export interface VerificationCodeInputProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  groupAfter?: number;
  size?: VCSize;
  label?: string;
  hint?: string;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const CELL_SIZES: Record<VCSize, string> = {
  xxxs: 'w-[var(--control-md)] h-[var(--control-md)] text-callout rounded-[var(--corner-md)]',
  xxs: 'w-[var(--control-lg)] h-[var(--control-lg)] text-body rounded-[var(--corner-md)]',
  xs: 'w-[var(--row)] h-[var(--row)] text-title3 rounded-[var(--corner-md)]',
  sm: 'w-[var(--row-tall)] h-[var(--row-tall)] text-title1 rounded-[var(--corner-lg)]',
  md: 'w-18 h-18 text-large-title rounded-[var(--corner-lg)]',
  lg: 'w-24 h-24 text-display rounded-[var(--corner-xl)]',
};

const CODE_CHARACTER = /[^0-9a-zA-Z]/g;

export const VerificationCodeInput = ({
  length = 6,
  value,
  defaultValue = '',
  onChange,
  groupAfter,
  size = 'sm',
  label,
  hint,
  invalid = false,
  disabled = false,
  required = false,
  className,
}: VerificationCodeInputProps) => {
  const fieldId = React.useId();
  const hintId = `${fieldId}-hint`;
  const [internalCode, setInternalCode] = React.useState(defaultValue);
  const code = value === undefined ? internalCode : value;
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const setCharacterAt = (index: number, character: string) => {
    const padded = code.padEnd(length, ' ');
    const nextCode = (padded.substring(0, index) + character + padded.substring(index + 1)).replace(
      /\s+$/,
      '',
    );
    if (value === undefined) setInternalCode(nextCode);
    onChange?.(nextCode);
    if (character) inputRefs.current[index + 1]?.focus();
  };

  const cells = Array.from({ length }, (_unused, index) => {
    const character = code[index] || '';
    const hasSeparator = Boolean(groupAfter) && index > 0 && index % (groupAfter ?? 1) === 0;
    return (
      <React.Fragment key={index}>
        {hasSeparator ? (
          <span
            aria-hidden="true"
            className="flex-none w-2.5 h-0.5 rounded-full bg-[var(--label-tertiary)]"
          />
        ) : null}
        <input
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={invalid || undefined}
          aria-describedby={hint ? hintId : undefined}
          value={character}
          onChange={(event) =>
            setCharacterAt(index, event.target.value.replace(CODE_CHARACTER, '').slice(-1))
          }
          onKeyDown={(event) => {
            if (event.key === 'Backspace' && !character) inputRefs.current[index - 1]?.focus();
          }}
          className={joinClasses(
            'fs-mask flex-none p-0 border-0 text-center font-medium tabular-nums font-[inherit] text-[var(--label)] bg-[var(--bg)] outline-none',
            'transition-shadow duration-[var(--duration-fade)] ease-[var(--ease-standard)]',
            CELL_SIZES[size],
            invalid
              ? 'shadow-[inset_0_0_0_var(--hairline)_var(--critical)] focus:shadow-[inset_0_0_0_var(--stroke-strong)_var(--focus-color-critical)]'
              : 'shadow-[inset_0_0_0_var(--hairline)_var(--control-border)] focus:shadow-[inset_0_0_0_var(--stroke-strong)_var(--focus-color)]',
            disabled && 'cursor-not-allowed',
          )}
        />
      </React.Fragment>
    );
  });

  return (
    <div
      className={joinClasses(
        'flex flex-col gap-1.5',
        disabled && 'opacity-[var(--opacity-disabled)]',
        className,
      )}
    >
      {label ? (
        <span className={FIELD_LABEL_TONE.default}>
          {label}
          {required ? (
            <span className="text-[var(--critical)]" aria-hidden="true">
              {' '}
              *
            </span>
          ) : null}
        </span>
      ) : null}
      <div
        className="inline-flex items-center gap-2"
        role="group"
        aria-label={label || 'Verification code'}
      >
        {cells}
      </div>
      {hint ? (
        <FieldHint id={hintId} invalid={invalid}>
          {hint}
        </FieldHint>
      ) : null}
    </div>
  );
};
