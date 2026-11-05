import { render, cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Table, TableCard, TableCellStack, TableEmptyState, TableFooter } from './Table';
import type { TableColumn } from './Table';

afterEach(cleanup);

interface Judge {
  id: string;
  name: string;
  panels: number;
}

const JUDGES: Judge[] = [
  { id: 'j1', name: 'Ada Park', panels: 3 },
  { id: 'j2', name: 'Ben Ortiz', panels: 12 },
];

const COLUMNS: TableColumn<Judge>[] = [
  { key: 'name', header: 'Judge', sortable: true },
  { key: 'panels', header: 'Panels', align: 'right' },
];

describe('Table', () => {
  it('renders a captioned grid with a quiet header row and dense rows when small', () => {
    render(<Table caption="Judges" columns={COLUMNS} rows={JUDGES} size="sm" />);
    const table = screen.getByRole('table', { name: 'Judges' });
    const header = within(table).getByRole('columnheader', { name: 'Panels' });
    expect(header.className).toContain('text-subheadline');
    expect(header.className).toContain('font-medium');
    expect(header.className).toContain('text-[var(--label-tertiary)]');
    const cell = within(table).getByRole('cell', { name: '12' });
    expect(cell.className).toContain('h-[var(--row-dense)]');
  });

  it('sets numeric columns in tabular numerals on the trailing edge', () => {
    render(<Table columns={COLUMNS} rows={JUDGES} />);
    const cell = screen.getByRole('cell', { name: '3' });
    expect(cell.className).toContain('tabular-nums');
    expect(cell.className).toContain('text-right');
  });

  it('separates rows with hairlines and can drop them', () => {
    const { rerender } = render(<Table columns={COLUMNS} rows={JUDGES} />);
    expect(screen.getByRole('cell', { name: 'Ben Ortiz' }).className).toContain(
      'border-t-[length:var(--hairline)]',
    );
    expect(screen.getByRole('cell', { name: 'Ada Park' }).className).not.toContain('border-t');
    rerender(<Table columns={COLUMNS} rows={JUDGES} divider={false} />);
    expect(screen.getByRole('cell', { name: 'Ben Ortiz' }).className).not.toContain('border-t');
  });

  it('reports sortable header clicks and marks the sorted column', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <Table columns={COLUMNS} rows={JUDGES} sortKey="name" sortDir="descending" onSort={onSort} />,
    );
    expect(screen.getByRole('columnheader', { name: 'Judge' }).getAttribute('aria-sort')).toBe(
      'descending',
    );
    await user.click(screen.getByRole('button', { name: 'Judge' }));
    expect(onSort).toHaveBeenCalledWith('name');
  });

  it('selects rows and reports select all as mixed then complete', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <Table
        columns={COLUMNS}
        rows={JUDGES}
        selectable
        rowLabel={(row) => row.name}
        onSelectionChange={onSelectionChange}
      />,
    );
    const selectAll = screen.getByRole('checkbox', { name: 'Select all rows' });
    expect(selectAll.getAttribute('aria-checked')).toBe('false');
    await user.click(screen.getByRole('checkbox', { name: 'Select Ada Park' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(['j1']);
    expect(selectAll.getAttribute('aria-checked')).toBe('mixed');
    expect(screen.getAllByRole('row')[1].getAttribute('aria-selected')).toBe('true');
    await user.click(selectAll);
    expect(onSelectionChange).toHaveBeenLastCalledWith(['j1', 'j2']);
    await user.click(selectAll);
    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  });

  it('honours controlled selection and derived row ids', () => {
    render(
      <Table
        columns={COLUMNS}
        rows={JUDGES}
        rowId={(row) => `judge-${row.id}`}
        selectedIds={['judge-j2']}
      />,
    );
    const rows = screen.getAllByRole('row');
    expect(rows[1].getAttribute('aria-selected')).toBe('false');
    expect(rows[2].getAttribute('aria-selected')).toBe('true');
  });

  it('adds a trailing actions column with a hidden header', () => {
    render(
      <Table
        columns={COLUMNS}
        rows={JUDGES}
        rowActions={(row) => <button type="button">{`Edit ${row.name}`}</button>}
      />,
    );
    expect(screen.getByText('Row actions').className).toContain('sr-only');
    expect(screen.getByRole('button', { name: 'Edit Ben Ortiz' })).toBeTruthy();
  });
});

describe('TableCard', () => {
  it('is a flat white group with a neutral count badge and a title in label color', () => {
    const { container } = render(
      <TableCard title="Startups" count="84" description="Boston 2026">
        <Table columns={COLUMNS} rows={JUDGES} />
      </TableCard>,
    );
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain('bg-[var(--bg)]');
    expect(card.className).toContain('rounded-[var(--corner-lg)]');
    expect(card.className).not.toContain('shadow');
    const heading = screen.getByRole('heading', { name: /Startups/ });
    expect(heading.className).toContain('text-[var(--label)]');
    expect(heading.className).not.toContain('--tint');
    expect(screen.getByText('84').closest('[data-tone]')?.getAttribute('data-tone')).toBe(
      'neutral',
    );
  });
});

describe('TableCellStack', () => {
  it('stacks a primary line over a secondary line', () => {
    render(<TableCellStack primary="Northwind Robotics" secondary="Robotics" />);
    expect(screen.getByText('Robotics').className).toContain('text-[var(--label-secondary)]');
  });
});

describe('TableFooter', () => {
  it('shows the page status and moves pages', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<TableFooter page={2} pageCount={5} onPageChange={onPageChange} />);
    expect(screen.getByText('Page 2 of 5')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeTruthy();
  });
});

describe('TableEmptyState', () => {
  it('shows a plain symbol, a title and an alert role for errors', () => {
    render(<TableEmptyState tone="pink" role="alert" title="Could not load startups" />);
    const alert = screen.getByRole('alert');
    expect(
      within(alert).getByRole('heading', { name: 'Could not load startups' }).className,
    ).toContain('text-title3');
    expect(alert.querySelector('[data-tone="critical"]')).not.toBeNull();
  });
});
