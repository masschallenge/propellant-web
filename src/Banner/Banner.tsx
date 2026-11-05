import * as React from 'react';
import type { ReactNode } from 'react';

export type BannerTone = 'neutral' | 'info' | 'success' | 'warning' | 'critical' | 'masquerade';

export interface BannerProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  tone?: BannerTone;
  title?: ReactNode;
  actions?: ReactNode;
  full?: boolean;
  solid?: boolean;
  icon?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
  children?: ReactNode;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const SOFT: Record<BannerTone, string> = {
  neutral: '[--banner-bg:var(--fill-tertiary)] [--banner-accent:var(--label-secondary)]',
  info: '[--banner-bg:var(--tint-fill)] [--banner-accent:var(--tint)]',
  success: '[--banner-bg:var(--success-fill)] [--banner-accent:var(--success)]',
  warning: '[--banner-bg:var(--warning-fill)] [--banner-accent:var(--warning)]',
  critical: '[--banner-bg:var(--critical-fill)] [--banner-accent:var(--critical)]',
  masquerade: '[--banner-bg:var(--masquerade)] [--banner-accent:var(--on-masquerade)]',
};

const SOLID: Record<BannerTone, string> = {
  neutral:
    '[--banner-bg:var(--gray-800)] [--banner-accent:var(--gray-0)] [--banner-fg:var(--gray-0)]',
  info: '[--banner-bg:var(--tint)] [--banner-accent:var(--on-tint)] [--banner-fg:var(--on-tint)]',
  success:
    '[--banner-bg:var(--success-solid)] [--banner-accent:var(--on-success)] [--banner-fg:var(--on-success)]',
  warning:
    '[--banner-bg:var(--warning-solid)] [--banner-accent:var(--on-warning)] [--banner-fg:var(--on-warning)]',
  critical:
    '[--banner-bg:var(--critical-solid)] [--banner-accent:var(--on-critical)] [--banner-fg:var(--on-critical)]',
  masquerade:
    '[--banner-bg:var(--masquerade)] [--banner-accent:var(--on-masquerade)] [--banner-fg:var(--on-masquerade)]',
};

const GLYPHS: Record<BannerTone, ReactNode> = {
  neutral: <path d="M12 16v-5M12 8h.01" />,
  info: <path d="M12 16v-5M12 8h.01" />,
  success: <path d="M8 12.5l2.5 2.5L16 9.5" />,
  warning: <path d="M12 8v5M12 16h.01" />,
  critical: <path d="M12 8v5M12 16h.01" />,
  masquerade: <path d="M12 8v5M12 16h.01" />,
};

export const Banner = ({
  tone = 'neutral',
  title,
  actions,
  full = false,
  solid,
  icon,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
  children,
  ...rest
}: BannerProps) => {
  const isSolid = solid ?? tone === 'masquerade';
  return (
    <div
      role={tone === 'critical' ? 'alert' : 'status'}
      className={joinClasses(
        'flex gap-3 bg-(--banner-bg)',
        isSolid ? SOLID[tone] : SOFT[tone],
        isSolid ? 'text-(--banner-fg)' : 'text-[var(--label)]',
        full
          ? 'rounded-none px-[var(--page-margin)] py-2.5 items-center'
          : 'rounded-[var(--corner-lg)] px-3.5 py-3',
        className,
      )}
      {...rest}
    >
      <span className="flex-none flex text-(--banner-accent) mt-px" aria-hidden="true">
        {icon || (
          <svg
            viewBox="0 0 24 24"
            className="w-[var(--icon-lg)] h-[var(--icon-lg)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            {GLYPHS[tone]}
          </svg>
        )}
      </span>
      <div
        className={joinClasses(
          'flex-1 min-w-0 flex',
          full ? 'flex-row flex-wrap items-center gap-x-3 gap-y-1' : 'flex-col gap-0.5',
        )}
      >
        {title ? (
          <p className="m-0 text-callout font-semibold [overflow-wrap:anywhere]">{title}</p>
        ) : null}
        {children ? (
          <div
            className={joinClasses(
              'text-callout [overflow-wrap:anywhere]',
              isSolid ? 'opacity-90' : 'text-[var(--label-secondary)]',
            )}
          >
            {children}
          </div>
        ) : null}
        {actions ? (
          <div
            className={joinClasses('flex flex-wrap items-center gap-2', full ? 'ml-auto' : 'mt-2')}
          >
            {actions}
          </div>
        ) : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className={joinClasses(
            'relative flex-none inline-flex items-center justify-center w-6 h-6 -mt-0.5 -mr-1 p-0 border-0 bg-transparent cursor-pointer rounded-[var(--corner-capsule)]',
            isSolid
              ? 'text-(--banner-fg) hover:bg-[rgb(255_255_255/0.16)]'
              : 'text-[var(--label-tertiary)] hover:bg-[var(--fill-secondary)] hover:text-[var(--label-secondary)]',
            'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]',
            "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[var(--hit-target)] before:h-[var(--hit-target)]",
          )}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M17 7 7 17M7 7l10 10" />
          </svg>
        </button>
      ) : null}
    </div>
  );
};
