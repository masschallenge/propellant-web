import { describe, expect, it } from 'vitest';
import { parseTokens, resolveReference } from './tokens';

const CSS = `
:root {
  --gray-0: #ffffff;
  --label: var(--gray-800);
}
:root,
[data-theme='light'] {
  --bg: var(--gray-0);
}
[data-theme='dark'] {
  --bg: var(--gray-850);
}
@media (pointer: coarse) {
  :root { --control-md: 44px; }
}
@media (prefers-reduced-transparency: reduce) {
  [data-theme='dark'] { --material-bar: var(--material-bar-opaque); }
}
@media (max-width: 639px) {
  :root { --type-display-size: 2rem; }
}
@media (min-width: 768px) {
  :root { --page-margin: 24px; }
}
.button { --button-bg: red; }
`;

describe('parseTokens', () => {
  const tokens = parseTokens(CSS, 'color');
  const valuesOf = (name: string) => tokens.find((token) => token.name === name)?.values;

  it('reads root tokens with their group', () => {
    expect(tokens.find((token) => token.name === '--gray-0')).toEqual({
      name: '--gray-0',
      group: 'color',
      values: [{ condition: 'default', value: '#ffffff' }],
    });
  });

  it('labels theme and media conditions', () => {
    expect(valuesOf('--bg')).toEqual([
      { condition: 'default', value: 'var(--gray-0)' },
      { condition: 'dark', value: 'var(--gray-850)' },
    ]);
    expect(valuesOf('--control-md')).toEqual([{ condition: 'coarse pointer', value: '44px' }]);
    expect(valuesOf('--material-bar')).toEqual([
      { condition: 'reduced transparency, dark', value: 'var(--material-bar-opaque)' },
    ]);
    expect(valuesOf('--type-display-size')).toEqual([
      { condition: 'width up to 639px', value: '2rem' },
    ]);
    expect(valuesOf('--page-margin')).toEqual([{ condition: 'width 768px and up', value: '24px' }]);
  });

  it('ignores custom properties outside token rules', () => {
    expect(valuesOf('--button-bg')).toBeUndefined();
  });

  it('keeps the last value when a condition repeats', () => {
    const repeated = parseTokens(':root { --gap: 4px; } :root { --gap: 8px; }', 'layout');
    expect(repeated[0].values).toEqual([{ condition: 'default', value: '8px' }]);
  });

  it('keeps unknown media queries as written', () => {
    const custom = parseTokens('@media print { :root { --ink: black; } }', 'color');
    expect(custom[0].values[0].condition).toBe('print');
  });
});

describe('resolveReference', () => {
  const lookup = new Map([
    ['--label', 'var(--gray-800)'],
    ['--gray-800', '#1e282b'],
    ['--loop', 'var(--loop)'],
  ]);

  it('follows chains of references', () => {
    expect(resolveReference('var(--label)', lookup)).toBe('#1e282b');
  });

  it('uses the fallback when the token is unknown', () => {
    expect(resolveReference('var(--missing, 12px)', lookup)).toBe('12px');
    expect(resolveReference('var(--missing)', lookup)).toBe('var(--missing)');
  });

  it('stops following a reference loop', () => {
    expect(resolveReference('var(--loop)', lookup)).toBe('var(--loop)');
  });
});
