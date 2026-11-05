import * as React from 'react';
import type { ReactNode } from 'react';

export type ButtonVariant = 'filled' | 'tinted' | 'gray' | 'plain';
export type ButtonSize = 'sm' | 'md' | 'lg';

type NativeButtonProps = Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'type' | 'children' | 'disabled'
>;

export interface ButtonProps extends NativeButtonProps {
  variant?: ButtonVariant;
  destructive?: boolean;
  size?: ButtonSize;
  inline?: boolean;
  iconLeading?: ReactNode;
  iconTrailing?: ReactNode;
  iconOnly?: boolean;
  wrap?: boolean;
  truncate?: boolean;
  loading?: boolean;
  disabled?: boolean;
  focusableWhenDisabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  download?: boolean | string;
  linkAs?: React.ElementType;
  type?: 'button' | 'submit' | 'reset';
  children?: ReactNode;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const BASE =
  'relative inline-flex items-center justify-center gap-1.5 border-0 no-underline whitespace-nowrap cursor-pointer select-none ' +
  'rounded-[var(--corner-capsule)] font-medium bg-(--button-bg) text-(--button-fg) ' +
  'transition-colors duration-[var(--duration-instant)] ease-[var(--ease-standard)] ' +
  'hover:bg-(--button-bg-hover) active:bg-(--button-bg-pressed) active:transition-none ' +
  'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-(--button-ring) ' +
  'disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)] disabled:hover:bg-(--button-bg) ' +
  'aria-disabled:cursor-not-allowed aria-disabled:opacity-[var(--opacity-disabled)] aria-disabled:hover:bg-(--button-bg)';

const HIT_AREA =
  "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 " +
  'before:h-[max(100%,var(--hit-target))] before:w-[max(100%,var(--hit-target))]';

const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-[var(--control-sm)] px-3 text-subheadline font-medium',
  md: 'min-h-[var(--control-md)] px-3.5 text-callout font-medium',
  lg: 'min-h-[var(--control-lg)] px-[18px] text-body font-semibold',
};

const LEADING_ICON_PADDING: Record<ButtonSize, string> = {
  sm: 'pl-2.5',
  md: 'pl-[11px]',
  lg: 'pl-[15px]',
};

const TRAILING_ICON_PADDING: Record<ButtonSize, string> = {
  sm: 'pr-2.5',
  md: 'pr-[11px]',
  lg: 'pr-[15px]',
};

const ICON_ONLY_SIZES: Record<ButtonSize, string> = {
  sm: 'px-0 w-[var(--control-sm)]',
  md: 'px-0 w-[var(--control-md)]',
  lg: 'px-0 w-[var(--control-lg)]',
};

const ICON_SIZES: Record<ButtonSize, string> = {
  sm: 'w-[var(--icon-sm)] h-[var(--icon-sm)]',
  md: 'w-[var(--icon-sm)] h-[var(--icon-sm)]',
  lg: 'w-[var(--icon-md)] h-[var(--icon-md)]',
};

const TONES: Record<ButtonVariant, { standard: string; destructive: string }> = {
  filled: {
    standard:
      '[--button-bg:var(--tint)] [--button-fg:var(--on-tint)] [--button-bg-hover:var(--tint-hover)] [--button-bg-pressed:var(--tint-pressed)]',
    destructive:
      '[--button-bg:var(--critical-solid)] [--button-fg:var(--on-critical)] [--button-bg-hover:var(--critical-solid-hover)] [--button-bg-pressed:var(--critical-solid-pressed)]',
  },
  tinted: {
    standard:
      '[--button-bg:var(--tint-fill)] [--button-fg:var(--tint)] [--button-bg-hover:var(--tint-fill-hover)] [--button-bg-pressed:var(--tint-fill-hover)]',
    destructive:
      '[--button-bg:var(--critical-fill)] [--button-fg:var(--critical)] [--button-bg-hover:var(--critical-fill-hover)] [--button-bg-pressed:var(--critical-fill-hover)]',
  },
  gray: {
    standard:
      '[--button-bg:var(--fill-secondary)] [--button-fg:var(--label)] [--button-bg-hover:var(--fill)] [--button-bg-pressed:var(--fill)]',
    destructive:
      '[--button-bg:var(--fill-secondary)] [--button-fg:var(--critical)] [--button-bg-hover:var(--fill)] [--button-bg-pressed:var(--fill)]',
  },
  plain: {
    standard:
      '[--button-bg:transparent] [--button-fg:var(--tint)] [--button-bg-hover:var(--fill-tertiary)] [--button-bg-pressed:var(--fill-secondary)]',
    destructive:
      '[--button-bg:transparent] [--button-fg:var(--critical)] [--button-bg-hover:var(--critical-fill)] [--button-bg-pressed:var(--critical-fill-hover)]',
  },
};

const INLINE =
  'min-h-0 px-0 py-0 rounded-[var(--corner-sm)] [font-size:inherit] [line-height:inherit] hover:bg-transparent active:bg-transparent hover:underline underline-offset-2';

const blockActivation = (event: React.MouseEvent) => event.preventDefault();

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = 'filled',
      destructive = false,
      size = 'md',
      inline = false,
      iconLeading,
      iconTrailing,
      iconOnly = false,
      wrap = false,
      truncate = false,
      loading = false,
      disabled = false,
      focusableWhenDisabled = false,
      href,
      linkAs: LinkElement = 'a',
      type = 'button',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const isInline = inline && variant === 'plain' && !iconOnly;
    const isSoftDisabled = disabled && focusableWhenDisabled;
    const wrapsLabel = wrap && !iconOnly;
    const truncatesLabel = truncate && !iconOnly && !wrapsLabel;
    const tone = TONES[variant][destructive ? 'destructive' : 'standard'];
    const ring = destructive
      ? '[--button-ring:var(--focus-color-critical)]'
      : '[--button-ring:var(--focus-color)]';

    const renderIcon = (node: ReactNode) =>
      node ? (
        <span
          className={joinClasses(
            'flex-none inline-flex items-center justify-center [&>svg]:w-full [&>svg]:h-full',
            ICON_SIZES[size],
          )}
          aria-hidden="true"
        >
          {node}
        </span>
      ) : null;

    const classes = joinClasses(
      BASE,
      tone,
      ring,
      HIT_AREA,
      isInline ? INLINE : SIZES[size],
      !isInline && !iconOnly && iconLeading && !wrapsLabel ? LEADING_ICON_PADDING[size] : null,
      !isInline && !iconOnly && iconTrailing ? TRAILING_ICON_PADDING[size] : null,
      iconOnly && ICON_ONLY_SIZES[size],
      (wrapsLabel || truncatesLabel) && 'max-w-full min-w-0',
      wrapsLabel && !isInline && 'py-1.5',
      loading && 'pointer-events-none',
      className,
    );

    const label =
      !iconOnly && children ? (
        <span
          className={
            wrapsLabel
              ? 'min-w-0 whitespace-normal break-words text-left'
              : truncatesLabel
                ? 'min-w-0 truncate'
                : undefined
          }
        >
          {children}
        </span>
      ) : null;

    const spinner = (
      <span
        className={joinClasses(
          'flex-none rounded-full border-2 border-current border-t-transparent animate-spin',
          ICON_SIZES[size],
        )}
        aria-hidden="true"
      />
    );

    const content = (
      <>
        {loading ? spinner : iconOnly ? null : renderIcon(iconLeading)}
        {label}
        {iconOnly && !loading ? renderIcon(iconLeading ?? children) : null}
        {!iconOnly ? renderIcon(iconTrailing) : null}
      </>
    );

    if (href && !disabled) {
      return (
        <LinkElement
          ref={ref}
          href={href}
          className={classes}
          aria-busy={loading || undefined}
          {...rest}
          aria-disabled={loading || rest['aria-disabled']}
          onClick={loading ? blockActivation : rest.onClick}
        >
          {content}
        </LinkElement>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        className={classes}
        disabled={(disabled && !isSoftDisabled) || loading}
        aria-busy={loading || undefined}
        {...rest}
        {...(isSoftDisabled ? { 'aria-disabled': true, onClick: blockActivation } : {})}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';
