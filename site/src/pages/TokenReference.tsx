import { useMemo, useState } from 'react';
import { SearchField, SegmentedControl } from '../../../src/index';
import { foundationGroups, tokens } from 'virtual:propellant-site-data';
import { Code, Note, PageBody, PageHeading, Prose, Section } from '../parts/Page';
import { TokenTable } from '../parts/TokenTable';

const GROUP_LABELS: Record<string, string> = {
  color: 'Color',
  typography: 'Typography',
  shape: 'Shape',
  depth: 'Depth',
  motion: 'Motion',
  layout: 'Layout',
};

const PRIMITIVE = /^--(teal|gray|magenta|orange|green|yellow|amber)-/;

export const TokenReference = () => {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('semantic');
  const normalizedQuery = query.trim().toLowerCase();

  const visible = useMemo(
    () =>
      tokens.filter((token) => {
        if (
          scope === 'semantic' &&
          (PRIMITIVE.test(token.name) || !foundationGroups.includes(token.group))
        ) {
          return false;
        }
        if (scope === 'primitive' && !PRIMITIVE.test(token.name)) return false;
        if (scope === 'component' && foundationGroups.includes(token.group)) return false;
        if (!normalizedQuery) return true;
        return (
          token.name.includes(normalizedQuery) ||
          token.values.some((entry) => entry.value.toLowerCase().includes(normalizedQuery))
        );
      }),
    [normalizedQuery, scope],
  );

  const groups = [...new Set(visible.map((token) => token.group))];

  return (
    <PageBody>
      <PageHeading
        title="Token reference"
        lede="Every custom property in the package, read from the token files when this site was built. Values that change with the theme, the pointer, the window or a motion preference are listed under each condition."
      />
      <div className="flex flex-wrap items-center gap-3">
        <SearchField
          aria-label="Filter tokens"
          placeholder="Filter by name or value"
          value={query}
          onChange={setQuery}
          isPrivate={false}
          className="w-72 max-w-full"
        />
        <SegmentedControl
          aria-label="Token tier"
          size="sm"
          value={scope}
          onChange={setScope}
          items={[
            { id: 'semantic', label: 'Semantic' },
            { id: 'primitive', label: 'Primitive' },
            { id: 'component', label: 'Component' },
          ]}
        />
      </div>
      <Prose>
        Components use semantic tokens. Primitives are the palette those roles point at; reach for
        one only inside the token files. Component tokens exist only where a component's value
        differs per theme or is computed.
      </Prose>
      <p role="status" className="m-0 text-footnote text-[var(--label-tertiary)] tabular-nums">
        {visible.length} of {tokens.length} tokens
      </p>
      {groups.length ? (
        groups.map((group) => (
          <Section key={group} title={GROUP_LABELS[group] ?? group} wide>
            <TokenTable
              tokens={visible.filter((token) => token.group === group)}
              caption={`${GROUP_LABELS[group] ?? group} tokens`}
            />
          </Section>
        ))
      ) : (
        <Note>
          No tokens match <Code>{query}</Code>. Try a shorter part of the name.
        </Note>
      )}
    </PageBody>
  );
};
