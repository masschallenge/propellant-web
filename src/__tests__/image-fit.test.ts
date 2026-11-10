import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { imageFitClass } from '../internal/imageFit';

const sourceDirectory = resolve(__dirname, '..');

const componentFiles = (directory: string): string[] =>
  readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return componentFiles(path);
    const isComponent = /\.tsx?$/.test(entry) && !/\.(test|stories)\.tsx?$/.test(entry);
    return isComponent ? [path] : [];
  });

describe('image fit rule', () => {
  it('shows the whole image unless an image is designated as auto croppable', () => {
    expect(imageFitClass()).toBe('object-contain');
    expect(imageFitClass(false)).toBe('object-contain');
    expect(imageFitClass(true)).toBe('object-cover');
  });

  it('never crops images directly in a component', () => {
    const offenders = componentFiles(sourceDirectory)
      .filter((path) => !path.endsWith(join('internal', 'imageFit.ts')))
      .filter((path) =>
        /object-cover|bg-cover|background-size:\s*cover/.test(readFileSync(path, 'utf8')),
      )
      .map((path) => path.slice(sourceDirectory.length + 1));
    expect(offenders).toEqual([]);
  });
});
