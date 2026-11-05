import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Banner } from './Banner';

afterEach(cleanup);

describe('Banner', () => {
  it('announces critical banners as alerts and the rest as status', () => {
    const { rerender } = render(<Banner tone="critical">Upload failed</Banner>);
    expect(screen.getByRole('alert')).toHaveTextContent('Upload failed');
    rerender(<Banner tone="success">Saved</Banner>);
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });

  it.each([
    ['neutral', '[--banner-bg:var(--fill-tertiary)]'],
    ['info', '[--banner-bg:var(--tint-fill)]'],
    ['success', '[--banner-bg:var(--success-fill)]'],
    ['warning', '[--banner-bg:var(--warning-fill)]'],
    ['critical', '[--banner-bg:var(--critical-fill)]'],
  ] as const)('paints the %s tone as a soft fill', (tone, fill) => {
    render(<Banner tone={tone}>Message</Banner>);
    expect(screen.getByRole(tone === 'critical' ? 'alert' : 'status').className).toContain(fill);
  });

  it('draws the masquerade tone as a solid bar', () => {
    render(
      <Banner tone="masquerade" full>
        Viewing as an applicant
      </Banner>,
    );
    const className = screen.getByRole('status').className;
    expect(className).toContain('[--banner-bg:var(--masquerade)]');
    expect(className).toContain('rounded-none');
  });

  it('renders the title, body and actions', () => {
    render(
      <Banner title="Scoring opens Monday" actions={<button type="button">Assign</button>}>
        Judges can start scoring.
      </Banner>,
    );
    expect(screen.getByText('Scoring opens Monday')).toBeInTheDocument();
    expect(screen.getByText('Judges can start scoring.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Assign' })).toBeInTheDocument();
  });

  it('dismisses with a labelled button', async () => {
    const onDismiss = vi.fn();
    render(
      <Banner onDismiss={onDismiss} dismissLabel="Hide notice">
        Saved
      </Banner>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Hide notice' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
