import * as React from 'react';
import type { ReactNode } from 'react';
import { FieldHintRow, FieldLabel, type FieldLabelEmphasis } from '../TextField/fieldText';

export type TextareaSize = 'sm' | 'md';

type NativeTextareaProps = Omit<React.ComponentPropsWithoutRef<'textarea'>, 'children'>;

export interface TextareaProps extends NativeTextareaProps {
  label?: ReactNode;
  hint?: ReactNode;
  hintEnd?: ReactNode;
  size?: TextareaSize;
  emphasis?: FieldLabelEmphasis;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  rows?: number;
  id?: string;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const SIZES: Record<TextareaSize, string> = {
  sm: 'min-h-22 px-2.5 py-1.5 text-subheadline',
  md: 'min-h-30 px-3 py-2 text-callout',
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      hint,
      hintEnd,
      size = 'md',
      emphasis = 'default',
      required = false,
      invalid = false,
      disabled = false,
      id,
      className,
      'aria-describedby': describedByProp,
      ...rest
    },
    forwardedRef,
  ) => {
    const generatedId = React.useId();
    const fieldId = id || generatedId;
    const hintId = hint ? `${fieldId}-hint` : undefined;
    const hintEndId = hintEnd !== undefined && hintEnd !== null ? `${fieldId}-hint-end` : undefined;
    const describedBy = [describedByProp, hintId, hintEndId].filter(Boolean).join(' ') || undefined;

    return (
      <div
        className={joinClasses(
          'flex flex-col gap-1.5 min-w-0',
          disabled && 'opacity-[var(--opacity-disabled)]',
          className,
        )}
      >
        {label ? (
          <FieldLabel htmlFor={fieldId} emphasis={emphasis} required={required}>
            {label}
          </FieldLabel>
        ) : null}
        <div className="propellant-field" data-invalid={invalid ? 'true' : undefined}>
          <textarea
            ref={forwardedRef}
            id={fieldId}
            className={joinClasses(
              'fs-mask block w-full resize-y border-0 bg-transparent outline-none font-normal text-[var(--label)]',
              'placeholder:text-[var(--label-tertiary)] disabled:cursor-not-allowed',
              SIZES[size],
            )}
            disabled={disabled}
            required={required}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            {...rest}
          />
          <span className="propellant-field-ring" aria-hidden="true" />
        </div>
        <FieldHintRow
          hint={hint}
          hintId={hintId}
          hintEnd={hintEnd}
          hintEndId={hintEndId}
          invalid={invalid}
          isHintEndWrapping
        />
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
