import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { watch } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import postcssImport from 'postcss-import';

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const entry = resolve(packageDir, 'styles.css');
const websiteClasses = resolve(packageDir, 'website.css');
const packageJsonPath = resolve(packageDir, 'package.json');
const distDir = resolve(packageDir, 'dist');

export const BOUNDARY = '[data-propellant]';
const SCOPE = `html ${BOUNDARY}`;
const SYSTEM_APPEARANCE = `html:has([data-appearance='system']) ${BOUNDARY}:not([data-theme='light'])`;
const THEME_SELECTORS = {
  dark: [
    `[data-theme='dark'] ${BOUNDARY}`,
    `${BOUNDARY}[data-theme='dark']`,
    `${SCOPE} [data-theme='dark']`,
  ],
  light: [
    `[data-theme='light'] ${BOUNDARY}`,
    `${BOUNDARY}[data-theme='light']`,
    `${SCOPE} [data-theme='light']`,
  ],
};

const isKeyframeStep = (rule) =>
  rule?.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name);

const themeOf = (selector) => {
  const match = selector.match(/^\[data-theme=['"](dark|light)['"]\]$/);
  return match ? match[1] : null;
};

const scopeSelector = (selector) => {
  if (selector === ':root') return SCOPE;
  if (selector.startsWith(':root ')) return `${SCOPE} ${selector.slice(6)}`;
  if (/^html[\s:[]/.test(selector)) return selector;
  return `${SCOPE} ${selector}`;
};

const chainedRootDeclarations = (root) => {
  const chained = new Map();
  root.walkRules((rule) => {
    if (isKeyframeStep(rule) || rule.parent?.type === 'atrule') return;
    if (!rule.selectors.includes(':root')) return;
    rule.walkDecls((decl) => {
      if (decl.prop.startsWith('--') && decl.value.includes('var(')) {
        chained.set(decl.prop, decl.value);
      }
    });
  });
  return chained;
};

const themedDeclarations = (root, theme) => {
  const names = new Set();
  root.walkRules((rule) => {
    if (isKeyframeStep(rule)) return;
    if (rule.selectors.some((selector) => themeOf(selector) === theme)) {
      rule.walkDecls((decl) => names.add(decl.prop));
    }
  });
  return names;
};

const appendChained = (rule, chained, alreadyDeclared) => {
  chained.forEach((value, prop) => {
    if (!alreadyDeclared.has(prop)) rule.append({ prop, value });
  });
};

export const scopeCss = (css) => {
  const root = postcss.parse(css);
  const chained = chainedRootDeclarations(root);
  const declaredInTheme = {
    dark: themedDeclarations(root, 'dark'),
    light: themedDeclarations(root, 'light'),
  };
  const finishedTheme = { dark: false, light: false };

  root.walkRules((rule) => {
    if (isKeyframeStep(rule)) return;
    const theme = rule.selectors.map(themeOf).find(Boolean);
    const insideMedia = rule.parent?.type === 'atrule';
    if (theme) {
      const others = rule.selectors.filter((selector) => !themeOf(selector));
      if (!insideMedia && !finishedTheme[theme]) {
        appendChained(rule, chained, declaredInTheme[theme]);
        finishedTheme[theme] = true;
      }
      if (theme === 'dark' && !insideMedia) {
        const system = rule.clone({ selectors: [SYSTEM_APPEARANCE] });
        const media = postcss.atRule({ name: 'media', params: '(prefers-color-scheme: dark)' });
        media.append(system);
        rule.after(media);
      }
      rule.selectors = [...THEME_SELECTORS[theme], ...others.map(scopeSelector)];
      return;
    }
    if (rule.selectors.includes(':root') && rule.parent?.type === 'root') {
      rule.selectors = rule.selectors.map(scopeSelector);
      return;
    }
    rule.selectors = rule.selectors.map(scopeSelector);
  });
  return root.toString();
};

const isTokenSelector = (selector) =>
  selector === ':root' || /^\[data-theme=['"](dark|light)['"]\]$/.test(selector);

export const websiteCss = (css, classes) => {
  const root = postcss.parse(css);
  root.walkRules((rule) => {
    if (isKeyframeStep(rule)) return;
    if (!rule.selectors.every(isTokenSelector)) rule.remove();
  });
  root.walkAtRules('media', (media) => {
    if (!media.nodes?.length) media.remove();
  });
  return `${root.toString().trim()}\n\n${classes.trim()}\n`;
};

export const build = async () => {
  const { version } = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  const source =
    (await readFile(entry, 'utf8')) + `\n:root {\n  --propellant-version: '${version}';\n}\n`;
  const imported = await postcss([postcssImport()]).process(source, { from: entry });
  await mkdir(distDir, { recursive: true });
  await writeFile(resolve(distDir, 'styles.css'), imported.css);
  await writeFile(resolve(distDir, 'styles.scoped.css'), scopeCss(imported.css));
  await writeFile(
    resolve(distDir, 'website.css'),
    websiteCss(imported.css, await readFile(websiteClasses, 'utf8')),
  );
  console.log('propellant: built dist/styles.css, dist/styles.scoped.css and dist/website.css');
};

const runsAsScript = import.meta.url === `file://${process.argv[1]}`;

if (runsAsScript) {
  await build();

  if (process.argv.includes('--watch')) {
    console.log('propellant: watching tokens/, base/, and root css for changes');
    let building = false;
    let pending = false;
    let debounce = null;
    const runBuild = () => {
      building = true;
      build()
        .catch((error) => console.error('propellant build failed:', error))
        .finally(() => {
          building = false;
          if (pending) {
            pending = false;
            runBuild();
          }
        });
    };
    const rebuild = () => {
      if (building) {
        pending = true;
        return;
      }
      clearTimeout(debounce);
      debounce = setTimeout(runBuild, 50);
    };
    watch(resolve(packageDir, 'tokens'), { recursive: true }, rebuild);
    watch(resolve(packageDir, 'base'), { recursive: true }, rebuild);
    watch(packageDir, { recursive: false }, (event, filename) => {
      if (filename && filename.endsWith('.css')) rebuild();
    });
  }
}
