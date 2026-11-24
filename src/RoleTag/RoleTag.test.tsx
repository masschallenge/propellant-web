import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { RoleTag } from './RoleTag';
import type { RoleTagTone } from './RoleTag';

afterEach(cleanup);

const FILLS: [RoleTagTone, string][] = [
  ['admin', 'bg-[var(--role-tag-admin-fill)]'],
  ['pm', 'bg-[var(--role-tag-pm-fill)]'],
  ['evaluator', 'bg-[var(--role-tag-evaluator-fill)]'],
  ['judge', 'bg-[var(--role-tag-evaluator-fill)]'],
  ['founder', 'bg-[var(--role-tag-founder-fill)]'],
  ['startup', 'bg-[var(--role-tag-founder-fill)]'],
  ['mentor', 'bg-[var(--role-tag-mentor-fill)]'],
  ['neutral', 'bg-[var(--fill-secondary)]'],
];

describe('RoleTag', () => {
  it('shows the role in sentence case at the 12px caption size, as it was given', () => {
    render(<RoleTag tone="evaluator">Evaluator</RoleTag>);
    const tag = screen.getByText('Evaluator');
    expect(tag).toHaveClass('text-caption', 'min-h-4.5', 'leading-4.5');
    expect(tag).not.toHaveClass('uppercase');
    expect(tag).not.toHaveClass('text-caption2');
    expect(tag).toHaveTextContent(/^Evaluator$/);
  });

  it('colors roles from role tag tokens, never the status colors', () => {
    (['admin', 'pm', 'evaluator', 'founder', 'mentor'] as RoleTagTone[]).forEach((tone) => {
      const { unmount } = render(<RoleTag tone={tone}>Role</RoleTag>);
      const tag = screen.getByText('Role');
      expect(tag.className).toContain(`--role-tag-${tone}-fill`);
      expect(tag.className).toContain(`--role-tag-${tone}-label`);
      expect(tag.className).not.toMatch(/--(critical|warning|success)/);
      unmount();
    });
  });

  it.each(FILLS)('gives the %s role its own soft fill', (tone, fill) => {
    render(<RoleTag tone={tone}>Role</RoleTag>);
    const tag = screen.getByText('Role');
    expect(tag).toHaveAttribute('data-tone', tone);
    expect(tag).toHaveClass(fill);
  });

  it('sets the mentor label in its own color from the mentor tokens', () => {
    render(<RoleTag tone="mentor">Mentor</RoleTag>);
    expect(screen.getByText('Mentor')).toHaveClass('text-[var(--role-tag-mentor-label)]');
  });

  it('is neutral unless a role is named', () => {
    render(<RoleTag>Mentor</RoleTag>);
    expect(screen.getByText('Mentor')).toHaveAttribute('data-tone', 'neutral');
  });

  it('passes attributes and classes through', () => {
    render(
      <RoleTag tone="pm" className="ml-auto" title="Program manager">
        PM
      </RoleTag>,
    );
    const tag = screen.getByText('PM');
    expect(tag).toHaveClass('ml-auto');
    expect(tag).toHaveAttribute('title', 'Program manager');
  });
});

describe('RoleTag tokens', () => {
  const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const ROLE_ALIASES = ['admin', 'pm', 'evaluator', 'founder'].flatMap((role) => [
    `--role-tag-${role}-fill`,
    `--role-tag-${role}-label`,
  ]);

  const declaredUnder = (css: string, selector: string) => {
    const declared = new Set<string>();
    postcss.parse(css).walkRules((rule) => {
      if (rule.parent?.type !== 'root' || !rule.selectors.includes(selector)) return;
      rule.walkDecls((declaration) => {
        declared.add(declaration.prop);
      });
    });
    return declared;
  };

  it.each(['dist/styles.css', 'dist/website.css'])(
    'redeclares every role alias in each theme block of %s, so a nested theme resolves its own colors',
    (stylesheet) => {
      const css = readFileSync(path.join(packageDir, stylesheet), 'utf8');
      ["[data-theme='light']", "[data-theme='dark']"].forEach((themeSelector) => {
        const declared = declaredUnder(css, themeSelector);
        ROLE_ALIASES.forEach((alias) => expect(declared).toContain(alias));
      });
    },
  );
});
