import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { extractComponents, readStoryMeta } from './components';
import { parseTokens } from './tokens';

export const SITE_DATA_MODULE = 'virtual:propellant-site-data';
const RESOLVED_SITE_DATA = `\0${SITE_DATA_MODULE}`;

const FOUNDATION_FILES = ['color', 'typography', 'shape', 'depth', 'motion', 'layout'];

export const exportedNames = (source: string) =>
  [...source.matchAll(/^export const (\w+)/gm)].map((match) => match[1]);

export const collectSiteData = (packageDir: string) => {
  const sourceDir = path.join(packageDir, 'src');
  const tokensDir = path.join(packageDir, 'tokens');
  const tokenFiles = readdirSync(tokensDir)
    .filter((fileName) => fileName.endsWith('.css') && fileName !== 'fonts.css')
    .map((fileName) => fileName.replace(/\.css$/, ''))
    .sort(
      (first, second) =>
        (FOUNDATION_FILES.indexOf(first) + 1 || 99) -
          (FOUNDATION_FILES.indexOf(second) + 1 || 99) || first.localeCompare(second),
    );
  const tokens = tokenFiles.flatMap((group) =>
    parseTokens(readFileSync(path.join(tokensDir, `${group}.css`), 'utf8'), group),
  );
  const components = extractComponents(
    path.join(sourceDir, 'index.ts'),
    sourceDir,
    (moduleName) => {
      const storyPath = path.join(sourceDir, moduleName, `${moduleName}.stories.tsx`);
      return existsSync(storyPath) ? readStoryMeta(readFileSync(storyPath, 'utf8')) : null;
    },
  );
  const storyOrder = Object.fromEntries(
    readdirSync(sourceDir)
      .filter((moduleName) =>
        existsSync(path.join(sourceDir, moduleName, `${moduleName}.stories.tsx`)),
      )
      .map((moduleName) => [
        moduleName,
        exportedNames(
          readFileSync(path.join(sourceDir, moduleName, `${moduleName}.stories.tsx`), 'utf8'),
        ),
      ]),
  );
  const packageJson = JSON.parse(readFileSync(path.join(packageDir, 'package.json'), 'utf8'));
  return {
    storyOrder,
    version: String(packageJson.version),
    foundationGroups: FOUNDATION_FILES,
    tokens,
    components,
  };
};

export const siteDataPlugin = (packageDir: string): Plugin => ({
  name: 'propellant-site-data',
  resolveId: (id) => (id === SITE_DATA_MODULE ? RESOLVED_SITE_DATA : null),
  load: (id) => {
    if (id !== RESOLVED_SITE_DATA) return null;
    const data = collectSiteData(packageDir);
    return Object.entries(data)
      .map(([name, value]) => `export const ${name} = ${JSON.stringify(value)};`)
      .join('\n');
  },
});

const escapeScript = (code: string) =>
  code.replace(/<\/script/gi, '<\\/script').replaceAll('\uFFFD', '\\uFFFD');

export const toArtifactPage = ({
  title,
  description,
  css,
  script,
}: {
  title: string;
  description: string;
  css: string;
  script: string;
}) =>
  [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    `<style>${css}</style>`,
    '<div id="root"></div>',
    `<script type="module">${escapeScript(script)}</script>`,
    '',
  ].join('\n');

export const artifactPagePlugin = ({
  fileName,
  title,
  description,
}: {
  fileName: string;
  title: string;
  description: string;
}): Plugin => ({
  name: 'propellant-artifact-page',
  apply: 'build',
  writeBundle: (outputOptions, bundle) => {
    const outputs = Object.values(bundle);
    const css = outputs
      .map((output) =>
        output.type === 'asset' && output.fileName.endsWith('.css') ? String(output.source) : '',
      )
      .join('\n');
    const script = outputs
      .map((output) => (output.type === 'chunk' && output.isEntry ? output.code : ''))
      .join('\n');
    const outputDir = outputOptions.dir ?? path.dirname(outputOptions.file ?? '.');
    writeFileSync(
      path.join(outputDir, fileName),
      toArtifactPage({ title, description, css, script }),
    );
  },
});
