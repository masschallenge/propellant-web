import { render, cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Skeleton, SkeletonGroup } from './Skeleton';

afterEach(cleanup);

describe('Skeleton', () => {
  it('is hidden from assistive tech and pulses only when motion is allowed', () => {
    const { container } = render(<Skeleton />);
    const bone = container.querySelector('[data-skeleton="text"]');
    expect(bone).toHaveAttribute('aria-hidden', 'true');
    expect(bone?.className).toContain('motion-safe:animate-pulse');
    expect(bone?.className).not.toMatch(/(^|\s)animate-pulse/);
    expect(bone?.className).toContain('bg-[var(--fill-secondary)]');
  });

  it('takes a width, and a height only as a block', () => {
    const { container } = render(
      <>
        <Skeleton shape="heading" width="40%" height="999px" />
        <Skeleton shape="block" height="10rem" />
        <Skeleton shape="circle" width="40%" />
      </>,
    );
    const heading = container.querySelector<HTMLElement>('[data-skeleton="heading"]');
    const block = container.querySelector<HTMLElement>('[data-skeleton="block"]');
    const circle = container.querySelector<HTMLElement>('[data-skeleton="circle"]');
    expect(heading?.style.width).toBe('40%');
    expect(heading?.style.height).toBe('');
    expect(block?.style.width).toBe('100%');
    expect(block?.style.height).toBe('10rem');
    expect(circle?.style.width).toBe('');
  });
});

describe('SkeletonGroup', () => {
  it('announces its label in a polite status beside one busy region', () => {
    const { container } = render(
      <SkeletonGroup label="Loading your Selection Pitching">
        <Skeleton />
        <Skeleton />
      </SkeletonGroup>,
    );
    const status = screen.getByRole('status');
    const busyRegions = container.querySelectorAll('[aria-busy="true"]');
    expect(busyRegions).toHaveLength(1);
    expect(status.closest('[aria-busy]')).toBeNull();
    expect(status.nextElementSibling).toBe(busyRegions[0]);
    expect(busyRegions[0]).toHaveAttribute('aria-hidden', 'true');
    expect(busyRegions[0].querySelectorAll('[data-skeleton]')).toHaveLength(2);
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent('Loading your Selection Pitching');
  });
});

describe('Skeleton shapes', () => {
  it('rounds each shape to its token corner', () => {
    const { container } = render(
      <>
        <Skeleton shape="pill" />
        <Skeleton shape="block" />
      </>,
    );
    expect(container.querySelector('[data-skeleton="pill"]')?.className).toContain(
      'rounded-[var(--corner-capsule)]',
    );
    expect(container.querySelector('[data-skeleton="block"]')?.className).toContain(
      'rounded-[var(--corner-lg)]',
    );
  });

  it('keeps the group label visually hidden', () => {
    render(<SkeletonGroup label="Loading judges" className="grid gap-2" />);
    expect(screen.getByRole('status').className).toContain('sr-only');
  });
});
