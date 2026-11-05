import { Code, PageBody, PageHeading, Prose, Rules, Section, Subsection } from '../parts/Page';
import { storyGroupFor } from '../stories';
import { StoryCanvas } from '../parts/StoryCanvas';

const SIZE_CLASSES = [
  {
    name: 'Compact',
    range: 'Below 768px',
    behavior:
      'Phones. The sidebar becomes a modal overlay behind the toolbar button and page margins are 16px. Below 640px the three largest text styles step down one size.',
  },
  {
    name: 'Regular',
    range: '768px to 1023px',
    behavior:
      'Tablets in portrait and narrow windows. The sidebar is still an overlay; margins grow to 24px. Tables scroll inside their own container.',
  },
  {
    name: 'Wide',
    range: '1024px and up',
    behavior:
      'Laptops and desktops. The sidebar is an inline column the person can hide. From 1280px the margins are 32px.',
  },
];

export const Responsive = () => {
  const shell = storyGroupFor('AppShell')?.stories.find((story) => story.name === 'Application');
  return (
    <PageBody>
      <PageHeading
        title="Responsive web apps"
        lede="Propellant thinks in two dimensions: the width of the window and the kind of pointer. Width decides the layout; the pointer decides the control size."
      />

      <Section title="Size classes">
        <div className="flex flex-col rounded-[var(--corner-lg)] bg-[var(--bg)]">
          {SIZE_CLASSES.map((sizeClass, index) => (
            <div
              key={sizeClass.name}
              className={`flex flex-col gap-1 px-4 py-3 ${index ? 'border-0 border-t-[length:var(--hairline)] border-solid border-[var(--separator)]' : ''}`}
            >
              <span className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-headline text-[var(--label)]">{sizeClass.name}</span>
                <span className="text-subheadline text-[var(--label-tertiary)] tabular-nums">
                  {sizeClass.range}
                </span>
              </span>
              <span className="text-callout text-[var(--label-secondary)]">
                {sizeClass.behavior}
              </span>
            </div>
          ))}
        </div>
        <Prose>
          Size class and pointer are independent. A large touch screen gets the wide layout with
          touch sized controls; a narrow desktop window gets the compact layout with desktop
          density.
        </Prose>
      </Section>

      {shell ? (
        <Section title="The shell, live" wide>
          <Prose>
            This is the application frame running in the page. Resize the window to watch the
            sidebar move from an inline column to an overlay at 1024px.
          </Prose>
          <StoryCanvas story={shell} />
        </Section>
      ) : null}

      <Section title="Splitting the chrome by how often it changes">
        <Subsection title="Sidebar for places">
          <Prose>
            The main destinations of the product. A person moves between these several times a day,
            so they stay in view on wide windows.
          </Prose>
        </Subsection>
        <Subsection title="Toolbar for context">
          <Prose>
            What the page is about and the controls that change it, such as a picker for the current
            program and, in the accessory row, a segmented control for the current stage. Content
            scrolls under the toolbar's bar material.
          </Prose>
        </Subsection>
        <Subsection title="The page for the page">
          <Prose>
            A large title, a one line summary and the page's own actions. Nothing global lives here.
          </Prose>
        </Subsection>
        <Subsection title="No footer in applications">
          <Prose>
            The sidebar's foot holds the account menu and the privacy, terms and cookie links. The
            brand footer belongs to public pages.
          </Prose>
        </Subsection>
      </Section>

      <Section title="Rules for responsive pages">
        <Rules
          items={[
            'Lay out with flex and grid gaps. Let rows wrap or stack to one column on a phone.',
            'Give any flex or grid child that holds text, code or a table min-width: 0 so long content wraps inside it instead of widening the page.',
            'Only tables, code and diagrams may be wider than the screen, each inside its own horizontal scroll container.',
            'Never hide a task on a phone. Show a note that a dense view works best on a wider screen, and keep the view usable.',
            'Respect the safe area: fixed bars add env(safe-area-inset-*) to their padding.',
          ]}
        />
        <Prose>
          Use the <Code>sm</Code>, <Code>md</Code> and <Code>lg</Code> Tailwind breakpoints (640,
          768 and 1024px) for layout changes inside a page, so pages and the shell agree on where
          the size classes change.
        </Prose>
      </Section>
    </PageBody>
  );
};
