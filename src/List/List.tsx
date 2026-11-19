import * as React from 'react';
import type { ReactNode } from 'react';
import { imageFitClass } from '../internal/imageFit';
import { IconTile } from '../IconTile/IconTile';
import type { IconTileTone } from '../IconTile/IconTile';
import { Avatar } from '../Avatar/Avatar';
import type { AvatarTone } from '../Avatar/Avatar';

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

export type ListDensity = 'regular' | 'dense' | 'roomy';

export type ListSectionHeadingProps = Omit<React.ComponentPropsWithRef<'h2'>, 'children' | 'id'>;

export interface ListSectionProps extends Omit<React.ComponentPropsWithoutRef<'section'>, 'title'> {
  title?: ReactNode;
  titleAs?: 'h2' | 'h3' | 'h4';
  headingProps?: ListSectionHeadingProps;
  footer?: ReactNode;
  trailing?: ReactNode;
  density?: ListDensity;
  framed?: boolean;
  children?: ReactNode;
}

const ListDensityContext = React.createContext<ListDensity>('regular');

export const ListSection = ({
  title,
  titleAs: TitleTag = 'h3',
  headingProps,
  footer,
  trailing,
  density = 'regular',
  framed = false,
  className,
  children,
  ...rest
}: ListSectionProps) => {
  const titleId = React.useId();
  const layout = framed ? FRAMED_SECTION : INSET_SECTION;
  const header =
    title || trailing ? (
      <div className={layout.header}>
        {title ? (
          <TitleTag
            {...headingProps}
            id={titleId}
            className={joinClasses(layout.title, headingProps?.className)}
          >
            {title}
          </TitleTag>
        ) : (
          <span />
        )}
        {trailing ? <div className="flex-none flex items-center gap-2">{trailing}</div> : null}
      </div>
    ) : null;
  const list = (
    <ListDensityContext.Provider value={density}>
      <ul role="list" className={layout.list}>
        {children}
      </ul>
    </ListDensityContext.Provider>
  );
  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      className={joinClasses('flex flex-col gap-2', className)}
      {...rest}
    >
      {framed ? (
        <div className="relative bg-[var(--bg)] rounded-[var(--corner-lg)] overflow-hidden after:content-[''] after:absolute after:inset-0 after:z-[2] after:rounded-[inherit] after:pointer-events-none after:shadow-[inset_0_0_0_var(--hairline)_var(--separator)]">
          {header}
          {list}
        </div>
      ) : (
        <>
          {header}
          {list}
        </>
      )}
      {footer ? (
        <div className="px-4 text-footnote text-[var(--label-tertiary)]">{footer}</div>
      ) : null}
    </section>
  );
};

const INSET_SECTION = {
  header: 'flex items-end justify-between gap-3 px-4',
  title: 'm-0 text-headline text-[var(--label)]',
  list: 'm-0 p-0 list-none bg-[var(--bg)] rounded-[var(--corner-lg)] overflow-hidden',
};

const FRAMED_SECTION = {
  header:
    'flex items-center justify-between gap-3 px-3.5 py-2.5 bg-[var(--bg-secondary)] border-0 border-b border-solid border-b-[var(--separator)]',
  title: 'm-0 text-subheadline font-semibold text-[var(--label-secondary)]',
  list: 'm-0 p-0 list-none',
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
  avatar?: never;
}

export interface ListRowTile {
  icon: ReactNode;
  tone?: IconTileTone;
}

export interface ListRowTileMedia {
  tile: ListRowTile;
  src?: never;
  avatar?: never;
}

export type ListRowAvatarSize = 'md' | 'compact';

export interface ListRowAvatar {
  initials?: string;
  src?: string;
  alt?: string;
  tone?: AvatarTone;
  size?: ListRowAvatarSize;
  autoCrop?: boolean;
}

export interface ListRowAvatarMedia {
  avatar: ListRowAvatar;
  src?: never;
  tile?: never;
}

export type ListRowMedia = ListRowImageMedia | ListRowTileMedia | ListRowAvatarMedia;

export type ListRowSubtitlePosition = 'below' | 'inline';

export type ListRowTitleEmphasis = 'default' | 'strong';

export type ListRowValueStyle = 'default' | 'subheadline' | 'callout';

export interface ListRowProps extends Omit<RowElementProps, 'children' | 'media'> {
  title: ReactNode;
  titleEmphasis?: ListRowTitleEmphasis;
  subtitle?: ReactNode;
  subtitlePosition?: ListRowSubtitlePosition;
  value?: ReactNode;
  valueStyle?: ListRowValueStyle;
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

const ChevronIcon = ({ tone = 'text-[var(--label-quaternary)]' }: { tone?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={joinClasses('w-[14px] h-[14px] flex-none', tone)}
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

type RowLead = 'none' | 'icon' | 'logo' | 'squircle' | 'tile' | 'avatar-md' | 'avatar-compact';

const STANDARD_INSETS: Record<RowLead, string> = {
  none: '[--row-inset:16px]',
  icon: '[--row-inset:calc(var(--icon-md)+28px)]',
  logo: '[--row-inset:calc(64px+28px)]',
  squircle: '[--row-inset:calc(var(--avatar-md)+28px)]',
  tile: '[--row-inset:calc(var(--avatar-md)+28px)]',
  'avatar-md': '[--row-inset:calc(var(--avatar-md)+28px)]',
  'avatar-compact': '[--row-inset:calc(var(--avatar-compact)+28px)]',
};

const ROOMY_INSETS: Record<RowLead, string> = {
  none: '[--row-inset:var(--space-5)]',
  icon: '[--row-inset:calc(var(--icon-md)+var(--space-5)+var(--space-3-5))]',
  logo: '[--row-inset:calc(64px+var(--space-5)+var(--space-3-5))]',
  squircle: '[--row-inset:calc(var(--avatar-md)+var(--space-5)+var(--space-3-5))]',
  tile: '[--row-inset:calc(var(--avatar-md)+var(--space-5)+var(--space-3-5))]',
  'avatar-md': '[--row-inset:calc(var(--avatar-md)+var(--space-5)+var(--space-3-5))]',
  'avatar-compact': '[--row-inset:calc(var(--avatar-compact)+var(--space-5)+var(--space-3-5))]',
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

const VALUE_STYLES: Record<ListRowValueStyle, string> = {
  default: 'text-body text-[var(--label-tertiary)]',
  subheadline: 'text-subheadline text-[var(--label-secondary)]',
  callout: 'text-callout text-[var(--label)]',
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

const RowAvatar = ({ avatar }: { avatar: ListRowAvatar }) => (
  <Avatar
    initials={avatar.initials}
    src={avatar.src}
    alt={avatar.alt}
    tone={avatar.tone}
    size={avatar.size ?? 'md'}
    autoCrop={avatar.autoCrop}
  />
);

const RowMedia = ({ media }: { media: ListRowMedia }) => {
  if (media.avatar) return <RowAvatar avatar={media.avatar} />;
  if (media.tile) return <IconTile icon={media.tile.icon} tone={media.tile.tone} />;
  return <RowImage media={media} />;
};

const mediaLead = (media: ListRowMedia): RowLead => {
  if (media.avatar) return `avatar-${media.avatar.size ?? 'md'}`;
  if (media.tile) return 'tile';
  return media.shape ?? 'logo';
};

const SUBTITLE_LAYOUTS: Record<
  ListRowSubtitlePosition,
  { text: string; title: string; subtitle: string }
> = {
  below: {
    text: 'flex-1 min-w-0 flex flex-col',
    title: '',
    subtitle: 'text-subheadline text-[var(--label-secondary)]',
  },
  inline: {
    text: 'flex-1 min-w-0 flex items-baseline gap-2',
    title: 'min-w-0 truncate',
    subtitle: 'min-w-0 truncate text-subheadline text-[var(--label-tertiary)]',
  },
};

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
  subtitlePosition = 'below',
  value,
  valueStyle = 'default',
  icon,
  media,
  accessory,
  href,
  openHref,
  openLabel,
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
  const subtitleLayout = SUBTITLE_LAYOUTS[subtitlePosition];
  const titleId = React.useId();
  const openTextId = React.useId();
  const isAction = Boolean(href || onClick);
  const hasOpenLink = Boolean(openHref) && !isAction;
  const hasChevron =
    !hasOpenLink && (showChevron ?? Boolean(href || (onClick && !destructive && !selected)));

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
      <span className={subtitleLayout.text}>
        <span
          id={titleId}
          className={joinClasses(
            subtitleLayout.title,
            TITLE_EMPHASIS[titleEmphasis],
            destructive ? 'text-[var(--critical)]' : 'text-[var(--label)]',
            destructive && !subtitle && !value && !accessory && 'text-center',
          )}
        >
          {title}
        </span>
        {subtitle ? <span className={subtitleLayout.subtitle}>{subtitle}</span> : null}
      </span>
      {value !== undefined && value !== null ? (
        <span
          className={joinClasses(
            'flex-none max-w-[50%] truncate tabular-nums',
            VALUE_STYLES[valueStyle],
          )}
        >
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
      {hasOpenLink ? (
        <LinkElement
          href={openHref}
          aria-label={openLabel}
          aria-labelledby={openLabel ? undefined : `${openTextId} ${titleId}`}
          className="flex-none inline-flex items-center justify-center min-w-[var(--control-sm)] min-h-[var(--control-sm)] -me-[calc((var(--control-sm)-14px)/2)] rounded-[var(--corner-sm)] no-underline focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-[var(--focus-color)]"
        >
          {openLabel ? null : (
            <span id={openTextId} className="sr-only">
              Open
            </span>
          )}
          <ChevronIcon tone="text-[var(--label-tertiary)]" />
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
