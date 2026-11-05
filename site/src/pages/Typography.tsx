import { tokens } from 'virtual:propellant-site-data';
import { Code, Note, PageBody, PageHeading, Prose, Rules, Section } from '../parts/Page';

const STYLES = [
  {
    id: 'display',
    label: 'Display',
    className: 'text-display',
    sample: 'Boston 2026',
    use: 'Public pages only',
  },
  {
    id: 'large-title',
    label: 'Large title',
    className: 'text-large-title',
    sample: 'Applications',
    use: 'Page titles',
  },
  {
    id: 'title1',
    label: 'Title 1',
    className: 'text-title1',
    sample: 'Assign judges',
    use: 'Sheet titles',
  },
  {
    id: 'title2',
    label: 'Title 2',
    className: 'text-title2',
    sample: 'Online selection',
    use: 'Section titles',
  },
  {
    id: 'title3',
    label: 'Title 3',
    className: 'text-title3',
    sample: 'Scoring rubric',
    use: 'Group titles',
  },
  {
    id: 'headline',
    label: 'Headline',
    className: 'text-headline',
    sample: 'Northwind Robotics',
    use: 'Row titles, emphasis',
  },
  {
    id: 'body',
    label: 'Body',
    className: 'text-body',
    sample: 'Judges see a startup after its application is complete.',
    use: 'Running text',
  },
  {
    id: 'callout',
    label: 'Callout',
    className: 'text-callout',
    sample: 'Scores stay private until the round closes.',
    use: 'Controls, dense text',
  },
  {
    id: 'subheadline',
    label: 'Subheadline',
    className: 'text-subheadline',
    sample: 'Series A, Boston, MA',
    use: 'Secondary lines',
  },
  {
    id: 'footnote',
    label: 'Footnote',
    className: 'text-footnote',
    sample: 'Edited 4 minutes ago',
    use: 'Metadata',
  },
  {
    id: 'caption',
    label: 'Caption',
    className: 'text-caption',
    sample: '3 of 3 judges',
    use: 'Labels on small controls',
  },
];

const WEIGHTS = [
  { value: 400, label: 'Regular', className: 'font-normal' },
  { value: 500, label: 'Medium', className: 'font-medium' },
  { value: 600, label: 'Semibold', className: 'font-semibold' },
  { value: 700, label: 'Bold', className: 'font-bold' },
];

const tokenValue = (name: string) =>
  tokens.find((token) => token.name === name)?.values.find((entry) => entry.condition === 'default')
    ?.value ?? '';

const toPixels = (remValue: string) => {
  const rem = Number.parseFloat(remValue);
  return Number.isFinite(rem) ? `${Math.round(rem * 16 * 10) / 10}` : remValue;
};

const specFor = (id: string) => {
  const size = toPixels(tokenValue(`--type-${id}-size`));
  const line = toPixels(tokenValue(`--type-${id}-line`));
  const weight = tokenValue(`--type-${id}-weight`);
  const tracking = tokenValue(`--type-${id}-tracking`);
  return `${size}/${line}, ${weight}${tracking && tracking !== '0' ? `, ${tracking} tracking` : ''}`;
};

export const Typography = () => (
  <PageBody>
    <PageHeading
      title="Typography"
      lede="One family for interfaces, Lato 2.0 at four real weights, organized as eleven named text styles."
    />

    <Section title="Text styles" wide>
      <Prose>
        Each style sets size, line height, weight and tracking together. Use the style that matches
        the job, not the size that looks right in one place. Sizes are tuned for reading at a desk,
        and the three largest step down on narrow windows.
      </Prose>
      <div className="flex flex-col rounded-[var(--corner-lg)] bg-[var(--bg)] overflow-hidden">
        {STYLES.map((style, index) => (
          <div
            key={style.id}
            className={`grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_200px] gap-x-6 gap-y-1 px-4 py-4 ${
              index
                ? 'border-0 border-t-[length:var(--hairline)] border-solid border-[var(--separator)]'
                : ''
            }`}
          >
            <p
              className={`m-0 min-w-0 text-[var(--label)] [overflow-wrap:anywhere] ${style.className}`}
            >
              {style.sample}
            </p>
            <p className="m-0 flex flex-col text-footnote tabular-nums">
              <span className="font-semibold text-[var(--label)]">
                {style.label} <Code>{style.className}</Code>
              </span>
              <span className="text-[var(--label-secondary)]">{specFor(style.id)}</span>
              <span className="text-[var(--label-tertiary)]">{style.use}</span>
            </p>
          </div>
        ))}
      </div>
      <Note>Sizes are in pixels at the default 16px root size; tokens are written in rem.</Note>
    </Section>

    <Section title="Weights">
      <Prose>
        Lato 2.0 is the designer's own update of Lato and adds Medium and Semibold. The commonly
        hosted version of Lato has no 500 or 600, so both fall back to Bold; Propellant ships the
        font files itself under the name Propellant Sans. Light and Black are left out: light
        weights are hard to read at interface sizes, and Black is too heavy for titles.
      </Prose>
      <div className="flex flex-col gap-1 rounded-[var(--corner-lg)] bg-[var(--bg)] p-4">
        {WEIGHTS.map((weight) => (
          <p
            key={weight.value}
            className={`m-0 text-title3 text-[var(--label)] ${weight.className}`}
          >
            Round 2 scoring opens Monday{' '}
            <span className="text-footnote font-normal text-[var(--label-tertiary)]">
              {weight.value} {weight.label}
            </span>
          </p>
        ))}
      </div>
      <Rules
        items={[
          'Control labels use Medium.',
          'Selected or emphasized text uses Semibold.',
          'Titles take their weight from their text style. Do not bold body text to make a heading.',
        ]}
      />
    </Section>

    <Section title="Details that read as hand set">
      <Rules
        items={[
          'Tracking tightens as size grows and opens slightly below 13px, the way optical sizing does.',
          'Tables, scores and counts use tabular figures, so digits line up in columns.',
          'Sentence case everywhere: labels, headers and buttons. No letter spaced capitals.',
          'Keep anything a person must read to finish a task at 13px or above. Use 12px for metadata only.',
          'Running text stops at about 68 characters, the --width-reading token.',
        ]}
      />
    </Section>

    <Section title="Oswald, for public pages">
      <Prose>
        The MassChallenge website sets headlines and buttons in Oswald, condensed and uppercase.
        That is the brand's most recognizable type, so public, shareable pages such as login and a
        program's application link use it for their main headline through{' '}
        <Code>--type-family-brand</Code>. Signed in applications never do; it would fight the quiet
        interface the rest of the system builds.
      </Prose>
      <div className="flex flex-col gap-2 rounded-[var(--corner-lg)] bg-[var(--bg)] p-6">
        <p className="m-0 font-[family-name:var(--type-family-brand)] font-medium uppercase text-[2rem] leading-none text-[var(--label)]">
          Apply to Boston 2026
        </p>
        <p className="m-0 text-body text-[var(--label-secondary)]">
          Public pages carry the website's voice. Applications stay quiet.
        </p>
      </div>
    </Section>

    <Section title="Icons">
      <Prose>
        Icons sit beside text and should feel like part of it: stroke weight follows the weight of
        the text beside it, size follows the text style (16px with Callout, 18px with Body, 20px
        with Title 3), and one idea gets one icon across a product. Sidebar icons take the tint;
        everywhere else an icon takes the color of its label.
      </Prose>
    </Section>
  </PageBody>
);
