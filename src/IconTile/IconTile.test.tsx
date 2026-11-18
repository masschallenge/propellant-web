import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { IconTile } from './IconTile';
import type { IconTileTone } from './IconTile';

afterEach(cleanup);

const TONES: [IconTileTone, string, string][] = [
  ['teal', 'bg-[var(--icon-tile-teal-bg)]', 'text-[var(--icon-tile-teal-fg)]'],
  ['gray', 'bg-[var(--icon-tile-gray-bg)]', 'text-[var(--icon-tile-gray-fg)]'],
  ['orange', 'bg-[var(--icon-tile-orange-bg)]', 'text-[var(--icon-tile-orange-fg)]'],
  ['application', 'bg-[var(--icon-tile-application-bg)]', 'text-[var(--icon-tile-application-fg)]'],
  [
    'prescreening',
    'bg-[var(--icon-tile-prescreening-bg)]',
    'text-[var(--icon-tile-prescreening-fg)]',
  ],
  ['online', 'bg-[var(--icon-tile-online-bg)]', 'text-[var(--icon-tile-online-fg)]'],
  ['pitch', 'bg-[var(--icon-tile-pitch-bg)]', 'text-[var(--icon-tile-pitch-fg)]'],
  ['cohort', 'bg-[var(--icon-tile-cohort-bg)]', 'text-[var(--icon-tile-cohort-fg)]'],
  ['closed', 'bg-[var(--icon-tile-closed-bg)]', 'text-[var(--icon-tile-closed-fg)]'],
];

const glyph = <svg data-testid="glyph" />;

describe('IconTile', () => {
  it('draws a 36px tile with the tile corner around an 18px icon', () => {
    render(<IconTile icon={glyph} data-testid="tile" />);
    const tile = screen.getByTestId('tile');
    expect(tile).toHaveClass(
      'w-[var(--avatar-md)]',
      'h-[var(--avatar-md)]',
      'rounded-[var(--corner-tile)]',
      '[&>svg]:w-[var(--icon-md)]',
      '[&>svg]:h-[var(--icon-md)]',
    );
    expect(tile).toContainElement(screen.getByTestId('glyph'));
  });

  it.each(TONES)('paints the %s tone from its own tokens', (tone, background, foreground) => {
    render(<IconTile icon={glyph} tone={tone} data-testid="tile" />);
    const tile = screen.getByTestId('tile');
    expect(tile).toHaveAttribute('data-tone', tone);
    expect(tile).toHaveClass(background, foreground);
  });

  it('is teal unless a tone is named', () => {
    render(<IconTile icon={glyph} data-testid="tile" />);
    expect(screen.getByTestId('tile')).toHaveAttribute('data-tone', 'teal');
  });

  it('is hidden from assistive technology when it has no name', () => {
    render(<IconTile icon={glyph} data-testid="tile" />);
    const tile = screen.getByTestId('tile');
    expect(tile).toHaveAttribute('aria-hidden', 'true');
    expect(tile).not.toHaveAttribute('role');
  });

  it('is announced as an image when given a label', () => {
    render(<IconTile icon={glyph} aria-label="Online selection" />);
    const tile = screen.getByRole('img', { name: 'Online selection' });
    expect(tile).not.toHaveAttribute('aria-hidden');
  });

  it('passes attributes and classes through', () => {
    render(<IconTile icon={glyph} className="ml-auto" title="Session" data-testid="tile" />);
    const tile = screen.getByTestId('tile');
    expect(tile).toHaveClass('ml-auto');
    expect(tile).toHaveAttribute('title', 'Session');
  });
});
