import { Table } from '../../../src/index';
import { Code, PageBody, PageHeading, Prose, Rules, Section } from '../parts/Page';

export const Accessibility = () => (
  <PageBody>
    <PageHeading
      title="Accessibility"
      lede="Propellant is built to WCAG 2.1 AA, and most of the work is done once, inside the components. These are the contracts every component keeps."
    />
    <Section title="Contrast">
      <Rules
        items={[
          'Text roles meet 4.5:1 on the content surface in both themes. The color page measures them live.',
          'Edges that identify a control, such as a field outline or an unchecked box, meet 3:1 through --control-border.',
          'Focus outlines sit 2px off the control, so the ring stays visible against a teal fill or a colored row.',
          'Under forced colors, components fall back to system colors instead of disappearing.',
        ]}
      />
    </Section>
    <Section title="Keyboard and focus">
      <Rules
        items={[
          'Every control is reachable with Tab and shows a focus outline that follows its shape.',
          'Segmented controls, radio groups and menus move with the arrow keys; pop up buttons also take Home, End and typeahead.',
          'Sheets and the compact sidebar keep focus inside while open. Sheets, menus and the sidebar close on Escape and return focus to what opened them.',
          'A skip link leads past the sidebar and toolbar to the main content.',
        ]}
      />
    </Section>
    <Section title="Targets">
      <Prose>
        Visible controls can be 28px on a desktop, but every one carries an invisible hit area of at
        least <Code>--hit-target</Code>, which is 28px with a mouse and 44px on touch.
      </Prose>
    </Section>
    <Section title="Meaning without color">
      <Rules
        items={[
          'Status badges always carry a word, and status icons a distinct glyph.',
          'Selected states change weight or add a check as well as color.',
          'Errors name the field and say how to fix it.',
        ]}
      />
    </Section>
    <Section title="Announcements and motion">
      <Rules
        items={[
          'Critical banners use role alert; other banners and toasts are announced politely.',
          'Counters such as the stepper value live in an output element that announces changes.',
          'Reduced motion removes travel and keeps progress indicators moving.',
        ]}
      />
    </Section>
    <Section title="Privacy in session replay">
      <Prose>
        Fields, search boxes and names carry the <Code>fs-mask</Code> class by default and avatars
        carry <Code>fs-exclude</Code>, so session recordings never capture what people type or who
        they are. Pass <Code>isPrivate=&#123;false&#125;</Code> only for values that are never
        personal, such as a filter on this page.
      </Prose>
    </Section>
  </PageBody>
);

export const Writing = () => (
  <PageBody>
    <PageHeading
      title="Writing"
      lede="Words are part of the interface. Write in the product's own words, from the side of the person using it."
    />
    <Section title="Voice">
      <Rules
        items={[
          'Use the words the people using the product use, and use each one for one thing only.',
          'Sentence case for every title, label, header and button.',
          'Put a verb on every button and say what will happen: Save changes, Invite mentors, Withdraw application.',
          'Say what went wrong and how to fix it. No apologies and no vague errors.',
          'Use commas, colons and periods. Propellant copy never uses em or en dashes.',
        ]}
      />
    </Section>
    <Section title="Examples">
      <div className="overflow-x-auto">
        <Table
          caption="Copy before and after"
          size="sm"
          rows={[
            { id: 'button', before: 'Submit', after: 'Submit scores' },
            { id: 'error', before: 'Invalid input', after: 'Enter a score from 1 to 10.' },
            { id: 'empty', before: 'No data', after: 'No mentors invited yet.' },
            { id: 'title', before: 'PROGRAM SETTINGS', after: 'Program settings' },
          ]}
          rowId={(row) => row.id}
          columns={[
            { key: 'before', header: 'Instead of', cell: (row) => row.before },
            { key: 'after', header: 'Write', cell: (row) => row.after },
          ]}
        />
      </div>
    </Section>
  </PageBody>
);
