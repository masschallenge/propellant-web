import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

afterEach(cleanup);

describe('Switch', () => {
  it('toggles itself when uncontrolled and reports the next state', async () => {
    const onChange = vi.fn();
    render(<Switch label="Email judges" onChange={onChange} />);
    const control = screen.getByRole('switch', { name: 'Email judges' });
    expect(control).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(control);
    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('follows the checked prop when controlled', async () => {
    const onChange = vi.fn();
    render(<Switch label="Email judges" checked onChange={onChange} />);
    const control = screen.getByRole('switch');
    await userEvent.click(control);
    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('describes the control by its hint', () => {
    render(<Switch label="Email judges" hint="Sent at 9:00 AM" />);
    expect(screen.getByRole('switch')).toHaveAccessibleDescription('Sent at 9:00 AM');
  });

  it('ignores activation when disabled', async () => {
    const onChange = vi.fn();
    render(<Switch label="Email judges" disabled onChange={onChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps a 3:1 edge on the off track and fills with the tint when on', () => {
    const { rerender } = render(<Switch aria-label="Email judges" />);
    const track = () => screen.getByRole('switch').firstElementChild as HTMLElement;
    expect(track().className).toContain('shadow-[inset_0_0_0_1px_var(--control-border)]');
    rerender(<Switch aria-label="Email judges" checked />);
    expect(track().className).toContain('bg-[var(--tint)]');
  });

  it('fills with the success colour and keeps a 1px edge when the tone is success', () => {
    render(<Switch aria-label="Online selection" tone="success" checked />);
    const track = screen.getByRole('switch').firstElementChild as HTMLElement;
    expect(track.className).toContain('bg-[var(--success-solid)]');
    expect(track.className).toContain('shadow-[inset_0_0_0_1px_var(--success)]');
  });

  it('draws the medium switch at 40 by 24 with a 20px knob', () => {
    render(<Switch aria-label="Email judges" checked />);
    const track = screen.getByRole('switch').firstElementChild as HTMLElement;
    expect(track).toHaveClass('w-10', 'h-6');
    expect(track.firstElementChild).toHaveClass('w-5', 'h-5', 'translate-x-4');
  });

  it('draws the compact switch at 38 by 22 with an 18px knob', () => {
    render(<Switch aria-label="Email judges" size="compact" checked />);
    const track = screen.getByRole('switch').firstElementChild as HTMLElement;
    expect(track).toHaveClass('w-9.5', 'h-5.5');
    expect(track.firstElementChild).toHaveClass('w-4.5', 'h-4.5', 'translate-x-4');
  });

  it('renders the bare control when there is no label or hint', () => {
    render(<Switch aria-label="Email judges" className="ml-auto" />);
    expect(screen.getByRole('switch', { name: 'Email judges' })).toHaveClass('ml-auto');
  });

  it('puts a semibold label first and pushes the switch to the far edge when leading', async () => {
    const onChange = vi.fn();
    render(<Switch label="Allow N/A" labelPlacement="leading" onChange={onChange} />);
    const control = screen.getByRole('switch', { name: 'Allow N/A' });
    const row = control.parentElement as HTMLElement;
    expect(row).toHaveClass('justify-between');
    expect(row.lastElementChild).toBe(control);
    const label = screen.getByText('Allow N/A');
    expect(label).toHaveClass('font-semibold');
    await userEvent.click(label);
    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('keeps the label after the switch by default', () => {
    render(<Switch label="Email judges" />);
    const control = screen.getByRole('switch');
    expect(control.parentElement?.firstElementChild).toBe(control);
    expect(screen.getByText('Email judges')).not.toHaveClass('font-semibold');
  });
});

describe('Switch leading hint', () => {
  it('puts a hint before the switch when there is no label', () => {
    render(<Switch aria-label="Allow N/A" hint="Judges can skip" labelPlacement="leading" />);
    const control = screen.getByRole('switch', { name: 'Allow N/A' });
    expect(control.parentElement?.lastElementChild).toBe(control);
    expect(screen.getByText('Judges can skip')).toBeInTheDocument();
  });
});
