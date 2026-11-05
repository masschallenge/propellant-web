import * as React from 'react';
import type { ReactNode } from 'react';
import { Badge } from '../Badge/Badge';
import { Pagination } from '../Pagination/Pagination';
import { StatusIcon } from '../StatusIcon/StatusIcon';

export interface TableColumn<Row = unknown> {
  key: string;
  header: ReactNode;
  cell?: (row: Row, index: number) => ReactNode;
  align?: 'left' | 'right';
  width?: string;
  sortable?: boolean;
}

export interface TableProps<Row = unknown> {
  columns: TableColumn<Row>[];
  rows: Row[];
  caption?: string;
  size?: 'sm' | 'md';
  zebra?: boolean;
  divider?: boolean;
  sortKey?: string;
  sortDir?: 'ascending' | 'descending';
  onSort?: (key: string) => void;
  selectedIds?: string[];
  rowId?: (row: Row, index: number) => string;
  selectable?: boolean;
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  rowLabel?: (row: Row, index: number) => string;
  rowActions?: (row: Row, index: number) => ReactNode;
  className?: string;
}

type CheckState = 'true' | 'false' | 'mixed';

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const HAIRLINE_ABOVE =
  'border-0 border-t-[length:var(--hairline)] border-solid border-[var(--separator)]';
const HAIRLINE_BELOW =
  'border-0 border-b-[length:var(--hairline)] border-solid border-[var(--separator)]';

const FOCUS_RING =
  'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]';

const CELL_SIZES = {
  sm: 'h-[var(--row-dense)] px-3 py-1.5 first:pl-4 last:pr-4 text-callout',
  md: 'h-[var(--row)] px-3 py-2 first:pl-5 last:pr-5 text-body',
} as const;

const HEADER_SIZES = {
  sm: 'h-[var(--row-dense)] px-3 py-1.5 first:pl-4 last:pr-4',
  md: 'h-[var(--row-dense)] px-3 py-2 first:pl-5 last:pr-5',
} as const;

const readCell = (row: unknown, key: string) =>
  (row as Record<string, ReactNode> | null | undefined)?.[key];

const defaultRowId = (row: unknown, index: number) => {
  const identifier = (row as { id?: string | number } | null | undefined)?.id;
  return String(identifier ?? index);
};

const TableCheckbox = ({
  state,
  label,
  onToggle,
}: {
  state: CheckState;
  label: string;
  onToggle: () => void;
}) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={state === 'mixed' ? 'mixed' : state === 'true'}
    aria-label={label}
    onClick={(event) => {
      event.stopPropagation();
      onToggle();
    }}
    className={joinClasses(
      'relative inline-flex items-center justify-center w-[var(--hit-target)] h-[var(--hit-target)] -my-1.5 -ml-1.5 p-0 border-0 bg-transparent rounded-[var(--corner-md)] cursor-pointer align-middle',
      FOCUS_RING,
    )}
  >
    <span
      aria-hidden="true"
      className={joinClasses(
        'inline-flex items-center justify-center w-4 h-4 rounded-[var(--corner-sm)]',
        state === 'false'
          ? 'bg-[var(--bg)] shadow-[inset_0_0_0_var(--hairline)_var(--control-border)] text-transparent'
          : 'bg-[var(--tint)] text-[var(--on-tint)]',
      )}
    >
      {state === 'mixed' ? (
        <span className="w-2 h-0.5 rounded-[var(--corner-capsule)] bg-current" />
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 12 5 5L19 7" />
        </svg>
      )}
    </span>
  </button>
);

const SortGlyph = ({ isDescending }: { isDescending: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={isDescending ? 'M6 9l6 6 6-6' : 'M6 15l6-6 6 6'} />
  </svg>
);

export const Table = <Row,>({
  columns,
  rows,
  caption,
  size = 'md',
  zebra = false,
  divider = true,
  sortKey,
  sortDir,
  onSort,
  selectedIds,
  rowId,
  selectable = false,
  defaultSelectedIds = [],
  onSelectionChange,
  rowLabel,
  rowActions,
  className,
}: TableProps<Row>) => {
  const [internalSelection, setInternalSelection] = React.useState<string[]>(defaultSelectedIds);
  const selection = selectedIds ?? internalSelection;
  const idOf = (row: Row, index: number) => (rowId ? rowId(row, index) : defaultRowId(row, index));
  const labelOf = (row: Row, index: number) =>
    rowLabel ? rowLabel(row, index) : `row ${index + 1}`;
  const allIds = rows.map(idOf);
  const allState: CheckState =
    selection.length === 0
      ? 'false'
      : allIds.every((identifier) => selection.includes(identifier))
        ? 'true'
        : 'mixed';

  const updateSelection = (next: string[]) => {
    if (selectedIds === undefined) setInternalSelection(next);
    onSelectionChange?.(next);
  };
  const toggleAll = () => updateSelection(allState === 'true' ? [] : allIds);
  const toggleRow = (identifier: string) =>
    updateSelection(
      selection.includes(identifier)
        ? selection.filter((selected) => selected !== identifier)
        : selection.concat(identifier),
    );

  const headerClass = (isNumeric: boolean, isSorted: boolean) =>
    joinClasses(
      HEADER_SIZES[size],
      'align-middle text-subheadline font-medium whitespace-nowrap',
      isSorted ? 'text-[var(--label)]' : 'text-[var(--label-tertiary)]',
      HAIRLINE_BELOW,
      isNumeric ? 'text-right' : 'text-left',
    );

  return (
    <table className={joinClasses('w-full border-collapse text-[var(--label)]', className)}>
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <thead>
        <tr>
          {selectable ? (
            <th scope="col" className={joinClasses(headerClass(false, false), 'w-10 pr-0')}>
              <TableCheckbox state={allState} label="Select all rows" onToggle={toggleAll} />
            </th>
          ) : null}
          {columns.map((column) => {
            const isSorted = sortKey === column.key;
            const isNumeric = column.align === 'right';
            return (
              <th
                key={column.key}
                scope="col"
                style={column.width ? { width: column.width } : undefined}
                aria-sort={isSorted ? sortDir : undefined}
                className={headerClass(isNumeric, isSorted)}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => onSort?.(column.key)}
                    className={joinClasses(
                      'relative inline-flex items-center gap-1 p-0 align-middle border-0 bg-transparent rounded-[var(--corner-sm)] font-[inherit] text-[inherit] [font-weight:inherit] cursor-pointer hover:text-[var(--label)]',
                      "before:content-[''] before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:h-[var(--hit-target)]",
                      isNumeric && 'flex-row-reverse',
                      FOCUS_RING,
                    )}
                  >
                    {column.header}
                    <span
                      className={isSorted ? 'text-[var(--label-secondary)]' : 'opacity-0'}
                      aria-hidden="true"
                    >
                      <SortGlyph isDescending={isSorted && sortDir === 'descending'} />
                    </span>
                  </button>
                ) : (
                  column.header
                )}
              </th>
            );
          })}
          {rowActions ? (
            <th scope="col" className={joinClasses(headerClass(true, false), 'w-[1%]')}>
              <span className="sr-only">Row actions</span>
            </th>
          ) : null}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const identifier = idOf(row, index);
          const isSelected = selection.includes(identifier);
          const ariaSelected = isSelected ? true : selectedIds || selectable ? false : undefined;
          const cellClass = (isNumeric: boolean) =>
            joinClasses(
              CELL_SIZES[size],
              'align-middle',
              isNumeric ? 'text-right tabular-nums' : 'text-left',
              divider && index > 0 && HAIRLINE_ABOVE,
              isSelected
                ? 'bg-[var(--tint-fill)]'
                : zebra && index % 2 === 1
                  ? 'bg-[var(--bg-secondary)] group-hover:bg-[var(--fill-tertiary)]'
                  : 'group-hover:bg-[var(--fill-tertiary)]',
            );
          return (
            <tr key={identifier} aria-selected={ariaSelected} className="group">
              {selectable ? (
                <td className={joinClasses(cellClass(false), 'w-10 pr-0')}>
                  <TableCheckbox
                    state={isSelected ? 'true' : 'false'}
                    label={`Select ${labelOf(row, index)}`}
                    onToggle={() => toggleRow(identifier)}
                  />
                </td>
              ) : null}
              {columns.map((column) => (
                <td key={column.key} className={cellClass(column.align === 'right')}>
                  {column.cell ? column.cell(row, index) : readCell(row, column.key)}
                </td>
              ))}
              {rowActions ? (
                <td className={joinClasses(cellClass(true), 'w-[1%] whitespace-nowrap')}>
                  {rowActions(row, index)}
                </td>
              ) : null}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export interface TableCellStackProps {
  primary: ReactNode;
  secondary?: ReactNode;
  media?: ReactNode;
}

export const TableCellStack = ({ primary, secondary, media }: TableCellStackProps) => (
  <span className="flex items-center gap-3">
    {media}
    <span className="flex flex-col min-w-0">
      <span className="font-medium text-[var(--label)]">{primary}</span>
      {secondary ? (
        <span className="text-subheadline text-[var(--label-secondary)]">{secondary}</span>
      ) : null}
    </span>
  </span>
);

export interface TableCardProps {
  title?: ReactNode;
  count?: string;
  description?: ReactNode;
  actions?: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export const TableCard = ({
  title,
  count,
  description,
  actions,
  toolbar,
  footer,
  className,
  children,
}: TableCardProps) => (
  <div
    className={joinClasses(
      'rounded-[var(--corner-lg)] bg-[var(--bg)] text-[var(--label)] overflow-hidden',
      className,
    )}
  >
    {title || actions || description ? (
      <div className="flex items-start gap-4 px-5 pt-5 pb-4">
        <div className="flex-1 min-w-0">
          {title ? (
            <h2 className="m-0 flex items-center gap-2 text-headline text-[var(--label)]">
              {title}
              {count ? <Badge size="sm">{count}</Badge> : null}
            </h2>
          ) : null}
          {description ? (
            <p className="m-0 mt-0.5 text-subheadline text-[var(--label-secondary)]">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2 flex-wrap">{actions}</div> : null}
      </div>
    ) : null}
    {toolbar ? <div className="flex items-center gap-2 px-5 pb-3 flex-wrap">{toolbar}</div> : null}
    {children}
    {footer}
  </div>
);

export interface TableFooterProps {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  variant?: 'status' | 'numbers';
  end?: ReactNode;
  'aria-label'?: string;
}

export const TableFooter = ({
  page,
  pageCount,
  onPageChange,
  variant = 'status',
  end,
  'aria-label': ariaLabel = 'Pagination',
}: TableFooterProps) => (
  <div className={joinClasses('flex items-center gap-3 px-5 py-3', HAIRLINE_ABOVE)}>
    <Pagination
      page={page}
      pageCount={pageCount}
      onPageChange={(next) => onPageChange?.(next)}
      variant={variant === 'numbers' ? 'numbers' : 'simple'}
      frame="none"
      aria-label={ariaLabel}
      className="flex-1 min-w-0"
    />
    {end}
  </div>
);

export interface TableEmptyStateProps {
  icon?: ReactNode;
  tone?: 'gray' | 'teal' | 'pink';
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  ghostRows?: boolean;
  role?: React.AriaRole;
  className?: string;
}

const EMPTY_TONES = {
  gray: 'neutral',
  teal: 'info',
  pink: 'critical',
} as const;

const SearchGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const TableEmptyState = ({
  icon,
  tone = 'gray',
  title,
  description,
  actions,
  ghostRows = false,
  role,
  className,
}: TableEmptyStateProps) => (
  <div
    role={role}
    className={joinClasses(
      'flex flex-col items-center text-center gap-2 px-6 py-10',
      HAIRLINE_ABOVE,
      className,
    )}
  >
    <StatusIcon tone={EMPTY_TONES[tone]} size="md" className="mb-1">
      {icon || <SearchGlyph />}
    </StatusIcon>
    <h3 className="m-0 text-title3 text-[var(--label)]">{title}</h3>
    {description ? (
      <p className="m-0 text-callout text-[var(--label-secondary)] max-w-[46ch]">{description}</p>
    ) : null}
    {actions ? <div className="flex gap-2 mt-2 flex-wrap justify-center">{actions}</div> : null}
    {ghostRows ? (
      <div className="flex flex-col gap-3 w-full max-w-[520px] mt-4" aria-hidden="true">
        <span className="block h-2.5 rounded-[var(--corner-capsule)] bg-[var(--fill-tertiary)]" />
        <span className="block h-2.5 w-[80%] rounded-[var(--corner-capsule)] bg-[var(--fill-tertiary)]" />
        <span className="block h-2.5 w-[62%] rounded-[var(--corner-capsule)] bg-[var(--fill-tertiary)]" />
      </div>
    ) : null}
  </div>
);
