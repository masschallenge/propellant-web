import path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { extractComponents, readStoryMeta, splitDescription } from './components';

const sourceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../src');

describe('readStoryMeta', () => {
  it('reads the title and a joined description', () => {
    const meta = readStoryMeta(`
      const meta = {
        title: 'Components/Inputs/Switch',
        parameters: { docs: { description: { component: ['First line.', '', 'Import: \`x\`'].join('\\n') } } },
      } satisfies Meta<typeof Switch>;
      export default meta;
    `);
    expect(meta).toEqual({
      title: 'Components/Inputs/Switch',
      description: 'First line.\n\nImport: `x`',
    });
  });

  it('reads a plain string description and tolerates missing docs', () => {
    expect(
      readStoryMeta(
        "const meta = { title: 'Components/Layout/Card', parameters: { docs: { description: { component: 'A card.' } } } };",
      ),
    ).toEqual({ title: 'Components/Layout/Card', description: 'A card.' });
    expect(readStoryMeta("const meta = { title: 'Components/Layout/Card' } as Meta;")).toEqual({
      title: 'Components/Layout/Card',
      description: '',
    });
    expect(readStoryMeta('export const Story = {};')).toBeNull();
  });
});

describe('splitDescription', () => {
  it('separates the prose from the import line', () => {
    expect(
      splitDescription(
        "A switch.\n\nImport: `import { Switch } from '@masschallenge/propellant-web'`",
      ),
    ).toEqual({
      prose: 'A switch.',
      importLine: "import { Switch } from '@masschallenge/propellant-web'",
    });
  });
});

describe('extractComponents', () => {
  const components = extractComponents(
    path.join(sourceDir, 'index.ts'),
    sourceDir,
    (moduleName) => {
      const storyPath = path.join(sourceDir, moduleName, `${moduleName}.stories.tsx`);
      return existsSync(storyPath) ? readStoryMeta(readFileSync(storyPath, 'utf8')) : null;
    },
  );
  const byName = (name: string) => components.find((component) => component.name === name);

  it('lists every component that exports a props type', () => {
    expect(byName('Button')).toBeDefined();
    expect(byName('ListRow')?.module).toBe('List');
    expect(byName('TabPanel')?.module).toBe('TabBar');
  });

  it('expands union aliases and reads defaults', () => {
    const variant = byName('Button')?.props.find((prop) => prop.name === 'variant');
    expect(variant).toEqual({
      name: 'variant',
      type: "'filled' | 'tinted' | 'gray' | 'plain'",
      optional: true,
      defaultValue: "'filled'",
    });
  });

  it('marks required props and skips inherited HTML attributes', () => {
    const titleProp = byName('ListRow')?.props.find((prop) => prop.name === 'title');
    expect(titleProp?.optional).toBe(false);
    expect(byName('ListRow')?.props.some((prop) => prop.name === 'onMouseEnter')).toBe(false);
  });

  it('carries the story category and import line', () => {
    expect(byName('Switch')?.category).toBe('Inputs');
    expect(byName('Switch')?.importLine).toBe(
      "import { Switch } from '@masschallenge/propellant-web'",
    );
  });
});
