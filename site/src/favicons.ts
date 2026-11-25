import faviconSvg from '../../assets/favicons/propellant/favicon.svg';
import favicon32 from '../../assets/favicons/propellant/favicon-32x32.png';
import favicon16 from '../../assets/favicons/propellant/favicon-16x16.png';
import appleTouchIcon from '../../assets/favicons/propellant/apple-touch-icon.png';

export interface FaviconLink {
  rel: 'icon' | 'apple-touch-icon';
  href: string;
  type?: string;
  sizes?: string;
}

export const FAVICON_LINKS: FaviconLink[] = [
  { rel: 'icon', href: faviconSvg, type: 'image/svg+xml' },
  { rel: 'icon', href: favicon32, type: 'image/png', sizes: '32x32' },
  { rel: 'icon', href: favicon16, type: 'image/png', sizes: '16x16' },
  { rel: 'apple-touch-icon', href: appleTouchIcon, sizes: '180x180' },
];

export const addFaviconLinks = (head: HTMLHeadElement) => {
  FAVICON_LINKS.forEach((favicon) => {
    const link = head.ownerDocument.createElement('link');
    link.rel = favicon.rel;
    link.href = favicon.href;
    if (favicon.type) link.type = favicon.type;
    if (favicon.sizes) link.setAttribute('sizes', favicon.sizes);
    head.append(link);
  });
};
