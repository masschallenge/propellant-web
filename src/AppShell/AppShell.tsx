import * as React from 'react';
import type { ReactNode } from 'react';

export type Appearance = 'system' | 'light' | 'dark';

export interface AppShellContextValue {
  hasSidebar: boolean;
  isSidebarVisible: boolean;
  isCompact: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  sidebarId: string;
}

const AppShellContext = React.createContext<AppShellContextValue | null>(null);

export const useAppShell = () => React.useContext(AppShellContext);

const WIDE_QUERY = '(min-width: 1024px)';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

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
  className,
}: AppShellProps) => {
  const isWide = useIsWide();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = React.useState(false);
  const sidebarId = React.useId();
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const hasSidebar = Boolean(sidebar);
  const isCompact = !isWide;

  React.useEffect(() => {
    if (isWide) setIsOverlayOpen(false);
  }, [isWide]);

  React.useEffect(() => {
    if (!isOverlayOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const firstFocusable = overlayRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    firstFocusable?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOverlayOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !overlayRef.current) return;
      const focusable = Array.from(
        overlayRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const isInside = overlayRef.current.contains(document.activeElement);
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

  const contextValue = React.useMemo<AppShellContextValue>(
    () => ({
      hasSidebar,
      isCompact,
      isSidebarVisible: isCompact ? isOverlayOpen : !isCollapsed,
      toggleSidebar: () =>
        isCompact ? setIsOverlayOpen((open) => !open) : setIsCollapsed((collapsed) => !collapsed),
      closeSidebar: () => setIsOverlayOpen(false),
      sidebarId,
    }),
    [hasSidebar, isCompact, isOverlayOpen, isCollapsed, sidebarId],
  );

  const showInlineSidebar = hasSidebar && isWide && !isCollapsed;

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
        {showInlineSidebar ? (
          <div
            id={sidebarId}
            className="flex-none sticky top-0 h-screen w-[var(--sidebar-width)] border-r border-solid border-[var(--separator)] [border-right-width:var(--hairline)] bg-[var(--material-sidebar)] [backdrop-filter:var(--material-blur)] [-webkit-backdrop-filter:var(--material-blur)]"
          >
            {sidebar}
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
