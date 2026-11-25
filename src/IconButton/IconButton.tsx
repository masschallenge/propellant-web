import * as React from 'react';
import type { ReactNode } from 'react';

export type IconButtonVariant = 'plain' | 'gray' | 'tinted' | 'filled' | 'on-dark';
export type IconButtonSize = 'sm' | 'md' | 'lg';
export type IconButtonShape = 'rounded' | 'capsule';

export interface IconButtonProps extends Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'children' | 'aria-label'
> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  shape?: IconButtonShape;
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

const SHAPES: Record<IconButtonShape, string> = {
  rounded: 'rounded-[var(--corner-md)]',
  capsule: 'rounded-full',
};

const OPEN_PLAIN = '[&[aria-haspopup]:not(:disabled)[aria-expanded=true]]:bg-[var(--fill)]';

const ON_DARK =
  'bg-[var(--on-dark-fill)] text-[var(--on-dark)] hover:not-disabled:bg-[var(--on-dark-fill-hover)] aria-expanded:bg-[var(--on-dark-fill-hover)] focus-visible:outline-[var(--focus-color)]';

const ROUNDED_BY_DEFAULT = new Set<IconButtonVariant>(['plain', 'on-dark']);

const STANDARD: Record<IconButtonVariant, string> = {
  plain: `bg-transparent text-[var(--label-secondary)] hover:not-disabled:bg-[var(--fill-tertiary)] hover:not-disabled:text-[var(--label)] active:not-disabled:bg-[var(--fill-secondary)] ${OPEN_PLAIN} focus-visible:outline-[var(--focus-color)]`,
  gray: 'bg-[var(--fill-secondary)] text-[var(--label)] hover:not-disabled:bg-[var(--fill)] focus-visible:outline-[var(--focus-color)]',
  tinted:
    'bg-[var(--tint-fill)] text-[var(--tint)] hover:not-disabled:bg-[var(--tint-fill-hover)] focus-visible:outline-[var(--focus-color)]',
  filled:
    'bg-[var(--tint)] text-[var(--on-tint)] hover:not-disabled:bg-[var(--tint-hover)] active:not-disabled:bg-[var(--tint-pressed)] focus-visible:outline-[var(--focus-color)]',
  'on-dark': ON_DARK,
};

const DESTRUCTIVE: Record<IconButtonVariant, string> = {
  plain:
    'bg-transparent text-[var(--label-secondary)] hover:not-disabled:bg-[var(--critical-fill)] hover:not-disabled:text-[var(--critical)] focus-visible:not-disabled:bg-[var(--critical-fill)] focus-visible:not-disabled:text-[var(--critical)] focus-visible:outline-[var(--focus-color-critical)]',
  gray: 'bg-[var(--fill-secondary)] text-[var(--critical)] hover:not-disabled:bg-[var(--fill)] focus-visible:outline-[var(--focus-color-critical)]',
  tinted:
    'bg-[var(--critical-fill)] text-[var(--critical)] hover:not-disabled:bg-[var(--critical-fill-hover)] focus-visible:outline-[var(--focus-color-critical)]',
  filled:
    'bg-[var(--critical-solid)] text-[var(--on-critical)] hover:not-disabled:bg-[var(--critical-solid-hover)] active:not-disabled:bg-[var(--critical-solid-pressed)] focus-visible:outline-[var(--focus-color-critical)]',
  'on-dark': ON_DARK,
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'plain',
      size = 'md',
      shape,
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
        SHAPES[shape ?? (ROUNDED_BY_DEFAULT.has(variant) ? 'rounded' : 'capsule')],
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
