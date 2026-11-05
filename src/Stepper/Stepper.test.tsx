import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Stepper } from './Stepper';

afterEach(cleanup);

describe('Stepper', () => {
  it('steps an uncontrolled value within its bounds', async () => {
    const onChange = vi.fn();
    render(
      <Stepper
        aria-label="Judges per startup"
        defaultValue={2}
        min={1}
        max={3}
        onChange={onChange}
      />,
    );
    const group = screen.getByRole('group', { name: 'Judges per startup' });
    const increase = screen.getByRole('button', { name: 'Increase' });
    const decrease = screen.getByRole('button', { name: 'Decrease' });
    expect(group).toHaveTextContent('2');
    await userEvent.click(increase);
    expect(group).toHaveTextContent('3');
    expect(onChange).toHaveBeenLastCalledWith(3);
    expect(increase).toBeDisabled();
    await userEvent.click(decrease);
    await userEvent.click(decrease);
    expect(group).toHaveTextContent('1');
    expect(decrease).toBeDisabled();
  });

  it('follows a controlled value and formats it', async () => {
    const onChange = vi.fn();
    render(
      <Stepper
        aria-label="Pitch length"
        value={10}
        step={5}
        onChange={onChange}
        formatValue={(minutes) => `${minutes} min`}
        incrementLabel="Longer"
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Longer' }));
    expect(onChange).toHaveBeenCalledWith(15);
    expect(screen.getByRole('status')).toHaveTextContent('10 min');
  });

  it('disables both buttons when disabled', () => {
    render(<Stepper aria-label="Rounds" disabled size="sm" />);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled();
  });
});
