import { render, cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { DotSpinner, Spinner } from './Spinner';

afterEach(cleanup);

describe('Spinner', () => {
  it('announces loading with a hidden name when unlabelled', () => {
    render(<Spinner />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Loading').className).toContain('sr-only');
  });

  it('shows a visible label in secondary text, not the tint', () => {
    render(<Spinner label="Loading applications" size="lg" />);
    const label = screen.getByText('Loading applications');
    expect(label.className).toContain('text-[var(--label-secondary)]');
    expect(label.className).not.toContain('--tint');
  });

  it('spins a tint arc on a fill track even under reduced motion', () => {
    const { container } = render(<Spinner thick longArc />);
    const [track, arc] = Array.from(container.querySelectorAll('circle'));
    expect(track.getAttribute('class')).toContain('stroke-[var(--fill-secondary)]');
    expect(arc.getAttribute('class')).toContain('stroke-[var(--tint)]');
    expect(arc.getAttribute('class')).toContain('animate-spin');
    expect(arc.getAttribute('class')).not.toContain('motion-safe');
    expect(arc.getAttribute('stroke-width')).toBe('10');
    expect(arc.getAttribute('stroke-dasharray')).toBe('180 84');
  });
});

describe('DotSpinner', () => {
  it('draws ten pulsing dots and announces its label', () => {
    const { container } = render(<DotSpinner label="Syncing judge scores" />);
    const dots = container.querySelectorAll('circle');
    expect(dots).toHaveLength(10);
    expect(dots[0].getAttribute('class')).not.toContain('motion-safe');
    expect(screen.getByRole('status')).toHaveTextContent('Syncing judge scores');
  });
});
