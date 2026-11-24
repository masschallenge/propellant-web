import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const layoutTokens = readFileSync(path.join(packageDir, 'tokens/layout.css'), 'utf8');

const coarsePointerStart = layoutTokens.indexOf('@media (pointer: coarse)');
const finePointerTokens = layoutTokens.slice(0, coarsePointerStart);
const coarsePointerTokens = layoutTokens.slice(coarsePointerStart);

const pixelValue = (source: string, name: string) => {
  const match = source.match(new RegExp(`${name}:\\s*(\\d+)px;`));
  return match ? Number(match[1]) : null;
};

const WCAG_TARGET_MINIMUM = 24;

describe('target size tokens', () => {
  it('sets the target floor to the WCAG 2.2 AA minimum of 24px', () => {
    expect(pixelValue(finePointerTokens, '--target-minimum')).toBe(WCAG_TARGET_MINIMUM);
  });

  it('keeps every hit area and the smallest control at or above the floor with a mouse', () => {
    ['--hit-target', '--control-sm'].forEach((name) => {
      expect(pixelValue(finePointerTokens, name)).toBeGreaterThanOrEqual(WCAG_TARGET_MINIMUM);
    });
  });

  it('keeps every hit area and the smallest control at or above the floor on touch', () => {
    ['--hit-target', '--control-sm'].forEach((name) => {
      expect(pixelValue(coarsePointerTokens, name)).toBeGreaterThanOrEqual(WCAG_TARGET_MINIMUM);
    });
  });
});
