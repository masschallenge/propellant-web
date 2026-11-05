import { Code, PageBody, PageHeading, Prose, Rules, Section, Subsection } from '../parts/Page';
import { storyGroupFor } from '../stories';
import { StoryCanvas } from '../parts/StoryCanvas';

const SIZE_CLASSES = [
  {
    name: 'Compact',
    range: 'Below 768px',
    behavior:
      'Phones. The sidebar becomes an overlay that opens from the toolbar button, and page margins are 16px. Below 640px the three largest text styles step down one size.',
  },
  {
    name: 'Regular',
    range: '768px to 1023px',
    behavior:
      'Tablets held upright and narrow windows. The sidebar is still an overlay, and margins grow to 24px. Tables scroll sideways inside their own box.',
  },
  {
    name: 'Wide',
    range: '1024px and up',
    behavior:
      'Laptops and desktops. The sidebar is a column beside the page that the person can hide. From 1280px the margins are 32px.',
  },
];

export const Responsive = () => {
  const shell = storyGroupFor('AppShell')?.stories.find((story) => story.name === 'Application');
  return (
    <PageBody>
      <PageHeading
        title="Responsive web apps"
        lede="People use our products on phones, tablets and big desktop screens. Responsive means the same page adapts to each one. We look at two things: how wide the window is, which decides the layout, and whether someone uses a mouse or a finger, which decides how big the controls are."
      />

      <Section title="Three window sizes">
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
          Window size and pointer are independent. A large touch screen gets the wide layout with
          touch sized controls. A narrow desktop window gets the compact layout with controls sized
          for a mouse.
        </Prose>
      </Section>

      {shell ? (
        <Section title="See the app frame live" wide>
          <Prose>
            This is the application frame, often called the shell, running right here. Resize the
            window to watch the sidebar change from a column beside the page to an overlay at
            1024px.
          </Prose>
          <StoryCanvas story={shell} />
        </Section>
      ) : null}

      <Section title="What goes where in the frame">
        <Subsection title="Sidebar for places">
          <Prose>
            The main destinations of the product. People move between these several times a day, so
            they stay in view on wide windows.
          </Prose>
        </Subsection>
        <Subsection title="Toolbar for context">
          <Prose>
            What the page is about and the controls that change it, such as a picker for the current
            program and, in the accessory row below it, a segmented control for the current stage.
            Content scrolls under the toolbar's frosted bar material.
          </Prose>
        </Subsection>
        <Subsection title="The page for the page">
          <Prose>
            A large title, a one line summary and the page's own actions. Nothing that belongs to
            the whole product lives here.
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
            'Lay out with flex and grid gaps. Let rows wrap, or stack to one column on a phone.',
            'Give any flex or grid child that holds text, code or a table min-width: 0 so long content wraps inside it instead of widening the page.',
            'Only tables, code and diagrams may be wider than the screen, each inside its own horizontal scroll container.',
            'Never hide a task on a phone. If a dense view works best on a wider screen, say so in a note and keep the view usable.',
            'Respect the safe area, the part of the screen clear of notches and rounded corners: fixed bars add env(safe-area-inset-*) to their padding.',
          ]}
        />
        <Prose>
          A breakpoint is the window width where a layout changes. Use the <Code>sm</Code>,{' '}
          <Code>md</Code> and <Code>lg</Code> Tailwind breakpoints (640, 768 and 1024px) for layout
          changes inside a page, so pages and the shell agree on where the window sizes change.
        </Prose>
      </Section>
    </PageBody>
  );
};
