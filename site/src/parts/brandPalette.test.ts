import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parseTokens } from '../../tooling/tokens';
import {
  APPROVED_PAIRINGS,
  CHART_ORDER,
  CORE_COLORS,
  SUPPORTING_COLORS,
  WARM_ACCENTS,
  brandColorNamed,
} from './brandPalette';
import { contrastRatio } from './contrast';

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const colorTokens = parseTokens(
  readFileSync(path.join(packageDir, 'tokens/color.css'), 'utf8'),
  'color',
);
const tokenValue = (name: string) =>
  colorTokens.find((token) => token.name === name)?.values[0]?.value;

const toRgba = (hex: string) => ({
  red: parseInt(hex.slice(1, 3), 16),
  green: parseInt(hex.slice(3, 5), 16),
  blue: parseInt(hex.slice(5, 7), 16),
  alpha: 1,
});

const hexOf = (name: string) => {
  const color = brandColorNamed(name);
  if (!color) throw new Error(`No brand color named ${name}`);
  return color.hex;
};

describe('brand palette data', () => {
  const palette = [...CORE_COLORS, ...SUPPORTING_COLORS, ...WARM_ACCENTS];

  it.each(palette.map((color) => [color.name, color.token, color.hex]))(
    'shows %s with the value of its token %s',
    (_name, token, hex) => {
      expect(tokenValue(token)).toBe(hex.toLowerCase());
    },
  );

  it('matches every print substitute to its token', () => {
    palette
      .filter((color) => color.printSubstitute)
      .forEach((color) => {
        expect(tokenValue(`${color.token}-print`)).toBe(color.printSubstitute?.toLowerCase());
      });
  });

  it.each(
    APPROVED_PAIRINGS.map((pairing) => [pairing.foreground, pairing.background, pairing.ratio]),
  )('measures %s on %s at the published %s:1', (foreground, background, ratio) => {
    const measured = contrastRatio(toRgba(hexOf(foreground)), toRgba(hexOf(background)));
    expect(measured).toBeCloseTo(ratio, 1);
    expect(measured).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps MC Blue out of text, because it fails on White', () => {
    expect(contrastRatio(toRgba(hexOf('MC Blue')), toRgba(hexOf('White')))).toBeLessThan(3);
  });

  it('builds the chart order from brand colors, with Gray 300 last', () => {
    expect(CHART_ORDER.at(-1)).toBe('Gray 300');
    CHART_ORDER.slice(0, -1).forEach((name) => {
      expect(brandColorNamed(name)).toBeDefined();
    });
  });
});
