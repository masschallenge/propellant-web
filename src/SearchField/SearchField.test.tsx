import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SearchField } from './SearchField';

afterEach(cleanup);

describe('SearchField', () => {
  it('types into an uncontrolled field and clears it with the clear button', async () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    render(<SearchField aria-label="Search startups" onChange={onChange} onClear={onClear} />);
    const field = screen.getByRole('searchbox', { name: 'Search startups' });
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
    await userEvent.type(field, 'solar');
    expect(onChange).toHaveBeenLastCalledWith('solar');
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(field).toHaveValue('');
    expect(field).toHaveFocus();
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('clears with Escape', async () => {
    render(<SearchField aria-label="Search judges" defaultValue="Ada" />);
    const field = screen.getByRole('searchbox');
    field.focus();
    await userEvent.keyboard('{Escape}');
    expect(field).toHaveValue('');
  });

  it('follows a controlled value', async () => {
    const onChange = vi.fn();
    render(<SearchField aria-label="Search" value="fintech" onChange={onChange} />);
    await userEvent.type(screen.getByRole('searchbox'), 's');
    expect(onChange).toHaveBeenCalledWith('fintechs');
    expect(screen.getByRole('searchbox')).toHaveValue('fintech');
  });

  it('masks its value from session replay unless told otherwise', () => {
    const { rerender } = render(<SearchField aria-label="Search" />);
    expect(screen.getByRole('searchbox')).toHaveClass('fs-mask');
    rerender(<SearchField aria-label="Search" isPrivate={false} />);
    expect(screen.getByRole('searchbox')).not.toHaveClass('fs-mask');
  });

  it('forwards object and callback refs to the input', () => {
    const objectRef = createRef<HTMLInputElement>();
    const callbackRef = vi.fn();
    const { unmount } = render(<SearchField aria-label="Search" ref={objectRef} />);
    expect(objectRef.current).toBe(screen.getByRole('searchbox'));
    unmount();
    render(<SearchField aria-label="Search" ref={callbackRef} size="lg" disabled />);
    expect(callbackRef).toHaveBeenCalledWith(screen.getByRole('searchbox'));
    expect(screen.getByRole('searchbox')).toBeDisabled();
  });
});
