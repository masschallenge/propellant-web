import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parseTokens } from '../../site/tooling/tokens';

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const colorTokens = parseTokens(
  readFileSync(path.join(packageDir, 'tokens/color.css'), 'utf8'),
  'color',
);

const valueOf = (name: string, condition = 'default') =>
  colorTokens
    .find((token) => token.name === name)
    ?.values.find((entry) => entry.condition === condition)?.value;

const BRAND_PALETTE: [string, string][] = [
  ['--mc-blue', '#0eabbc'],
  ['--mc-gray', '#808285'],
  ['--mc-navy', '#10263f'],
  ['--mc-black', '#222222'],
  ['--mc-warm-white', '#f8f8f5'],
  ['--mc-deep-teal', '#004f73'],
  ['--mc-teal', '#00708e'],
  ['--mc-cyan', '#54eeff'],
  ['--mc-cyan-print', '#00cfe8'],
  ['--mc-ocean', '#037aa6'],
  ['--mc-yellow', '#ffc801'],
  ['--mc-orange', '#ff6b35'],
  ['--mc-orange-print', '#f58242'],
  ['--mc-raspberry', '#d14170'],
  ['--mc-raspberry-print', '#d83b80'],
  ['--mc-lime', '#c6f135'],
  ['--mc-lime-print', '#91d438'],
  ['--mc-navy-black', '#051925'],
  ['--mc-light-tint', '#f3fafc'],
];

const UNCHANGED_INTERFACE_TOKENS: [string, string, string][] = [
  ['--teal-900', 'default', '#044451'],
  ['--teal-800', 'default', '#065e6f'],
  ['--teal-400', 'default', '#0facbd'],
  ['--teal-300', 'default', '#3fc6d4'],
  ['--teal-100', 'default', '#d9f6fa'],
  ['--teal-50', 'default', '#f3fbfc'],
  ['--gray-800', 'default', '#1e282b'],
  ['--gray-500', 'default', '#4b575b'],
  ['--magenta-600', 'default', '#bf0261'],
  ['--yellow-400', 'default', '#ffc801'],
  ['--tint', 'default', 'var(--teal-800)'],
  ['--tint-hover', 'default', 'var(--teal-900)'],
  ['--tint', 'dark', 'var(--teal-300)'],
  ['--brand-surface', 'default', 'var(--teal-900)'],
  ['--brand-surface', 'dark', 'var(--gray-900)'],
  ['--brand-accent', 'default', 'var(--teal-400)'],
  ['--brand-accent', 'dark', 'var(--teal-400)'],
];

describe('brand palette tokens', () => {
  it.each(BRAND_PALETTE)('defines %s as %s', (name, hex) => {
    expect(valueOf(name)).toBe(hex);
  });

  it('builds the MC Gradient from Navy to Ocean', () => {
    expect(valueOf('--mc-gradient')).toBe(
      'linear-gradient(135deg, var(--mc-navy), var(--mc-ocean))',
    );
  });

  it('keeps the hero overlay between 15 and 30 percent, Navy black to Ocean', () => {
    expect(valueOf('--mc-hero-overlay-text-side')).toBe('rgb(5 25 37 / 0.3)');
    expect(valueOf('--mc-hero-overlay-subject-side')).toBe('rgb(3 122 166 / 0.15)');
  });

  it('never themes the brand palette, so it reads the same in light and dark', () => {
    const brandTokens = colorTokens.filter((token) => token.name.startsWith('--mc-'));
    brandTokens.forEach((token) => {
      expect(token.values.map((entry) => entry.condition)).toEqual(['default']);
    });
  });
});

describe('interface tokens', () => {
  it.each(UNCHANGED_INTERFACE_TOKENS)('keeps %s (%s) at %s', (name, condition, value) => {
    expect(valueOf(name, condition)).toBe(value);
  });
});
