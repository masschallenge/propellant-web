import * as React from 'react';
import type { ReactNode } from 'react';
import { useAppShell } from '../AppShell/AppShell';

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

export type ToolbarSidebarToggleIcon = 'sidebar' | 'menu';

export interface ToolbarProps {
  leading?: ReactNode;
  title?: ReactNode;
  trailing?: ReactNode;
  accessory?: ReactNode;
  sticky?: boolean;
  sidebarToggleLabel?: string;
  sidebarToggleIcon?: ToolbarSidebarToggleIcon;
  className?: string;
}

const ToggleGlyph = ({ children }: { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="w-[var(--icon-lg)] h-[var(--icon-lg)]"
  >
    {children}
  </svg>
);

const TOGGLE_GLYPHS: Record<ToolbarSidebarToggleIcon, ReactNode> = {
  sidebar: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <path d="M9.5 4.5v15" />
    </>
  ),
  menu: <path d="M4 6.5h16M4 12h16M4 17.5h16" />,
};

const useScrollPaddingForStickyHeader = (
  headerRef: React.RefObject<HTMLElement | null>,
  isSticky: boolean,
) => {
  React.useEffect(() => {
    const header = headerRef.current;
    if (!isSticky || !header) return;
    const root = document.documentElement;
    const previousPadding = root.style.scrollPaddingTop;
    const reserveHeaderHeight = () => {
      root.style.scrollPaddingTop = `${header.offsetHeight}px`;
    };
    reserveHeaderHeight();
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(reserveHeaderHeight);
    observer?.observe(header);
    return () => {
      observer?.disconnect();
      root.style.scrollPaddingTop = previousPadding;
    };
  }, [headerRef, isSticky]);
};

export const Toolbar = ({
  leading,
  title,
  trailing,
  accessory,
  sticky = true,
  sidebarToggleLabel = 'Show sidebar',
  sidebarToggleIcon = 'sidebar',
  className,
}: ToolbarProps) => {
  const shell = useAppShell();
  const showsToggle = Boolean(
    shell?.hasSidebar && !(shell.collapseMode === 'rail' && !shell.isCompact),
  );
  const headerRef = React.useRef<HTMLElement>(null);
  useScrollPaddingForStickyHeader(headerRef, sticky);
  return (
    <header
      ref={headerRef}
      data-propellant-app-header=""
      className={joinClasses(
        'flex flex-col bg-[var(--material-bar)] [backdrop-filter:var(--material-blur)] [-webkit-backdrop-filter:var(--material-blur)]',
        'border-b border-solid border-[var(--separator)] [border-bottom-width:var(--hairline)]',
        'pt-[env(safe-area-inset-top,0px)]',
        sticky && 'sticky top-0 z-[var(--layer-sticky)]',
        className,
      )}
    >
      <div className="flex items-center gap-2 min-h-[var(--toolbar-height)] px-2.5 sm:px-4">
        {shell && showsToggle ? (
          <button
            type="button"
            aria-label={sidebarToggleLabel}
            aria-controls={shell.sidebarId}
            aria-expanded={shell.isSidebarVisible}
            onClick={shell.toggleSidebar}
            className="relative flex-none inline-flex items-center justify-center w-[var(--control-md)] h-[var(--control-md)] rounded-[var(--corner-md)] border-0 bg-transparent text-[var(--label-secondary)] cursor-pointer hover:bg-[var(--fill-tertiary)] active:bg-[var(--fill-secondary)] focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]"
          >
            <ToggleGlyph>{TOGGLE_GLYPHS[sidebarToggleIcon]}</ToggleGlyph>
          </button>
        ) : null}
        {leading ? <div className="flex items-center gap-2 min-w-0">{leading}</div> : null}
        {title ? (
          <div className="min-w-0 truncate text-headline text-[var(--label)]">{title}</div>
        ) : null}
        <div className="flex-1" />
        {trailing ? (
          <div className="flex items-center gap-1.5 sm:gap-2 flex-none">{trailing}</div>
        ) : null}
      </div>
      {accessory ? (
        <div className="flex items-center min-w-0 px-2.5 pb-2 sm:px-4">{accessory}</div>
      ) : null}
    </header>
  );
};
