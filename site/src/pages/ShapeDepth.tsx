import { Code, PageBody, PageHeading, Prose, Rules, Section } from '../parts/Page';

const RADII = [
  {
    token: '--corner-sm',
    value: '4px',
    use: 'Checkboxes, inline code, keyboard keys',
    className: 'rounded-[var(--corner-sm)]',
  },
  {
    token: '--corner-md',
    value: '8px',
    use: 'Fields, menu items, selected sidebar rows',
    className: 'rounded-[var(--corner-md)]',
  },
  {
    token: '--corner-lg',
    value: '12px',
    use: 'Groups, tables, menus, popovers',
    className: 'rounded-[var(--corner-lg)]',
  },
  {
    token: '--corner-xl',
    value: '16px',
    use: 'Sheets and dialogs',
    className: 'rounded-[var(--corner-xl)]',
  },
  {
    token: '--corner-capsule',
    value: 'Capsule',
    use: 'Buttons in a row, segmented controls, badges, search',
    className: 'rounded-[var(--corner-capsule)]',
  },
];

const LEVELS = [
  {
    title: 'Content',
    detail:
      'Groups, tables, fields and cards. No shadow and no border: a white group on the slightly darker page behind it is enough.',
    className: 'bg-[var(--bg)]',
  },
  {
    title: 'Floating',
    detail:
      'Menus, popovers, tooltips and toasts (brief pop up messages). A half pixel outline and a soft 24px shadow.',
    className: 'bg-[var(--bg-elevated)] shadow-[var(--shadow-float)]',
  },
  {
    title: 'Modal',
    detail:
      'Sheets and dialogs over a scrim, the dimmed layer that covers the page. A deeper 64px shadow, and a lighter surface in dark mode.',
    className: 'bg-[var(--bg-elevated)] shadow-[var(--shadow-sheet)]',
  },
];

export const ShapeDepth = () => (
  <PageBody>
    <PageHeading
      title="Shape and depth"
      lede="How rounded things are and how high they seem to sit tells people what they can touch and what sits on top. We use five corner sizes and three levels of depth, and we separate content mostly with background color, not with lines and shadows."
    />

    <Section title="Five corner sizes" wide>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
        {RADII.map((radius) => (
          <div
            key={radius.token}
            className="flex flex-col gap-2 p-4 rounded-[var(--corner-lg)] bg-[var(--bg)]"
          >
            <span
              className={`block h-14 w-full bg-[var(--tint-fill)] shadow-[inset_0_0_0_1px_var(--tint)] ${radius.className}`}
            />
            <code className="text-footnote font-semibold text-[var(--label)] font-[family-name:var(--type-family-mono)]">
              {radius.token}
            </code>
            <span className="text-footnote text-[var(--label-secondary)]">
              {radius.value}. {radius.use}
            </span>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Shapes inside shapes share a center">
      <Prose>
        When one rounded shape sits inside another, the inner corner radius (how rounded it is)
        equals the outer radius minus the gap between them. A 12px menu with a 4px inset holds 8px
        rows; a capsule track holds a capsule thumb. That is what makes nested controls look
        precisely made rather than piled up.
      </Prose>
      <div className="flex flex-wrap gap-6 items-end">
        <figure className="m-0 flex flex-col gap-2">
          <div className="p-1 w-56 rounded-[var(--corner-lg)] bg-[var(--bg-elevated)] shadow-[var(--shadow-float)]">
            <div className="px-2 py-1.5 rounded-[var(--corner-md)] bg-[var(--tint)] text-[var(--on-tint)] text-callout">
              Assign judges
            </div>
            <div className="px-2 py-1.5 rounded-[var(--corner-md)] text-callout text-[var(--label)]">
              Export scores
            </div>
          </div>
          <figcaption className="text-footnote text-[var(--label-secondary)]">
            12px outside, 4px inset, 8px inside
          </figcaption>
        </figure>
      </div>
      <Rules
        items={[
          'Buttons in a horizontal row are capsules (fully rounded ends). Buttons stacked vertically in a sheet may be rounded rectangles.',
          'Fields are rounded rectangles at 8px, because text lines up better against squarer corners.',
          'Checkboxes are 4px squares and radios are circles.',
        ]}
      />
    </Section>

    <Section title="Three levels of depth" wide>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 p-6 rounded-[var(--corner-lg)] bg-[var(--bg-grouped)] shadow-[inset_0_0_0_var(--hairline)_var(--separator)]">
        {LEVELS.map((level) => (
          <div
            key={level.title}
            className={`flex flex-col gap-1 p-4 rounded-[var(--corner-lg)] ${level.className}`}
          >
            <span className="text-headline text-[var(--label)]">{level.title}</span>
            <span className="text-subheadline text-[var(--label-secondary)]">{level.detail}</span>
          </div>
        ))}
      </div>
      <Prose>
        Depth, or elevation, is how high something seems to sit above the page. Leaving borders and
        shadows off content keeps pages calm. We save depth for things that float, so a menu or
        sheet stands out the moment it appears.
      </Prose>
    </Section>

    <Section title="Thin lines and frosted bars">
      <Prose>
        <Code>--hairline</Code> is our thinnest line: one pixel on standard displays and half a
        pixel on high density ones. Row separators are inset, so they start where the text starts.
      </Prose>
      <Prose>
        The toolbar and sidebar use a bar material, a frosted glass effect: the surface at partial
        opacity with <Code>backdrop-filter: saturate(180%) blur(20px)</Code>. Content scrolls under
        it and stays faintly visible, which tells a person the bar floats above the page. When
        someone turns on reduced transparency in their system settings, both materials turn solid.
      </Prose>
    </Section>
  </PageBody>
);
