import * as React from 'react';
import type { ReactNode } from 'react';
import { useAppShell } from '../AppShell/AppShell';
import { imageFitClass } from '../internal/imageFit';
import { RoleTag } from '../RoleTag/RoleTag';
import type { RoleTagProps } from '../RoleTag/RoleTag';

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

export type SidebarItemSize = 'sm' | 'md';

const ITEM_SIZES: Record<SidebarItemSize, string> = {
  sm: 'min-h-[var(--control-sm)]',
  md: 'min-h-[var(--control-md)]',
};

export type SidebarMarkerState = 'done' | 'now' | 'next';

export interface SidebarItemMarker {
  state: SidebarMarkerState;
  number?: number | string;
  label: string;
}

export interface SidebarItemMedia {
  src: string;
  alt: string;
}

export interface SidebarItemProps {
  icon?: ReactNode;
  marker?: SidebarItemMarker;
  media?: SidebarItemMedia;
  href?: string;
  linkAs?: React.ElementType;
  onClick?: React.MouseEventHandler<HTMLElement>;
  current?: boolean;
  count?: number | string;
  accessory?: ReactNode;
  size?: SidebarItemSize;
  subitems?: ReactNode;
  collapsible?: boolean;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  children?: ReactNode;
  className?: string;
}

interface SidebarLevel {
  depth: number;
  indent: string;
  isInset: boolean;
}

const TOP_INDENT = 'pl-2';
const STEP_INDENT = 'pl-6.5';
const ICON_LABEL_INDENT = 'pl-[calc(var(--space-2)+var(--icon-lg)+var(--space-2-5))]';
const LEAF_INDENT = 'pl-18';
const PROGRAM_INSET = 'pl-1.5';
const PROGRAM_ROW_INDENT = 'pl-0.5';
const PROGRAM_STEP_INDENT = 'pl-5';
const PROGRAM_LEAF_INDENT = 'pl-16.5';

const SidebarLevelContext = React.createContext<SidebarLevel>({
  depth: 0,
  indent: TOP_INDENT,
  isInset: false,
});

type LeadingKind = 'media' | 'marker' | 'icon' | null;

const leadingKindOf = (
  icon: ReactNode,
  marker: SidebarItemMarker | undefined,
  media: SidebarItemMedia | undefined,
): LeadingKind => {
  if (media) return 'media';
  if (marker) return 'marker';
  return icon ? 'icon' : null;
};

const rowIndentFor = (indent: string, isProgramRow: boolean) =>
  isProgramRow ? PROGRAM_ROW_INDENT : indent;

const childIndentFor = (
  depth: number,
  leadingKind: LeadingKind,
  isProgramRow: boolean,
  isInset: boolean,
) => {
  if (isProgramRow) return PROGRAM_STEP_INDENT;
  if (leadingKind === 'marker' || depth > 0) return isInset ? PROGRAM_LEAF_INDENT : LEAF_INDENT;
  return leadingKind === 'icon' ? ICON_LABEL_INDENT : STEP_INDENT;
};

type RowKind = 'flat' | 'item' | 'program' | 'branch' | 'leaf';

const rowKindOf = (
  depth: number,
  isBranch: boolean,
  leadingKind: LeadingKind,
  isProgramRow: boolean,
): RowKind => {
  if (isProgramRow) return 'program';
  if (depth === 0 && !isBranch) return 'flat';
  if (depth === 0 || leadingKind === 'icon') return 'item';
  return isBranch ? 'branch' : 'leaf';
};

const ROW_HEIGHTS: Record<RowKind, string> = {
  flat: ITEM_SIZES.sm,
  item: 'min-h-[var(--row-dense)]',
  program: 'min-h-11',
  branch: 'min-h-[calc(var(--row-dense)-var(--space-0-5))]',
  leaf: 'min-h-[calc(var(--row-dense)-var(--space-1))]',
};

const ROW_TEXT: Record<RowKind, string> = {
  flat: 'text-callout',
  item: 'text-body',
  program: 'text-callout font-semibold',
  branch: 'text-body',
  leaf: 'text-callout',
};

const ROW_PADDING: Record<RowKind, string> = {
  flat: 'py-1',
  item: 'py-0',
  program: 'py-1',
  branch: 'py-0',
  leaf: 'py-0',
};

const LABEL_LEADING: Record<RowKind, string> = {
  flat: 'leading-4.5',
  item: 'leading-5',
  program: 'leading-4.5',
  branch: 'leading-5.5',
  leaf: 'leading-5.5',
};

const labelLeadingFor = (rowKind: RowKind, depth: number) =>
  rowKind === 'item' && depth > 0 ? LABEL_LEADING.leaf : LABEL_LEADING[rowKind];

const rowLayout = (rowKind: RowKind, indent: string, size: SidebarItemSize | undefined) =>
  joinClasses(
    'w-full pr-2',
    ROW_PADDING[rowKind],
    indent,
    rowKind === 'flat' ? 'gap-2' : 'gap-2.5',
    size ? ITEM_SIZES[size] : ROW_HEIGHTS[rowKind],
    ROW_TEXT[rowKind],
  );

const rowColor = (rowKind: RowKind, isHighlighted: boolean, isInteractive: boolean) => {
  if (isHighlighted) return 'bg-[var(--fill)] text-[var(--label)] font-semibold';
  const label = rowKind === 'leaf' ? 'text-[var(--label-secondary)]' : 'text-[var(--label)]';
  return joinClasses('bg-transparent', label, isInteractive && 'hover:text-[var(--tint)]');
};

const INTERACTIVE_ROW =
  'cursor-pointer active:bg-[var(--fill-secondary)] focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--focus-color)]';

const ICON_SIZES = {
  flat: 'w-[var(--icon-sm)] h-[var(--icon-sm)]',
  tree: 'w-[var(--icon-lg)] h-[var(--icon-lg)]',
};

const MARKER_STATES: Record<SidebarMarkerState, string> = {
  done: 'bg-[var(--tint)] text-[var(--on-tint)]',
  now: 'bg-[var(--bg)] shadow-[inset_0_0_0_var(--stroke-strong)_var(--tint)]',
  next: 'bg-[var(--bg)] text-[var(--label-tertiary)] shadow-[inset_0_0_0_calc(var(--stroke-strong)*0.75)_var(--separator-strong)]',
};

const markerContent = (marker: SidebarItemMarker) => {
  if (marker.state === 'done')
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-2.5 h-2.5"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  if (marker.state === 'now') return <span className="w-1.5 h-1.5 rounded-full bg-[var(--tint)]" />;
  return marker.number;
};

const SidebarMarker = ({ marker }: { marker: SidebarItemMarker }) => (
  <span
    data-marker={marker.state}
    aria-hidden="true"
    className={joinClasses(
      'flex-none inline-flex items-center justify-center w-[var(--icon-md)] h-[var(--icon-md)] rounded-full text-caption2 leading-none tracking-normal font-bold tabular-nums',
      MARKER_STATES[marker.state],
    )}
  >
    {markerContent(marker)}
  </span>
);

const SidebarMedia = ({ media }: { media: SidebarItemMedia }) => (
  <img
    src={media.src}
    alt={media.alt}
    className={joinClasses(
      'flex-none w-15 h-9 rounded-[var(--corner-thumbnail)] bg-[var(--bg)] outline-1 outline-solid outline-[var(--separator)] -outline-offset-1',
      imageFitClass(true),
    )}
  />
);

const SidebarChevron = ({ isExpanded }: { isExpanded: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={joinClasses(
      'flex-none w-3.5 h-3.5 text-[var(--label-tertiary)] transition-transform duration-[var(--spring-snappy-duration)] ease-[var(--spring-snappy)]',
      isExpanded && 'rotate-90',
    )}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const leadingVisual = (
  icon: ReactNode,
  marker: SidebarItemMarker | undefined,
  media: SidebarItemMedia | undefined,
  iconSize: string,
) => {
  if (media) return <SidebarMedia media={media} />;
  if (marker) return <SidebarMarker marker={marker} />;
  if (!icon) return null;
  return (
    <span
      className={joinClasses(
        'flex-none inline-flex text-[var(--tint)] [&>svg]:w-full [&>svg]:h-full [&>svg]:[stroke-width:var(--icon-stroke)]',
        iconSize,
      )}
      aria-hidden="true"
    >
      {icon}
    </span>
  );
};

const hasCount = (count: number | string | undefined) => count !== undefined && count !== null;

const plainText = (node: ReactNode) =>
  typeof node === 'string' || typeof node === 'number' ? String(node) : undefined;

const roleTagText = (accessory: ReactNode) =>
  React.isValidElement<RoleTagProps>(accessory) && accessory.type === RoleTag
    ? plainText(accessory.props.children)
    : undefined;

const tagSuffix = (tagText: string | undefined, children: ReactNode) => {
  if (!tagText) return '';
  const isRepeated = plainText(children)?.toLowerCase() === tagText.toLowerCase();
  return isRepeated ? '' : `, ${tagText}`;
};

const visibleAccessory = (accessory: ReactNode, tagText: string | undefined) =>
  tagText && React.isValidElement<RoleTagProps>(accessory)
    ? React.cloneElement(accessory, { 'aria-hidden': true })
    : accessory;

const ItemLabel = ({
  children,
  spokenSuffix,
  leading,
}: {
  children: ReactNode;
  spokenSuffix: string;
  leading: string;
}) => (
  <span className={joinClasses('relative flex-1 min-w-0 line-clamp-2 break-words', leading)}>
    {spokenSuffix ? (
      <>
        <span className="sr-only">
          {children}
          {spokenSuffix}
        </span>
        <span aria-hidden="true">{children}</span>
      </>
    ) : (
      children
    )}
  </span>
);

export const SidebarItem = ({
  icon,
  marker,
  media,
  href,
  linkAs: LinkElement = 'a',
  onClick,
  current = false,
  count,
  accessory,
  size,
  subitems,
  collapsible = true,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  children,
  className,
}: SidebarItemProps) => {
  const shell = useAppShell();
  const { depth, indent, isInset } = React.useContext(SidebarLevelContext);
  const subitemsId = React.useId();
  const [internalExpanded, setInternalExpanded] = React.useState(defaultExpanded);
  const hasSubitems = React.Children.toArray(subitems).length > 0;
  const isProgramRow = hasSubitems && !collapsible;
  const isStatic = isProgramRow && !href;
  const isDisclosure = hasSubitems && collapsible;
  const isLink = Boolean(href) && !isDisclosure;
  const isExpanded = !collapsible || (expanded ?? internalExpanded);
  const leadingKind = leadingKindOf(icon, marker, media);
  const rowKind = rowKindOf(depth, hasSubitems || Boolean(marker), leadingKind, isProgramRow);
  const tagText = roleTagText(accessory);
  const toggleExpanded = () => {
    if (expanded === undefined) setInternalExpanded(!isExpanded);
    onExpandedChange?.(!isExpanded);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onClick?.(event);
    if (isDisclosure) return toggleExpanded();
    if (shell?.isCompact) shell.closeSidebar();
  };
  const classes = joinClasses(
    'relative flex items-center rounded-[var(--corner-md)] border-0 text-left no-underline',
    rowLayout(rowKind, rowIndentFor(indent, isProgramRow), size),
    rowColor(rowKind, current, !isStatic),
    !isStatic && INTERACTIVE_ROW,
    className,
  );
  const staticProps = {
    className: classes,
    'aria-current': current ? ('page' as const) : undefined,
  };
  const rowProps = {
    ...staticProps,
    onClick: handleClick,
    ...(isDisclosure ? { 'aria-expanded': isExpanded, 'aria-controls': subitemsId } : {}),
  };
  const content = (
    <>
      {leadingVisual(icon, marker, media, rowKind === 'flat' ? ICON_SIZES.flat : ICON_SIZES.tree)}
      <ItemLabel
        spokenSuffix={`${marker ? `, ${marker.label}` : ''}${tagSuffix(tagText, children)}`}
        leading={labelLeadingFor(rowKind, depth)}
      >
        {children}
      </ItemLabel>
      {hasCount(count) ? (
        <span className="flex-none text-footnote font-medium tabular-nums text-[var(--label-tertiary)]">
          <span className="sr-only">, </span>
          {count}
        </span>
      ) : null}
      {visibleAccessory(accessory, tagText)}
      {isDisclosure ? <SidebarChevron isExpanded={isExpanded} /> : null}
    </>
  );
  const rowElement = () => {
    if (isStatic) return <div {...staticProps}>{content}</div>;
    if (isLink)
      return (
        <LinkElement href={href} {...rowProps}>
          {content}
        </LinkElement>
      );
    return (
      <button type="button" {...rowProps}>
        {content}
      </button>
    );
  };
  return (
    <li data-propellant-sidebar-depth={depth} className={isProgramRow ? PROGRAM_INSET : undefined}>
      {rowElement()}
      {hasSubitems ? (
        <SidebarLevelContext.Provider
          value={{
            depth: depth + 1,
            indent: childIndentFor(depth, leadingKind, isProgramRow, isInset),
            isInset: isInset || isProgramRow,
          }}
        >
          <ul
            role="list"
            id={subitemsId}
            hidden={!isExpanded}
            className={joinClasses(
              'm-0 p-0 pt-0.5 list-none flex-col gap-0.5',
              isExpanded ? 'flex' : 'hidden',
            )}
          >
            {subitems}
          </ul>
        </SidebarLevelContext.Provider>
      ) : null}
    </li>
  );
};

export interface SidebarSeparatorProps {
  className?: string;
}

const separatorSpacing = (depth: number, isInset: boolean) => {
  if (depth === 0) return 'mx-2 my-2.5';
  return isInset ? 'my-1.5 mr-2 ml-5' : 'my-1.5 mr-2 ml-6.5';
};

export const SidebarSeparator = ({ className }: SidebarSeparatorProps) => {
  const { depth, isInset } = React.useContext(SidebarLevelContext);
  return (
    <li
      aria-hidden="true"
      className={joinClasses(
        'h-[var(--hairline)] bg-[var(--separator)]',
        separatorSpacing(depth, isInset),
        className,
      )}
    />
  );
};
