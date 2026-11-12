import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { build } from './build.mjs';
import { auditScopedCss } from './scope-audit.mjs';

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageVersion = JSON.parse(
  await readFile(resolve(packageDir, 'package.json'), 'utf8'),
).version;

const readScoped = () => readFile(resolve(packageDir, 'dist/styles.scoped.css'), 'utf8');
const readWebsite = () => readFile(resolve(packageDir, 'dist/website.css'), 'utf8');

beforeAll(async () => {
  await build();
});

describe('scoped build', () => {
  it('confines every rule to the [data-propellant] boundary', async () => {
    const { unscoped, definedNames } = auditScopedCss(await readScoped());
    expect(unscoped).toEqual([]);
    expect(definedNames.has('--label')).toBe(true);
  });

  it('exposes the package version under the boundary', async () => {
    const scoped = await readScoped();
    expect(scoped).toMatch(
      new RegExp(`html \\[data-propellant\\]\\s*\\{[^}]*--propellant-version: '${packageVersion}'`),
    );
  });

  it('exposes the brand palette under the boundary', async () => {
    const { definedNames } = auditScopedCss(await readScoped());
    expect(definedNames.has('--mc-navy')).toBe(true);
    expect(definedNames.has('--mc-gradient')).toBe(true);
  });

  it('leaves font faces global so the fonts load once', async () => {
    const scoped = await readScoped();
    expect((scoped.match(/@font-face/g) ?? []).length).toBeGreaterThan(0);
    expect(/\[data-propellant\][^{]*@font-face/.test(scoped)).toBe(false);
  });

  it('follows the system appearance only where a page opts in', async () => {
    const scoped = await readScoped();
    expect(scoped).toContain("html:has([data-appearance='system']) [data-propellant]");
  });
});

describe('website build', () => {
  it('carries the fonts, the tokens and the website classes', async () => {
    const website = await readWebsite();
    expect(website).toContain('@font-face');
    expect(website).toMatch(/:root[^{]*\{[^}]*--tint:/);
    expect(website).toMatch(/:root[^{]*\{[^}]*--mc-teal: #00708e;/);
    expect(website).toContain('.propellant-button {');
    expect(website).toContain('.propellant-headline {');
  });

  it('leaves the rest of a site alone', async () => {
    const website = await readWebsite();
    expect(website).not.toMatch(/autofill|propellant-field|propellant-scroll|\[data-propellant\]/);
    expect(website).not.toMatch(/(^|\n)\s*(input|select|textarea|body|html)\b[^{]*\{/);
  });
});
