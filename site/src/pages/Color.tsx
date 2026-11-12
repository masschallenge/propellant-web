import { Badge } from '../../../src/index';
import { ColorBoard } from '../parts/ColorBoard';
import type { ColorRole } from '../parts/ColorBoard';
import { Code, PageBody, PageHeading, Prose, Rules, Section, Subsection } from '../parts/Page';

const TEXT_ROLES: ColorRole[] = [
  { name: '--label', use: 'Primary text', kind: 'text', minimum: 4.5 },
  { name: '--label-secondary', use: 'Descriptions and values', kind: 'text', minimum: 4.5 },
  { name: '--label-tertiary', use: 'Metadata and placeholders', kind: 'text', minimum: 4.5 },
  { name: '--label-quaternary', use: 'Disabled text only', kind: 'text' },
  { name: '--tint', use: 'Links and interactive text', kind: 'text', minimum: 4.5 },
  { name: '--critical', use: 'Errors and destructive actions', kind: 'text', minimum: 4.5 },
  { name: '--warning', use: 'Needs attention', kind: 'text', minimum: 4.5 },
  { name: '--success', use: 'Complete and approved', kind: 'text', minimum: 4.5 },
];

const SURFACE_ROLES: ColorRole[] = [
  { name: '--bg-grouped', use: 'The page behind groups', kind: 'surface', on: '--bg' },
  { name: '--bg', use: 'Groups, tables, fields', kind: 'surface', on: '--bg-grouped' },
  { name: '--bg-secondary', use: 'Inset areas inside a group', kind: 'surface' },
  { name: '--bg-elevated', use: 'Menus, popovers, sheets', kind: 'surface', on: '--bg-grouped' },
];

const FILL_ROLES: ColorRole[] = [
  { name: '--fill', use: 'Gray controls while pressed', kind: 'fill' },
  { name: '--fill-secondary', use: 'Gray buttons and tokens', kind: 'fill' },
  { name: '--fill-tertiary', use: 'Hover on plain controls', kind: 'fill' },
  { name: '--tint-fill', use: 'Tinted buttons, selected tokens', kind: 'fill' },
  { name: '--critical-fill', use: 'Critical banners', kind: 'fill' },
  { name: '--warning-fill', use: 'Warning banners', kind: 'fill' },
  { name: '--success-fill', use: 'Success banners', kind: 'fill' },
];

const LINE_ROLES: ColorRole[] = [
  { name: '--separator', use: 'Hairlines between rows', kind: 'line' },
  { name: '--separator-strong', use: 'Lines between sections', kind: 'line' },
  { name: '--control-border', use: 'Edges of fields and checkboxes', kind: 'line', minimum: 3 },
];

const SOLID_ROLES: ColorRole[] = [
  {
    name: '--tint',
    use: 'Filled buttons, selected controls',
    kind: 'solid',
    on: '--on-tint',
    minimum: 4.5,
  },
  {
    name: '--critical-solid',
    use: 'Destructive filled buttons',
    kind: 'solid',
    on: '--on-critical',
    minimum: 4.5,
  },
  {
    name: '--warning-solid',
    use: 'Solid warning banner',
    kind: 'solid',
    on: '--on-warning',
    minimum: 4.5,
  },
  {
    name: '--success-solid',
    use: 'Solid success banner',
    kind: 'solid',
    on: '--on-success',
    minimum: 4.5,
  },
  {
    name: '--highlight',
    use: 'Search matches, new items',
    kind: 'solid',
    on: '--on-highlight',
    minimum: 4.5,
  },
  {
    name: '--masquerade',
    use: 'Showing you are viewing as someone else',
    kind: 'solid',
    on: '--on-masquerade',
    minimum: 4.5,
  },
];

export const Color = () => (
  <PageBody>
    <PageHeading
      title="Color"
      lede="Color tells people what they can click, what needs their attention and what went well. This page shows the colors we use, the one job each of them does, and the rules that keep text easy to read in light and dark mode."
    />

    <Section title="Colors by job, not by shade">
      <Prose>
        Components never use a raw color code. They use roles instead, such as label, fill,
        separator or grouped background. Each role is a token: a named setting, like{' '}
        <Code>--label</Code>, that the code refers to instead of a fixed value. A role points at a
        primitive, one color from the palette, and dark mode points the same role at a different
        primitive. So a component written once works in both themes.
      </Prose>
      <Prose>
        Our grays lean slightly toward the brand teal. Text colors are solid, so their contrast (how
        strongly text stands out from what is behind it) is guaranteed. Fills are see through, so
        one control style sits correctly on any surface.
      </Prose>
      <Rules
        items={[
          'Use the tint, our teal accent, only on things a person can act on. A teal title makes every teal link mean less.',
          'Pair every status color with an icon or a word. Color alone never carries meaning, since not everyone sees it the same way.',
          'The quaternary (fourth level) label is for disabled text only. It is faint on purpose and does not meet the contrast minimum for text.',
          'Use the solid status colors for full width banners and filled buttons. Everywhere else, use the status text color on its matching fill.',
        ]}
      />
    </Section>

    <Section title="Text" wide>
      <ColorBoard
        roles={TEXT_ROLES}
        caption="Text colors, with how strongly each stands out on the content background"
      />
    </Section>

    <Section title="Surfaces" wide>
      <Prose>
        Content sits on <Code>--bg</Code> inside a page of <Code>--bg-grouped</Code>. The small step
        in lightness between them is enough to set a group apart, so groups need no border and no
        shadow. Things that float above the page, such as menus and sheets, use{' '}
        <Code>--bg-elevated</Code>. It is lighter in dark mode too, so you can still tell what sits
        on top.
      </Prose>
      <ColorBoard roles={SURFACE_ROLES} caption="Surface roles" />
    </Section>

    <Section title="Fills and lines" wide>
      <ColorBoard roles={FILL_ROLES} caption="See through fills" />
      <ColorBoard
        roles={LINE_ROLES}
        caption="Separators and control edges, with how strongly the control border stands out on the content background"
      />
    </Section>

    <Section title="Solid colors and the text on them" wide>
      <ColorBoard
        roles={SOLID_ROLES}
        caption="Solid colors, with the contrast of the text drawn on top"
      />
    </Section>

    <Section title="Interface colors, one job each">
      <Subsection title="Teal">
        <Prose>
          These are the interface teals, the <Code>--teal</Code> scale. Light mode uses the primary,
          a deep teal. Dark mode lightens <Code>--teal-400</Code> one step, so teal text keeps a
          contrast ratio of 4.5:1 (the minimum for readable text) on tinted fills over every
          surface. Filled controls in dark mode use dark text, because white on bright teal is too
          hard to read.
        </Prose>
      </Subsection>
      <Subsection title="Magenta">
        <Prose>
          Magenta fills destructive buttons, the ones that delete or undo something. One step
          darker, it colors critical text, so error text keeps 4.5:1 on its own tinted fill. It
          reads as a red pink, which suits errors, and we never use it as decoration.
        </Prose>
      </Subsection>
      <Subsection title="Yellow">
        <Prose>
          Yellow has one job: highlighting search matches and marking new items, always with dark
          text on top.
        </Prose>
        <p className="m-0 text-body text-[var(--label)]">
          Results for{' '}
          <mark className="bg-[var(--highlight)] text-[var(--on-highlight)] rounded-[var(--corner-sm)] px-0.5">
            North
          </mark>
          wind Robotics
        </p>
      </Subsection>
      <Subsection title="The MassChallenge brand palette">
        <Prose>
          The brand palette from the MassChallenge brand guidelines is in the token files too, as
          primitives with an <Code>--mc-</Code> prefix, such as <Code>--mc-navy</Code> and{' '}
          <Code>--mc-teal</Code>. Websites and brand material use them. Components do not: the
          product keeps its interface teal, <Code>--tint</Code>, until a later release moves it to
          the new Teal. The{' '}
          <a href="#brand" className="text-[var(--tint)]">
            brand guidelines
          </a>{' '}
          list every color and its job.
        </Prose>
      </Subsection>
      <Subsection title="Status">
        <div className="flex flex-wrap gap-2">
          <Badge tone="success">Scored</Badge>
          <Badge tone="warning">Needs judge</Badge>
          <Badge tone="critical">Withdrawn</Badge>
          <Badge tone="info">In review</Badge>
          <Badge>Draft</Badge>
        </div>
        <Prose>
          There is no separate notice status. Orange and mustard are hard to tell apart, and even
          harder for people with red green color blindness, so warning covers both.
        </Prose>
      </Subsection>
    </Section>
  </PageBody>
);
