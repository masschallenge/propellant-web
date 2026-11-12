import { describe, expect, it } from 'vitest';
import { isPrimitiveToken, referencesPrimitive } from './primitives';

describe('isPrimitiveToken', () => {
  it('recognizes the interface scales and the brand palette', () => {
    expect(isPrimitiveToken('--teal-800')).toBe(true);
    expect(isPrimitiveToken('--gray-0')).toBe(true);
    expect(isPrimitiveToken('--mc-navy')).toBe(true);
    expect(isPrimitiveToken('--mc-hero-overlay-text-side')).toBe(true);
  });

  it('leaves semantic and component tokens alone', () => {
    expect(isPrimitiveToken('--tint')).toBe(false);
    expect(isPrimitiveToken('--brand-surface')).toBe(false);
    expect(isPrimitiveToken('--corner-lg')).toBe(false);
  });
});

describe('referencesPrimitive', () => {
  it('spots a value that points at a primitive', () => {
    expect(referencesPrimitive('var(--teal-900)')).toBe(true);
    expect(referencesPrimitive('var(--mc-teal)')).toBe(true);
  });

  it('ignores other values', () => {
    expect(referencesPrimitive('var(--label)')).toBe(false);
    expect(referencesPrimitive('#00708e')).toBe(false);
  });
});
