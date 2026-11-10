import { describe, expect, it } from 'vitest';
import { docRouteFor, siteHrefFor } from './docLinks';

describe('docRouteFor', () => {
  it('maps the guides that have a page on the site', () => {
    expect(docRouteFor('docs/websites.md')).toBe('websites');
    expect(docRouteFor('docs/brand.md')).toBe('brand');
    expect(docRouteFor('docs/images.md')).toBe('images');
    expect(docRouteFor('docs/websites/squarespace.md')).toBe('websites-squarespace');
  });

  it('returns null for files without a page', () => {
    expect(docRouteFor('examples/website.html')).toBeNull();
  });
});

describe('siteHrefFor', () => {
  it('turns links between guides into site routes', () => {
    expect(siteHrefFor('docs/websites/wix.md', '../websites.md')).toBe('#websites');
    expect(siteHrefFor('docs/websites.md', 'websites/webflow.md')).toBe('#websites-webflow');
    expect(siteHrefFor('docs/websites/wix.md', '../brand.md#logo')).toBe('#brand');
  });

  it('sends other repository files to GitHub', () => {
    expect(siteHrefFor('docs/websites/html.md', '../../examples/website.html')).toBe(
      'https://github.com/masschallenge/propellant-web/blob/main/examples/website.html',
    );
  });

  it('keeps absolute links and drops in-page anchors', () => {
    expect(siteHrefFor('docs/websites.md', 'https://example.com/a')).toBe('https://example.com/a');
    expect(siteHrefFor('docs/websites.md', '#fonts')).toBeNull();
  });
});
