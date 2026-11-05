import * as React from 'react';
import type { ReactNode } from 'react';
import { IconButton } from '../IconButton/IconButton';

export type InspectorSize = 'md' | 'lg' | 'xl';

const WIDTHS: Record<InspectorSize, string> = {
  md: 'w-[420px]',
  lg: 'w-[480px]',
  xl: 'w-[640px]',
};

const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const isShown = (element: HTMLElement) =>
  typeof element.checkVisibility === 'function'
    ? element.checkVisibility()
    : !element.closest('[hidden]');

export interface InspectorProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: string;
  headerActions?: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
  size?: InspectorSize;
  flush?: boolean;
  inline?: boolean;
  closeLabel?: string;
  className?: string;
  children?: ReactNode;
}

export const Inspector = ({
  open,
  onClose,
  title,
  description,
  headerActions,
  footer,
  wide = false,
  size,
  flush = false,
  inline = false,
  closeLabel = 'Close panel',
  className,
  children,
}: InspectorProps) => {
  const inspectorId = React.useId();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = `${inspectorId}-title`;

  React.useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (!event.defaultPrevented) onClose();
        return;
      }
      const panel = panelRef.current;
      if (event.key !== 'Tab' || !panel) return;
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => isShown(element) || element === document.activeElement,
      );
      if (!focusables.length) {
        event.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const isInside = panel.contains(active);
      if (event.shiftKey && (active === first || active === panel || !isInside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !isInside)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (trigger instanceof HTMLElement && document.contains(trigger)) trigger.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={joinClasses(
        inline ? 'absolute' : 'fixed z-[var(--layer-overlay)]',
        'inset-0 bg-[var(--scrim)]',
      )}
      onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={joinClasses(
          'absolute top-0 right-0 bottom-0 flex flex-col overflow-hidden outline-none max-w-full',
          'bg-[var(--bg-elevated)] shadow-[var(--shadow-sheet)]',
          'border-l-[length:var(--hairline)] border-solid border-[var(--separator)]',
          WIDTHS[size ?? (wide ? 'lg' : 'md')],
          className,
        )}
      >
        <div className="sticky top-0 flex items-start gap-3 px-5 pt-5 pb-3 bg-[var(--bg-elevated)]">
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            {title ? (
              <h2
                id={titleId}
                className="m-0 text-title3 text-[var(--label)] [overflow-wrap:anywhere]"
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="m-0 text-callout text-[var(--label-secondary)]">{description}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            {headerActions}
            <IconButton variant="gray" size="sm" aria-label={closeLabel} onClick={onClose}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M17 7 7 17M7 7l10 10" />
              </svg>
            </IconButton>
          </div>
        </div>
        <div
          className={joinClasses(
            'flex-1 overflow-y-auto flex flex-col gap-4 pb-5 text-callout text-[var(--label)]',
            flush ? 'px-0' : 'px-5',
          )}
        >
          {children}
        </div>
        {footer ? (
          <div className="flex items-center gap-3 px-5 py-4 border-t-[length:var(--hairline)] border-solid border-[var(--separator)] bg-[var(--bg-elevated)] [&>*]:flex-1">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export interface InspectorRowProps {
  label: string;
  value?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const InspectorRow = ({ label, value, selected, onClick, className }: InspectorRowProps) => {
  const rowClasses = joinClasses(
    'flex items-center gap-3 w-full min-h-[var(--row)] px-3 py-2 text-left rounded-[var(--corner-lg)] border-0 font-[inherit] text-callout',
    selected ? 'bg-[var(--tint-fill)]' : 'bg-[var(--fill-tertiary)]',
    onClick &&
      'cursor-pointer hover:bg-[var(--fill-secondary)] focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]',
    selected && onClick && 'hover:bg-[var(--tint-fill-hover)]',
    className,
  );
  const rowContent = (
    <>
      <span
        className={joinClasses(
          'min-w-0 text-[var(--label)]',
          selected ? 'font-semibold' : 'font-normal',
        )}
      >
        {label}
      </span>
      {value !== undefined ? (
        <span className="ml-auto text-[var(--label-secondary)]">{value}</span>
      ) : null}
      {selected ? (
        <svg
          viewBox="0 0 24 24"
          className={joinClasses(
            'flex-none w-[var(--icon-sm)] h-[var(--icon-sm)] text-[var(--tint)]',
            value === undefined && 'ml-auto',
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      ) : null}
    </>
  );
  if (onClick) {
    return (
      <button
        type="button"
        aria-pressed={selected === undefined ? undefined : selected}
        onClick={onClick}
        className={rowClasses}
      >
        {rowContent}
      </button>
    );
  }
  return <div className={rowClasses}>{rowContent}</div>;
};
