import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Token } from './Token';

afterEach(cleanup);

describe('Token', () => {
  it('renders a static label in a neutral capsule', () => {
    render(<Token label="Health" count={3} />);
    expect(screen.getByText('Health')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('toggles as a pressed button and reports the next state', async () => {
    const onToggle = vi.fn();
    render(<Token label="Hardware" onToggle={onToggle} />);
    const token = screen.getByRole('button', { name: 'Hardware' });
    expect(token).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(token);
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('shows the tint and a check when selected', () => {
    render(<Token label="Software" onToggle={vi.fn()} selected />);
    const token = screen.getByRole('button', { name: 'Software' });
    expect(token).toHaveAttribute('aria-pressed', 'true');
    expect(token.className).toContain('bg-[var(--tint-fill)]');
    expect(token.querySelector('svg')).not.toBeNull();
  });

  it('removes with a labelled button that does not toggle', async () => {
    const onToggle = vi.fn();
    const onRemove = vi.fn();
    render(<Token label="Fintech" onToggle={onToggle} onRemove={onRemove} />);
    await userEvent.click(screen.getByRole('button', { name: 'Remove Fintech' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onToggle).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Fintech' }));
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('takes a category color for its fill and dot', () => {
    const { container } = render(<Token label="Women-led" color="#bf0261" dot />);
    const shell = container.firstElementChild as HTMLElement;
    expect(shell.style.getPropertyValue('--token-color')).toBe('#bf0261');
    expect(shell.className).toContain('color-mix(in_srgb,var(--token-color)_16%,var(--bg))');
  });

  it('blocks interaction when disabled', async () => {
    const onToggle = vi.fn();
    render(<Token label="Hardware" onToggle={onToggle} disabled />);
    await userEvent.click(screen.getByRole('button', { name: 'Hardware' }));
    expect(onToggle).not.toHaveBeenCalled();
  });

  describe('with rich content', () => {
    const highlighted = (
      <>
        <mark>Cli</mark>mate
      </>
    );

    it('shows the content and keeps the label as the text alternative', () => {
      const { container } = render(<Token label="Climate">{highlighted}</Token>);
      const mark = container.querySelector('mark');
      expect(mark).toHaveTextContent('Cli');
      expect(mark?.closest('[aria-hidden="true"]')).not.toBeNull();
      expect(screen.getByText('Climate')).toHaveClass('sr-only');
    });

    it('names a toggle by its label and keeps the pressed state', async () => {
      const onToggle = vi.fn();
      render(
        <Token label="Climate" onToggle={onToggle} selected>
          {highlighted}
        </Token>,
      );
      const token = screen.getByRole('button', { name: 'Climate' });
      expect(token).toHaveAttribute('aria-pressed', 'true');
      token.focus();
      await userEvent.keyboard(' ');
      expect(onToggle).toHaveBeenCalledWith(false);
    });

    it('names the remove button by the label', async () => {
      const onRemove = vi.fn();
      render(
        <Token label="Climate" onRemove={onRemove}>
          {highlighted}
        </Token>,
      );
      screen.getByRole('button', { name: 'Remove Climate' }).focus();
      await userEvent.keyboard('{Enter}');
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('lets an explicit ariaLabel name a toggle', () => {
      render(
        <Token label="Climate" ariaLabel="Filter by Climate" onToggle={vi.fn()}>
          {highlighted}
        </Token>,
      );
      expect(screen.getByRole('button', { name: 'Filter by Climate' })).toBeInTheDocument();
    });
  });
});
