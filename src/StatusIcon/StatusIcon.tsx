import * as React from 'react';
import type { ReactNode } from 'react';

export type StatusIconTone = 'neutral' | 'info' | 'success' | 'warning' | 'critical';
export type StatusIconSize = 'md' | 'lg';

export interface StatusIconProps {
  tone?: StatusIconTone;
  size?: StatusIconSize;
  label?: string;
  className?: string;
  children: ReactNode;
}

const TONES: Record<StatusIconTone, string> = {
  neutral: 'text-[var(--label-tertiary)]',
  info: 'text-[var(--tint)]',
  success: 'text-[var(--success)]',
  warning: 'text-[var(--warning)]',
  critical: 'text-[var(--critical)]',
};

const SIZES: Record<StatusIconSize, string> = {
  md: '[&>svg]:w-8 [&>svg]:h-8',
  lg: '[&>svg]:w-11 [&>svg]:h-11',
};

export const StatusIcon = ({
  tone = 'info',
  size = 'lg',
  label,
  className,
  children,
}: StatusIconProps) => (
  <span
    data-tone={tone}
    className={[
      'inline-flex flex-none [&>svg]:block [&>svg]:[stroke-width:1.75]',
      TONES[tone],
      SIZES[size],
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
  >
    {children}
  </span>
);
