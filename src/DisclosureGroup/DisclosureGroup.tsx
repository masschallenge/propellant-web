import * as React from 'react';
import type { ReactNode } from 'react';

export interface DisclosureGroupProps {
  title: ReactNode;
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trailing?: ReactNode;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

export const DisclosureGroup = ({
  title,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  trailing,
  className,
}: DisclosureGroupProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = open === undefined ? internalOpen : open;
  const regionId = React.useId();
  const toggle = () => {
    if (open === undefined) setInternalOpen(!isOpen);
    onOpenChange?.(!isOpen);
  };
  return (
    <div className={joinClasses('flex flex-col', className)}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={regionId}
          onClick={toggle}
          className="group flex flex-1 min-w-0 items-center gap-1.5 min-h-[var(--control-md)] px-1 -mx-1 border-0 bg-transparent text-left text-headline text-[var(--label)] cursor-pointer rounded-[var(--corner-md)] hover:bg-[var(--fill-tertiary)] focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-1 focus-visible:outline-[var(--focus-color)]"
        >
          <svg
            viewBox="0 0 24 24"
            className={joinClasses(
              'flex-none w-[var(--icon-sm)] h-[var(--icon-sm)] text-[var(--label-tertiary)] transition-transform duration-[var(--spring-snappy-duration)] ease-[var(--spring-snappy)]',
              isOpen && 'rotate-90',
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 5.5l6.5 6.5L9 18.5" />
          </svg>
          <span className="min-w-0 truncate">{title}</span>
        </button>
        {trailing ? <div className="flex-none flex items-center gap-2">{trailing}</div> : null}
      </div>
      <div id={regionId} hidden={!isOpen} className="pt-2 pl-[calc(var(--icon-sm)+6px)]">
        {children}
      </div>
    </div>
  );
};
