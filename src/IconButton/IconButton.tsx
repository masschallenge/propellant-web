import * as React from 'react';
import type { ReactNode } from 'react';

export type IconButtonVariant = 'plain' | 'gray' | 'tinted' | 'filled';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'children' | 'aria-label'
> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  destructive?: boolean;
  'aria-label': string;
  children?: ReactNode;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const BASE =
  'relative inline-flex flex-none items-center justify-center p-0 border-0 cursor-pointer ' +
  'transition-colors duration-[var(--duration-instant)] ease-[var(--ease-standard)] active:transition-none ' +
  'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] ' +
  "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 " +
  'before:w-[max(100%,var(--hit-target))] before:h-[max(100%,var(--hit-target))] ' +
  'disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]';

const SIZES: Record<IconButtonSize, string> = {
  sm: 'w-[var(--control-sm)] h-[var(--control-sm)] [&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)]',
  md: 'w-[var(--control-md)] h-[var(--control-md)] [&>svg]:w-[var(--icon-md)] [&>svg]:h-[var(--icon-md)]',
  lg: 'w-[var(--control-lg)] h-[var(--control-lg)] [&>svg]:w-[var(--icon-lg)] [&>svg]:h-[var(--icon-lg)]',
};

const STANDARD: Record<IconButtonVariant, string> = {
  plain:
    'rounded-[var(--corner-md)] bg-transparent text-[var(--label-secondary)] hover:not-disabled:bg-[var(--fill-tertiary)] hover:not-disabled:text-[var(--label)] active:not-disabled:bg-[var(--fill-secondary)] focus-visible:outline-[var(--focus-color)]',
  gray: 'rounded-full bg-[var(--fill-secondary)] text-[var(--label)] hover:not-disabled:bg-[var(--fill)] focus-visible:outline-[var(--focus-color)]',
  tinted:
    'rounded-full bg-[var(--tint-fill)] text-[var(--tint)] hover:not-disabled:bg-[var(--tint-fill-hover)] focus-visible:outline-[var(--focus-color)]',
  filled:
    'rounded-full bg-[var(--tint)] text-[var(--on-tint)] hover:not-disabled:bg-[var(--tint-hover)] active:not-disabled:bg-[var(--tint-pressed)] focus-visible:outline-[var(--focus-color)]',
};

const DESTRUCTIVE: Record<IconButtonVariant, string> = {
  plain:
    'rounded-[var(--corner-md)] bg-transparent text-[var(--label-secondary)] hover:not-disabled:bg-[var(--critical-fill)] hover:not-disabled:text-[var(--critical)] focus-visible:not-disabled:bg-[var(--critical-fill)] focus-visible:not-disabled:text-[var(--critical)] focus-visible:outline-[var(--focus-color-critical)]',
  gray: 'rounded-full bg-[var(--fill-secondary)] text-[var(--critical)] hover:not-disabled:bg-[var(--fill)] focus-visible:outline-[var(--focus-color-critical)]',
  tinted:
    'rounded-full bg-[var(--critical-fill)] text-[var(--critical)] hover:not-disabled:bg-[var(--critical-fill-hover)] focus-visible:outline-[var(--focus-color-critical)]',
  filled:
    'rounded-full bg-[var(--critical-solid)] text-[var(--on-critical)] hover:not-disabled:bg-[var(--critical-solid-hover)] active:not-disabled:bg-[var(--critical-solid-pressed)] focus-visible:outline-[var(--focus-color-critical)]',
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'plain',
      size = 'md',
      destructive = false,
      type = 'button',
      className,
      children,
      ...rest
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={joinClasses(
        BASE,
        SIZES[size],
        (destructive ? DESTRUCTIVE : STANDARD)[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  ),
);

IconButton.displayName = 'IconButton';
