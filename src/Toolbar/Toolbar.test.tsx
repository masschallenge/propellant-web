import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Toolbar } from './Toolbar';

afterEach(cleanup);

describe('Toolbar', () => {
  it('renders leading, title, trailing and accessory content in a banner', () => {
    render(
      <Toolbar
        leading={<button type="button">Cohort Alpha</button>}
        title="Round 1"
        trailing={<button type="button">Export</button>}
        accessory={<div role="radiogroup" aria-label="Program stage" />}
      />,
    );
    const banner = screen.getByRole('banner');
    expect(banner).toHaveTextContent('Round 1');
    expect(screen.getByRole('button', { name: 'Cohort Alpha' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: 'Program stage' })).toBeInTheDocument();
  });

  it('sticks to the top by default and can scroll away', () => {
    const { rerender } = render(<Toolbar title="Round 1" />);
    expect(screen.getByRole('banner')).toHaveClass('sticky', 'top-0');
    rerender(<Toolbar title="Round 1" sticky={false} />);
    expect(screen.getByRole('banner')).not.toHaveClass('sticky');
  });

  it('marks itself as the app header that sticky page frames clear', () => {
    render(<Toolbar title="Round 1" />);
    expect(screen.getByRole('banner')).toHaveAttribute('data-propellant-app-header');
  });

  it('shows no sidebar toggle outside an app shell', () => {
    render(<Toolbar title="Round 1" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
