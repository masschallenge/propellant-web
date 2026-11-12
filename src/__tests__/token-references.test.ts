import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const filesUnder = (directory: string, pattern: RegExp): string[] =>
  readdirSync(directory).flatMap((entry) => {
    const fullPath = path.join(directory, entry);
    if (statSync(fullPath).isDirectory()) return filesUnder(fullPath, pattern);
    return pattern.test(entry) ? [fullPath] : [];
  });

const read = (files: string[]) => files.map((file) => readFileSync(file, 'utf8')).join('\n');

const styleSources = read([
  ...filesUnder(path.join(packageDir, 'tokens'), /\.css$/),
  ...filesUnder(path.join(packageDir, 'base'), /\.css$/),
  path.join(packageDir, 'utilities.css'),
  path.join(packageDir, 'website.css'),
]);
const componentSources = read(filesUnder(path.join(packageDir, 'src'), /\.tsx?$/));

const collect = (source: string, pattern: RegExp) =>
  new Set([...source.matchAll(pattern)].map((match) => match[1]));

const defined = new Set([
  ...collect(styleSources, /(--[a-z0-9-]+)\s*:/g),
  ...collect(componentSources, /\[(--[a-z0-9-]+):/g),
  ...collect(componentSources, /['"](--[a-z0-9-]+)['"]\s*:/g),
  ...collect(componentSources, /setProperty\(\s*['"`](--[a-z0-9-]+)/g),
]);

const referenced = new Set([
  ...collect(styleSources, /var\((--[a-z0-9-]+)/g),
  ...collect(componentSources, /var\((--[a-z0-9-]+)/g),
  ...collect(componentSources, /\((--[a-z0-9-]+)\)/g),
]);

const isExternal = (name: string) =>
  name.startsWith('--tw-') || name === '--propellant-version' || name.startsWith('--text-');

describe('token references', () => {
  it('only references custom properties that something defines', () => {
    const missing = [...referenced]
      .filter((name) => !defined.has(name) && !isExternal(name))
      .sort();
    expect(missing).toEqual([]);
  });
});
