import * as React from 'react';
import type { ReactNode } from 'react';
import {
  ANCHORED_SECTION_CLASSES,
  ANCHORED_SEPARATOR_CLASSES,
  ANCHORED_SURFACE_CLASSES,
  AnchoredLayer,
  AnchoredSearchField,
  anchoredPanelStyle,
  useAnchoredPosition,
} from '../internal/anchoredLayer';
import { imageFitClass } from '../internal/imageFit';
import { Avatar } from '../Avatar/Avatar';

export interface MenuItem {
  separator?: boolean;
  section?: string;
  label?: string;
  icon?: ReactNode;
  avatar?: string;
  shortcut?: string;
  checkbox?: boolean;
  dot?: 'online' | 'offline';
  submenu?: MenuItem[];
  destructive?: boolean;
  danger?: boolean;
  disabled?: boolean;
  selected?: boolean;
  badge?: MenuItemBadge;
  href?: string;
  linkAs?: React.ElementType;
  onSelect?: () => void;
}

export interface MenuItemBadge {
  count: number;
  label?: string;
}

export interface MenuAccountBandAvatar {
  src?: string;
  initials?: string;
}

export interface MenuAccountBand {
  title: string;
  sub?: string;
  avatar?: MenuAccountBandAvatar;
}

export interface MenuProps {
  trigger: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  items: MenuItem[];
  align?: 'start' | 'end';
  search?: boolean;
  searchPlaceholder?: string;
  accountBand?: MenuAccountBand;
  className?: string;
}

const MENU_MAX_HEIGHT = 420;

const ITEM_SELECTOR = ':scope > li > [role^="menuitem"]:not(:disabled)';

type FocusTarget = 'first' | 'last' | null;

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const PANEL_CLASSES = `list-none m-0 p-1 min-w-[13.5rem] text-callout ${ANCHORED_SURFACE_CLASSES}`;

const ROW_BASE =
  'flex items-center gap-2 w-full min-h-[var(--control-sm)] px-2 py-1 rounded-[var(--corner-md)] border-0 bg-transparent text-left no-underline cursor-default font-[inherit] text-callout font-normal text-(--row-label) ' +
  'focus-visible:outline-none disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed';

const ROW_TONE = {
  standard:
    '[--row-label:var(--label)] [--row-accent:var(--label-secondary)] [--row-check:var(--tint)] [--row-box-edge:var(--tint)] ' +
    'not-disabled:hover:bg-[var(--tint)] not-disabled:focus-visible:bg-[var(--tint)] ' +
    'not-disabled:hover:[--row-label:var(--on-tint)] not-disabled:focus-visible:[--row-label:var(--on-tint)] ' +
    'not-disabled:hover:[--row-accent:var(--on-tint)] not-disabled:focus-visible:[--row-accent:var(--on-tint)] ' +
    'not-disabled:hover:[--row-check:var(--on-tint)] not-disabled:focus-visible:[--row-check:var(--on-tint)] ' +
    'not-disabled:hover:[--row-box-edge:var(--on-tint)] not-disabled:focus-visible:[--row-box-edge:var(--on-tint)]',
  destructive:
    '[--row-label:var(--critical)] [--row-accent:var(--critical)] [--row-check:var(--critical)] [--row-box-edge:var(--critical)] ' +
    'not-disabled:hover:bg-[var(--critical-solid)] not-disabled:focus-visible:bg-[var(--critical-solid)] ' +
    'not-disabled:hover:[--row-label:var(--on-critical)] not-disabled:focus-visible:[--row-label:var(--on-critical)] ' +
    'not-disabled:hover:[--row-accent:var(--on-critical)] not-disabled:focus-visible:[--row-accent:var(--on-critical)] ' +
    'not-disabled:hover:[--row-check:var(--on-critical)] not-disabled:focus-visible:[--row-check:var(--on-critical)] ' +
    'not-disabled:hover:[--row-box-edge:var(--on-critical)] not-disabled:focus-visible:[--row-box-edge:var(--on-critical)]',
};

const CheckGlyph = ({ className }: { className: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const MenuSeparator = () => <li role="separator" className={ANCHORED_SEPARATOR_CLASSES} />;

const MenuSection = ({ label }: { label: string }) => (
  <li role="presentation" className={ANCHORED_SECTION_CLASSES}>
    {label}
  </li>
);

interface MenuRowProps {
  item: MenuItem;
  onClose: () => void;
}

const menuItemRole = (item: MenuItem) => {
  if (item.checkbox) return 'menuitemcheckbox';
  return item.selected === undefined ? 'menuitem' : 'menuitemradio';
};

const MenuItemCount = ({ badge }: { badge: MenuItemBadge }) => (
  <>
    {' '}
    <span
      data-count={badge.count}
      className="flex-none box-border min-w-5 h-5 px-1.5 rounded-[var(--corner-capsule)] bg-[var(--critical-solid)] text-[var(--on-critical)] text-caption leading-5 font-bold text-center tabular-nums"
      aria-hidden="true"
    >
      {badge.count}
    </span>
    <span className="sr-only">{badge.label ?? `${badge.count} unread`}</span>
  </>
);

const MenuRow = ({ item, onClose }: MenuRowProps) => {
  const hasSubmenu = Boolean(item.submenu && item.submenu.length);
  const isDestructive = item.destructive ?? item.danger ?? false;
  const isLink = Boolean(item.href && !item.disabled && !hasSubmenu);
  const LinkElement = item.linkAs ?? 'a';
  const rowClasses = joinClasses(ROW_BASE, ROW_TONE[isDestructive ? 'destructive' : 'standard']);
  const ariaChecked =
    item.checkbox || item.selected !== undefined ? Boolean(item.selected) : undefined;

  const handleSelect = () => {
    if (item.disabled || hasSubmenu) return;
    item.onSelect?.();
    onClose();
  };

  const content = (
    <>
      {item.checkbox ? (
        <span
          aria-hidden="true"
          className={joinClasses(
            'flex-none flex items-center justify-center w-4 h-4 rounded-[var(--corner-sm)]',
            item.selected
              ? 'bg-[var(--tint)] text-[var(--on-tint)] shadow-[inset_0_0_0_1px_var(--row-box-edge)]'
              : 'bg-[var(--bg)] text-transparent shadow-[inset_0_0_0_1px_var(--control-border)]',
          )}
        >
          <CheckGlyph className="w-3 h-3" />
        </span>
      ) : null}
      {item.dot ? (
        <span
          aria-hidden="true"
          className={joinClasses(
            'flex-none w-2 h-2 rounded-full',
            item.dot === 'online' ? 'bg-[var(--success-solid)]' : 'bg-[var(--label-tertiary)]',
          )}
        />
      ) : null}
      {item.avatar ? (
        <img
          className={`flex-none w-[var(--icon-lg)] h-[var(--icon-lg)] rounded-full ${imageFitClass()} bg-[var(--bg-secondary)]`}
          src={item.avatar}
          alt=""
        />
      ) : null}
      {item.icon ? (
        <span
          className="flex-none flex items-center justify-center text-(--row-accent) [&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:block"
          aria-hidden="true"
        >
          {item.icon}
        </span>
      ) : null}
      <span className="flex-1 min-w-0 truncate">{item.label}</span>
      {item.badge && item.badge.count > 0 ? <MenuItemCount badge={item.badge} /> : null}
      {item.shortcut ? (
        <span className="flex-none tabular-nums text-(--row-accent)">{item.shortcut}</span>
      ) : null}
      {!item.checkbox && item.selected ? (
        <span className="flex-none flex text-(--row-check)" aria-hidden="true">
          <CheckGlyph className="w-[var(--icon-sm)] h-[var(--icon-sm)]" />
        </span>
      ) : null}
      {hasSubmenu ? (
        <span className="flex-none flex text-(--row-accent)" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            className="w-[var(--icon-sm)] h-[var(--icon-sm)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
        </span>
      ) : null}
    </>
  );

  return (
    <li role="none" className={hasSubmenu ? 'relative group/sub' : undefined}>
      {isLink ? (
        <LinkElement
          role={menuItemRole(item)}
          aria-checked={ariaChecked}
          href={item.href}
          onClick={handleSelect}
          className={rowClasses}
        >
          {content}
        </LinkElement>
      ) : (
        <button
          role={menuItemRole(item)}
          aria-checked={ariaChecked}
          aria-haspopup={hasSubmenu ? 'menu' : undefined}
          type="button"
          disabled={item.disabled}
          onClick={handleSelect}
          className={rowClasses}
        >
          {content}
        </button>
      )}
      {hasSubmenu ? (
        <ul
          role="menu"
          aria-label={item.label}
          className={joinClasses(
            PANEL_CLASSES,
            'absolute left-[calc(100%-4px)] -top-1 z-10 hidden group-hover/sub:block group-focus-within/sub:block',
          )}
        >
          <MenuEntries items={item.submenu ?? []} onClose={onClose} />
        </ul>
      ) : null}
    </li>
  );
};

const MenuEntries = ({ items, onClose }: { items: MenuItem[]; onClose: () => void }) => (
  <>
    {items.map((item, index) => {
      if (item.separator) return <MenuSeparator key={index} />;
      if (item.section) return <MenuSection key={index} label={item.section} />;
      return <MenuRow key={index} item={item} onClose={onClose} />;
    })}
  </>
);

export const Menu = ({
  trigger,
  items,
  align = 'start',
  search = false,
  searchPlaceholder = 'Search',
  accountBand,
  className,
}: MenuProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [initialFocus, setInitialFocus] = React.useState<FocusTarget>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const panelRef = React.useRef<HTMLUListElement | null>(null);
  const position = useAnchoredPosition(isOpen, wrapperRef, panelRef, align);

  const close = () => {
    setIsOpen(false);
    setQuery('');
  };

  const menuItems = () =>
    panelRef.current
      ? Array.from(panelRef.current.querySelectorAll<HTMLElement>(ITEM_SELECTOR))
      : [];

  const [layerHost, setLayerHost] = React.useState<Element | null>(null);

  const open = (target: FocusTarget) => {
    setLayerHost(wrapperRef.current?.closest('[data-propellant-layer-host]') ?? null);
    setInitialFocus(target);
    setIsOpen(true);
  };

  React.useEffect(() => {
    if (!isOpen || search || !initialFocus) return;
    const available = menuItems();
    const target = initialFocus === 'last' ? available[available.length - 1] : available[0];
    target?.focus();
  }, [isOpen, initialFocus, search]);

  const handlePanelKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const available = menuItems();
    if (!available.length) return;
    const currentIndex = available.indexOf(document.activeElement as HTMLElement);
    const focusAt = (index: number) => {
      event.preventDefault();
      available[(index + available.length) % available.length].focus();
    };
    if (event.key === 'ArrowDown') focusAt(currentIndex + 1);
    else if (event.key === 'ArrowUp') focusAt(currentIndex === -1 ? -1 : currentIndex - 1);
    else if (event.key === 'Home') focusAt(0);
    else if (event.key === 'End') focusAt(available.length - 1);
    else if (event.key === 'Tab') {
      event.preventDefault();
      closeToTrigger();
    }
  };

  const closeToTrigger = () => {
    close();
    const triggerElement = wrapperRef.current?.firstElementChild;
    if (triggerElement instanceof HTMLElement) triggerElement.focus();
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInside = wrapperRef.current?.contains(target) || panelRef.current?.contains(target);
      if (!isInside) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeToTrigger();
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleItems = normalizedQuery
    ? items.filter(
        (item) =>
          item.separator ||
          item.section ||
          (item.label || '').toLowerCase().includes(normalizedQuery),
      )
    : items;

  return (
    <div ref={wrapperRef} className={joinClasses('relative inline-flex', className)}>
      {React.cloneElement(trigger, {
        onClick: () => (isOpen ? close() : open('first')),
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
          event.preventDefault();
          open(event.key === 'ArrowDown' ? 'first' : 'last');
        },
        'aria-haspopup': 'menu',
        'aria-expanded': isOpen,
      })}
      {isOpen ? (
        <AnchoredLayer host={layerHost}>
          <ul
            ref={panelRef}
            role="menu"
            onKeyDown={handlePanelKeyDown}
            style={{
              ...anchoredPanelStyle(position, { capsHeight: false }),
              maxHeight: position ? Math.min(MENU_MAX_HEIGHT, position.available) : undefined,
            }}
            className={joinClasses(PANEL_CLASSES, 'overflow-auto')}
          >
            {accountBand ? (
              <>
                <li
                  role="presentation"
                  className={joinClasses(
                    'flex px-2 pb-2',
                    accountBand.avatar ? 'items-center gap-2.5 pt-2.5' : 'pt-1.5',
                  )}
                >
                  {accountBand.avatar ? (
                    <Avatar
                      src={accountBand.avatar.src}
                      initials={accountBand.avatar.initials}
                      size="md"
                    />
                  ) : null}
                  <span className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-callout font-semibold text-[var(--label)]">
                      {accountBand.title}
                    </span>
                    {accountBand.sub ? (
                      <span className="text-footnote text-[var(--label-secondary)]">
                        {accountBand.sub}
                      </span>
                    ) : null}
                  </span>
                </li>
                <MenuSeparator />
              </>
            ) : null}
            {search ? (
              <li role="presentation" className="px-1 pt-1 pb-1.5">
                <AnchoredSearchField
                  autoFocus
                  value={query}
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </li>
            ) : null}
            <MenuEntries items={visibleItems} onClose={closeToTrigger} />
          </ul>
        </AnchoredLayer>
      ) : null}
    </div>
  );
};
