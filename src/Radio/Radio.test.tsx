import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { Radio, RadioGroup } from './Radio';

afterEach(cleanup);

describe('Radio', () => {
  it('keeps the native input at a real 1px size with the focus ring on the drawn circle', () => {
    render(<Radio label="Morning session" />);
    const input = screen.getByRole('radio', { name: 'Morning session' });
    expect(input).toHaveClass('absolute', 'w-px', 'h-px', 'opacity-0');
    expect(input.nextElementSibling).toHaveClass(
      'rounded-full',
      'peer-checked:bg-[var(--tint)]',
      'peer-focus-visible:outline-[var(--focus-color)]',
    );
  });

  it('describes the input by its hint and draws an error edge', () => {
    render(<Radio label="Morning session" hint="Panel is full." error />);
    const input = screen.getByRole('radio', { name: /Morning session/ });
    expect(input).toHaveAccessibleDescription('Panel is full.');
    expect(input.nextElementSibling?.className).toContain('--critical');
  });
});

describe('Radio name', () => {
  it('takes its name from the label and its description from the hint', () => {
    render(<Radio name="session" label="Afternoon session" hint="1:00 PM to 4:00 PM" />);
    const radio = screen.getByRole('radio', { name: 'Afternoon session' });
    expect(radio).toHaveAccessibleDescription('1:00 PM to 4:00 PM');
  });
});

describe('Radio ref', () => {
  it('forwards its ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Radio label="Morning" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('radio', { name: 'Morning' }));
  });
});

describe('RadioGroup', () => {
  it('shares one generated name so a choice clears the others', async () => {
    render(
      <RadioGroup legend="Judging session">
        <Radio label="Morning" value="morning" />
        <Radio label="Afternoon" value="afternoon" />
      </RadioGroup>,
    );
    const morning = screen.getByRole('radio', { name: 'Morning' });
    const afternoon = screen.getByRole('radio', { name: 'Afternoon' });
    expect(morning.getAttribute('name')).toBeTruthy();
    expect(morning.getAttribute('name')).toBe(afternoon.getAttribute('name'));
    await userEvent.click(morning);
    await userEvent.click(afternoon);
    expect(morning).not.toBeChecked();
    expect(afternoon).toBeChecked();
  });

  it('keeps an explicit name and names the group by its legend and error', () => {
    render(
      <RadioGroup legend="Judging session" name="session" error="Choose a session.">
        <Radio label="Morning" value="morning" />
        <Radio label="Afternoon" value="afternoon" name="custom" />
      </RadioGroup>,
    );
    const group = screen.getByRole('group', { name: 'Judging session' });
    expect(group).toHaveAccessibleDescription('Choose a session.');
    expect(screen.getByRole('radio', { name: 'Morning' })).toHaveAttribute('name', 'session');
    expect(screen.getByRole('radio', { name: 'Afternoon' })).toHaveAttribute('name', 'custom');
    expect(screen.getByText('Judging session')).not.toHaveClass('uppercase');
  });
});
