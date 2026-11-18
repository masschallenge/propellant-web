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

  it('keeps the capsule shape by default', () => {
    render(<Badge size="sm">Live</Badge>);
    const badge = screen.getByText('Live').parentElement as HTMLElement;
    expect(badge.className).toContain('rounded-[var(--corner-capsule)]');
    expect(badge.className).not.toContain('rounded-[var(--corner-sm)]');
  });

  it('draws the board badge with the rounded shape at the small size', () => {
    render(
      <Badge size="sm" shape="rounded">
        Connected
      </Badge>,
    );
    const badge = screen.getByText('Connected').parentElement as HTMLElement;
    expect(badge.className).toContain('rounded-[var(--corner-sm)]');
    expect(badge.className).not.toContain('rounded-[var(--corner-capsule)]');
    expect(badge.className).toContain('min-h-5');
    expect(badge.className).toContain('px-2');
    expect(badge.className).toContain('text-caption');
  });

  it('keeps the rounded shape with a tone dot and when icon only', () => {
    render(
      <>
        <Badge shape="rounded" dot="warning">
          Failing
        </Badge>
        <Badge shape="rounded" iconOnly icon={<svg />} aria-label="Scored" />
      </>,
    );
    expect((screen.getByText('Failing').parentElement as HTMLElement).className).toContain(
      'rounded-[var(--corner-sm)]',
    );
    expect(screen.getByRole('img', { name: 'Scored' }).className).toContain(
      'rounded-[var(--corner-sm)]',
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

  describe('dot tone', () => {
    it.each([
      ['warning', 'bg-[var(--warning)]'],
      ['critical', 'bg-[var(--critical)]'],
    ] as const)('leads a neutral badge with a 7px %s dot', (dotTone, color) => {
      const { container } = render(<Badge dot={dotTone}>Failing</Badge>);
      const badge = screen.getByText('Failing').parentElement as HTMLElement;
      expect(badge).toHaveAttribute('data-tone', 'neutral');
      expect(badge).toHaveAttribute('data-dot', dotTone);
      expect(badge).toHaveClass('bg-[var(--fill-secondary)]', 'px-2.5');
      expect(badge).not.toHaveClass('pl-1.5');
      const dot = container.querySelector('[aria-hidden="true"]') as HTMLElement;
      expect(dot).toHaveClass('w-1.75', 'h-1.75', 'rounded-full', color);
    });

    it('keeps the tone colored dot when dot is true', () => {
      const { container } = render(
        <Badge tone="warning" dot>
          Needs judge
        </Badge>,
      );
      const badge = screen.getByText('Needs judge').parentElement as HTMLElement;
      expect(badge).not.toHaveAttribute('data-dot');
      expect(badge).toHaveClass('pl-1.5');
      const dot = container.querySelector('[aria-hidden="true"]') as HTMLElement;
      expect(dot).toHaveClass('w-1.5', 'h-1.5', 'bg-[var(--warning-solid)]');
    });

    it('keeps its own color on a strong badge', () => {
      const { container } = render(
        <Badge emphasis="strong" dot="critical">
          Failing
        </Badge>,
      );
      const dot = container.querySelector('[aria-hidden="true"]') as HTMLElement;
      expect(dot).toHaveClass('bg-[var(--critical)]');
      expect(dot).not.toHaveClass('bg-current');
    });
  });

  it('exposes an icon-only badge as an image with a label', () => {
    render(<Badge iconOnly icon={<svg />} aria-label="Verified" />);
    expect(screen.getByRole('img', { name: 'Verified' })).toBeInTheDocument();
  });
});
