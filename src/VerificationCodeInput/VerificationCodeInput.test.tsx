import { useState } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { VerificationCodeInput } from './VerificationCodeInput';

afterEach(cleanup);

describe('VerificationCodeInput', () => {
  it('fills a cell, moves focus forward and reports the whole code', () => {
    const onChange = vi.fn();
    render(<VerificationCodeInput length={4} onChange={onChange} />);
    const first = screen.getByRole('textbox', { name: 'Digit 1 of 4' });
    fireEvent.change(first, { target: { value: '7' } });
    expect(onChange).toHaveBeenLastCalledWith('7');
    expect(screen.getByRole('textbox', { name: 'Digit 2 of 4' })).toHaveFocus();
    fireEvent.change(screen.getByRole('textbox', { name: 'Digit 2 of 4' }), {
      target: { value: '-' },
    });
    expect(onChange).toHaveBeenLastCalledWith('7');
  });

  it('steps back to the previous cell on Backspace in an empty cell', () => {
    render(<VerificationCodeInput length={4} defaultValue="1" />);
    const second = screen.getByRole('textbox', { name: 'Digit 2 of 4' });
    second.focus();
    fireEvent.keyDown(second, { key: 'Backspace' });
    expect(screen.getByRole('textbox', { name: 'Digit 1 of 4' })).toHaveFocus();
  });

  it('keeps a controlled code and groups the cells with a separator', () => {
    const Controlled = () => {
      const [code, setCode] = useState('12');
      return <VerificationCodeInput length={6} groupAfter={3} value={code} onChange={setCode} />;
    };
    const { container } = render(<Controlled />);
    expect(screen.getByRole('textbox', { name: 'Digit 2 of 6' })).toHaveValue('2');
    expect(container.querySelectorAll('[aria-hidden="true"].rounded-full')).toHaveLength(1);
    expect(container.textContent).toBe('');
  });

  it('names the group by its label and describes every cell by the hint', () => {
    render(
      <VerificationCodeInput length={2} label="Sign in code" hint="Check your email." invalid />,
    );
    expect(screen.getByRole('group', { name: 'Sign in code' })).toBeInTheDocument();
    const cell = screen.getByRole('textbox', { name: 'Digit 1 of 2' });
    expect(cell).toHaveAccessibleDescription('Check your email.');
    expect(cell).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Check your email.')).toHaveClass('text-[var(--critical)]');
  });
});
