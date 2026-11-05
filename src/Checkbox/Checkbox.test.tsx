import { createRef } from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

afterEach(cleanup);

describe('Checkbox name', () => {
  it('takes its name from the label and its description from the hint', () => {
    render(<Checkbox label="Email judges" hint="Sent when a judge is assigned" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Email judges' });
    expect(checkbox).toHaveAccessibleDescription('Sent when a judge is assigned');
  });

  it('keeps an explicit name when there is no visible label', () => {
    render(<Checkbox aria-label="Select Northwind Robotics" />);
    expect(screen.getByRole('checkbox', { name: 'Select Northwind Robotics' })).toBeInTheDocument();
  });
});

describe('Checkbox native input', () => {
  it('stays visually hidden at a real 1px size in the label corner', () => {
    render(<Checkbox label="9:00 AM" />);
    const input = screen.getByRole('checkbox', { name: '9:00 AM' });
    expect(input).toHaveClass('absolute', 'top-0', 'left-0', 'w-px', 'h-px', 'opacity-0');
    expect(input).not.toHaveClass('w-0');
    expect(input).toHaveClass('z-[1]');
    expect(input.closest('label')).toHaveClass('relative');
  });

  it('keeps the focus ring on the drawn box', () => {
    render(<Checkbox label="9:00 AM" />);
    const box = screen.getByRole('checkbox', { name: '9:00 AM' }).nextElementSibling;
    expect(box).toHaveClass(
      'peer-focus-visible:outline-[length:var(--focus-width)]',
      'peer-focus-visible:outline-[var(--focus-color)]',
    );
  });

  it('draws a 4px square that fills with the tint when checked', () => {
    render(<Checkbox label="9:00 AM" />);
    const box = screen.getByRole('checkbox', { name: '9:00 AM' }).nextElementSibling;
    expect(box).toHaveClass('rounded-[var(--corner-sm)]', 'peer-checked:bg-[var(--tint)]');
  });

  it('marks itself indeterminate and flags an error with its hint', () => {
    render(<Checkbox label="All judges" indeterminate error hint="Pick at least one judge." />);
    const input = screen.getByRole('checkbox', { name: /All judges/ }) as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Pick at least one judge.');
    expect(screen.getByText('Pick at least one judge.')).toHaveClass('text-[var(--critical)]');
  });

  it('toggles when the label text is clicked', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="9:00 AM" onChange={onChange} />);

    await userEvent.click(screen.getByText('9:00 AM'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('checkbox', { name: '9:00 AM' })).toBeChecked();
  });

  it('can be focused and checked directly', async () => {
    render(<Checkbox label="9:00 AM" />);
    const input = screen.getByRole('checkbox', { name: '9:00 AM' });

    await userEvent.tab();
    expect(input).toHaveFocus();
    await userEvent.keyboard(' ');

    expect(input).toBeChecked();
  });
});

describe('Checkbox ref', () => {
  it('forwards its ref to the input while still driving indeterminate', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox label="All panels" ref={ref} indeterminate />);
    expect(ref.current).toBe(screen.getByRole('checkbox', { name: 'All panels' }));
    expect(ref.current?.indeterminate).toBe(true);
  });
});
