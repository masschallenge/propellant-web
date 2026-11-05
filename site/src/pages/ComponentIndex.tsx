import { useState } from 'react';
import { SearchField } from '../../../src/index';
import { categories, componentModules } from '../catalog';
import { InlineText } from '../parts/RichText';
import { Note, PageBody, PageHeading, Section } from '../parts/Page';

const firstSentence = (text: string) => {
  const match = text.match(/^[^.]*\./);
  return match ? match[0] : text;
};

export const ComponentIndex = () => {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const matches = componentModules.filter(
    (entry) =>
      !normalizedQuery ||
      entry.module.toLowerCase().includes(normalizedQuery) ||
      entry.description.toLowerCase().includes(normalizedQuery),
  );
  return (
    <PageBody>
      <PageHeading
        title="Components"
        lede="Each page shows live examples and the props read from the TypeScript source."
      />
      <SearchField
        aria-label="Filter components"
        placeholder="Filter components"
        value={query}
        onChange={setQuery}
        isPrivate={false}
        className="w-72 max-w-full"
      />
      {categories.map((category) => {
        const inCategory = matches.filter((entry) => entry.category === category);
        if (!inCategory.length) return null;
        return (
          <Section key={category} title={category} wide>
            <ul className="m-0 p-0 list-none grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
              {inCategory.map((entry) => (
                <li key={entry.module} className="min-w-0">
                  <a
                    href={`#${entry.slug}`}
                    className="flex flex-col gap-1 h-full p-4 rounded-[var(--corner-lg)] bg-[var(--bg)] no-underline hover:bg-[var(--fill-tertiary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)]"
                  >
                    <span className="text-headline text-[var(--tint)]">{entry.module}</span>
                    <span className="text-subheadline text-[var(--label-secondary)]">
                      <InlineText text={firstSentence(entry.description)} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        );
      })}
      {matches.length ? null : <Note>No components match that filter.</Note>}
    </PageBody>
  );
};
