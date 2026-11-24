import * as React from 'react';
import type { ReactNode } from 'react';
import { IconButton } from '../IconButton/IconButton';

export type ToastTone = 'default' | 'gray' | 'brand' | 'success' | 'warning' | 'error';

export type ToastActionPlacement = 'below' | 'inline';

export interface ToastAction {
  label: string;
  onClick?: () => void;
  muted?: boolean;
}

export interface ToastProps {
  title: string;
  children?: ReactNode;
  tone?: ToastTone;
  when?: string;
  actions?: ToastAction[];
  actionPlacement?: ToastActionPlacement;
  media?: ReactNode;
  progress?: number;
  progressLabel?: string;
  onDismiss?: () => void;
  announce?: boolean;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const GLYPH_COLOR: Record<ToastTone, string> = {
  default: 'text-[var(--label-secondary)]',
  gray: 'text-[var(--label-tertiary)]',
  brand: 'text-[var(--tint)]',
  success: 'text-[var(--success)]',
  warning: 'text-[var(--warning)]',
  error: 'text-[var(--critical)]',
};

const GLYPH_PATH: Record<ToastTone, string> = {
  default: 'M12 16v-5M12 8h.01',
  gray: 'M12 16v-5M12 8h.01',
  brand: 'M12 16v-5M12 8h.01',
  success: 'M8 12.5l2.5 2.5L16 9.5',
  warning: 'M12 8v5M12 16h.01',
  error: 'M15 9l-6 6M9 9l6 6',
};

const ACTION_CLASSES =
  'relative inline-flex items-center min-h-[var(--control-sm)] p-0 border-0 bg-transparent cursor-pointer rounded-[var(--corner-sm)] text-callout font-medium ' +
  'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)] ' +
  "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[max(100%,var(--hit-target))] before:h-[max(100%,var(--hit-target))]";

const ToastActions = ({ actions, className }: { actions: ToastAction[]; className: string }) => (
  <div className={joinClasses('flex items-center gap-4', className)}>
    {actions.map((action) => (
      <button
        key={action.label}
        type="button"
        onClick={action.onClick}
        className={joinClasses(
          ACTION_CLASSES,
          action.muted
            ? 'text-[var(--label-secondary)] hover:text-[var(--label)]'
            : 'text-[var(--tint)] hover:text-[var(--tint-hover)]',
        )}
      >
        {action.label}
      </button>
    ))}
  </div>
);

export const Toast = ({
  title,
  children,
  tone = 'default',
  when,
  actions,
  actionPlacement = 'below',
  media,
  progress,
  progressLabel,
  onDismiss,
  announce = true,
  className,
}: ToastProps) => {
  const isInline = actionPlacement === 'inline';
  const actionList = actions ?? [];
  const hasActions = actionList.length > 0;
  const showsInlineActions = isInline && hasActions;
  return (
    <div
      role={announce ? (tone === 'error' ? 'alert' : 'status') : undefined}
      data-tone={tone}
      className={joinClasses(
        'relative w-full max-w-[var(--toast-width)] flex gap-3 px-3.5 py-3',
        isInline && 'items-center',
        'rounded-[var(--corner-lg)] bg-[var(--bg-elevated)] shadow-[var(--shadow-float)] text-[var(--label)]',
        className,
      )}
    >
      {media || (
        <span
          className={joinClasses('flex-none flex', !isInline && 'mt-px', GLYPH_COLOR[tone])}
          aria-hidden="true"
        >
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
            <path d={GLYPH_PATH[tone]} />
          </svg>
        </span>
      )}
      <div
        className={joinClasses(
          'flex-1 min-w-0 flex flex-col gap-0.5',
          onDismiss && !showsInlineActions && 'pr-7',
        )}
      >
        <span className="text-callout font-semibold [overflow-wrap:anywhere]">{title}</span>
        {children ? (
          <p className="m-0 text-callout text-[var(--label-secondary)] [overflow-wrap:anywhere]">
            {children}
          </p>
        ) : null}
        {when ? <span className="text-footnote text-[var(--label-tertiary)]">{when}</span> : null}
        {progress !== undefined ? (
          <span className="flex items-center gap-3 mt-2">
            <span
              className="relative flex-1 h-1 rounded-[var(--corner-capsule)] overflow-hidden bg-[var(--fill-secondary)]"
              role="progressbar"
              aria-label={progressLabel || 'Upload progress'}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <span
                className="absolute left-0 top-0 bottom-0 rounded-[var(--corner-capsule)] bg-[var(--tint)]"
                style={{ width: `${progress}%` }}
              />
            </span>
            <span className="flex-none text-footnote font-medium tabular-nums text-[var(--label-secondary)]">
              {progress}%
            </span>
          </span>
        ) : null}
        {hasActions && !isInline ? <ToastActions actions={actionList} className="mt-1" /> : null}
      </div>
      {showsInlineActions ? (
        <ToastActions
          actions={actionList}
          className={joinClasses('flex-none', onDismiss && 'pr-7')}
        />
      ) : null}
      {onDismiss ? (
        <span className="absolute top-2 right-2 flex">
          <IconButton size="sm" aria-label="Dismiss notification" onClick={onDismiss}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M17 7 7 17M7 7l10 10" />
            </svg>
          </IconButton>
        </span>
      ) : null}
    </div>
  );
};
