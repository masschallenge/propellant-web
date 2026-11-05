import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Separator, SeparatorAddButton } from './Separator';

afterEach(cleanup);

describe('Separator', () => {
  it('names a labelled rule and draws hairlines on both sides', () => {
    const { container } = render(<Separator label="or" />);
    const separator = screen.getByRole('separator', { name: 'or' });
    expect(separator).toBeTruthy();
    const rules = container.querySelectorAll('[aria-hidden="true"]');
    expect(rules).toHaveLength(2);
    expect(rules[0].className).toContain('h-[var(--hairline)]');
    expect(screen.getByText('or').className).toContain('text-[var(--label-secondary)]');
  });

  it('draws a single rule with no label and leads with the label when left aligned', () => {
    const { container, rerender } = render(<Separator />);
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
    rerender(<Separator label="Round 1" align="left" />);
    const separator = screen.getByRole('separator');
    expect(separator.firstElementChild?.textContent).toBe('Round 1');
  });

  it('becomes a group when it carries an action so the button stays reachable', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(
      <Separator
        label="Add a judging round"
        action={<SeparatorAddButton aria-label="Add a judging round" onClick={onAdd} />}
      />,
    );
    expect(screen.queryByRole('separator')).toBeNull();
    expect(screen.getByRole('group', { name: 'Add a judging round' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Add a judging round' }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('renders the dual and fill treatments', () => {
    const { rerender } = render(<Separator variant="dual" label="Week 3" />);
    expect(screen.getByRole('separator').className).toContain('border-y-[length:var(--hairline)]');
    rerender(<Separator variant="fill" label="Week 3" />);
    expect(screen.getByRole('separator').className).toContain('bg-[var(--fill-tertiary)]');
  });
});
