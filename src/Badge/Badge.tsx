import * as React from 'react';
import type { ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'critical';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> {
  tone?: BadgeTone;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean;
  emphasis?: 'default' | 'strong';
  icon?: ReactNode;
  iconPosition?: 'leading' | 'trailing';
  iconOnly?: boolean;
  truncate?: boolean;
  children?: ReactNode;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const TONES: Record<BadgeTone, { soft: string; strong: string; dot: string }> = {
  neutral: {
    soft: 'bg-[var(--fill-secondary)] text-[var(--label-secondary)]',
    strong: 'bg-[var(--label-secondary)] text-[var(--bg)]',
    dot: 'bg-[var(--label-tertiary)]',
  },
  info: {
    soft: 'bg-[var(--tint-fill)] text-[var(--tint)]',
    strong: 'bg-[var(--tint)] text-[var(--on-tint)]',
    dot: 'bg-[var(--tint)]',
  },
  success: {
    soft: 'bg-[var(--success-fill)] text-[var(--success)]',
    strong: 'bg-[var(--success-solid)] text-[var(--on-success)]',
    dot: 'bg-[var(--success-solid)]',
  },
  warning: {
    soft: 'bg-[var(--warning-fill)] text-[var(--warning)]',
    strong: 'bg-[var(--warning-solid)] text-[var(--on-warning)]',
    dot: 'bg-[var(--warning-solid)]',
  },
  critical: {
    soft: 'bg-[var(--critical-fill)] text-[var(--critical)]',
    strong: 'bg-[var(--critical-solid)] text-[var(--on-critical)]',
    dot: 'bg-[var(--critical-solid)]',
  },
};

const SIZES: Record<BadgeSize, { label: string; iconOnly: string; icon: string }> = {
  sm: {
    label: 'min-h-5 px-2 text-caption',
    iconOnly: 'w-5 h-5',
    icon: 'w-3 h-3',
  },
  md: {
    label: 'min-h-6 px-2.5 text-subheadline font-medium',
    iconOnly: 'w-6 h-6',
    icon: 'w-3.5 h-3.5',
  },
};

export const Badge = ({
  tone = 'neutral',
  size = 'md',
  dot = false,
  pulse = false,
  emphasis = 'default',
  icon,
  iconPosition = 'leading',
  iconOnly = false,
  truncate = false,
  className,
  children,
  ...rest
}: BadgeProps) => {
  const palette = TONES[tone];
  const sizing = SIZES[size];
  const iconElement = icon ? (
    <span
      className={joinClasses(
        'flex-none inline-flex [&>svg]:w-full [&>svg]:h-full [&>svg]:block',
        sizing.icon,
      )}
      aria-hidden="true"
    >
      {icon}
    </span>
  ) : null;

  return (
    <span
      data-tone={tone}
      className={joinClasses(
        'relative inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-[var(--corner-capsule)] tabular-nums',
        emphasis === 'strong' ? palette.strong : palette.soft,
        iconOnly ? sizing.iconOnly : sizing.label,
        dot && !iconOnly && 'pl-1.5',
        truncate ? 'max-w-full min-w-0' : 'max-w-max',
        className,
      )}
      {...(iconOnly ? { role: 'img' } : {})}
      {...rest}
    >
      {dot ? (
        <span
          className={joinClasses(
            'flex-none w-1.5 h-1.5 rounded-full',
            emphasis === 'strong' ? 'bg-current' : palette.dot,
            pulse && 'motion-safe:animate-pulse',
          )}
          aria-hidden="true"
        />
      ) : null}
      {iconPosition === 'leading' ? iconElement : null}
      {iconOnly ? null : (
        <span className={truncate ? 'min-w-0 truncate' : undefined}>{children}</span>
      )}
      {iconPosition === 'trailing' ? iconElement : null}
    </span>
  );
};
