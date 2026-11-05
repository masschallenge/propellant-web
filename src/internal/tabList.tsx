import * as React from 'react';
import type { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  meta?: string | number;
  badge?: string | number;
  ariaLabel?: string;
  disabled?: boolean;
}

export type TabListMode = 'tabs' | 'radio';

export interface TabListOptions {
  mode?: TabListMode;
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  vertical?: boolean;
  id?: string;
}

const REVEAL_PADDING = 12;

export const tabId = (listId: string, itemId: string) => `${listId}-tab-${itemId}`;
export const panelId = (listId: string, itemId: string) => `${listId}-panel-${itemId}`;

export const useTabList = ({
  mode = 'tabs',
  items,
  value,
  defaultValue,
  onChange,
  vertical = false,
  id,
}: TabListOptions) => {
  const generatedId = React.useId();
  const listId = id || generatedId;
  const [internalValue, setInternalValue] = React.useState(defaultValue || items[0]?.id);
  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const [edges, setEdges] = React.useState({ start: false, end: false });
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const currentId = value === undefined ? internalValue : value;
  const currentRef = React.useRef(currentId);
  currentRef.current = currentId;
  const rovingId = focusedId || currentId;

  const select = (nextId: string) => {
    if (value === undefined) setInternalValue(nextId);
    onChange?.(nextId);
  };

  const reveal = React.useCallback(
    (element: HTMLElement | null | undefined) => {
      const scroller = scrollerRef.current;
      if (!element || !scroller || vertical) return;
      if (element.offsetLeft < scroller.scrollLeft + REVEAL_PADDING) {
        scroller.scrollLeft = Math.max(0, element.offsetLeft - REVEAL_PADDING);
      } else if (
        element.offsetLeft + element.offsetWidth >
        scroller.scrollLeft + scroller.clientWidth - REVEAL_PADDING
      ) {
        scroller.scrollLeft =
          element.offsetLeft + element.offsetWidth - scroller.clientWidth + REVEAL_PADDING;
      }
    },
    [vertical],
  );

  const updateEdges = React.useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const overflows = scroller.scrollWidth > scroller.clientWidth + 1;
    const start = overflows && scroller.scrollLeft > 1;
    const end = overflows && scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1;
    setEdges((previous) =>
      previous.start === start && previous.end === end ? previous : { start, end },
    );
  }, []);

  React.useEffect(() => {
    if (vertical) return;
    reveal(tabRefs.current[currentId ?? '']);
    updateEdges();
    const scroller = scrollerRef.current;
    if (!scroller || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      updateEdges();
      reveal(tabRefs.current[currentRef.current ?? '']);
    });
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [currentId, vertical, items.length, reveal, updateEdges]);

  const enabledIds = items.filter((item) => !item.disabled).map((item) => item.id);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const previousKeys = vertical ? ['ArrowUp', 'ArrowLeft'] : ['ArrowLeft'];
    const nextKeys = vertical ? ['ArrowDown', 'ArrowRight'] : ['ArrowRight'];
    const position = Math.max(0, enabledIds.indexOf(rovingId ?? ''));
    let target: string | null = null;
    if (nextKeys.includes(event.key)) target = enabledIds[(position + 1) % enabledIds.length];
    else if (previousKeys.includes(event.key)) {
      target = enabledIds[(position - 1 + enabledIds.length) % enabledIds.length];
    } else if (event.key === 'Home') target = enabledIds[0];
    else if (event.key === 'End') target = enabledIds[enabledIds.length - 1];
    if (!target) return;
    event.preventDefault();
    setFocusedId(target);
    if (mode === 'radio') select(target);
    const element = tabRefs.current[target];
    element?.focus();
    reveal(element);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusedId(null);
  };

  const tabProps = (item: TabItem, controlsPanels: boolean) => ({
    ref: (element: HTMLButtonElement | null) => {
      tabRefs.current[item.id] = element;
    },
    role: mode === 'radio' ? ('radio' as const) : ('tab' as const),
    type: 'button' as const,
    id: tabId(listId, item.id),
    'aria-selected': mode === 'tabs' ? item.id === currentId : undefined,
    'aria-checked': mode === 'radio' ? item.id === currentId : undefined,
    'aria-label': item.ariaLabel,
    'aria-controls': controlsPanels ? panelId(listId, item.id) : undefined,
    tabIndex: item.id === rovingId ? 0 : -1,
    disabled: item.disabled,
    onClick: () => {
      if (!item.disabled) select(item.id);
    },
    onKeyDown: handleKeyDown,
    onFocus: () => setFocusedId(item.id),
  });

  return {
    listId,
    currentId,
    edges,
    scrollerRef,
    tabRefs,
    updateEdges,
    handleBlur,
    tabProps,
  };
};

export interface TabPanelProps {
  tabsId: string;
  value: string;
  active?: boolean;
  className?: string;
  children?: ReactNode;
}

export const TabPanel = ({ tabsId, value, active = true, className, children }: TabPanelProps) => (
  <div
    role="tabpanel"
    id={panelId(tabsId, value)}
    aria-labelledby={tabId(tabsId, value)}
    tabIndex={0}
    hidden={!active}
    className={className}
  >
    {children}
  </div>
);

export const EdgeFades = ({
  edges,
  color,
}: {
  edges: { start: boolean; end: boolean };
  color: string;
}) => (
  <>
    {edges.start ? (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 z-[2] rounded-[inherit]"
        style={{ background: `linear-gradient(to right, ${color}, transparent)` }}
      />
    ) : null}
    {edges.end ? (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 z-[2] rounded-[inherit]"
        style={{ background: `linear-gradient(to left, ${color}, transparent)` }}
      />
    ) : null}
  </>
);

export const TabExtras = ({ item, isNarrow = false }: { item: TabItem; isNarrow?: boolean }) => (
  <>
    {item.meta !== undefined ? (
      <span className="inline-flex items-center h-[18px] px-1.5 rounded-[var(--corner-capsule)] text-caption tabular-nums bg-[var(--fill-secondary)] text-[var(--label-secondary)]">
        {item.meta}
      </span>
    ) : null}
    {item.badge !== undefined && isNarrow ? (
      <span className="inline-flex size-2 shrink-0 rounded-full bg-[var(--critical-solid)] sm:hidden">
        <span className="sr-only">{item.badge}</span>
      </span>
    ) : null}
    {item.badge !== undefined ? (
      <span
        className={
          (isNarrow ? 'hidden sm:inline-flex' : 'inline-flex') +
          ' items-center h-[18px] px-1.5 rounded-[var(--corner-capsule)] text-caption tabular-nums bg-[var(--critical-fill)] text-[var(--critical)]'
        }
      >
        {item.badge}
      </span>
    ) : null}
  </>
);
