import type { ComponentType } from 'react';
import { Overview } from './pages/Overview';
import { Usage } from './pages/Usage';
import {
  HtmlGuide,
  HubSpotGuide,
  SquarespaceGuide,
  WebflowGuide,
  WebsitesOverview,
  WixGuide,
  WordPressGuide,
} from './pages/WebsiteGuides';
import { Brand } from './pages/Brand';
import { LogoGuide } from './pages/LogoGuide';
import { Color } from './pages/Color';
import { Typography } from './pages/Typography';
import { ShapeDepth } from './pages/ShapeDepth';
import { Motion } from './pages/Motion';
import { Layout } from './pages/Layout';
import { Responsive } from './pages/Responsive';
import { TokenReference } from './pages/TokenReference';
import { ComponentIndex } from './pages/ComponentIndex';
import { Patterns } from './pages/Patterns';
import { Accessibility, Writing } from './pages/Guidelines';
import { ImagesGuide } from './pages/ImagesGuide';

export interface SiteRoute {
  id: string;
  title: string;
  section: string;
  Page: ComponentType;
}

export const SECTIONS = ['Start', 'Websites', 'Brand', 'Foundations', 'Build', 'Guidelines'];

export const ROUTES: SiteRoute[] = [
  { id: 'overview', title: 'Overview', section: 'Start', Page: Overview },
  { id: 'usage', title: 'Using Propellant', section: 'Start', Page: Usage },
  { id: 'websites', title: 'Websites overview', section: 'Websites', Page: WebsitesOverview },
  { id: 'websites-squarespace', title: 'Squarespace', section: 'Websites', Page: SquarespaceGuide },
  { id: 'websites-wordpress', title: 'WordPress', section: 'Websites', Page: WordPressGuide },
  { id: 'websites-webflow', title: 'Webflow', section: 'Websites', Page: WebflowGuide },
  { id: 'websites-wix', title: 'Wix', section: 'Websites', Page: WixGuide },
  { id: 'websites-hubspot', title: 'HubSpot', section: 'Websites', Page: HubSpotGuide },
  { id: 'websites-html', title: 'Plain HTML', section: 'Websites', Page: HtmlGuide },
  { id: 'brand', title: 'Brand guidelines', section: 'Brand', Page: Brand },
  { id: 'logo', title: 'Logo', section: 'Brand', Page: LogoGuide },
  { id: 'color', title: 'Color', section: 'Foundations', Page: Color },
  { id: 'typography', title: 'Typography', section: 'Foundations', Page: Typography },
  { id: 'shape', title: 'Shape and depth', section: 'Foundations', Page: ShapeDepth },
  { id: 'motion', title: 'Motion', section: 'Foundations', Page: Motion },
  { id: 'layout', title: 'Layout and density', section: 'Foundations', Page: Layout },
  { id: 'responsive', title: 'Responsive web apps', section: 'Foundations', Page: Responsive },
  { id: 'tokens', title: 'Token reference', section: 'Foundations', Page: TokenReference },
  { id: 'components', title: 'Components', section: 'Build', Page: ComponentIndex },
  { id: 'patterns', title: 'Patterns', section: 'Build', Page: Patterns },
  { id: 'accessibility', title: 'Accessibility', section: 'Guidelines', Page: Accessibility },
  { id: 'writing', title: 'Writing', section: 'Guidelines', Page: Writing },
  { id: 'images', title: 'Images and uploads', section: 'Guidelines', Page: ImagesGuide },
];
