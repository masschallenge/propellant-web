import * as React from 'react';
import type { ReactNode } from 'react';
import { IconButton } from '../IconButton/IconButton';

export interface SeparatorProps {
  label?: ReactNode;
  variant?: 'single' | 'dual' | 'fill';
  align?: 'center' | 'left';
  action?: ReactNode;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const Rule = () => (
  <span className="flex-1 min-w-4 h-[var(--hairline)] bg-[var(--separator)]" aria-hidden="true" />
);

const SeparatorLabel = ({ label }: { label: ReactNode }) => (
  <span className="text-footnote text-[var(--label-secondary)]">{label}</span>
);

export const Separator = ({
  label,
  variant = 'single',
  align = 'center',
  action,
  className,
}: SeparatorProps) => {
  const accessibleLabel = typeof label === 'string' ? label : undefined;
  const semantics = action
    ? { role: 'group', 'aria-label': accessibleLabel }
    : { role: 'separator', 'aria-label': accessibleLabel };

  if (variant === 'fill') {
    return (
      <div
        {...semantics}
        className={joinClasses(
          'flex items-center gap-3 min-h-[var(--control-lg)] px-4 rounded-[var(--corner-lg)] bg-[var(--fill-tertiary)]',
          align === 'center' && 'justify-center',
          className,
        )}
      >
        <span
          className={joinClasses(
            'text-subheadline font-medium text-[var(--label)]',
            align === 'left' && 'mr-auto',
          )}
        >
          {label}
        </span>
        {action}
      </div>
    );
  }

  if (variant === 'dual') {
    return (
      <div
        {...semantics}
        className={joinClasses(
          'flex items-center gap-2 py-3 border-0 border-y-[length:var(--hairline)] border-solid border-[var(--separator)]',
          align === 'center' ? 'justify-center' : 'justify-start',
          className,
        )}
      >
        {label ? <SeparatorLabel label={label} /> : null}
        {action}
      </div>
    );
  }

  const hasContent = Boolean(label || action);
  return (
    <div
      {...semantics}
      className={joinClasses('flex items-center gap-3 min-h-[var(--control-md)]', className)}
    >
      {align === 'center' || !hasContent ? <Rule /> : null}
      {hasContent ? (
        <span className="inline-flex items-center gap-2">
          {label ? <SeparatorLabel label={label} /> : null}
          {action}
        </span>
      ) : null}
      {hasContent ? <Rule /> : null}
    </div>
  );
};

export interface SeparatorAddButtonProps {
  'aria-label': string;
  onClick?: () => void;
  className?: string;
}

export const SeparatorAddButton = ({
  onClick,
  className,
  'aria-label': ariaLabel,
}: SeparatorAddButtonProps) => (
  <IconButton
    variant="gray"
    size="sm"
    aria-label={ariaLabel}
    onClick={onClick}
    className={className}
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  </IconButton>
);
