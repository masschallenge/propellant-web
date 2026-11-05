import type { ComponentModule } from '../catalog';
import { storyGroupFor } from '../stories';
import { CodeBlock, Note, PageBody, PageHeading, Section } from '../parts/Page';
import { Paragraphs } from '../parts/RichText';
import { PropsTable } from '../parts/PropsTable';
import { StoryCanvas } from '../parts/StoryCanvas';

export const ComponentPage = ({ entry }: { entry: ComponentModule }) => {
  const stories = storyGroupFor(entry.module)?.stories ?? [];
  return (
    <PageBody>
      <div className="flex flex-col gap-3 max-w-[var(--width-reading)]">
        <PageHeading title={entry.module} />
        <Paragraphs
          text={entry.description}
          className="m-0 text-body text-[var(--label-secondary)]"
        />
        {entry.importLine ? <CodeBlock label="Import">{entry.importLine}</CodeBlock> : null}
      </div>

      <Section title="Examples" wide>
        {stories.length ? (
          <div className="flex flex-col gap-6">
            {stories.map((story) => (
              <StoryCanvas key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <Note>This component has no examples yet.</Note>
        )}
      </Section>

      {entry.entries.map((component) => (
        <Section key={component.name} title={`${component.name} props`} wide>
          <PropsTable props={component.props} caption={`${component.name} props`} />
        </Section>
      ))}
    </PageBody>
  );
};
