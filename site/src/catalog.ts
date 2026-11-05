import { components } from 'virtual:propellant-site-data';
import type { ComponentEntry } from '../tooling/components';

export interface ComponentModule {
  module: string;
  slug: string;
  category: string;
  description: string;
  importLine: string;
  entries: ComponentEntry[];
}

export const CATEGORY_ORDER = [
  'Actions',
  'Inputs',
  'Navigation',
  'Overlays',
  'Feedback',
  'Data display',
  'Layout',
];

const toKebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export const componentModules: ComponentModule[] = [
  ...new Set(components.map((component) => component.module)),
]
  .map((moduleName) => {
    const entries = components.filter((component) => component.module === moduleName);
    const primary = entries.find((entry) => entry.name === moduleName) ?? entries[0];
    return {
      module: moduleName,
      slug: `component-${toKebab(moduleName)}`,
      category: primary.category,
      description: primary.description,
      importLine: primary.importLine,
      entries: [primary, ...entries.filter((entry) => entry !== primary)],
    };
  })
  .sort((first, second) => first.module.localeCompare(second.module));

export const categoryRank = (category: string) => {
  const rank = CATEGORY_ORDER.indexOf(category);
  return rank === -1 ? CATEGORY_ORDER.length : rank;
};

export const categories = [...new Set(componentModules.map((entry) => entry.category))].sort(
  (first, second) => categoryRank(first) - categoryRank(second),
);

export const moduleForSlug = (slug: string) =>
  componentModules.find((entry) => entry.slug === slug);
