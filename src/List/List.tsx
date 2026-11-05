import * as React from 'react';
import type { ReactNode } from 'react';

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

export type ListDensity = 'regular' | 'dense';

export interface ListSectionProps extends Omit<React.ComponentPropsWithoutRef<'section'>, 'title'> {
  title?: ReactNode;
  titleAs?: 'h2' | 'h3' | 'h4';
  footer?: ReactNode;
  trailing?: ReactNode;
  density?: ListDensity;
  children?: ReactNode;
}

const ListDensityContext = React.createContext<ListDensity>('regular');

export const ListSection = ({
  title,
  titleAs: TitleTag = 'h3',
  footer,
  trailing,
  density = 'regular',
  className,
  children,
  ...rest
}: ListSectionProps) => {
  const titleId = React.useId();
  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      className={joinClasses('flex flex-col gap-2', className)}
      {...rest}
    >
      {title || trailing ? (
        <div className="flex items-end justify-between gap-3 px-4">
          {title ? (
            <TitleTag id={titleId} className="m-0 text-headline text-[var(--label)]">
              {title}
            </TitleTag>
          ) : (
            <span />
          )}
          {trailing ? <div className="flex-none flex items-center gap-2">{trailing}</div> : null}
        </div>
      ) : null}
      <ListDensityContext.Provider value={density}>
        <ul
          role="list"
          className="m-0 p-0 list-none bg-[var(--bg)] rounded-[var(--corner-lg)] overflow-hidden"
        >
          {children}
        </ul>
      </ListDensityContext.Provider>
      {footer ? (
        <div className="px-4 text-footnote text-[var(--label-tertiary)]">{footer}</div>
      ) : null}
    </section>
  );
};

type RowElementProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'title' | 'value' | 'type'> &
  Omit<React.ComponentPropsWithoutRef<'a'>, 'title' | 'type'>;

export interface ListRowProps extends Omit<RowElementProps, 'children'> {
  title: ReactNode;
  subtitle?: ReactNode;
  value?: ReactNode;
  icon?: ReactNode;
  accessory?: ReactNode;
  href?: string;
  linkAs?: React.ElementType;
  onClick?: React.MouseEventHandler<HTMLElement>;
  selected?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  showChevron?: boolean;
}

const ChevronIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-[14px] h-[14px] flex-none text-[var(--label-quaternary)]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 5.5l6.5 6.5L9 18.5" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-[var(--icon-md)] h-[var(--icon-md)] flex-none text-[var(--tint)]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const labelAccessory = (accessory: ReactNode, titleId: string) => {
  if (!React.isValidElement<Record<string, unknown>>(accessory)) return accessory;
  const accessoryProps = accessory.props;
  if (accessoryProps['aria-label'] || accessoryProps['aria-labelledby'] || accessoryProps.label) {
    return accessory;
  }
  return React.cloneElement(accessory, { 'aria-labelledby': titleId });
};

export const ListRow = ({
  title,
  subtitle,
  value,
  icon,
  accessory,
  href,
  linkAs: LinkElement = 'a',
  onClick,
  selected = false,
  destructive = false,
  disabled = false,
  showChevron,
  className,
  ...rest
}: ListRowProps) => {
  const density = React.useContext(ListDensityContext);
  const titleId = React.useId();
  const isAction = Boolean(href || onClick);
  const hasChevron = showChevron ?? Boolean(href || (onClick && !destructive && !selected));

  const rowClasses = joinClasses(
    'relative flex w-full items-center gap-3 px-4 text-left border-0 bg-transparent no-underline',
    density === 'dense' ? 'min-h-[var(--row-dense)] py-1.5' : 'min-h-[var(--row)] py-2.5',
    isAction &&
      'cursor-pointer hover:bg-[var(--fill-tertiary)] active:bg-[var(--fill-secondary)] focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-[var(--focus-color)]',
    disabled && 'opacity-[var(--opacity-disabled)] cursor-not-allowed pointer-events-none',
    className,
  );

  const content = (
    <>
      {icon ? (
        <span
          className="flex-none inline-flex w-[var(--icon-md)] h-[var(--icon-md)] text-[var(--tint)] [&>svg]:w-full [&>svg]:h-full"
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      <span className="flex-1 min-w-0 flex flex-col">
        <span
          id={titleId}
          className={joinClasses(
            'text-body',
            destructive ? 'text-[var(--critical)]' : 'text-[var(--label)]',
            destructive && !subtitle && !value && !accessory && 'text-center',
          )}
        >
          {title}
        </span>
        {subtitle ? (
          <span className="text-subheadline text-[var(--label-secondary)]">{subtitle}</span>
        ) : null}
      </span>
      {value !== undefined && value !== null ? (
        <span className="flex-none max-w-[50%] truncate text-body text-[var(--label-tertiary)] tabular-nums">
          {value}
        </span>
      ) : null}
      {accessory ? (
        <span className="flex-none inline-flex items-center">
          {labelAccessory(accessory, titleId)}
        </span>
      ) : null}
      {selected ? <CheckIcon /> : null}
      {hasChevron ? <ChevronIcon /> : null}
    </>
  );

  const itemClasses = joinClasses(
    "relative [&+&]:before:content-[''] [&+&]:before:absolute [&+&]:before:top-0 [&+&]:before:right-0 [&+&]:before:left-(--row-inset) [&+&]:before:h-[var(--hairline)] [&+&]:before:bg-[var(--separator)] [&+&]:before:z-[1]",
    icon ? '[--row-inset:calc(var(--icon-md)+28px)]' : '[--row-inset:16px]',
  );

  let row: ReactNode;
  if (href && !disabled) {
    row = (
      <LinkElement
        href={href}
        className={rowClasses}
        aria-current={selected ? 'page' : undefined}
        onClick={onClick}
        {...rest}
      >
        {content}
      </LinkElement>
    );
  } else if (onClick) {
    row = (
      <button
        type="button"
        className={rowClasses}
        onClick={onClick}
        disabled={disabled}
        aria-pressed={selected || undefined}
        {...(rest as React.ComponentPropsWithoutRef<'button'>)}
      >
        {content}
      </button>
    );
  } else {
    row = (
      <div className={rowClasses} {...(rest as React.ComponentPropsWithoutRef<'div'>)}>
        {content}
      </div>
    );
  }

  return <li className={itemClasses}>{row}</li>;
};
