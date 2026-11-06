import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  exportedNames,
  siteDataPlugin,
  SITE_DATA_MODULE,
  toArtifactPage,
} from './site-data-plugin';

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

describe('exportedNames', () => {
  it('lists exported constants in declaration order', () => {
    expect(
      exportedNames('export const Playground = {};\nconst hidden = 1;\nexport const Sizes = {};'),
    ).toEqual(['Playground', 'Sizes']);
  });
});

describe('toArtifactPage', () => {
  it('writes a page body with inline styles and a module script that cannot close early', () => {
    const page = toArtifactPage({
      title: 'Propellant',
      description: 'Design system',
      css: 'body{}',
      script: 'const markup = "</script>";',
    });
    expect(page).toContain('<title>Propellant</title>');
    expect(page).toContain('<style>body{}</style>');
    expect(page).toContain('<div id="root"></div>');
    expect(page).toContain('const markup = "<\\/script>";');
    expect(page).not.toContain('<html');
  });

  it('writes the replacement character as an escape so the page stays plain text', () => {
    const page = toArtifactPage({
      title: 'Propellant',
      description: 'Design system',
      css: '',
      script: 'const fallback = `\uFFFD`;',
    });
    expect(page).not.toContain('\uFFFD');
    expect(page).toContain('const fallback = `\\uFFFD`;');
  });
});

describe('siteDataPlugin', () => {
  const plugin = siteDataPlugin(packageDir);
  const resolveId = plugin.resolveId as (id: string) => string | null;
  const load = plugin.load as (id: string) => string | null;

  it('resolves only its own virtual module', () => {
    expect(resolveId(SITE_DATA_MODULE)).toBe(`\0${SITE_DATA_MODULE}`);
    expect(resolveId('react')).toBeNull();
    expect(load('react')).toBeNull();
  });

  it('exports the version, story order, tokens and components', () => {
    const code = load(`\0${SITE_DATA_MODULE}`) ?? '';
    expect(code).toMatch(/export const version = "\d+\.\d+\.\d+";/);
    expect(code).toContain('export const storyOrder = ');
    expect(code).toContain('export const foundationGroups = ["color"');
    expect(code).toContain('"name":"--label"');
    expect(code).toContain('"name":"Button"');
  });
});
