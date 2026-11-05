import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

afterEach(cleanup);

describe('Pagination', () => {
  it('marks the current page as a tint fill capsule', () => {
    render(<Pagination page={3} pageCount={10} onPageChange={vi.fn()} />);
    const current = screen.getByRole('button', { name: 'Page 3' });
    expect(current.getAttribute('aria-current')).toBe('page');
    expect(current.className).toContain('bg-[var(--tint-fill)]');
    expect(current.className).toContain('rounded-[var(--corner-capsule)]');
    expect(screen.getByRole('button', { name: 'Page 4' }).getAttribute('aria-current')).toBeNull();
  });

  it('collapses long ranges around the current page', () => {
    render(<Pagination page={6} pageCount={20} onPageChange={vi.fn()} />);
    const pages = screen
      .getAllByRole('button', { name: /^Page \d+$/ })
      .map((button) => button.textContent);
    expect(pages).toEqual(['1', '5', '6', '7', '20']);
  });

  it('moves with previous and next and stops at the ends', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const { rerender } = render(<Pagination page={1} pageCount={3} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toHaveProperty('disabled', true);
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    rerender(<Pagination page={3} pageCount={3} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveProperty('disabled', true);
  });

  it('ignores a click on the current page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={2} pageCount={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('shows the page status in the simple variant', () => {
    render(<Pagination page={2} pageCount={9} onPageChange={vi.fn()} variant="simple" />);
    expect(screen.getByText('Page 2 of 9')).toBeTruthy();
  });

  it('picks rows per page from a listbox', async () => {
    const user = userEvent.setup();
    const onRowsPerPageChange = vi.fn();
    render(
      <Pagination
        page={1}
        pageCount={4}
        onPageChange={vi.fn()}
        rowsPerPage={25}
        rowsPerPageLabel="Rows"
        onRowsPerPageChange={onRowsPerPageChange}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Rows per page, 25' });
    await user.click(trigger);
    expect(screen.getByRole('option', { name: '25 per page' }).getAttribute('aria-selected')).toBe(
      'true',
    );
    await user.click(screen.getByRole('option', { name: '50 per page' }));
    expect(onRowsPerPageChange).toHaveBeenCalledWith(50);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('closes the rows per page list on Escape', async () => {
    const user = userEvent.setup();
    render(<Pagination page={1} pageCount={4} onPageChange={vi.fn()} rowsPerPage={10} />);
    await user.click(screen.getByRole('button', { name: 'Rows per page, 10' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('jumps to a typed page and offers first and last', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={2} pageCount={8} onPageChange={onPageChange} pageJump firstLast />);
    fireEvent.change(screen.getByLabelText('Page'), { target: { value: '5' } });
    expect(onPageChange).toHaveBeenLastCalledWith(5);
    await user.click(screen.getByRole('button', { name: 'Last page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(8);
    await user.click(screen.getByRole('button', { name: 'First page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);
  });

  it('renders dot indicators as tabs', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={1} pageCount={3} onPageChange={onPageChange} variant="dots" />);
    expect(screen.getByRole('tab', { name: 'Go to page 1' }).getAttribute('aria-selected')).toBe(
      'true',
    );
    await user.click(screen.getByRole('tab', { name: 'Go to page 3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('uses the given accessible name', () => {
    render(
      <Pagination page={1} pageCount={2} onPageChange={vi.fn()} aria-label="Applications pages" />,
    );
    expect(screen.getByRole('navigation', { name: 'Applications pages' })).toBeTruthy();
  });
});
