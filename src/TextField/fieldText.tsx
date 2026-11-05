import * as React from 'react';
import type { ReactNode } from 'react';

export type FieldLabelEmphasis = 'default' | 'strong';

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

export const FIELD_LABEL_TONE: Record<FieldLabelEmphasis, string> = {
  default: 'text-subheadline font-medium text-[var(--label-secondary)]',
  strong: 'text-callout font-semibold text-[var(--label)]',
};

export const fieldHintTone = (isInvalid: boolean) =>
  joinClasses(
    'm-0 text-footnote',
    isInvalid ? 'text-[var(--critical)]' : 'text-[var(--label-tertiary)]',
  );

const HelpGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    className="block w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7M12 17h.01" />
  </svg>
);

export const ErrorGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    className="flex-none w-3 h-3 mt-0.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 7.5v5.5M12 16.5h.01" />
  </svg>
);

export interface FieldLabelProps {
  htmlFor?: string;
  id?: string;
  emphasis?: FieldLabelEmphasis;
  required?: boolean;
  help?: string;
  className?: string;
  children: ReactNode;
}

export const FieldLabel = ({
  htmlFor,
  id,
  emphasis = 'default',
  required = false,
  help,
  className,
  children,
}: FieldLabelProps) => (
  <label
    htmlFor={htmlFor}
    id={id}
    className={joinClasses('flex items-center gap-1', FIELD_LABEL_TONE[emphasis], className)}
  >
    {children}
    {required ? (
      <span className="text-[var(--critical)]" aria-hidden="true">
        *
      </span>
    ) : null}
    {help ? (
      <span className="inline-flex text-[var(--label-tertiary)] cursor-help" title={help}>
        <HelpGlyph />
      </span>
    ) : null}
  </label>
);

export interface FieldHintProps {
  id?: string;
  invalid?: boolean;
  className?: string;
  children: ReactNode;
}

export const FieldHint = ({ id, invalid = false, className, children }: FieldHintProps) => (
  <p
    id={id}
    className={joinClasses(fieldHintTone(invalid), invalid && 'flex items-start gap-1', className)}
  >
    {invalid ? <ErrorGlyph /> : null}
    {children}
  </p>
);

export interface FieldHintRowProps {
  hint?: ReactNode;
  hintId?: string;
  hintEnd?: ReactNode;
  hintEndId?: string;
  invalid?: boolean;
  isHintEndWrapping?: boolean;
}

export const FieldHintRow = ({
  hint,
  hintId,
  hintEnd,
  hintEndId,
  invalid = false,
  isHintEndWrapping = false,
}: FieldHintRowProps) => {
  const hasHint = Boolean(hint);
  const hasHintEnd = hintEnd !== undefined && hintEnd !== null;
  if (!hasHintEnd) {
    return hasHint ? (
      <FieldHint id={hintId} invalid={invalid}>
        {hint}
      </FieldHint>
    ) : null;
  }
  return (
    <div className="flex items-start justify-between gap-3">
      {hasHint ? (
        <FieldHint id={hintId} invalid={invalid}>
          {hint}
        </FieldHint>
      ) : null}
      <p
        id={hintEndId}
        className={joinClasses(
          fieldHintTone(invalid),
          'ml-auto tabular-nums',
          isHintEndWrapping ? 'text-right' : 'whitespace-nowrap',
        )}
      >
        {hintEnd}
      </p>
    </div>
  );
};
