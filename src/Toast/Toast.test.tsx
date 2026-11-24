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

describe('Toast action placement', () => {
  it('keeps actions under the title by default', () => {
    render(<Toast title="New judge comment" actions={[{ label: 'Reply' }]} />);
    const toast = screen.getByRole('status');
    const reply = screen.getByRole('button', { name: 'Reply' });
    expect(toast).not.toHaveClass('items-center');
    expect(screen.getByText('New judge comment').parentElement).toContainElement(reply);
  });

  it('puts the action on the same line as the message, vertically centred', () => {
    render(
      <Toast
        title="Deadline extended to Fri, Nov 13 @ 5:00 PM ET."
        actions={[{ label: 'Undo' }]}
        actionPlacement="inline"
      />,
    );
    const toast = screen.getByRole('status');
    const undo = screen.getByRole('button', { name: 'Undo' });
    const message = screen.getByText('Deadline extended to Fri, Nov 13 @ 5:00 PM ET.');
    expect(toast).toHaveClass('items-center');
    expect(message.parentElement).not.toContainElement(undo);
    expect(undo.parentElement).toHaveClass('flex-none');
    expect(undo.parentElement?.parentElement).toBe(toast);
    expect(toast.lastElementChild).toContainElement(undo);
  });

  it('keeps the inline action a keyboard reachable button inside the live region', async () => {
    const onUndo = vi.fn();
    render(
      <Toast
        title="Deadline extended"
        tone="error"
        actions={[{ label: 'Undo', onClick: onUndo }]}
        actionPlacement="inline"
      />,
    );
    await userEvent.tab();
    const undo = screen.getByRole('button', { name: 'Undo' });
    expect(undo).toHaveFocus();
    expect(undo).toHaveAttribute('type', 'button');
    await userEvent.keyboard('{Enter}');
    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('alert')).toContainElement(undo);
  });

  it('clears the dismiss button beside an inline action', () => {
    render(
      <Toast
        title="Deadline extended"
        actions={[{ label: 'Undo' }]}
        actionPlacement="inline"
        onDismiss={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Undo' }).parentElement).toHaveClass('pr-7');
    expect(screen.getByText('Deadline extended').parentElement).not.toHaveClass('pr-7');
  });

  it('types inline only for a one line toast without body, timestamp or progress', () => {
    const undo = [{ label: 'Undo' }];
    render(
      <>
        {/* @ts-expect-error inline actions are only typed for a toast without children */}
        <Toast title="With body" actions={undo} actionPlacement="inline">
          Judges see it now.
        </Toast>
        {/* @ts-expect-error inline actions are only typed for a toast without a timestamp */}
        <Toast title="With timestamp" actions={undo} actionPlacement="inline" when="Now" />
        {/* @ts-expect-error inline actions are only typed for a toast without progress */}
        <Toast title="With progress" actions={undo} actionPlacement="inline" progress={40} />
        <Toast title="One line" actions={undo} actionPlacement="inline" />
      </>,
    );
    expect(screen.getAllByRole('status')).toHaveLength(4);
  });

  it('keeps the message clear of the dismiss button when inline has no actions', () => {
    render(<Toast title="Deadline extended" actionPlacement="inline" onDismiss={vi.fn()} />);
    expect(screen.getByText('Deadline extended').parentElement).toHaveClass('pr-7');
  });
});
