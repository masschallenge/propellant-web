import * as React from 'react';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';

export type PaginationVariant = 'numbers' | 'simple' | 'group' | 'dots' | 'lines';

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  variant?: PaginationVariant;
  frame?: 'page' | 'card' | 'none';
  align?: 'between' | 'left' | 'center' | 'right';
  soft?: boolean;
  showStatus?: boolean;
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  rowsPerPageLabel?: string;
  pageJump?: boolean;
  firstLast?: boolean;
  'aria-label'?: string;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const GAP = 'gap';

const visiblePages = (page: number, pageCount: number): (number | typeof GAP)[] => {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_unused, index) => index + 1);
  const windowStart = Math.max(2, page - 1);
  const windowEnd = Math.min(pageCount - 1, page + 1);
  const pages: (number | typeof GAP)[] = [1];
  if (windowStart > 2) pages.push(GAP);
  for (let pageNumber = windowStart; pageNumber <= windowEnd; pageNumber += 1) {
    pages.push(pageNumber);
  }
  if (windowEnd < pageCount - 1) pages.push(GAP);
  pages.push(pageCount);
  return pages;
};

const FOCUS_RING =
  'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]';

const HIT_AREA =
  "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[max(100%,var(--hit-target))] before:h-[max(100%,var(--hit-target))]";

const Glyph = ({ path }: { path: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={path} />
  </svg>
);

const PREVIOUS_PATH = 'M15 6l-6 6 6 6';
const NEXT_PATH = 'M9 6l6 6-6 6';
const FIRST_PATH = 'M17 6l-6 6 6 6M7 6v12';
const LAST_PATH = 'M7 6l6 6-6 6M17 6v12';
const CHEVRON_DOWN_PATH = 'M7 10l5 5 5-5';
const CHECK_PATH = 'M5 12.5l4.5 4.5L19 7.5';

const RowsPerPageSelect = ({
  value,
  options,
  onChange,
}: {
  value: number;
  options: number[];
  onChange?: (rowsPerPage: number) => void;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const anchor = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (anchor.current && !anchor.current.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <span className="relative inline-flex" ref={anchor}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Rows per page, ${value}`}
        onClick={() => setIsOpen(!isOpen)}
        className={joinClasses(
          'relative inline-flex items-center gap-1 min-h-[var(--control-sm)] pl-3 pr-2 border-0 rounded-[var(--corner-capsule)] bg-[var(--fill-secondary)] font-[inherit] text-subheadline font-medium tabular-nums text-[var(--label)] cursor-pointer hover:bg-[var(--fill)] [&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:text-[var(--label-secondary)]',
          HIT_AREA,
          FOCUS_RING,
        )}
      >
        {`${value} per page`}
        <Glyph path={CHEVRON_DOWN_PATH} />
      </button>
      {isOpen ? (
        <div
          role="listbox"
          aria-label="Rows per page"
          className="absolute top-[calc(100%+var(--space-1))] left-0 min-w-full z-[var(--layer-dropdown)] p-1 flex flex-col rounded-[var(--corner-lg)] bg-[var(--bg-elevated)] shadow-[var(--shadow-float)]"
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              onClick={() => {
                onChange?.(option);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 min-h-[var(--control-sm)] pl-2 pr-2 border-0 rounded-[var(--corner-md)] bg-transparent font-[inherit] text-body tabular-nums text-left whitespace-nowrap cursor-pointer text-[var(--label)] hover:bg-[var(--tint)] hover:text-[var(--on-tint)] focus-visible:outline-none focus-visible:bg-[var(--tint)] focus-visible:text-[var(--on-tint)]"
            >
              <span
                className="flex-none inline-flex w-[var(--icon-sm)] h-[var(--icon-sm)] [&>svg]:w-full [&>svg]:h-full"
                aria-hidden="true"
              >
                {option === value ? <Glyph path={CHECK_PATH} /> : null}
              </span>
              {`${option} per page`}
            </button>
          ))}
        </div>
      ) : null}
    </span>
  );
};

const JUSTIFY = {
  between: 'justify-between',
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
} as const;

const FRAMES = {
  page: 'pt-3 border-0 border-t-[length:var(--hairline)] border-solid border-[var(--separator)]',
  card: 'p-3 rounded-[var(--corner-lg)] bg-[var(--bg)]',
  none: '',
} as const;

export const Pagination = ({
  page,
  pageCount,
  onPageChange,
  variant = 'numbers',
  frame = 'page',
  align = 'between',
  showStatus = true,
  rowsPerPage,
  rowsPerPageOptions = [10, 25, 50, 100],
  onRowsPerPageChange,
  rowsPerPageLabel,
  pageJump = false,
  firstLast = false,
  'aria-label': ariaLabel = 'Pagination',
  className,
}: PaginationProps) => {
  const jumpId = React.useId();
  const goTo = (target: number) => {
    if (target >= 1 && target <= pageCount && target !== page) onPageChange(target);
  };

  if (variant === 'dots' || variant === 'lines') {
    const isDots = variant === 'dots';
    return (
      <nav aria-label={ariaLabel} className={joinClasses('flex justify-center', className)}>
        <div role="tablist" aria-label="Pages" className="flex items-center gap-2">
          {Array.from({ length: pageCount }, (_unused, index) => index + 1).map((pageNumber) => {
            const isCurrent = pageNumber === page;
            return (
              <button
                key={pageNumber}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-label={`Go to page ${pageNumber}`}
                onClick={() => goTo(pageNumber)}
                className={joinClasses(
                  'relative border-0 p-0 rounded-[var(--corner-capsule)] cursor-pointer transition-[width,background-color] duration-[var(--spring-snappy-duration)] ease-[var(--spring-snappy)]',
                  HIT_AREA,
                  FOCUS_RING,
                  isDots
                    ? isCurrent
                      ? 'w-5 h-2 bg-[var(--tint)]'
                      : 'w-2 h-2 bg-[var(--control-border)] hover:bg-[var(--label-tertiary)]'
                    : isCurrent
                      ? 'w-8 h-1 bg-[var(--tint)]'
                      : 'w-5 h-1 bg-[var(--control-border)] hover:bg-[var(--label-tertiary)]',
                )}
              />
            );
          })}
        </div>
      </nav>
    );
  }

  const isGroup = variant === 'group';

  const pageButton = (pageNumber: number) => {
    const isCurrent = pageNumber === page;
    return (
      <button
        key={pageNumber}
        type="button"
        aria-current={isCurrent ? 'page' : undefined}
        aria-label={`Page ${pageNumber}`}
        onClick={() => goTo(pageNumber)}
        className={joinClasses(
          'relative inline-flex items-center justify-center min-w-[var(--control-sm)] h-[var(--control-sm)] px-2 border-0 rounded-[var(--corner-capsule)] font-[inherit] text-subheadline tabular-nums cursor-pointer',
          HIT_AREA,
          FOCUS_RING,
          isCurrent
            ? 'bg-[var(--tint-fill)] text-[var(--tint)] font-semibold'
            : 'bg-transparent text-[var(--label-secondary)] font-normal hover:bg-[var(--fill-tertiary)] hover:text-[var(--label)] active:bg-[var(--fill-secondary)]',
        )}
      >
        {pageNumber}
      </button>
    );
  };

  const pageNumbers = visiblePages(page, pageCount).map((entry, position) =>
    entry === GAP ? (
      <span
        key={`gap-${position}`}
        aria-hidden="true"
        className="inline-flex items-center justify-center min-w-[var(--control-sm)] h-[var(--control-sm)] text-subheadline text-[var(--label-tertiary)]"
      >
        …
      </span>
    ) : (
      pageButton(entry)
    ),
  );

  const previousButton = isGroup ? (
    <IconButton
      size="sm"
      aria-label="Previous page"
      disabled={page <= 1}
      onClick={() => goTo(page - 1)}
      className="rounded-[var(--corner-capsule)]"
    >
      <Glyph path={PREVIOUS_PATH} />
    </IconButton>
  ) : (
    <Button
      variant="gray"
      size="sm"
      aria-label="Previous page"
      disabled={page <= 1}
      onClick={() => goTo(page - 1)}
      iconLeading={<Glyph path={PREVIOUS_PATH} />}
    >
      Previous
    </Button>
  );

  const nextButton = isGroup ? (
    <IconButton
      size="sm"
      aria-label="Next page"
      disabled={page >= pageCount}
      onClick={() => goTo(page + 1)}
      className="rounded-[var(--corner-capsule)]"
    >
      <Glyph path={NEXT_PATH} />
    </IconButton>
  ) : (
    <Button
      variant="gray"
      size="sm"
      aria-label="Next page"
      disabled={page >= pageCount}
      onClick={() => goTo(page + 1)}
      iconTrailing={<Glyph path={NEXT_PATH} />}
    >
      Next
    </Button>
  );

  const firstButton = firstLast ? (
    <IconButton size="sm" aria-label="First page" disabled={page <= 1} onClick={() => goTo(1)}>
      <Glyph path={FIRST_PATH} />
    </IconButton>
  ) : null;

  const lastButton = firstLast ? (
    <IconButton
      size="sm"
      aria-label="Last page"
      disabled={page >= pageCount}
      onClick={() => goTo(pageCount)}
    >
      <Glyph path={LAST_PATH} />
    </IconButton>
  ) : null;

  const rowsPerPageControl =
    rowsPerPage !== undefined ? (
      <span className="inline-flex items-center gap-2">
        {rowsPerPageLabel ? (
          <span className="text-subheadline text-[var(--label-secondary)]">{rowsPerPageLabel}</span>
        ) : null}
        <RowsPerPageSelect
          value={rowsPerPage}
          options={rowsPerPageOptions}
          onChange={onRowsPerPageChange}
        />
      </span>
    ) : null;

  const jumpControl = pageJump ? (
    <span className="inline-flex items-center gap-2 text-subheadline text-[var(--label-secondary)]">
      <label htmlFor={`${jumpId}-jump`}>Page</label>
      <input
        id={`${jumpId}-jump`}
        type="number"
        min={1}
        max={pageCount}
        value={page}
        onChange={(event) => {
          const target = parseInt(event.target.value, 10);
          if (target) goTo(target);
        }}
        className="w-14 h-[var(--control-sm)] px-2 border-0 rounded-[var(--corner-md)] bg-[var(--bg)] shadow-[inset_0_0_0_var(--hairline)_var(--control-border)] font-[inherit] text-subheadline tabular-nums text-[var(--label)] text-center outline-none focus:shadow-[inset_0_0_0_var(--stroke-strong)_var(--focus-color)]"
      />
      <span className="tabular-nums">{`of ${pageCount}`}</span>
    </span>
  ) : null;

  const status = (
    <span className="text-subheadline tabular-nums text-[var(--label-secondary)]">
      {`Page ${page} of ${pageCount}`}
    </span>
  );

  const middle = isGroup ? (
    <span className="inline-flex items-center gap-0.5 p-0.5 rounded-[var(--corner-capsule)] bg-[var(--fill-tertiary)]">
      {previousButton}
      {pageNumbers}
      {nextButton}
    </span>
  ) : variant === 'simple' ? (
    showStatus ? (
      status
    ) : null
  ) : (
    <span className="flex items-center gap-1 px-1">{pageNumbers}</span>
  );

  const cluster = isGroup ? (
    middle
  ) : (
    <>
      {firstButton}
      {previousButton}
      {middle}
      {nextButton}
      {lastButton}
    </>
  );

  const body = () => {
    if (jumpControl || rowsPerPageControl) {
      return (
        <>
          {jumpControl}
          {jumpControl && rowsPerPageControl ? (
            <span aria-hidden="true" className="w-[var(--hairline)] h-5 bg-[var(--separator)]" />
          ) : null}
          {rowsPerPageControl}
          {align === 'between' ? <span className="flex-1" /> : null}
          <span className="flex items-center gap-2">{cluster}</span>
        </>
      );
    }
    if (align === 'between' && !isGroup) {
      return (
        <>
          {firstButton}
          {previousButton}
          <span className="flex-1 flex justify-center">{middle}</span>
          {nextButton}
          {lastButton}
        </>
      );
    }
    return <span className="flex items-center gap-2 flex-wrap">{cluster}</span>;
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={joinClasses(
        'flex items-center gap-3 flex-wrap w-full',
        JUSTIFY[align],
        FRAMES[frame],
        className,
      )}
    >
      {body()}
    </nav>
  );
};
