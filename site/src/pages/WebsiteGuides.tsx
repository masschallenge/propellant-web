import overview from '../../../docs/websites.md?raw';
import squarespace from '../../../docs/websites/squarespace.md?raw';
import wordpress from '../../../docs/websites/wordpress.md?raw';
import webflow from '../../../docs/websites/webflow.md?raw';
import wix from '../../../docs/websites/wix.md?raw';
import hubspot from '../../../docs/websites/hubspot.md?raw';
import html from '../../../docs/websites/html.md?raw';
import { MarkdownPage } from '../parts/MarkdownPage';

export const WebsitesOverview = () => <MarkdownPage path="docs/websites.md" source={overview} />;
export const SquarespaceGuide = () => (
  <MarkdownPage path="docs/websites/squarespace.md" source={squarespace} />
);
export const WordPressGuide = () => (
  <MarkdownPage path="docs/websites/wordpress.md" source={wordpress} />
);
export const WebflowGuide = () => <MarkdownPage path="docs/websites/webflow.md" source={webflow} />;
export const WixGuide = () => <MarkdownPage path="docs/websites/wix.md" source={wix} />;
export const HubSpotGuide = () => <MarkdownPage path="docs/websites/hubspot.md" source={hubspot} />;
export const HtmlGuide = () => <MarkdownPage path="docs/websites/html.md" source={html} />;
