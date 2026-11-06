const REPOSITORY_URL = 'https://github.com/masschallenge/propellant-web/blob/main/';

const DOC_ROUTES: Record<string, string> = {
  'docs/usage.md': 'usage',
  'docs/brand.md': 'brand',
  'docs/websites.md': 'websites',
};

const resolvePath = (fromDocument: string, target: string) => {
  const parts = fromDocument.split('/').slice(0, -1);
  target.split('/').forEach((segment) => {
    if (segment === '..') parts.pop();
    else if (segment !== '.' && segment !== '') parts.push(segment);
  });
  return parts.join('/');
};

export const docRouteFor = (path: string) => {
  if (DOC_ROUTES[path]) return DOC_ROUTES[path];
  const builder = path.match(/^docs\/websites\/([a-z0-9-]+)\.md$/);
  return builder ? `websites-${builder[1]}` : null;
};

export const siteHrefFor = (fromDocument: string, href: string) => {
  if (/^[a-z]+:/i.test(href)) return href;
  if (href.startsWith('#')) return null;
  const path = resolvePath(fromDocument, href.split('#')[0]);
  const route = docRouteFor(path);
  return route ? `#${route}` : `${REPOSITORY_URL}${path}`;
};
