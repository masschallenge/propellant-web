import { render, cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { StatusIcon } from './StatusIcon';

afterEach(cleanup);

describe('StatusIcon', () => {
  it('draws the symbol in its tone color with no box behind it', () => {
    const { container } = render(
      <StatusIcon tone="critical">
        <svg />
      </StatusIcon>,
    );
    const icon = container.firstElementChild as HTMLElement;
    expect(icon).toHaveAttribute('data-tone', 'critical');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon.className).toContain('text-[var(--critical)]');
    expect(icon.className).not.toContain('bg-');
  });

  it('becomes a labelled image when given a label', () => {
    render(
      <StatusIcon tone="success" label="Saved">
        <svg />
      </StatusIcon>,
    );
    expect(screen.getByRole('img', { name: 'Saved' })).toBeInTheDocument();
  });
});
