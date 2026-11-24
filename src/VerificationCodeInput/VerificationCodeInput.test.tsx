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

  it('replaces the character in a filled cell with the one typed over it', () => {
    const onChange = vi.fn();
    render(<VerificationCodeInput length={4} defaultValue="12" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Digit 1 of 4' }), {
      target: { value: '19' },
    });
    expect(onChange).toHaveBeenLastCalledWith('92');
    expect(screen.getByRole('textbox', { name: 'Digit 2 of 4' })).toHaveFocus();
  });

  it('spreads a pasted code across the cells and focuses the cell after it', () => {
    const onChange = vi.fn();
    render(<VerificationCodeInput length={6} onChange={onChange} />);
    const first = screen.getByRole('textbox', { name: 'Digit 1 of 6' });
    const pasteEvent = fireEvent.paste(first, { clipboardData: { getData: () => '48 1-2' } });
    expect(pasteEvent).toBe(false);
    expect(onChange).toHaveBeenLastCalledWith('4812');
    expect(screen.getByRole('textbox', { name: 'Digit 4 of 6' })).toHaveValue('2');
    expect(screen.getByRole('textbox', { name: 'Digit 5 of 6' })).toHaveFocus();
  });

  it('fills every cell from the start when a whole code is pasted into a later cell', () => {
    const onChange = vi.fn();
    render(<VerificationCodeInput length={4} onChange={onChange} />);
    fireEvent.paste(screen.getByRole('textbox', { name: 'Digit 3 of 4' }), {
      clipboardData: { getData: () => '904417' },
    });
    expect(onChange).toHaveBeenLastCalledWith('9044');
    expect(screen.getByRole('textbox', { name: 'Digit 4 of 4' })).toHaveFocus();
  });

  it('lets the browser autofill a one time code into the first cell', () => {
    const onChange = vi.fn();
    render(<VerificationCodeInput length={6} onChange={onChange} />);
    const first = screen.getByRole('textbox', { name: 'Digit 1 of 6' });
    expect(first).toHaveAttribute('autocomplete', 'one-time-code');
    expect(first).not.toHaveAttribute('maxlength');
    expect(screen.getByRole('textbox', { name: 'Digit 2 of 6' })).toHaveAttribute(
      'autocomplete',
      'off',
    );
    fireEvent.change(first, { target: { value: '730215' } });
    expect(onChange).toHaveBeenLastCalledWith('730215');
    expect(screen.getByRole('textbox', { name: 'Digit 6 of 6' })).toHaveValue('5');
  });

  it('takes a whole autofilled code into a two cell input that already holds a digit', () => {
    const onChange = vi.fn();
    render(<VerificationCodeInput length={2} defaultValue="1" onChange={onChange} />);
    fireEvent.input(screen.getByRole('textbox', { name: 'Digit 1 of 2' }), {
      target: { value: '12' },
      inputType: 'insertReplacementText',
    });
    expect(onChange).toHaveBeenLastCalledWith('12');
    expect(screen.getByRole('textbox', { name: 'Digit 2 of 2' })).toHaveValue('2');
  });

  it('treats a value as long as the code as a whole code when the input type is unknown', () => {
    const onChange = vi.fn();
    render(<VerificationCodeInput length={2} defaultValue="1" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Digit 1 of 2' }), {
      target: { value: '12' },
    });
    expect(onChange).toHaveBeenLastCalledWith('12');
  });

  it('still replaces the digit when someone types over a filled cell of a two cell input', () => {
    const onChange = vi.fn();
    render(<VerificationCodeInput length={2} defaultValue="1" onChange={onChange} />);
    fireEvent.input(screen.getByRole('textbox', { name: 'Digit 1 of 2' }), {
      target: { value: '19' },
      inputType: 'insertText',
    });
    expect(onChange).toHaveBeenLastCalledWith('9');
    expect(screen.getByRole('textbox', { name: 'Digit 2 of 2' })).toHaveFocus();
  });

  it('fills from the first cell when a whole code is autofilled into a later cell', () => {
    const onChange = vi.fn();
    render(<VerificationCodeInput length={4} defaultValue="5" onChange={onChange} />);
    fireEvent.input(screen.getByRole('textbox', { name: 'Digit 3 of 4' }), {
      target: { value: '8812' },
      inputType: 'insertReplacementText',
    });
    expect(onChange).toHaveBeenLastCalledWith('8812');
  });

  it('keeps the cell and its focus when someone types a character a code cannot hold', () => {
    const onChange = vi.fn();
    render(<VerificationCodeInput length={4} defaultValue="3" onChange={onChange} />);
    const first = screen.getByRole('textbox', { name: 'Digit 1 of 4' });
    first.focus();
    fireEvent.input(first, { target: { value: '3-' }, inputType: 'insertText' });
    expect(onChange).not.toHaveBeenCalled();
    expect(first).toHaveFocus();
    expect(first).toHaveValue('3');
  });

  it('blocks a paste with no code characters so the cell keeps its digit', () => {
    const onChange = vi.fn();
    render(<VerificationCodeInput length={4} defaultValue="3" onChange={onChange} />);
    const first = screen.getByRole('textbox', { name: 'Digit 1 of 4' });
    const pasteEvent = fireEvent.paste(first, { clipboardData: { getData: () => ' - ' } });
    expect(pasteEvent).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
    expect(first).toHaveValue('3');
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
