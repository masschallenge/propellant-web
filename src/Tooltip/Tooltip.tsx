import * as React from 'react';
import type { ReactNode } from 'react';
import { AnchoredLayer } from '../internal/anchoredLayer';

export type TooltipPlacement =
  'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' | 'left' | 'right';

export interface TooltipProps {
  content: ReactNode;
  description?: ReactNode;
  placement?: TooltipPlacement;
  open?: boolean;
  className?: string;
  children?: ReactNode;
  delay?: number;
  wide?: boolean;
  onlyWhenTruncated?: boolean;
  disabled?: boolean;
  block?: boolean;
}

type Side = 'top' | 'bottom' | 'left' | 'right';
type Alignment = 'left' | 'right';

interface BubblePosition {
  side: Side;
  top: number;
  left: number;
}

const VIEWPORT_MARGIN = 8;
const TOOLTIP_OFFSET = 6;

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const isOverflowing = (element: Element) =>
  element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;

const showsEllipsis = (element: Element) => {
  const style = window.getComputedStyle(element);
  const lineClamp = style.getPropertyValue('-webkit-line-clamp');
  return style.textOverflow === 'ellipsis' || (lineClamp !== '' && lineClamp !== 'none');
};

const isContentTruncated = (trigger: HTMLElement | null) => {
  const firstChild = trigger ? trigger.firstElementChild : null;
  if (!firstChild) return false;
  if (isOverflowing(firstChild)) return true;
  return Array.from(firstChild.querySelectorAll('*')).some(
    (element) => showsEllipsis(element) && isOverflowing(element),
  );
};

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

const BRIDGE: Record<Side, string> = {
  top: "before:content-[''] before:absolute before:inset-x-0 before:top-full before:h-1.5",
  bottom: "before:content-[''] before:absolute before:inset-x-0 before:bottom-full before:h-1.5",
  left: "before:content-[''] before:absolute before:inset-y-0 before:left-full before:w-1.5",
  right: "before:content-[''] before:absolute before:inset-y-0 before:right-full before:w-1.5",
};

const ALIGNMENT_RATIO: Record<Alignment, number> = { left: 0.84, right: 0.16 };

const clamp = (value: number, lowest: number, highest: number) =>
  Math.min(Math.max(value, lowest), Math.max(lowest, highest));

const measure = (
  anchor: Element,
  bubble: HTMLElement,
  placement: TooltipPlacement,
): BubblePosition => {
  const target = anchor.getBoundingClientRect();
  const { width, height } = bubble.getBoundingClientRect();
  const [preferred, alignment] = placement.split('-') as [Side, Alignment | undefined];
  const fits: Record<Side, boolean> = {
    top: target.top - height - TOOLTIP_OFFSET >= VIEWPORT_MARGIN,
    bottom: target.bottom + height + TOOLTIP_OFFSET <= window.innerHeight - VIEWPORT_MARGIN,
    left: target.left - width - TOOLTIP_OFFSET >= VIEWPORT_MARGIN,
    right: target.right + width + TOOLTIP_OFFSET <= window.innerWidth - VIEWPORT_MARGIN,
  };
  const side = fits[preferred] || !fits[OPPOSITE[preferred]] ? preferred : OPPOSITE[preferred];
  if (side === 'top' || side === 'bottom') {
    const centre = target.left + target.width / 2;
    const left = clamp(
      centre - width * (alignment ? ALIGNMENT_RATIO[alignment] : 0.5),
      VIEWPORT_MARGIN,
      window.innerWidth - width - VIEWPORT_MARGIN,
    );
    const top =
      side === 'top' ? target.top - height - TOOLTIP_OFFSET : target.bottom + TOOLTIP_OFFSET;
    return { side, top, left };
  }
  const middle = target.top + target.height / 2;
  const top = clamp(
    middle - height / 2,
    VIEWPORT_MARGIN,
    window.innerHeight - height - VIEWPORT_MARGIN,
  );
  const left =
    side === 'left' ? target.left - width - TOOLTIP_OFFSET : target.right + TOOLTIP_OFFSET;
  return { side, top, left };
};

export const Tooltip = ({
  content,
  description,
  placement = 'top',
  open,
  className,
  children,
  delay = 0,
  wide = false,
  onlyWhenTruncated = false,
  disabled = false,
  block = false,
}: TooltipProps) => {
  const tooltipId = React.useId();
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState<BubblePosition | null>(null);
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const bubbleRef = React.useRef<HTMLSpanElement>(null);
  const pointerTypeRef = React.useRef<string | null>(null);
  const hasKeyboardFocusRef = React.useRef(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isShown = open === undefined ? isVisible && !disabled : open;

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };
  const reveal = () => {
    if (!onlyWhenTruncated || isContentTruncated(anchorRef.current)) setIsVisible(true);
  };
  const show = () => {
    clearTimer();
    if (disabled) return;
    if (delay > 0) timerRef.current = setTimeout(reveal, delay);
    else reveal();
  };
  const hide = () => {
    clearTimer();
    setIsVisible(false);
  };

  React.useEffect(() => clearTimer, []);

  React.useLayoutEffect(() => {
    if (!isShown) {
      setPosition(null);
      return undefined;
    }
    const place = () => {
      if (anchorRef.current && bubbleRef.current) {
        setPosition(measure(anchorRef.current, bubbleRef.current, placement));
      }
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [isShown, placement]);

  React.useEffect(() => {
    if (!isShown || open !== undefined) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      hide();
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isShown, open]);

  const side = position?.side ?? (placement.split('-')[0] as Side);
  const bubble = (
    <span
      ref={bubbleRef}
      role="tooltip"
      id={tooltipId}
      style={{
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        visibility: position ? undefined : 'hidden',
      }}
      className={joinClasses(
        'fixed z-[var(--layer-tooltip)] flex flex-col items-start gap-0.5 w-max px-2.5',
        'rounded-[var(--corner-lg)] bg-[var(--bg-elevated)] shadow-[var(--shadow-float)]',
        'text-footnote font-normal text-[var(--label)]',
        wide
          ? 'max-w-[min(26rem,calc(100vw-1rem))] max-h-80 overflow-y-auto whitespace-pre-wrap break-words text-left'
          : 'max-w-[17.5rem]',
        description ? 'py-2' : 'py-1.5',
        BRIDGE[side],
      )}
    >
      <span>{content}</span>
      {description ? <span className="text-[var(--label-secondary)]">{description}</span> : null}
    </span>
  );

  return (
    <span
      className={joinClasses(block ? 'relative block' : 'relative inline-flex', className)}
      onMouseEnter={() => {
        if (pointerTypeRef.current !== 'touch') show();
      }}
      onMouseLeave={() => {
        if (pointerTypeRef.current !== 'touch' && !hasKeyboardFocusRef.current) hide();
      }}
      onPointerDown={(event: React.PointerEvent<HTMLSpanElement>) => {
        pointerTypeRef.current = event.pointerType || 'mouse';
      }}
      onClick={() => {
        if (pointerTypeRef.current !== 'touch' || disabled) return;
        clearTimer();
        setIsVisible((current) => !current);
      }}
      onFocus={() => {
        hasKeyboardFocusRef.current = pointerTypeRef.current === null;
        if (pointerTypeRef.current !== 'touch') show();
      }}
      onBlur={(event: React.FocusEvent<HTMLSpanElement>) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        pointerTypeRef.current = null;
        hasKeyboardFocusRef.current = false;
        hide();
      }}
    >
      <span
        ref={anchorRef}
        aria-describedby={isShown ? tooltipId : undefined}
        className={block ? 'block' : 'inline-flex'}
      >
        {children}
      </span>
      {isShown && typeof document !== 'undefined' ? <AnchoredLayer>{bubble}</AnchoredLayer> : null}
    </span>
  );
};

export interface TooltipTriggerProps {
  'aria-label': string;
  'aria-describedby'?: string;
  className?: string;
  children?: ReactNode;
}

export const TooltipTrigger = ({ className, children, ...rest }: TooltipTriggerProps) => (
  <button
    type="button"
    className={joinClasses(
      'relative inline-flex items-center justify-center w-5 h-5 p-0 border-0 bg-transparent rounded-full cursor-help',
      'text-[var(--label-tertiary)] hover:text-[var(--label-secondary)]',
      'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]',
      "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-[var(--hit-target)] before:h-[var(--hit-target)] before:-translate-x-1/2 before:-translate-y-1/2",
      '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:block [&>svg]:relative',
      className,
    )}
    {...rest}
  >
    {children || (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        style={{ strokeWidth: 'var(--icon-stroke)' }}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.5a2.5 2.5 0 1 1 3 2.45V14M12 17h.01" />
      </svg>
    )}
  </button>
);
