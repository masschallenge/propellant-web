import { render, cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Badge } from './Badge';

afterEach(cleanup);

describe('Badge', () => {
  it.each([
    ['neutral', 'bg-[var(--fill-secondary)]'],
    ['info', 'bg-[var(--tint-fill)]'],
    ['success', 'bg-[var(--success-fill)]'],
    ['warning', 'bg-[var(--warning-fill)]'],
    ['critical', 'bg-[var(--critical-fill)]'],
  ] as const)('paints the %s tone as a soft capsule with no border', (tone, fill) => {
    render(<Badge tone={tone}>Status</Badge>);
    const badge = screen.getByText('Status').parentElement as HTMLElement;
    expect(badge).toHaveAttribute('data-tone', tone);
    expect(badge.className).toContain(fill);
    expect(badge.className).toContain('rounded-[var(--corner-capsule)]');
    expect(badge.className).not.toContain('shadow');
  });

  it('fills solid with strong emphasis', () => {
    render(
      <Badge tone="critical" emphasis="strong">
        Withdrawn
      </Badge>,
    );
    expect((screen.getByText('Withdrawn').parentElement as HTMLElement).className).toContain(
      'bg-[var(--critical-solid)]',
    );
  });

  it('uses the caption style when small', () => {
    render(<Badge size="sm">3 of 3</Badge>);
    expect((screen.getByText('3 of 3').parentElement as HTMLElement).className).toContain(
      'text-caption',
    );
  });

  it('draws a decorative dot that can pulse', () => {
    const { container } = render(
      <Badge tone="warning" dot pulse>
        Live now
      </Badge>,
    );
    const dot = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(dot.className).toContain('motion-safe:animate-pulse');
  });

  it('exposes an icon-only badge as an image with a label', () => {
    render(<Badge iconOnly icon={<svg />} aria-label="Verified" />);
    expect(screen.getByRole('img', { name: 'Verified' })).toBeInTheDocument();
  });
});
