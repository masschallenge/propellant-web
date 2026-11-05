import * as React from 'react';
import type { ReactNode } from 'react';
import { ErrorGlyph } from '../TextField/fieldText';

export type SelectionSize = 'sm' | 'md';

export const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

export const HIDDEN_INPUT =
  'peer absolute top-0 left-0 z-[1] w-px h-px m-0 p-0 border-0 overflow-hidden opacity-0';

export const INDICATOR_SIZES: Record<SelectionSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-4.5 h-4.5',
};

export const indicatorClasses = (size: SelectionSize, hasError: boolean) =>
  joinClasses(
    'relative flex-none mt-px bg-[var(--bg)]',
    INDICATOR_SIZES[size],
    hasError
      ? 'shadow-[inset_0_0_0_var(--stroke-strong)_var(--critical)]'
      : 'shadow-[inset_0_0_0_1px_var(--control-border)]',
    'transition-[background-color,box-shadow] duration-[var(--duration-fade)] ease-[var(--ease-standard)]',
    'peer-focus-visible:outline-[length:var(--focus-width)] peer-focus-visible:outline-solid peer-focus-visible:outline-offset-[var(--focus-offset)] peer-focus-visible:outline-[var(--focus-color)]',
    "after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[var(--hit-target)] after:h-[var(--hit-target)]",
  );

export const selectionRowClasses = (size: SelectionSize, isDisabled: boolean, className?: string) =>
  joinClasses(
    'relative inline-flex items-start py-1.5',
    size === 'sm' ? 'gap-2' : 'gap-2.5',
    isDisabled ? 'cursor-not-allowed opacity-[var(--opacity-disabled)]' : 'cursor-pointer',
    className,
  );

export interface SelectionTextProps {
  label?: ReactNode;
  hint?: ReactNode;
  labelId: string;
  hintId: string;
  size: SelectionSize;
  hasError?: boolean;
}

export const SelectionText = ({
  label,
  hint,
  labelId,
  hintId,
  size,
  hasError = false,
}: SelectionTextProps) => {
  if (!label && !hint) return null;
  return (
    <span className="flex flex-col gap-0.5 min-w-0 select-none">
      {label ? (
        <span
          id={labelId}
          className={joinClasses(
            size === 'sm' ? 'text-subheadline' : 'text-callout',
            'text-[var(--label)]',
          )}
        >
          {label}
        </span>
      ) : null}
      {hint ? (
        <span
          id={hintId}
          className={joinClasses(
            'text-footnote',
            hasError
              ? 'flex items-start gap-1 text-[var(--critical)]'
              : 'text-[var(--label-tertiary)]',
          )}
        >
          {hasError ? <ErrorGlyph /> : null}
          {hint}
        </span>
      ) : null}
    </span>
  );
};
