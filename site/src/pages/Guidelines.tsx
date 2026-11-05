import { Table } from '../../../src/index';
import { Code, PageBody, PageHeading, Prose, Rules, Section } from '../parts/Page';

export const Accessibility = () => (
  <PageBody>
    <PageHeading
      title="Accessibility"
      lede="Everyone in the MassChallenge community should be able to use what we build. Propellant does most of that work once, inside the components, so you get it every time you use them."
    />
    <Section title="Why it matters">
      <Prose>
        The people using MassChallenge products are founders, mentors, judges, partners and the
        staff who run programs. Some use a screen reader, which reads the page aloud. Some move
        through a page with a keyboard instead of a mouse. Some see color differently, and some are
        on a small screen in bright light. If a form or a score sheet does not work for them, they
        miss their chance to take part. It takes a community to raise a startup, and that only works
        when everyone can get in the door.
      </Prose>
      <Prose>
        Propellant is built to WCAG 2.1 AA, the widely used standard for accessible websites. The
        sections below are the promises every component keeps, so you can count on them without
        rebuilding them yourself.
      </Prose>
    </Section>
    <Section title="Contrast">
      <Rules
        items={[
          'Text stands out from the content surface by a contrast ratio of at least 4.5:1 in both themes. The color page measures every text role live.',
          'Edges that identify a control, such as a field outline or an unchecked box, meet 3:1 through --control-border.',
          'Focus outlines sit 2px off the control, so the ring stays visible against a teal fill or a colored row.',
          'Under forced colors (a high contrast setting some people turn on in their operating system), components fall back to system colors instead of disappearing.',
        ]}
      />
    </Section>
    <Section title="Keyboard and focus">
      <Rules
        items={[
          'Every control is reachable with Tab and shows a focus outline that follows its shape.',
          'Segmented controls, radio groups and menus move with the arrow keys. Pop up buttons also take Home, End and typeahead (typing the first letters of an option to jump to it).',
          'Sheets and the compact sidebar keep focus inside while open. Sheets, menus and the sidebar close on Escape and return focus to what opened them.',
          'A skip link, the first thing a keyboard user reaches, leads past the sidebar and toolbar to the main content.',
        ]}
      />
    </Section>
    <Section title="Targets">
      <Prose>
        A target is the area you can click or tap. Visible controls can be 28px on a desktop, but
        every one carries an invisible hit area of at least <Code>--hit-target</Code>, which is 28px
        with a mouse and 44px on touch.
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
          'Screen readers announce changes as they happen. Critical banners and error toasts use role alert and interrupt; other banners and toasts are announced politely, once the reader is free.',
          'Counters such as the stepper value live in an output element that announces changes.',
          'When someone asks their device for reduced motion, things stop sliding across the screen, while progress indicators keep moving.',
        ]}
      />
    </Section>
    <Section title="Privacy in session replay">
      <Prose>
        Session replay records how people move through a product so the team can fix problems.
        Fields, search boxes and names carry the <Code>fs-mask</Code> class by default and avatars
        carry <Code>fs-exclude</Code>, so those recordings never capture what people type or who
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
      lede="Words are part of the interface. Write the way MassChallenge talks: straight to the point, warm, and on the side of the person using the product."
    />
    <Section title="Voice">
      <Prose>
        Our website says &ldquo;Founders need more than capital. They need access, insight, and
        relationships that unlock momentum.&rdquo; That is the voice: confident, human and about the
        people we back. In a product, the same voice helps someone finish a task. Say it plainly,
        say it once, and get out of the way.
      </Prose>
      <Rules
        items={[
          'Write like a person on the team. Use "we" for MassChallenge and "you" for the person reading.',
          'Keep sentences short and words everyday. Explain a technical term the first time, or pick a plainer one.',
          'Be confident without hype: no buzzwords such as leverage or seamless, and no exclamation marks.',
          'Use the words the people using the product use, and use each one for one thing only.',
          'Sentence case for every title, label, header and button.',
          'Put a verb on every button and say what will happen: Save changes, Invite mentors, Withdraw application.',
          'Say what went wrong and how to fix it. No apologies and no vague errors.',
          'Use commas, colons and periods. Propellant copy never uses em or en dashes.',
        ]}
      />
    </Section>
    <Section title="Do and don't">
      <div className="overflow-x-auto">
        <Table
          caption="Copy to avoid and copy to use"
          size="sm"
          rows={[
            { id: 'button', before: 'Submit', after: 'Submit scores' },
            { id: 'error', before: 'Invalid input', after: 'Enter a score from 1 to 10.' },
            { id: 'empty', before: 'No data', after: 'No mentors invited yet.' },
            { id: 'title', before: 'PROGRAM SETTINGS', after: 'Program settings' },
            {
              id: 'hype',
              before: 'Leverage our seamless platform to unlock your full potential!',
              after: 'Find mentors who know your market.',
            },
            {
              id: 'system',
              before: 'The user has been successfully added to the cohort.',
              after: 'You added Priya to the cohort.',
            },
          ]}
          rowId={(row) => row.id}
          columns={[
            { key: 'before', header: "Don't write", cell: (row) => row.before },
            { key: 'after', header: 'Write', cell: (row) => row.after },
          ]}
        />
      </div>
    </Section>
  </PageBody>
);
