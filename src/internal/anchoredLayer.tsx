import * as React from 'react';
import { createPortal } from 'react-dom';

export interface AnchoredPosition {
  left: number;
  top: number;
  width: number;
  available: number;
}

export type AnchoredAlignment = 'start' | 'end';

export interface AnchoredPanelStyleOptions {
  matchWidth?: boolean;
  capsHeight?: boolean;
}

const VIEWPORT_GAP = 8;
const ANCHOR_GAP = 6;
const MIN_ROOM_BELOW = 220;
const FALLBACK_PANEL_HEIGHT = 280;
const MIN_AVAILABLE_HEIGHT = 160;

export const placeBelowOrAbove = (
  anchorRect: { left: number; top: number; bottom: number; width: number },
  panelSize: { width: number; height: number },
  viewport: { width: number; height: number },
  alignment: AnchoredAlignment = 'start',
): AnchoredPosition => {
  const roomBelow = viewport.height - anchorRect.bottom - ANCHOR_GAP - VIEWPORT_GAP;
  const roomAbove = anchorRect.top - ANCHOR_GAP - VIEWPORT_GAP;
  const panelHeight = panelSize.height || FALLBACK_PANEL_HEIGHT;
  const panelWidth = panelSize.width || anchorRect.width;
  const shouldFlip = roomBelow < Math.min(panelHeight, MIN_ROOM_BELOW) && roomAbove > roomBelow;
  const alignedLeft =
    alignment === 'end' ? anchorRect.left + anchorRect.width - panelWidth : anchorRect.left;
  const left = Math.max(
    VIEWPORT_GAP,
    Math.min(alignedLeft, viewport.width - panelWidth - VIEWPORT_GAP),
  );
  const viewportRoom = viewport.height - 2 * VIEWPORT_GAP;
  const available = Math.min(
    viewportRoom,
    Math.max(MIN_AVAILABLE_HEIGHT, shouldFlip ? roomAbove : roomBelow),
  );
  const lowestTop = viewport.height - VIEWPORT_GAP - Math.min(panelHeight, available);
  const top = shouldFlip
    ? Math.max(VIEWPORT_GAP, anchorRect.top - ANCHOR_GAP - panelHeight)
    : Math.max(VIEWPORT_GAP, Math.min(anchorRect.bottom + ANCHOR_GAP, lowestTop));
  return {
    left: Math.round(left),
    width: Math.round(anchorRect.width),
    top: Math.round(top),
    available: Math.round(available),
  };
};

export const useAnchoredPosition = (
  isOpen: boolean,
  anchor: React.RefObject<HTMLElement | null>,
  panel: React.RefObject<HTMLElement | null>,
  alignment: AnchoredAlignment = 'start',
): AnchoredPosition | null => {
  const [position, setPosition] = React.useState<AnchoredPosition | null>(null);
  React.useEffect(() => {
    if (!isOpen) {
      setPosition(null);
      return;
    }
    const place = () => {
      if (!anchor.current) return;
      setPosition(
        placeBelowOrAbove(
          anchor.current.getBoundingClientRect(),
          {
            width: panel.current?.offsetWidth ?? 0,
            height: panel.current?.offsetHeight ?? 0,
          },
          { width: window.innerWidth, height: window.innerHeight },
          alignment,
        ),
      );
    };
    place();
    const frame = requestAnimationFrame(place);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(place);
    if (panel.current) observer?.observe(panel.current);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [isOpen, alignment]);
  return position;
};

export const anchoredPanelStyle = (
  position: AnchoredPosition | null,
  { matchWidth = false, capsHeight = true }: AnchoredPanelStyleOptions = {},
): React.CSSProperties => {
  return {
    position: 'fixed',
    zIndex: 'var(--layer-overlay)',
    left: position ? position.left : -9999,
    top: position ? position.top : 0,
    width: matchWidth ? (position ? position.width : 0) : undefined,
    maxHeight: capsHeight && position ? position.available : undefined,
    visibility: position ? 'visible' : 'hidden',
  };
};

export const AnchoredLayer = ({
  children,
  host = null,
  isPrivate = false,
}: {
  children: React.ReactNode;
  host?: Element | null;
  isPrivate?: boolean;
}) =>
  createPortal(
    <div
      data-propellant
      className={isPrivate ? 'fs-mask' : undefined}
      style={{ display: 'contents' }}
    >
      {children}
    </div>,
    host || document.body,
  );

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

export const ANCHORED_SURFACE_CLASSES =
  'rounded-[var(--corner-lg)] bg-[var(--bg-elevated)] shadow-[var(--shadow-float)] text-[var(--label)] ' +
  '[--option-label:var(--label)] [--option-secondary:var(--label-secondary)] [--option-check:var(--tint)]';

export const ANCHORED_SECTION_CLASSES =
  'px-2 pt-2 pb-1 text-footnote font-semibold text-[var(--label-tertiary)]';

export const ANCHORED_SEPARATOR_CLASSES = 'h-[var(--hairline)] my-1 mx-2 bg-[var(--separator)]';

export const anchoredOptionClasses = ({
  isHighlighted = false,
  isDisabled = false,
}: {
  isHighlighted?: boolean;
  isDisabled?: boolean;
}) =>
  joinClasses(
    'flex items-center gap-2 min-h-[var(--control-sm)] px-2 py-1 rounded-[var(--corner-md)] text-(--option-label)',
    isDisabled ? 'cursor-not-allowed' : 'cursor-default',
    isHighlighted &&
      !isDisabled &&
      'bg-[var(--tint)] [--option-label:var(--on-tint)] [--option-secondary:var(--on-tint)] [--option-check:var(--on-tint)]',
    isHighlighted && isDisabled && 'bg-[var(--fill-tertiary)]',
  );

export const OptionCheckmark = ({ isVisible }: { isVisible: boolean }) => (
  <span
    className={joinClasses(
      'ml-auto flex-none flex text-(--option-check)',
      isVisible ? 'opacity-100' : 'opacity-0',
    )}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 24 24"
      className="w-[var(--icon-sm)] h-[var(--icon-sm)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  </span>
);

export type FieldChevronShape = 'popup' | 'disclosure';

export const FieldChevron = ({
  shape = 'disclosure',
  className,
}: {
  shape?: FieldChevronShape;
  className?: string;
}) => (
  <span
    className={joinClasses('flex-none flex text-[var(--label-tertiary)]', className)}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 24 24"
      className="w-[var(--icon-sm)] h-[var(--icon-sm)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={shape === 'popup' ? 'm8 9.5 4-4 4 4M8 14.5l4 4 4-4' : 'm6 9 6 6 6-6'} />
    </svg>
  </span>
);

export const AnchoredSearchField = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentPropsWithoutRef<'input'>, 'type'>
>(({ className, ...inputProps }, ref) => (
  <span
    className={joinClasses(
      'flex items-center gap-1.5 h-[var(--control-sm)] px-2.5 rounded-[var(--corner-capsule)] bg-[var(--fill-tertiary)] text-[var(--label-tertiary)]',
      'focus-within:shadow-[inset_0_0_0_var(--stroke-strong)_var(--focus-color)]',
      className,
    )}
  >
    <svg
      viewBox="0 0 24 24"
      className="flex-none block w-[var(--icon-sm)] h-[var(--icon-sm)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" />
    </svg>
    <input
      ref={ref}
      type="text"
      className="fs-mask w-full min-w-0 border-0 bg-transparent outline-none font-[inherit] text-callout text-[var(--label)] placeholder:text-[var(--label-tertiary)]"
      {...inputProps}
    />
  </span>
));

AnchoredSearchField.displayName = 'AnchoredSearchField';
