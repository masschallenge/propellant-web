import * as React from 'react';
import type { ReactNode } from 'react';
import { Button } from '../Button/Button';
import type { ButtonSize, ButtonVariant } from '../Button/Button';

const EDGE_GAP = 16;
const TRIGGER_GAP = 4;
const ASSUMED_PANEL_HEIGHT = 280;
const FLIP_THRESHOLD = 220;

export interface PopoverProps {
  label: ReactNode;
  panelLabel: string;
  iconTrailing?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  inline?: boolean;
  truncateLabel?: boolean;
  align?: 'start' | 'end';
  defaultOpen?: boolean;
  className?: string;
  children?: ReactNode;
}

interface PanelPlacement {
  maxWidth: number;
  maxHeight: number;
  left: number;
  top: number;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const PANEL_CLASSES = joinClasses(
  'flex flex-col gap-2 p-4 overflow-y-auto text-callout text-[var(--label)]',
  'w-[min(20rem,calc(100vw-2rem))]',
  'rounded-[var(--corner-lg)] bg-[var(--bg-elevated)] shadow-[var(--shadow-float)]',
);

export const Popover = ({
  label,
  panelLabel,
  iconTrailing,
  variant = 'plain',
  size = 'md',
  inline = variant === 'plain',
  truncateLabel = false,
  align = 'start',
  defaultOpen = false,
  className,
  children,
}: PopoverProps) => {
  const panelId = React.useId();
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [placement, setPlacement] = React.useState<PanelPlacement | null>(null);

  React.useLayoutEffect(() => {
    if (!isOpen) return;
    const measure = () => {
      if (!wrapperRef.current) return;
      const triggerRect = wrapperRef.current.getBoundingClientRect();
      const availableWidth =
        align === 'end'
          ? triggerRect.right - EDGE_GAP
          : window.innerWidth - triggerRect.left - EDGE_GAP;
      const panelHeight = panelRef.current?.offsetHeight || ASSUMED_PANEL_HEIGHT;
      const panelWidth = panelRef.current?.offsetWidth || 0;
      const roomBelow = window.innerHeight - triggerRect.bottom - EDGE_GAP;
      const roomAbove = triggerRect.top - EDGE_GAP;
      const shouldFlip = roomBelow < Math.min(panelHeight, FLIP_THRESHOLD) && roomAbove > roomBelow;
      const alignedLeft = align === 'end' ? triggerRect.right - panelWidth : triggerRect.left;
      const left = Math.max(
        EDGE_GAP,
        Math.min(alignedLeft, window.innerWidth - panelWidth - EDGE_GAP),
      );
      const top = shouldFlip
        ? Math.max(EDGE_GAP, triggerRect.top - TRIGGER_GAP - panelHeight)
        : triggerRect.bottom + TRIGGER_GAP;
      setPlacement({
        maxWidth: Math.max(0, Math.floor(availableWidth)),
        maxHeight: Math.max(0, Math.floor(shouldFlip ? roomAbove : roomBelow)),
        left: Math.round(left),
        top: Math.round(top),
      });
    };
    measure();
    const frame = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [isOpen, align]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      setIsOpen(false);
      wrapperRef.current?.querySelector('button')?.focus();
    };
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const isInsideTrigger = wrapperRef.current?.contains(target);
      const isInsidePanel = panelRef.current?.contains(target);
      if (!isInsideTrigger && !isInsidePanel) setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [isOpen]);

  return (
    <div
      ref={wrapperRef}
      className={joinClasses(
        'relative inline-flex min-w-0',
        truncateLabel && 'max-w-full',
        className,
      )}
    >
      <Button
        type="button"
        variant={variant}
        size={size}
        inline={inline}
        iconTrailing={iconTrailing}
        truncate={truncateLabel}
        title={truncateLabel && typeof label === 'string' ? label : undefined}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
      </Button>
      {isOpen ? (
        <div
          ref={panelRef}
          id={panelId}
          role="group"
          aria-label={panelLabel}
          data-propellant-layer-host=""
          style={{
            position: 'fixed',
            zIndex: 'var(--layer-overlay)',
            left: `${placement ? placement.left : -9999}px`,
            top: `${placement ? placement.top : 0}px`,
            maxWidth: placement ? `${placement.maxWidth}px` : undefined,
            maxHeight: placement ? `${placement.maxHeight}px` : undefined,
            visibility: placement ? 'visible' : 'hidden',
          }}
          className={PANEL_CLASSES}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};
