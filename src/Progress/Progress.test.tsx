import { render, cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Progress, ProgressCircle, ProgressRing } from './Progress';

afterEach(cleanup);

const indicatorOf = () => screen.getByRole('progressbar').firstElementChild as HTMLElement;

describe('Progress tone', () => {
  it('uses the brand indicator by default', () => {
    render(<Progress value={40} aria-label="Problem" />);
    expect(indicatorOf().className).toContain('bg-[var(--tint)]');
  });

  it('uses the success indicator when tone is success', () => {
    render(<Progress value={87} tone="success" aria-label="Problem" />);
    expect(indicatorOf().className).toContain('bg-[var(--success-solid)]');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '87');
  });
});

describe('Progress track and value', () => {
  it('fills with the tint on a fill secondary track and clamps the value', () => {
    render(<Progress value={140} label="Applications reviewed" />);
    const bar = screen.getByRole('progressbar', { name: 'Applications reviewed' });
    expect(bar.className).toContain('bg-[var(--fill-secondary)]');
    expect(bar).toHaveAttribute('aria-valuenow', '100');
    expect(indicatorOf().style.width).toBe('100%');
  });

  it('shows the percentage on the trailing side, below, or not at all', () => {
    const { rerender } = render(<Progress value={30} aria-label="Scores" />);
    expect(screen.getByText('30%')).toBeTruthy();
    rerender(<Progress value={30} aria-label="Scores" valuePosition="none" />);
    expect(screen.queryByText('30%')).toBeNull();
    rerender(<Progress value={30} aria-label="Scores" valuePosition="float-top" />);
    expect(screen.getByText('30%').style.left).toBe('30%');
  });
});

describe('ProgressRing', () => {
  it('names itself from the label and turns success when complete', () => {
    const { container } = render(<ProgressRing value={100} label="Judging" />);
    expect(screen.getByRole('progressbar', { name: 'Judging progress' })).toBeTruthy();
    const arcs = container.querySelectorAll('circle');
    expect(arcs[0].getAttribute('class')).toContain('stroke-[var(--fill-secondary)]');
    expect(arcs[1].getAttribute('class')).toContain('stroke-[var(--success-solid)]');
  });

  it('draws no arc at zero and shows the percentage by default', () => {
    const { container } = render(<ProgressRing value={0} aria-label="Mentor matches" size="sm" />);
    expect(container.querySelectorAll('circle')).toHaveLength(1);
    expect(screen.getByText('0%')).toBeTruthy();
  });
});

describe('ProgressCircle', () => {
  it('reports its value with the caption as the name', () => {
    render(<ProgressCircle value={64} caption="Cohort onboarding" half />);
    expect(screen.getByRole('progressbar', { name: 'Cohort onboarding' })).toHaveAttribute(
      'aria-valuenow',
      '64',
    );
  });
});
