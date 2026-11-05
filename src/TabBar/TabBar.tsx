import * as React from 'react';
import { EdgeFades, TabExtras, TabPanel, useTabList } from '../internal/tabList';
import type { TabItem, TabPanelProps } from '../internal/tabList';

export { TabPanel };
export type { TabItem, TabPanelProps };

export interface TabBarProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  vertical?: boolean;
  fullWidth?: boolean;
  controlsPanels?: boolean;
  id?: string;
  'aria-label'?: string;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

export const TabBar = ({
  items,
  value,
  defaultValue,
  onChange,
  vertical = false,
  fullWidth = false,
  controlsPanels = true,
  id,
  'aria-label': ariaLabel,
  className,
}: TabBarProps) => {
  const { currentId, edges, scrollerRef, updateEdges, handleBlur, tabProps } = useTabList({
    items,
    value,
    defaultValue,
    onChange,
    vertical,
    id,
  });

  const list = (
    <div
      ref={vertical ? undefined : scrollerRef}
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation={vertical ? 'vertical' : undefined}
      onScroll={vertical ? undefined : updateEdges}
      onBlur={handleBlur}
      className={joinClasses(
        vertical
          ? 'flex flex-col w-56 border-l border-solid border-[var(--separator)] [border-left-width:var(--hairline)]'
          : 'relative flex flex-nowrap gap-1 overflow-x-auto max-w-full border-b border-solid border-[var(--separator)] [border-bottom-width:var(--hairline)] propellant-scroll-hidden',
        vertical && className,
      )}
    >
      {items.map((item) => {
        const isSelected = item.id === currentId;
        return (
          <button
            key={item.id}
            {...tabProps(item, controlsPanels)}
            className={joinClasses(
              'relative inline-flex items-center gap-1.5 border-0 bg-transparent cursor-pointer whitespace-nowrap text-callout',
              vertical
                ? 'justify-start w-full min-h-[var(--row-dense)] px-3'
                : 'justify-center min-h-[var(--row)] px-3 shrink-0',
              fullWidth && !vertical && 'flex-1',
              isSelected
                ? "font-semibold text-[var(--label)] after:content-[''] after:absolute after:bg-[var(--tint)] after:rounded-[var(--corner-capsule)]"
                : 'font-medium text-[var(--label-secondary)] hover:text-[var(--label)]',
              isSelected &&
                (vertical
                  ? 'after:-left-px after:top-1.5 after:bottom-1.5 after:w-0.5'
                  : 'after:left-2 after:right-2 after:-bottom-px after:h-0.5'),
              'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-[var(--focus-color)] focus-visible:rounded-[var(--corner-md)]',
              'disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed',
            )}
          >
            {item.icon ? (
              <span aria-hidden="true" className="inline-flex shrink-0 [&>svg]:size-4">
                {item.icon}
              </span>
            ) : null}
            {item.label}
            <TabExtras item={item} />
          </button>
        );
      })}
    </div>
  );

  if (vertical) return list;
  return (
    <div className={joinClasses('relative w-full max-w-full', className)}>
      {list}
      <EdgeFades edges={edges} color="var(--bg-grouped)" />
    </div>
  );
};
