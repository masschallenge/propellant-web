import * as React from 'react';
import type { ReactNode } from 'react';
import { imageFitClass } from '../internal/imageFit';
import { IconTile } from '../IconTile/IconTile';
import type { IconTileTone } from '../IconTile/IconTile';

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

export type ListDensity = 'regular' | 'dense' | 'roomy';

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

export type ListRowMediaShape = 'logo' | 'squircle';

export interface ListRowImageMedia {
  src: string;
  alt?: string;
  shape?: ListRowMediaShape;
  autoCrop?: boolean;
  tile?: never;
}

export interface ListRowTile {
  icon: ReactNode;
  tone?: IconTileTone;
}

export interface ListRowTileMedia {
  tile: ListRowTile;
  src?: never;
}

export type ListRowMedia = ListRowImageMedia | ListRowTileMedia;

export type ListRowTitleEmphasis = 'default' | 'strong';

export interface ListRowProps extends Omit<RowElementProps, 'children' | 'media'> {
  title: ReactNode;
  titleEmphasis?: ListRowTitleEmphasis;
  subtitle?: ReactNode;
  value?: ReactNode;
  icon?: ReactNode;
  media?: ListRowMedia;
  accessory?: ReactNode;
  href?: string;
  openHref?: string;
  openLabel?: string;
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

const MEDIA_SHAPES: Record<ListRowMediaShape, string> = {
  logo: 'w-16 h-9.5 rounded-[var(--corner-thumbnail)] shadow-[0_0_0_1px_var(--separator)]',
  squircle: 'w-[var(--avatar-md)] h-[var(--avatar-md)] rounded-[var(--corner-tile)]',
};

type RowLead = 'none' | 'icon' | 'logo' | 'squircle' | 'tile';

const STANDARD_INSETS: Record<RowLead, string> = {
  none: '[--row-inset:16px]',
  icon: '[--row-inset:calc(var(--icon-md)+28px)]',
  logo: '[--row-inset:calc(64px+28px)]',
  squircle: '[--row-inset:calc(var(--avatar-md)+28px)]',
  tile: '[--row-inset:calc(var(--avatar-md)+28px)]',
};

const ROOMY_INSETS: Record<RowLead, string> = {
  none: '[--row-inset:var(--space-5)]',
  icon: '[--row-inset:calc(var(--icon-md)+var(--space-5)+var(--space-3-5))]',
  logo: '[--row-inset:calc(64px+var(--space-5)+var(--space-3-5))]',
  squircle: '[--row-inset:calc(var(--avatar-md)+var(--space-5)+var(--space-3-5))]',
  tile: '[--row-inset:calc(var(--avatar-md)+var(--space-5)+var(--space-3-5))]',
};

const DENSITY_LAYOUTS: Record<ListDensity, { row: string; insets: Record<RowLead, string> }> = {
  regular: { row: 'min-h-[var(--row)] gap-3 px-4 py-2.5', insets: STANDARD_INSETS },
  dense: { row: 'min-h-[var(--row-dense)] gap-3 px-4 py-1.5', insets: STANDARD_INSETS },
  roomy: {
    row: 'min-h-[var(--row)] gap-[var(--space-3-5)] px-[var(--space-5)] py-[var(--space-3-5)]',
    insets: ROOMY_INSETS,
  },
};

const TITLE_EMPHASIS: Record<ListRowTitleEmphasis, string> = {
  default: 'text-body',
  strong: 'text-callout font-semibold',
};

const RowImage = ({ media }: { media: ListRowImageMedia }) => {
  const shape = media.shape ?? 'logo';
  const autoCrop = media.autoCrop ?? false;
  return (
    <img
      src={media.src}
      alt={media.alt ?? ''}
      data-shape={shape}
      className={joinClasses(
        'flex-none block',
        MEDIA_SHAPES[shape],
        imageFitClass(autoCrop),
        !autoCrop && 'bg-[var(--bg-secondary)]',
      )}
    />
  );
};

const RowMedia = ({ media }: { media: ListRowMedia }) =>
  media.tile ? (
    <IconTile icon={media.tile.icon} tone={media.tile.tone} />
  ) : (
    <RowImage media={media} />
  );

const mediaLead = (media: ListRowMedia): RowLead => (media.tile ? 'tile' : (media.shape ?? 'logo'));

const rowLead = (media: ListRowMedia | undefined, icon: ReactNode): RowLead => {
  if (media) return mediaLead(media);
  return icon ? 'icon' : 'none';
};

const labelAccessory = (accessory: ReactNode, titleId: string) => {
  if (!React.isValidElement<Record<string, unknown>>(accessory)) return accessory;
  if (accessory.type === React.Fragment) return accessory;
  const accessoryProps = accessory.props;
  if (accessoryProps['aria-label'] || accessoryProps['aria-labelledby'] || accessoryProps.label) {
    return accessory;
  }
  return React.cloneElement(accessory, { 'aria-labelledby': titleId });
};

export const ListRow = ({
  title,
  titleEmphasis = 'default',
  subtitle,
  value,
  icon,
  media,
  accessory,
  href,
  openHref,
  openLabel = 'Open',
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
    'relative flex w-full items-center text-left border-0 bg-transparent no-underline',
    DENSITY_LAYOUTS[density].row,
    isAction &&
      'cursor-pointer hover:bg-[var(--fill-tertiary)] active:bg-[var(--fill-secondary)] focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-[var(--focus-color)]',
    disabled && 'opacity-[var(--opacity-disabled)] cursor-not-allowed pointer-events-none',
    className,
  );

  const content = (
    <>
      {media ? <RowMedia media={media} /> : null}
      {icon && !media ? (
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
            TITLE_EMPHASIS[titleEmphasis],
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
        <span className="flex-none inline-flex items-center gap-2">
          {labelAccessory(accessory, titleId)}
        </span>
      ) : null}
      {selected ? <CheckIcon /> : null}
      {hasChevron ? <ChevronIcon /> : null}
      {openHref && !isAction ? (
        <LinkElement
          href={openHref}
          aria-label={openLabel}
          className="flex-none inline-flex items-center justify-center min-w-[var(--control-sm)] min-h-[var(--control-sm)] -me-[calc((var(--control-sm)-14px)/2)] rounded-[var(--corner-sm)] no-underline focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-[var(--focus-color)]"
        >
          <ChevronIcon />
        </LinkElement>
      ) : null}
    </>
  );

  const itemClasses = joinClasses(
    "relative [&+&]:before:content-[''] [&+&]:before:absolute [&+&]:before:top-0 [&+&]:before:right-0 [&+&]:before:left-(--row-inset) [&+&]:before:h-[var(--hairline)] [&+&]:before:bg-[var(--separator)] [&+&]:before:z-[1]",
    DENSITY_LAYOUTS[density].insets[rowLead(media, icon)],
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
