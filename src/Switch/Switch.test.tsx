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

  it('renders the bare control when there is no label or hint', () => {
    render(<Switch aria-label="Email judges" className="ml-auto" />);
    expect(screen.getByRole('switch', { name: 'Email judges' })).toHaveClass('ml-auto');
  });
});
