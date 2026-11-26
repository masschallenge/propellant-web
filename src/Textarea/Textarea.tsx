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
  accessory?: ReactNode;
  footer?: ReactNode;
  id?: string;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const SIZES: Record<TextareaSize, string> = {
  sm: 'px-2.5 py-1.5 text-subheadline',
  md: 'px-3 py-2 text-callout',
};

const MIN_HEIGHTS: Record<TextareaSize, string> = {
  sm: 'min-h-22',
  md: 'min-h-30',
};

const ACCESSORY_ROOM = 'pr-[calc(var(--control-sm)+var(--space-4))]';

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
      rows,
      accessory,
      footer,
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

    const field = (
      <textarea
        ref={forwardedRef}
        id={fieldId}
        className={joinClasses(
          'fs-mask block w-full resize-y border-0 bg-transparent outline-none font-normal text-[var(--label)]',
          'placeholder:text-[var(--label-tertiary)] disabled:cursor-not-allowed',
          SIZES[size],
          rows === undefined && MIN_HEIGHTS[size],
          Boolean(accessory) && ACCESSORY_ROOM,
        )}
        rows={rows}
        disabled={disabled}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        {...rest}
      />
    );

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
        <div
          className={joinClasses('propellant-field', Boolean(footer) && 'flex-col')}
          data-invalid={invalid ? 'true' : undefined}
        >
          {accessory ? (
            <div className="relative flex-1 min-w-0">
              {field}
              <span className="absolute right-[var(--space-2)] bottom-[var(--space-2)] flex">
                {accessory}
              </span>
            </div>
          ) : (
            field
          )}
          {footer ? <div className="w-full">{footer}</div> : null}
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
