import * as React from 'react';
import type { ReactNode } from 'react';
import { IconButton } from '../IconButton/IconButton';
import { useStoredBoolean } from '../internal/useStoredBoolean';

export type Appearance = 'system' | 'light' | 'dark';

export type SidebarCollapseMode = 'hide' | 'rail';

export interface AppShellContextValue {
  hasSidebar: boolean;
  isSidebarVisible: boolean;
  isCompact: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  sidebarId: string;
  collapseMode: SidebarCollapseMode;
  isCollapsed: boolean;
  isRail: boolean;
  toggleCollapsed: () => void;
}

const AppShellContext = React.createContext<AppShellContextValue | null>(null);

export const useAppShell = () => React.useContext(AppShellContext);

const WIDE_QUERY = '(min-width: 1024px)';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const focusableIn = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.closest('[hidden]'),
  );

const useIsWide = () => {
  const [isWide, setIsWide] = React.useState(true);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia(WIDE_QUERY);
    const update = () => setIsWide(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return isWide;
};

export interface AppShellProps {
  sidebar?: ReactNode;
  toolbar?: ReactNode;
  banner?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  mainId?: string;
  flush?: boolean;
  appearance?: Appearance;
  skipLinkLabel?: string;
  sidebarLabel?: string;
  sidebarToggleLabel?: string;
  sidebarCollapse?: SidebarCollapseMode;
  sidebarStorageKey?: string;
  defaultSidebarCollapsed?: boolean;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const PINNED_COLUMN =
  'w-[var(--sidebar-width)] border-r border-solid border-[var(--separator)] [border-right-width:var(--hairline)] bg-[var(--material-sidebar)] [backdrop-filter:var(--material-blur)] [-webkit-backdrop-filter:var(--material-blur)]';

const RESIZE_SETTLE_MS = 400;

const RESIZING_COLUMN =
  'overflow-hidden transition-[width,background-color] duration-[var(--duration-resize)] ease-[var(--ease-in-out)]';

const MenuGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M4 6.5h16M4 12h16M4 17.5h16" />
  </svg>
);

const RAIL_COLUMN =
  'w-[var(--sidebar-rail-width)] overflow-hidden bg-[var(--material-sidebar-opaque)] border-r border-solid border-[var(--separator)] [border-right-width:var(--hairline)]';

export const AppShell = ({
  sidebar,
  toolbar,
  banner,
  footer,
  children,
  mainId = 'main-content',
  flush = false,
  appearance = 'system',
  skipLinkLabel = 'Skip to content',
  sidebarLabel = 'Navigation',
  sidebarToggleLabel = 'Show sidebar',
  sidebarCollapse = 'hide',
  sidebarStorageKey,
  defaultSidebarCollapsed = false,
  className,
}: AppShellProps) => {
  const isWide = useIsWide();
  const [isCollapsed, setIsCollapsed] = useStoredBoolean(
    sidebarStorageKey,
    defaultSidebarCollapsed,
  );
  const [isOverlayOpen, setIsOverlayOpen] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);
  const sidebarId = React.useId();
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const hasSidebar = Boolean(sidebar);
  const isCompact = !isWide;
  const isRail = hasSidebar && isWide && sidebarCollapse === 'rail' && isCollapsed;

  React.useEffect(() => {
    if (isWide) setIsOverlayOpen(false);
  }, [isWide]);

  React.useEffect(() => {
    if (!isResizing) return;
    const settle = window.setTimeout(() => setIsResizing(false), RESIZE_SETTLE_MS);
    return () => window.clearTimeout(settle);
  }, [isResizing, isCollapsed]);

  React.useEffect(() => {
    const overlay = overlayRef.current;
    if (!isOverlayOpen || !overlay) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const [firstFocusable] = focusableIn(overlay);
    firstFocusable?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOverlayOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = focusableIn(overlay);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const isInside = overlay.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || !isInside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !isInside)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [isOverlayOpen]);

  const contextValue = React.useMemo<AppShellContextValue>(() => {
    const toggleCollapsed = () => {
      setIsResizing(sidebarCollapse === 'rail' && !isCompact);
      setIsCollapsed(!isCollapsed);
    };
    return {
      hasSidebar,
      isCompact,
      isSidebarVisible: isCompact ? isOverlayOpen : sidebarCollapse === 'rail' || !isCollapsed,
      toggleSidebar: () => (isCompact ? setIsOverlayOpen((open) => !open) : toggleCollapsed()),
      closeSidebar: () => setIsOverlayOpen(false),
      sidebarId,
      collapseMode: sidebarCollapse,
      isCollapsed,
      isRail,
      toggleCollapsed,
    };
  }, [
    hasSidebar,
    isCompact,
    isOverlayOpen,
    isCollapsed,
    setIsCollapsed,
    sidebarId,
    sidebarCollapse,
    isRail,
  ]);

  const showsColumn = hasSidebar && isWide && (isRail || !isCollapsed);

  const handleColumnTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && event.propertyName === 'width')
      setIsResizing(false);
  };

  return (
    <AppShellContext.Provider value={contextValue}>
      <div
        data-appearance={appearance}
        className={joinClasses(
          'min-h-screen flex bg-[var(--bg-grouped)] text-[var(--label)] text-body',
          className,
        )}
      >
        <a
          href={`#${mainId}`}
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[var(--layer-tooltip)] focus:px-3 focus:py-2 focus:rounded-[var(--corner-md)] focus:bg-[var(--bg-elevated)] focus:text-[var(--tint)] focus:shadow-[var(--shadow-float)] text-callout font-semibold"
        >
          {skipLinkLabel}
        </a>
        {showsColumn ? (
          <div
            id={sidebarId}
            data-sidebar-state={isRail ? 'rail' : 'pinned'}
            className={joinClasses(
              'flex-none sticky top-0 z-[var(--layer-sticky)] h-screen',
              isRail ? RAIL_COLUMN : PINNED_COLUMN,
              isResizing && RESIZING_COLUMN,
            )}
            onTransitionEnd={handleColumnTransitionEnd}
            onTransitionCancel={handleColumnTransitionEnd}
          >
            <div
              className={joinClasses('h-full', isResizing && !isRail && 'w-[var(--sidebar-width)]')}
            >
              {sidebar}
            </div>
          </div>
        ) : null}
        {hasSidebar && isCompact && isOverlayOpen ? (
          <div className="fixed inset-0 z-[var(--layer-sheet)]">
            <div
              className="absolute inset-0 bg-[var(--scrim)]"
              aria-hidden="true"
              onClick={() => setIsOverlayOpen(false)}
            />
            <div
              ref={overlayRef}
              id={sidebarId}
              data-propellant-layer-host=""
              role="dialog"
              aria-modal="true"
              aria-label={sidebarLabel}
              className="absolute inset-y-0 left-0 w-[min(320px,85vw)] bg-[var(--bg-elevated)] shadow-[var(--shadow-sheet)] pt-[env(safe-area-inset-top,0px)] pl-[env(safe-area-inset-left,0px)]"
            >
              {sidebar}
            </div>
          </div>
        ) : null}
        <div className="flex-1 min-w-0 flex flex-col">
          {banner}
          {toolbar}
          {hasSidebar && isCompact && !toolbar ? (
            <div className="flex items-center pt-3 px-[var(--page-margin)]">
              <IconButton
                variant="plain"
                aria-label={sidebarToggleLabel}
                aria-controls={sidebarId}
                aria-expanded={isOverlayOpen}
                onClick={contextValue.toggleSidebar}
              >
                <MenuGlyph />
              </IconButton>
            </div>
          ) : null}
          <main
            id={mainId}
            tabIndex={-1}
            className={joinClasses(
              'flex-1 min-w-0 flex flex-col outline-none',
              !flush && 'py-6 px-[var(--page-margin)] lg:py-8',
            )}
          >
            {children}
          </main>
          {footer}
        </div>
      </div>
    </AppShellContext.Provider>
  );
};
