import { afterEach, describe, expect, it } from 'vitest';
import propellantSvg from '../../assets/favicons/propellant/favicon.svg';
import propellant32 from '../../assets/favicons/propellant/favicon-32x32.png';
import propellant16 from '../../assets/favicons/propellant/favicon-16x16.png';
import propellantAppleTouchIcon from '../../assets/favicons/propellant/apple-touch-icon.png';
import masschallenge32 from '../../assets/favicons/masschallenge/favicon-32x32.png';
import masschallengeAppleTouchIcon from '../../assets/favicons/masschallenge/apple-touch-icon.png';
import { addFaviconLinks, FAVICON_LINKS } from './favicons';

const faviconLinks = () => [...document.head.querySelectorAll('link')];

afterEach(() => {
  faviconLinks().forEach((link) => link.remove());
});

describe('addFaviconLinks', () => {
  it('adds the vector icon, the 32 and 16 pixel fallbacks and the apple touch icon', () => {
    addFaviconLinks(document.head);
    expect(
      faviconLinks().map((link) => [
        link.rel,
        link.getAttribute('href'),
        link.getAttribute('type'),
        link.getAttribute('sizes'),
      ]),
    ).toEqual([
      ['icon', propellantSvg, 'image/svg+xml', null],
      ['icon', propellant32, 'image/png', '32x32'],
      ['icon', propellant16, 'image/png', '16x16'],
      ['apple-touch-icon', propellantAppleTouchIcon, null, '180x180'],
    ]);
  });

  it('serves the Propellant set, never the MassChallenge one', () => {
    const hrefs = FAVICON_LINKS.map((favicon) => favicon.href);
    expect(hrefs).not.toContain(masschallenge32);
    expect(hrefs).not.toContain(masschallengeAppleTouchIcon);
  });
});
