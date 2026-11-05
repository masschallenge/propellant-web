import * as React from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from '../IconButton/IconButton';

const openSheetStack: object[] = [];

export type SheetTone = 'neutral' | 'info' | 'success' | 'warning' | 'critical';
export type SheetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type SheetLayout = 'stacked' | 'horizontal' | 'split';

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  tone?: SheetTone;
  icon?: ReactNode;
  hideIcon?: boolean;
  avatar?: string;
  layout?: SheetLayout;
  media?: ReactNode;
  footer?: ReactNode;
  footerLayout?: 'row' | 'wide';
  role?: 'dialog' | 'alertdialog';
  size?: SheetSize;
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}

const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

const SKIPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'LINK']);

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const TONE_COLOR: Record<SheetTone, string> = {
  neutral: 'text-[var(--label-secondary)]',
  info: 'text-[var(--tint)]',
  success: 'text-[var(--success)]',
  warning: 'text-[var(--warning)]',
  critical: 'text-[var(--critical)]',
};

const TONE_GLYPH: Record<SheetTone, string> = {
  neutral: 'M12 16v-5M12 8h.01',
  info: 'M12 16v-5M12 8h.01',
  success: 'M8 12.5l2.5 2.5L16 9.5',
  warning: 'M12 8v5M12 16h.01',
  critical: 'M12 8v5M12 16h.01',
};

const WIDTH: Record<SheetSize, string> = {
  sm: 'max-w-[400px]',
  md: 'max-w-[520px]',
  lg: 'max-w-[640px]',
  xl: 'max-w-[1152px]',
  full: 'max-w-none h-full',
};

const FOOTER_LAYOUT = {
  row: 'flex flex-col-reverse gap-2 [&>*]:w-full sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 sm:[&>*]:w-auto',
  wide: 'flex flex-col-reverse gap-2 [&>*]:w-full',
};

const isTabbable = (element: HTMLElement) =>
  element.tabIndex >= 0 &&
  ((typeof element.checkVisibility === 'function'
    ? element.checkVisibility()
    : !element.closest('[hidden]')) ||
    element === document.activeElement);

export const Sheet = ({
  open,
  onClose,
  title,
  description,
  tone = 'info',
  icon,
  hideIcon = false,
  avatar,
  layout = 'stacked',
  media,
  footer,
  footerLayout = 'row',
  size = 'md',
  role = 'dialog',
  inline = false,
  className,
  children,
}: SheetProps) => {
  const sheetId = React.useId();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = React.useRef<Element | null>(null);
  const latestOnCloseRef = React.useRef(onClose);

  React.useEffect(() => {
    latestOnCloseRef.current = onClose;
  });

  React.useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = document.activeElement;
    panelRef.current?.focus();
    const inertedElements: HTMLElement[] = [];
    const overlay = overlayRef.current;
    if (!inline && overlay && overlay.parentNode === document.body) {
      for (const sibling of Array.from(document.body.children)) {
        if (!(sibling instanceof HTMLElement)) continue;
        if (sibling === overlay || SKIPPED_TAGS.has(sibling.tagName)) continue;
        if (sibling.hasAttribute('inert')) continue;
        sibling.setAttribute('inert', '');
        sibling.setAttribute('aria-hidden', 'true');
        inertedElements.push(sibling);
      }
    }
    const stackEntry = {};
    openSheetStack.push(stackEntry);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (openSheetStack[openSheetStack.length - 1] !== stackEntry) return;
      if (event.key === 'Escape') {
        if (event.defaultPrevented) return;
        event.stopPropagation();
        latestOnCloseRef.current();
        return;
      }
      const panel = panelRef.current;
      if (event.key !== 'Tab' || !panel) return;
      const tabbable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        isTabbable,
      );
      if (!tabbable.length) {
        event.preventDefault();
        return;
      }
      const first = tabbable[0];
      const last = tabbable[tabbable.length - 1];
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
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      openSheetStack.splice(openSheetStack.indexOf(stackEntry), 1);
      for (const element of inertedElements) {
        element.removeAttribute('inert');
        element.removeAttribute('aria-hidden');
      }
      const previouslyFocused = previouslyFocusedRef.current;
      if (previouslyFocused instanceof HTMLElement && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [open]);

  if (!open) return null;

  const titleId = `${sheetId}-title`;
  const descriptionId = `${sheetId}-desc`;

  const lead = avatar ? (
    <img className="flex-none w-10 h-10 rounded-full object-cover" src={avatar} alt="" />
  ) : !hideIcon ? (
    <span
      className={joinClasses(
        'flex-none flex [&>svg]:w-[var(--icon-xl)] [&>svg]:h-[var(--icon-xl)] [&>svg]:block',
        TONE_COLOR[tone],
      )}
      data-tone={tone}
      aria-hidden="true"
    >
      {icon || (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d={TONE_GLYPH[tone]} />
        </svg>
      )}
    </span>
  ) : null;

  const closeButton = (
    <span className="absolute top-4 right-4 z-[2] flex">
      <IconButton variant="gray" size="sm" aria-label="Close" onClick={onClose}>
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
    </span>
  );

  const heading = (
    <div className="flex flex-col gap-1 min-w-0 pr-10">
      {title ? (
        <h2 id={titleId} className="m-0 text-title2 text-[var(--label)] [overflow-wrap:anywhere]">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p
          id={descriptionId}
          className="m-0 text-callout text-[var(--label-secondary)] [overflow-wrap:anywhere]"
        >
          {description}
        </p>
      ) : null}
    </div>
  );

  const scrollsBody = layout === 'stacked' && size !== 'full';

  const footerNode = footer ? (
    <div className={joinClasses(FOOTER_LAYOUT[footerLayout], scrollsBody && 'shrink-0')}>
      {footer}
    </div>
  ) : null;

  const body = children ? (
    <div
      className={joinClasses(
        'text-callout text-[var(--label)]',
        size === 'full' && 'flex-1 min-h-0 flex flex-col',
        scrollsBody && 'min-h-0 overflow-y-auto -m-1 p-1',
      )}
    >
      {children}
    </div>
  ) : null;

  const content =
    layout === 'horizontal' ? (
      <div className="flex items-start gap-4">
        {lead}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {heading}
          {body}
          {footerNode}
        </div>
      </div>
    ) : layout === 'split' ? (
      <div className="flex items-stretch gap-4">
        <div className="flex-none w-45 rounded-[var(--corner-lg)] overflow-hidden bg-[var(--bg-secondary)] flex items-center justify-center">
          {media}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {heading}
          {body}
          {footerNode}
        </div>
      </div>
    ) : (
      <>
        <div className="shrink-0 flex flex-col gap-3">
          {lead}
          {heading}
        </div>
        {body}
        {footerNode}
      </>
    );

  const sheet = (
    <div
      ref={overlayRef}
      data-propellant
      className={joinClasses(
        inline
          ? 'absolute inset-0 rounded-[var(--corner-lg)]'
          : 'fixed inset-0 z-[var(--layer-overlay)]',
        'flex items-center justify-center p-4 sm:p-6 bg-[var(--scrim)]',
      )}
      onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        onClose();
      }}
    >
      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={joinClasses(
          'relative w-full flex flex-col gap-5 p-6 outline-none',
          'rounded-[var(--corner-xl)] bg-[var(--bg-elevated)] shadow-[var(--shadow-sheet)]',
          WIDTH[size],
          scrollsBody && !inline && 'max-h-full',
          className,
        )}
      >
        {closeButton}
        {content}
      </div>
    </div>
  );
  return inline ? sheet : createPortal(sheet, document.body);
};
