import * as React from 'react';
import { imageFitClass } from '../internal/imageFit';

export interface Crumb {
  label: string;
  href?: string;
  onClick?: () => void;
  ellipsis?: boolean;
}

export interface BreadcrumbAccountOption {
  name: string;
  sub?: string;
  avatar?: string;
}

export interface BreadcrumbProps {
  items: Crumb[];
  separator?: 'chevron' | 'slash';
  variant?: 'plain' | 'line' | 'pill';
  homeHref?: string;
  org?: { label: string; href?: string; logo?: string };
  account?: BreadcrumbAccountOption[];
  activeAccount?: number;
  onAccountChange?: (index: number) => void;
  accountMenuOpen?: boolean;
  'aria-label'?: string;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const FOCUS_RING =
  'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]';

const HIT_AREA =
  "relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[max(100%,var(--hit-target))] before:h-[max(100%,var(--hit-target))]";

const PLAIN_LINK = joinClasses(
  'inline-flex items-center gap-1.5 min-h-[var(--control-sm)] border-0 bg-transparent no-underline rounded-[var(--corner-capsule)] font-[inherit] text-subheadline cursor-pointer hover:bg-[var(--fill-tertiary)] active:bg-[var(--fill-secondary)]',
  HIT_AREA,
  FOCUS_RING,
);

const ANCESTOR_LINK = joinClasses(PLAIN_LINK, 'px-2 text-[var(--tint)]');

const CURRENT_VARIANTS = {
  plain: 'px-2 font-semibold text-[var(--label)]',
  line: 'px-2 font-semibold text-[var(--label)] underline decoration-2 underline-offset-4',
  pill: 'px-3 rounded-[var(--corner-capsule)] bg-[var(--tint-fill)] font-semibold text-[var(--tint)]',
} as const;

const Glyph = ({ path, className }: { path: string; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={joinClasses('block flex-none', className)}
  >
    <path d={path} />
  </svg>
);

const CHEVRON_PATH = 'm9 6 6 6-6 6';
const HOME_PATH = 'M3 11l9-8 9 8M5 10v10h14V10';
const UPDOWN_PATH = 'M8 9l4-4 4 4M8 15l4 4 4-4';
const CHECK_PATH = 'M5 12.5l4.5 4.5L19 7.5';

export const Breadcrumb = ({
  items,
  separator = 'chevron',
  variant = 'plain',
  homeHref,
  org,
  account,
  activeAccount = 0,
  onAccountChange,
  accountMenuOpen,
  'aria-label': ariaLabel = 'Breadcrumb',
  className,
}: BreadcrumbProps) => {
  const [isMenuShown, setIsMenuShown] = React.useState(false);
  const [internalActive, setInternalActive] = React.useState(activeAccount);
  const accountAnchor = React.useRef<HTMLSpanElement>(null);
  const isControlled = accountMenuOpen !== undefined;
  const isMenuOpen = isControlled ? accountMenuOpen : isMenuShown;
  const activeIndex = onAccountChange ? activeAccount : internalActive;
  const activeOption = account?.[activeIndex];

  React.useEffect(() => {
    if (!isMenuOpen || isControlled) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (accountAnchor.current && !accountAnchor.current.contains(event.target as Node)) {
        setIsMenuShown(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuShown(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen, isControlled]);

  const chooseAccount = (index: number) => {
    if (onAccountChange) onAccountChange(index);
    else setInternalActive(index);
    if (!isControlled) setIsMenuShown(false);
  };

  const separatorMark = (
    <span className="inline-flex flex-none text-[var(--label-tertiary)]" aria-hidden="true">
      {separator === 'chevron' ? (
        <Glyph path={CHEVRON_PATH} className="w-3.5 h-3.5" />
      ) : (
        <span className="text-subheadline">/</span>
      )}
    </span>
  );

  const itemClass = 'inline-flex items-center gap-0.5';

  return (
    <nav aria-label={ariaLabel} className={joinClasses('flex', className)}>
      <ol className="list-none m-0 p-0 flex items-center flex-wrap gap-0.5">
        {org ? (
          <li className={itemClass}>
            <a
              href={org.href || '#'}
              className={joinClasses(PLAIN_LINK, 'pl-1 pr-2 font-semibold text-[var(--label)]')}
            >
              <span
                className="flex-none w-5 h-5 rounded-[var(--corner-sm)] bg-[var(--fill)] text-[var(--label-secondary)] inline-flex items-center justify-center text-caption font-semibold"
                aria-hidden="true"
              >
                {org.logo || org.label.slice(0, 2)}
              </span>
              {org.label}
            </a>
            {separatorMark}
          </li>
        ) : null}
        {account && account.length ? (
          <li className={itemClass}>
            <span className="relative inline-flex" ref={accountAnchor}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                onClick={() => {
                  if (!isControlled) setIsMenuShown(!isMenuShown);
                }}
                className={joinClasses(
                  'inline-flex items-center gap-1.5 min-h-[var(--control-sm)] pl-1 pr-2 border-0 rounded-[var(--corner-capsule)] bg-[var(--fill-secondary)] font-[inherit] text-subheadline font-medium text-[var(--label)] cursor-pointer hover:bg-[var(--fill)]',
                  !activeOption?.avatar && 'pl-3',
                  HIT_AREA,
                  FOCUS_RING,
                )}
              >
                {activeOption?.avatar ? (
                  <img
                    className={`flex-none w-5 h-5 rounded-full ${imageFitClass()} bg-[var(--bg-secondary)]`}
                    src={activeOption.avatar}
                    alt=""
                  />
                ) : null}
                {activeOption ? activeOption.name : ''}
                <Glyph
                  path={UPDOWN_PATH}
                  className="w-[var(--icon-sm)] h-[var(--icon-sm)] text-[var(--label-secondary)]"
                />
              </button>
              {isMenuOpen ? (
                <div
                  role="menu"
                  aria-label="Switch account"
                  className="absolute top-[calc(100%+var(--space-1))] left-0 z-[var(--layer-dropdown)] min-w-60 p-1 rounded-[var(--corner-lg)] bg-[var(--bg-elevated)] shadow-[var(--shadow-float)]"
                >
                  {account.map((option, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <div
                        key={`${option.name}-${index}`}
                        role="menuitemradio"
                        aria-checked={isActive}
                        tabIndex={0}
                        onClick={() => chooseAccount(index)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            chooseAccount(index);
                          }
                        }}
                        className="group flex items-center gap-2 min-h-[var(--control-sm)] px-2 py-1 rounded-[var(--corner-md)] cursor-pointer text-[var(--label)] outline-none hover:bg-[var(--tint)] hover:text-[var(--on-tint)] focus-visible:bg-[var(--tint)] focus-visible:text-[var(--on-tint)]"
                      >
                        <span className="flex-none inline-flex w-[var(--icon-sm)] h-[var(--icon-sm)]">
                          {isActive ? <Glyph path={CHECK_PATH} className="w-full h-full" /> : null}
                        </span>
                        {option.avatar ? (
                          <img
                            className={`flex-none w-7 h-7 rounded-full ${imageFitClass()} bg-[var(--bg-secondary)]`}
                            src={option.avatar}
                            alt=""
                          />
                        ) : null}
                        <span className="flex flex-col min-w-0">
                          <span className="text-body">{option.name}</span>
                          {option.sub ? (
                            <span className="text-footnote text-[var(--label-secondary)] group-hover:text-[var(--on-tint)] group-focus-visible:text-[var(--on-tint)]">
                              {option.sub}
                            </span>
                          ) : null}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </span>
            {separatorMark}
          </li>
        ) : null}
        {homeHref ? (
          <li className={itemClass}>
            <a
              href={homeHref}
              aria-label="Home"
              className={joinClasses(PLAIN_LINK, 'px-1.5 text-[var(--label-secondary)]')}
            >
              <Glyph path={HOME_PATH} className="w-[var(--icon-sm)] h-[var(--icon-sm)]" />
            </a>
            {separatorMark}
          </li>
        ) : null}
        {items.map((crumb, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={`${crumb.label}-${index}`}
              className={joinClasses(itemClass, 'min-w-0 max-w-full [overflow-wrap:anywhere]')}
            >
              {crumb.ellipsis ? (
                <button
                  type="button"
                  aria-label="Show hidden breadcrumbs"
                  className={ANCESTOR_LINK}
                >
                  …
                </button>
              ) : isLast ? (
                <span
                  aria-current="page"
                  className={joinClasses(
                    'inline-flex items-center min-h-[var(--control-sm)] text-subheadline',
                    CURRENT_VARIANTS[variant],
                  )}
                >
                  {crumb.label}
                </span>
              ) : crumb.onClick ? (
                <button type="button" onClick={crumb.onClick} className={ANCESTOR_LINK}>
                  {crumb.label}
                </button>
              ) : crumb.href ? (
                <a href={crumb.href} className={ANCESTOR_LINK}>
                  {crumb.label}
                </a>
              ) : (
                <span className="inline-flex items-center min-h-[var(--control-sm)] px-2 text-subheadline text-[var(--label-secondary)]">
                  {crumb.label}
                </span>
              )}
              {isLast ? null : separatorMark}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
