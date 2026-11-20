import { render, cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StepIndicator } from './StepIndicator';

afterEach(cleanup);

const STEPS = [
  { id: 'start', label: 'Start' },
  { id: 'stages', label: 'Stages' },
  { id: 'team', label: 'Team' },
  { id: 'review', label: 'Review' },
];

describe('StepIndicator', () => {
  it('lists the steps in order and marks the current one', () => {
    render(<StepIndicator steps={STEPS} currentIndex={1} compact="never" />);
    const navigation = screen.getByRole('navigation', { name: 'Steps' });
    const items = within(navigation).getAllByRole('listitem');
    expect(items.map((item) => item.textContent)).toEqual([
      'Start (done)',
      '2Stages (current step)',
      '3Team (not started)',
      '4Review (not started)',
    ]);
    expect(within(items[1]).getByText('Stages', { exact: false })).toHaveAttribute(
      'aria-current',
      'step',
    );
  });

  it('lets a finished step be chosen when there is a handler', async () => {
    const onStepSelect = vi.fn();
    render(
      <StepIndicator steps={STEPS} currentIndex={2} onStepSelect={onStepSelect} compact="never" />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Stages (done)' }));
    expect(onStepSelect).toHaveBeenCalledWith(1);
    expect(screen.queryByRole('button', { name: /Review/ })).not.toBeInTheDocument();
  });

  it('lets a reached step ahead be chosen and announces it as visited', async () => {
    const onStepSelect = vi.fn();
    render(
      <StepIndicator
        steps={STEPS}
        currentIndex={0}
        onStepSelect={onStepSelect}
        isStepReachable={(index) => index <= 2}
        compact="never"
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Team (visited)' }));
    expect(onStepSelect).toHaveBeenCalledWith(2);
    expect(screen.getByRole('button', { name: 'Stages (visited)' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Review/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Start/ })).not.toBeInTheDocument();
    expect(screen.getByText('Review', { exact: false })).toHaveTextContent('4Review (not started)');
  });

  it('keeps a finished step static when it is not reachable', () => {
    render(
      <StepIndicator
        steps={STEPS}
        currentIndex={2}
        onStepSelect={vi.fn()}
        isStepReachable={(index) => index !== 0}
        compact="never"
      />,
    );
    expect(screen.queryByRole('button', { name: 'Start (done)' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stages (done)' })).toBeInTheDocument();
  });

  it('keeps finished steps static without a handler', () => {
    render(<StepIndicator steps={STEPS} currentIndex={2} compact="never" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('summarises the position when compact', () => {
    render(<StepIndicator steps={STEPS} currentIndex={1} compact="always" />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.getByText('Step 2 of 4').parentElement).toHaveTextContent('Step 2 of 4 · Stages');
  });

  it('switches between the list and the summary by width when auto', () => {
    render(<StepIndicator steps={STEPS} currentIndex={0} label="New program steps" />);
    const navigation = screen.getByRole('navigation', { name: 'New program steps' });
    expect(navigation.querySelector('ol')).toHaveClass('hidden', 'sm:flex');
    expect(screen.getByText('Step 1 of 4').parentElement).toHaveClass('sm:hidden');
  });
});
