import * as React from 'react';
import type { ReactNode } from 'react';
import { useAppShell } from '../AppShell/AppShell';

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

export interface SidebarProps {
  label?: string;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const Sidebar = ({ label = 'Main', header, footer, children, className }: SidebarProps) => (
  <nav
    aria-label={label}
    className={joinClasses('h-full flex flex-col gap-1 px-2.5 py-3 overflow-y-auto', className)}
  >
    {header ? <div className="px-2 pb-3">{header}</div> : null}
    <div className="flex-1 flex flex-col gap-4">{children}</div>
    {footer ? (
      <div className="mt-2 pt-2.5 px-0 border-t border-solid border-[var(--separator)] [border-top-width:var(--hairline)]">
        {footer}
      </div>
    ) : null}
  </nav>
);

export interface SidebarSectionProps {
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const SidebarSection = ({ title, children, className }: SidebarSectionProps) => {
  const titleId = React.useId();
  return (
    <div className={joinClasses('flex flex-col gap-0.5', className)}>
      {title ? (
        <h2
          id={titleId}
          className="m-0 px-2 pb-1 text-footnote font-semibold text-[var(--label-tertiary)]"
        >
          {title}
        </h2>
      ) : null}
      <ul
        role="list"
        aria-labelledby={title ? titleId : undefined}
        className="m-0 p-0 list-none flex flex-col gap-0.5"
      >
        {children}
      </ul>
    </div>
  );
};

export interface SidebarItemProps {
  icon?: ReactNode;
  href?: string;
  linkAs?: React.ElementType;
  onClick?: React.MouseEventHandler<HTMLElement>;
  current?: boolean;
  count?: number | string;
  accessory?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const SidebarItem = ({
  icon,
  href,
  linkAs: LinkElement = 'a',
  onClick,
  current = false,
  count,
  accessory,
  children,
  className,
}: SidebarItemProps) => {
  const shell = useAppShell();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onClick?.(event);
    if (shell?.isCompact) shell.closeSidebar();
  };
  const classes = joinClasses(
    'relative w-full flex items-center gap-2 min-h-[var(--control-sm)] px-2 rounded-[var(--corner-md)] border-0 text-left no-underline text-callout cursor-pointer',
    current
      ? 'bg-[var(--fill)] text-[var(--label)] font-semibold'
      : 'bg-transparent text-[var(--label)] hover:bg-[var(--fill-tertiary)]',
    'active:bg-[var(--fill-secondary)] focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--focus-color)]',
    className,
  );
  const content = (
    <>
      {icon ? (
        <span
          className="flex-none inline-flex w-[var(--icon-sm)] h-[var(--icon-sm)] text-[var(--tint)] [&>svg]:w-full [&>svg]:h-full"
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      <span className="flex-1 min-w-0 truncate">{children}</span>
      {count !== undefined && count !== null ? (
        <span className="flex-none text-footnote font-medium tabular-nums text-[var(--label-tertiary)]">
          <span className="sr-only">, </span>
          {count}
        </span>
      ) : null}
      {accessory}
    </>
  );
  return (
    <li>
      {href ? (
        <LinkElement
          href={href}
          className={classes}
          aria-current={current ? 'page' : undefined}
          onClick={handleClick}
        >
          {content}
        </LinkElement>
      ) : (
        <button
          type="button"
          className={classes}
          aria-current={current ? 'page' : undefined}
          onClick={handleClick}
        >
          {content}
        </button>
      )}
    </li>
  );
};
