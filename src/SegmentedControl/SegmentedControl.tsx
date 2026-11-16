import * as React from 'react';
import { EdgeFades, TabExtras, useTabList } from '../internal/tabList';
import type { TabItem } from '../internal/tabList';

export type { TabItem };
export type SegmentedControlSize = 'sm' | 'md';

export interface SegmentedControlProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  size?: SegmentedControlSize;
  fullWidth?: boolean | 'narrow';
  controlsPanels?: boolean;
  id?: string;
  'aria-label'?: string;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const HEIGHTS: Record<SegmentedControlSize, string> = {
  sm: 'min-h-[calc(var(--control-sm)-4px)] px-3 text-subheadline',
  md: 'min-h-[calc(var(--control-md)-4px)] px-3.5 text-callout',
};

export const SegmentedControl = ({
  items,
  value,
  defaultValue,
  onChange,
  size = 'md',
  fullWidth = false,
  controlsPanels = false,
  id,
  'aria-label': ariaLabel,
  className,
}: SegmentedControlProps) => {
  const mode = controlsPanels ? 'tabs' : 'radio';
  const { currentId, edges, scrollerRef, tabRefs, updateEdges, handleBlur, tabProps } = useTabList({
    mode,
    items,
    value,
    defaultValue,
    onChange,
    id,
  });
  const [thumb, setThumb] = React.useState<{ left: number; width: number } | null>(null);
  const fillsAlways = fullWidth === true;
  const fillsNarrow = fullWidth === 'narrow';

  const measure = React.useCallback(() => {
    const selected = tabRefs.current[currentId ?? ''];
    if (!selected || !selected.offsetWidth) {
      setThumb(null);
      return;
    }
    setThumb((previous) =>
      previous && previous.left === selected.offsetLeft && previous.width === selected.offsetWidth
        ? previous
        : { left: selected.offsetLeft, width: selected.offsetWidth },
    );
  }, [currentId, tabRefs]);

  React.useLayoutEffect(() => {
    measure();
  }, [measure, items]);

  React.useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [measure, scrollerRef]);

  return (
    <div
      className={joinClasses(
        'relative max-w-full rounded-[var(--corner-capsule)]',
        fillsAlways
          ? 'block w-full'
          : fillsNarrow
            ? 'block w-full sm:inline-block sm:w-auto'
            : 'inline-block align-top',
        className,
      )}
    >
      <div
        ref={scrollerRef}
        role={mode === 'tabs' ? 'tablist' : 'radiogroup'}
        aria-label={ariaLabel}
        onScroll={updateEdges}
        onBlur={handleBlur}
        className={joinClasses(
          'relative isolate flex flex-nowrap overflow-x-auto max-w-full p-0.5 rounded-[var(--corner-capsule)] bg-[var(--fill-secondary)] propellant-scroll-hidden',
          (fillsAlways || fillsNarrow) && 'w-full',
          fillsNarrow && 'sm:w-auto',
        )}
      >
        {thumb ? (
          <span
            aria-hidden="true"
            className="absolute top-0.5 bottom-0.5 left-0 z-0 rounded-[var(--corner-capsule)] bg-[var(--control-thumb)] shadow-[var(--shadow-thumb)] transition-[transform,width] duration-[var(--spring-snappy-duration)] ease-[var(--spring-snappy)]"
            style={{ width: thumb.width, transform: `translateX(${thumb.left}px)` }}
          />
        ) : null}
        {items.map((item) => {
          const isSelected = item.id === currentId;
          return (
            <button
              key={item.id}
              {...tabProps(item, controlsPanels)}
              className={joinClasses(
                'relative z-[1] inline-flex items-center justify-center gap-1.5 border-0 bg-transparent cursor-pointer whitespace-nowrap rounded-[var(--corner-capsule)]',
                HEIGHTS[size],
                fillsAlways
                  ? 'flex-1 min-w-0'
                  : fillsNarrow
                    ? 'flex-1 min-w-0 sm:flex-none'
                    : 'shrink-0',
                isSelected
                  ? joinClasses(
                      'font-semibold text-[var(--label)]',
                      !thumb && 'bg-[var(--control-thumb)] shadow-[var(--shadow-thumb)]',
                    )
                  : 'font-medium text-[var(--label-secondary)] hover:text-[var(--label)]',
                'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-[var(--focus-color)]',
                'disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed',
              )}
            >
              {item.icon ? (
                <span
                  aria-hidden="true"
                  className={joinClasses(
                    fillsNarrow ? 'hidden sm:inline-flex' : 'inline-flex',
                    'shrink-0 [&>svg]:size-4',
                  )}
                >
                  {item.icon}
                </span>
              ) : null}
              {item.label}
              <TabExtras item={item} isNarrow={fillsNarrow} />
            </button>
          );
        })}
      </div>
      <EdgeFades edges={edges} color="var(--bg)" />
    </div>
  );
};
