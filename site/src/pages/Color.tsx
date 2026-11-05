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
  { name: '--bg-secondary', use: 'Wells inside a group', kind: 'surface' },
  { name: '--bg-elevated', use: 'Menus, popovers, sheets', kind: 'surface', on: '--bg-grouped' },
];

const FILL_ROLES: ColorRole[] = [
  { name: '--fill', use: 'Gray controls, pressed', kind: 'fill' },
  { name: '--fill-secondary', use: 'Gray buttons and tokens', kind: 'fill' },
  { name: '--fill-tertiary', use: 'Hover on plain controls', kind: 'fill' },
  { name: '--tint-fill', use: 'Tinted buttons, selected tokens', kind: 'fill' },
  { name: '--critical-fill', use: 'Critical banners', kind: 'fill' },
  { name: '--warning-fill', use: 'Warning banners', kind: 'fill' },
  { name: '--success-fill', use: 'Success banners', kind: 'fill' },
];

const LINE_ROLES: ColorRole[] = [
  { name: '--separator', use: 'Hairlines between rows', kind: 'line' },
  { name: '--separator-strong', use: 'Section rules', kind: 'line' },
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
    use: 'Viewing as another person',
    kind: 'solid',
    on: '--on-masquerade',
    minimum: 4.5,
  },
];

export const Color = () => (
  <PageBody>
    <PageHeading
      title="Color"
      lede="Neutrals lean slightly toward the brand teal, text colors stay opaque so contrast is guaranteed, and fills are translucent so one control style sits correctly on any surface."
    />

    <Section title="Roles, not swatches">
      <Prose>
        Components never name a hex value. They use roles: label, fill, separator, grouped
        background. A role resolves to a primitive from the palette, and the dark theme points the
        same role at a different primitive, so a component written once works in both themes.
      </Prose>
      <Rules
        items={[
          'Use the tint only on things a person can act on. A teal title makes every teal link mean less.',
          'Pair every status color with a glyph or a word. Color alone never carries meaning.',
          'Quaternary label is for disabled text only. It does not meet text contrast on purpose.',
          'Use the solid status colors for full width banners and filled buttons. Everywhere else, use the text color on its fill.',
        ]}
      />
    </Section>

    <Section title="Text" wide>
      <ColorBoard
        roles={TEXT_ROLES}
        caption="Text roles with contrast against the content surface"
      />
    </Section>

    <Section title="Surfaces" wide>
      <Prose>
        Content sits on <Code>--bg</Code> inside a page of <Code>--bg-grouped</Code>. That step in
        lightness is the separation, so content groups need no border and no shadow. Things that
        float, such as menus and sheets, use <Code>--bg-elevated</Code>, which is also lighter in
        dark mode so depth still reads.
      </Prose>
      <ColorBoard roles={SURFACE_ROLES} caption="Surface roles" />
    </Section>

    <Section title="Fills and lines" wide>
      <ColorBoard roles={FILL_ROLES} caption="Translucent fills" />
      <ColorBoard
        roles={LINE_ROLES}
        caption="Separators and control edges, with control border contrast against the content surface"
      />
    </Section>

    <Section title="Solid colors and their ink" wide>
      <ColorBoard
        roles={SOLID_ROLES}
        caption="Solid colors with the contrast of the text drawn on them"
      />
    </Section>

    <Section title="Brand colors, one job each">
      <Subsection title="Teal">
        <Prose>
          The website's teals. Light mode uses the primary, a deep teal. Dark mode lightens the
          website's bright teal one step, so teal text keeps 4.5:1 on tinted fills over every
          surface, and filled controls use dark ink because white on bright teal fails contrast.
        </Prose>
      </Subsection>
      <Subsection title="Magenta">
        <Prose>
          The website's secondary color fills destructive buttons, and one step darker it colors
          critical text, so error text keeps 4.5:1 on its own tinted fill. It reads as red pink, so
          it works for errors, and it is never used decoratively.
        </Prose>
      </Subsection>
      <Subsection title="Yellow">
        <Prose>
          Yellow has one job: highlighting search matches and marking new items, always with dark
          ink.
        </Prose>
        <p className="m-0 text-body text-[var(--label)]">
          Results for{' '}
          <mark className="bg-[var(--highlight)] text-[var(--on-highlight)] rounded-[var(--corner-sm)] px-0.5">
            North
          </mark>
          wind Robotics
        </p>
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
          There is no separate notice status. Orange and mustard are hard to tell apart, and harder
          with red green color blindness, so warning covers both.
        </Prose>
      </Subsection>
    </Section>
  </PageBody>
);
