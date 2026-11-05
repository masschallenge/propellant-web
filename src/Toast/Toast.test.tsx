import * as React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Toast } from './Toast';

afterEach(cleanup);

describe('Toast announcement', () => {
  it('announces as a status by default and as an alert for errors', () => {
    const { rerender } = render(<Toast title="Saved" />);
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
    rerender(<Toast title="Failed" tone="error" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Failed');
  });

  it('drops its own live role when the caller owns the announcement', () => {
    render(<Toast title="Saved" tone="error" announce={false} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Saved')).toBeVisible();
  });
});

describe('Toast surface', () => {
  it('floats on the elevated surface and exposes its tone', () => {
    render(<Toast title="Cohort published" tone="success" />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('data-tone', 'success');
    expect(toast).toHaveClass(
      'bg-[var(--bg-elevated)]',
      'shadow-[var(--shadow-float)]',
      'rounded-[var(--corner-lg)]',
    );
    expect(toast.querySelector('[aria-hidden="true"]')).toHaveClass('text-[var(--success)]');
  });

  it('replaces the status glyph with custom media', () => {
    render(<Toast title="Priya replied" media={<span data-testid="avatar">PR</span>} />);
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByRole('status').querySelector('svg')).toBeNull();
  });
});

describe('Toast controls', () => {
  it('runs each action and the dismiss button', async () => {
    const onReply = vi.fn();
    const onMarkRead = vi.fn();
    const onDismiss = vi.fn();
    render(
      <Toast
        title="New judge comment"
        actions={[
          { label: 'Reply', onClick: onReply },
          { label: 'Mark as read', muted: true, onClick: onMarkRead },
        ]}
        onDismiss={onDismiss}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Reply' }));
    await userEvent.click(screen.getByRole('button', { name: 'Mark as read' }));
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(onReply).toHaveBeenCalledTimes(1);
    expect(onMarkRead).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Mark as read' })).toHaveClass(
      'text-[var(--label-secondary)]',
    );
  });

  it('shows upload progress as a labelled progress bar with its percentage', () => {
    render(<Toast title="Uploading pitch-deck.pdf" progress={62} progressLabel="Deck upload" />);
    const bar = screen.getByRole('progressbar', { name: 'Deck upload' });
    expect(bar).toHaveAttribute('aria-valuenow', '62');
    expect(screen.getByText('62%')).toBeInTheDocument();
  });
});
