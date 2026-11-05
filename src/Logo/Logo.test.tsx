import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Logo } from './Logo';
import { MC_LOGO_HORIZONTAL, MC_MONOGRAM } from '../assets/logos';

afterEach(cleanup);

describe('Logo', () => {
  it('renders the full color horizontal lockup named MassChallenge by default', () => {
    render(<Logo />);
    const logo = screen.getByRole('img', { name: 'MassChallenge' });
    expect(logo).toHaveAttribute('src', MC_LOGO_HORIZONTAL);
    expect(logo).toHaveAttribute('data-lockup', 'horizontal');
    expect(logo).toHaveAttribute('data-treatment', 'color');
    expect(logo.className).not.toContain('filter');
  });

  it('renders the monogram', () => {
    render(<Logo lockup="monogram" />);
    expect(screen.getByRole('img', { name: 'MassChallenge' })).toHaveAttribute('src', MC_MONOGRAM);
  });

  it('turns the mark white or black for one color treatments', () => {
    const { rerender } = render(<Logo treatment="white" />);
    expect(screen.getByRole('img')).toHaveClass('[filter:brightness(0)_invert(1)]');
    rerender(<Logo treatment="black" />);
    expect(screen.getByRole('img')).toHaveClass('[filter:brightness(0)]');
  });

  it('can be decorative when a visible name sits beside it', () => {
    const { container } = render(<Logo label="" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('accepts a size and other image attributes', () => {
    render(<Logo className="h-10" loading="lazy" />);
    const logo = screen.getByRole('img');
    expect(logo).toHaveClass('h-10');
    expect(logo).toHaveAttribute('loading', 'lazy');
  });
});
