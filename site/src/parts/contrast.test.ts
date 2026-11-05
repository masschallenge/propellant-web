import { describe, expect, it } from 'vitest';
import { composite, contrastRatio, formatRatio, parseColor, toHex } from './contrast';

describe('parseColor', () => {
  it('reads rgb, rgba and slash alpha forms', () => {
    expect(parseColor('rgb(30, 40, 43)')).toEqual({ red: 30, green: 40, blue: 43, alpha: 1 });
    expect(parseColor('rgba(6, 94, 111, 0.1)')).toEqual({
      red: 6,
      green: 94,
      blue: 111,
      alpha: 0.1,
    });
    expect(parseColor('rgb(6 94 111 / 16%)')).toEqual({
      red: 6,
      green: 94,
      blue: 111,
      alpha: 0.16,
    });
  });

  it('returns null for other formats', () => {
    expect(parseColor('#ffffff')).toBeNull();
  });
});

describe('contrast', () => {
  const white = { red: 255, green: 255, blue: 255, alpha: 1 };
  const black = { red: 0, green: 0, blue: 0, alpha: 1 };

  it('measures black on white at 21:1', () => {
    expect(contrastRatio(black, white)).toBeCloseTo(21, 5);
    expect(contrastRatio(white, black)).toBeCloseTo(21, 5);
  });

  it('composites a translucent color before measuring', () => {
    const halfBlack = { ...black, alpha: 0.5 };
    expect(composite(halfBlack, white)).toEqual({
      red: 127.5,
      green: 127.5,
      blue: 127.5,
      alpha: 1,
    });
    expect(contrastRatio(halfBlack, white)).toBeCloseTo(
      contrastRatio(composite(halfBlack, white), white),
      5,
    );
  });

  it('formats hex and floors ratios so a pass is never rounded up', () => {
    expect(toHex({ red: 6, green: 94, blue: 111, alpha: 1 })).toBe('#065e6f');
    expect(formatRatio(4.49)).toBe('4.4:1');
    expect(formatRatio(15.06)).toBe('15.0:1');
  });
});
