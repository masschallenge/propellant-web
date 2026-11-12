import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import { beforeAll, describe, expect, it } from 'vitest';

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

let declarationsBySelector = new Map();

const declarationsOf = (selector) => {
  const declarations = declarationsBySelector.get(selector);
  if (!declarations) throw new Error(`website.css has no rule for ${selector}`);
  return declarations;
};

beforeAll(async () => {
  const root = postcss.parse(await readFile(resolve(packageDir, 'website.css'), 'utf8'));
  root.walkRules((rule) => {
    if (rule.parent?.type !== 'root') return;
    rule.selectors.forEach((selector) => {
      const declarations = declarationsBySelector.get(selector) ?? {};
      rule.walkDecls((declaration) => {
        declarations[declaration.prop] = declaration.value
          .replace(/\s+/g, ' ')
          .replace(/\( /g, '(')
          .replace(/ \)/g, ')')
          .trim();
      });
      declarationsBySelector.set(selector, declarations);
    });
  });
});

describe('website type', () => {
  it('sets the headline in Oswald SemiBold capitals on a line height of 1', () => {
    expect(declarationsOf('.propellant-headline')).toMatchObject({
      'font-family': 'var(--type-family-brand)',
      'font-weight': '600',
      'line-height': '1',
      'text-transform': 'uppercase',
    });
  });

  it('tracks the eyebrow at 300 in Oswald Regular capitals', () => {
    expect(declarationsOf('.propellant-eyebrow')).toMatchObject({
      'font-family': 'var(--type-family-brand)',
      'font-weight': '400',
      'letter-spacing': '0.3em',
      'text-transform': 'uppercase',
    });
  });

  it('sets titles and subheads in Oswald SemiBold capitals', () => {
    ['.propellant-title-1', '.propellant-title-2', '.propellant-subhead'].forEach((selector) => {
      expect(declarationsOf(selector)).toMatchObject({
        'font-family': 'var(--type-family-brand)',
        'font-weight': '600',
        'text-transform': 'uppercase',
      });
    });
  });

  it('keeps the big stat as the only Oswald Bold', () => {
    expect(declarationsOf('.propellant-stat')).toMatchObject({
      'font-family': 'var(--type-family-brand)',
      'font-weight': '700',
    });
    const boldSelectors = [...declarationsBySelector.entries()]
      .filter(([, declarations]) => declarations['font-weight'] === '700')
      .map(([selector]) => selector);
    expect(boldSelectors).toEqual(['.propellant-stat']);
  });

  it('sets reading text in Lato on a line height of 1.5, never in capitals', () => {
    ['.propellant-text', '.propellant-body', '.propellant-caption'].forEach((selector) => {
      expect(declarationsOf(selector)).toMatchObject({
        'font-family': 'var(--type-family)',
        'line-height': '1.5',
      });
      expect(declarationsOf(selector)['text-transform']).toBeUndefined();
    });
  });
});

describe('website buttons', () => {
  it('draws a fully rounded pill in Oswald capitals', () => {
    expect(declarationsOf('.propellant-button')).toMatchObject({
      'border-radius': 'var(--corner-capsule)',
      'font-family': 'var(--type-family-brand)',
      'text-transform': 'uppercase',
    });
  });

  it('fills Teal on light and clears to a Teal outline on hover', () => {
    const button = declarationsOf('.propellant-button');
    expect(button.background).toBe('var(--propellant-button-fill, var(--mc-teal))');
    expect(button.color).toBe('var(--propellant-button-text, var(--gray-0))');
    const hover = declarationsOf('.propellant-button:hover');
    expect(hover).toMatchObject({
      'border-color': 'var(--mc-teal)',
      background: 'var(--propellant-button-hover-fill, transparent)',
      color: 'var(--propellant-button-hover-text, var(--mc-teal))',
    });
  });

  it('outlines in Cyan on dark sections and fills with Teal on hover', () => {
    [
      '.propellant-section-navy',
      '.propellant-section-black',
      '.propellant-section-deep-teal',
    ].forEach((selector) => {
      expect(declarationsOf(selector)).toMatchObject({
        '--propellant-button-fill': 'transparent',
        '--propellant-button-edge': 'var(--mc-cyan)',
        '--propellant-button-hover-fill': 'var(--mc-teal)',
        '--propellant-button-hover-text': 'var(--gray-0)',
        color: 'var(--gray-0)',
      });
    });
  });

  it('resets the dark section colors on every light section, so they read inside a dark one', () => {
    [
      '.propellant-section-white',
      '.propellant-section-warm-white',
      '.propellant-section-angled',
    ].forEach((selector) =>
      expect(declarationsOf(selector)).toMatchObject({
        '--propellant-section-accent': 'var(--mc-teal)',
        '--propellant-section-heading': 'var(--mc-teal)',
        '--propellant-section-muted': 'var(--gray-500)',
        '--propellant-button-fill': 'var(--mc-teal)',
        '--propellant-button-edge': 'var(--mc-teal)',
        '--propellant-button-hover-fill': 'transparent',
        '--propellant-button-hover-text': 'var(--mc-teal)',
      }),
    );
  });

  it('turns white cards back to the light button style', () => {
    expect(declarationsOf('.propellant-card')).toMatchObject({
      '--propellant-button-fill': 'var(--mc-teal)',
      '--propellant-button-hover-fill': 'transparent',
    });
  });
});

describe('website layout', () => {
  it('keeps cards and photos square cornered', () => {
    expect(declarationsOf('.propellant-card')['border-radius']).toBe('0');
    expect(declarationsOf('.propellant-photo')['border-radius']).toBe('0');
    expect(declarationsOf('.propellant-tag')['border-radius']).toBe('0');
  });

  it('paints each section in its brand color', () => {
    expect(declarationsOf('.propellant-section-white')['--propellant-section-color']).toBe(
      'var(--gray-0)',
    );
    expect(declarationsOf('.propellant-section-warm-white')['--propellant-section-color']).toBe(
      'var(--mc-warm-white)',
    );
    expect(declarationsOf('.propellant-section-navy')['--propellant-section-color']).toBe(
      'var(--mc-navy)',
    );
    expect(declarationsOf('.propellant-brand-band')['--propellant-section-color']).toBe(
      'var(--mc-navy)',
    );
    expect(declarationsOf('.propellant-section-black')['--propellant-section-color']).toBe(
      'var(--mc-black)',
    );
    expect(declarationsOf('.propellant-section-deep-teal')['--propellant-section-color']).toBe(
      'var(--mc-deep-teal)',
    );
  });

  it('draws the notch below a section in that section color', () => {
    expect(declarationsOf('.propellant-notch::after')).toMatchObject({
      top: '100%',
      left: '50%',
      background: 'var(--propellant-section-color, var(--gray-0))',
    });
  });

  it('raises the light tint on an angle from white', () => {
    expect(declarationsOf('.propellant-section-angled')['background-image']).toMatch(
      /^linear-gradient\(\d+deg, var\(--gray-0\) .+, var\(--mc-light-tint\) .+\)$/,
    );
  });

  it('lets the notch show below a hero, keeping the photo and overlay inside it', () => {
    expect(declarationsOf('.propellant-hero').overflow).toBeUndefined();
    expect(declarationsOf('.propellant-hero::before').inset).toBe('0');
    expect(declarationsOf('.propellant-hero-image').inset).toBe('0');
    expect(declarationsOf('.propellant-notch::after').top).toBe('100%');
  });

  it('lays the hero overlay from the dark text side toward the subject', () => {
    expect(declarationsOf('.propellant-hero::before').background).toBe(
      'linear-gradient(to right, var(--mc-hero-overlay-text-side), var(--mc-hero-overlay-subject-side))',
    );
    expect(declarationsOf('.propellant-hero-subject-left::before').background).toContain('to left');
  });

  it('marks numbered blocks with a heavy rule and an accent number', () => {
    expect(declarationsOf('.propellant-numbered')['border-top']).toBe(
      '0.375rem solid currentColor',
    );
    expect(declarationsOf('.propellant-numbered-number')).toMatchObject({
      'font-family': 'var(--type-family-brand)',
      color: 'var(--propellant-section-accent, var(--mc-teal))',
    });
  });

  it('keeps Cyan for dark sections and Teal for light ones', () => {
    expect(declarationsOf('.propellant-section-navy')['--propellant-section-accent']).toBe(
      'var(--mc-cyan)',
    );
    expect(declarationsOf('.propellant-headline-accent').color).toBe(
      'var(--propellant-section-accent, var(--mc-teal))',
    );
    expect(declarationsOf('.propellant-link').color).toBe(
      'var(--propellant-section-accent, var(--mc-teal))',
    );
  });
});
