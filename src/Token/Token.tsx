import * as React from 'react';
import type { ReactNode } from 'react';

export type TokenSize = 'sm' | 'md';

export interface TokenProps {
  label: string;
  size?: TokenSize;
  color?: string;
  dot?: boolean;
  icon?: ReactNode;
  count?: string | number;
  selected?: boolean;
  onToggle?: (selected: boolean) => void;
  onRemove?: () => void;
  removeLabel?: string;
  disabled?: boolean;
  wrap?: boolean;
  ariaLabel?: string;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const SIZES: Record<TokenSize, string> = {
  sm: 'min-h-6 px-2.5 gap-1.5 text-subheadline',
  md: 'min-h-7 px-3 gap-1.5 text-callout',
};

const CheckGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    className="flex-none w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const Token = ({
  label,
  size = 'md',
  color,
  dot = false,
  icon,
  count,
  selected = false,
  onToggle,
  onRemove,
  removeLabel,
  disabled = false,
  wrap = false,
  ariaLabel,
  className,
}: TokenProps) => {
  const isToggle = Boolean(onToggle);
  const surface = selected
    ? 'bg-[var(--tint-fill)] text-[var(--tint)]'
    : color
      ? 'bg-[color-mix(in_srgb,var(--token-color)_16%,var(--bg))] text-[var(--label)]'
      : 'bg-[var(--fill-secondary)] text-[var(--label)]';
  const style = color ? ({ '--token-color': color } as React.CSSProperties) : undefined;

  const content = (
    <>
      {isToggle && selected ? <CheckGlyph /> : null}
      {dot ? (
        <span
          className={joinClasses(
            'flex-none w-2 h-2 rounded-full',
            color ? 'bg-[var(--token-color)]' : 'bg-[var(--label-tertiary)]',
          )}
          aria-hidden="true"
        />
      ) : null}
      {icon ? (
        <span
          className="flex-none inline-flex [&>svg]:w-3.5 [&>svg]:h-3.5 [&>svg]:block"
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      <span
        className={joinClasses(
          selected ? 'font-semibold' : 'font-normal',
          wrap ? 'min-w-0 whitespace-normal [overflow-wrap:anywhere]' : 'whitespace-nowrap',
        )}
      >
        {label}
      </span>
      {count !== undefined ? (
        <span className="tabular-nums text-[var(--label-tertiary)]">{count}</span>
      ) : null}
    </>
  );

  const shell = joinClasses(
    'relative inline-flex items-center rounded-[var(--corner-capsule)] text-left',
    SIZES[size],
    surface,
    wrap ? 'max-w-full' : 'max-w-max',
    disabled && 'opacity-[var(--opacity-disabled)] cursor-not-allowed',
    onRemove && 'pr-1.5',
    className,
  );

  const removeButton = onRemove ? (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onRemove();
      }}
      aria-label={removeLabel ?? `Remove ${label}`}
      disabled={disabled}
      className="relative flex-none inline-flex items-center justify-center w-[18px] h-[18px] p-0 border-0 bg-transparent cursor-pointer rounded-full text-[var(--label-tertiary)] hover:bg-[var(--fill)] hover:text-[var(--label)] disabled:cursor-not-allowed focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-1 focus-visible:outline-[var(--focus-color)] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[var(--hit-target)] before:h-[var(--hit-target)]"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M17 7 7 17M7 7l10 10" />
      </svg>
    </button>
  ) : null;

  if (isToggle && !onRemove) {
    return (
      <button
        type="button"
        aria-pressed={selected}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => onToggle?.(!selected)}
        style={style}
        className={joinClasses(
          shell,
          'border-0 cursor-pointer',
          !selected && !disabled && 'hover:bg-[var(--fill)]',
          "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:h-[max(100%,var(--hit-target))] before:w-full",
          'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]',
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <span style={style} className={shell} aria-disabled={disabled || undefined}>
      {isToggle ? (
        <button
          type="button"
          aria-pressed={selected}
          aria-label={ariaLabel}
          disabled={disabled}
          onClick={() => onToggle?.(!selected)}
          className="inline-flex items-center gap-1.5 p-0 border-0 bg-transparent text-inherit cursor-pointer focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)] rounded-[var(--corner-sm)]"
        >
          {content}
        </button>
      ) : (
        content
      )}
      {removeButton}
    </span>
  );
};
