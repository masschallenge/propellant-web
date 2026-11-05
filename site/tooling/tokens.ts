import postcss from 'postcss';
import type { AtRule, ChildNode, Rule } from 'postcss';

export interface TokenValue {
  condition: string;
  value: string;
}

export interface TokenEntry {
  name: string;
  group: string;
  values: TokenValue[];
}

const MEDIA_LABELS: [RegExp, (match: RegExpMatchArray) => string][] = [
  [/pointer:\s*coarse/, () => 'coarse pointer'],
  [/min-resolution/, () => 'high density display'],
  [/prefers-reduced-motion/, () => 'reduced motion'],
  [/prefers-reduced-transparency/, () => 'reduced transparency'],
  [/forced-colors/, () => 'forced colors'],
  [/prefers-color-scheme:\s*dark/, () => 'dark'],
  [/min-width:\s*(\d+px)/, (match) => `width ${match[1]} and up`],
  [/max-width:\s*(\d+px)/, (match) => `width up to ${match[1]}`],
];

const labelForMedia = (params: string) => {
  for (const [pattern, label] of MEDIA_LABELS) {
    const match = params.match(pattern);
    if (match) return label(match);
  }
  return params.trim();
};

const conditionsFor = (rule: Rule) => {
  const conditions: string[] = [];
  let parent = rule.parent as ChildNode | undefined;
  while (parent && parent.type === 'atrule') {
    const atRule = parent as AtRule;
    if (atRule.name === 'media') conditions.unshift(labelForMedia(atRule.params));
    parent = atRule.parent as ChildNode | undefined;
  }
  const isDark = rule.selectors.some((selector) => /data-theme=['"]dark['"]/.test(selector));
  if (isDark && !conditions.includes('dark')) conditions.push('dark');
  return conditions.length ? conditions.join(', ') : 'default';
};

const isTokenRule = (rule: Rule) =>
  rule.selectors.some(
    (selector) => selector === ':root' || /^\[data-theme=['"](dark|light)['"]\]$/.test(selector),
  );

export const parseTokens = (css: string, group: string): TokenEntry[] => {
  const entries = new Map<string, TokenEntry>();
  postcss.parse(css).walkRules((rule) => {
    if (!isTokenRule(rule)) return;
    const condition = conditionsFor(rule);
    rule.each((node) => {
      if (node.type !== 'decl' || !node.prop.startsWith('--')) return;
      const entry = entries.get(node.prop) ?? { name: node.prop, group, values: [] };
      const value = node.value.replace(/\s+/g, ' ').trim();
      const existing = entry.values.find((candidate) => candidate.condition === condition);
      if (existing) existing.value = value;
      else entry.values.push({ condition, value });
      entries.set(node.prop, entry);
    });
  });
  return [...entries.values()];
};

export const resolveReference = (
  value: string,
  lookup: ReadonlyMap<string, string>,
  depth = 0,
): string => {
  if (depth > 8) return value;
  return value.replace(/var\((--[a-z0-9-]+)(?:,\s*([^)]+))?\)/gi, (whole, name, fallback) => {
    const next = lookup.get(name) ?? fallback;
    return next === undefined ? whole : resolveReference(next, lookup, depth + 1);
  });
};
