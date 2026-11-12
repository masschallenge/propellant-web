import { Table } from '../../../src/index';
import lockupColor from '../../../assets/brand/propellant-lockup-color.svg';
import lockupWhite from '../../../assets/brand/propellant-lockup-white.svg';
import icon from '../../../assets/brand/propellant-icon.svg';
import { Code, PageBody, PageHeading, Prose, Rules, Section, Subsection } from '../parts/Page';
import {
  APPROVED_PAIRINGS,
  CHART_ORDER,
  CORE_COLORS,
  SUPPORTING_COLORS,
  WARM_ACCENTS,
} from '../parts/brandPalette';
import type { BrandColor } from '../parts/brandPalette';

const TYPEFACES = [
  {
    id: 'oswald',
    name: 'Oswald',
    use: 'Headlines, always in capitals: SemiBold for headlines and subheads, Regular with wide tracking for eyebrows, Bold for big stats only. Never inside signed in product screens.',
  },
  {
    id: 'sans',
    name: 'Lato (Propellant Sans)',
    use: 'Reading text, at a line height of 1.5. In Propellant it is Propellant Sans: Lato 2.0 at 400, 500, 600 and 700, plus 400 italic.',
  },
];

const VOICE_EXAMPLES = [
  {
    id: 'hype',
    avoid: "Leverage our seamless platform to unlock your startup's full potential!",
    write: 'Find mentors who know your market.',
  },
  {
    id: 'system',
    avoid: 'Users must complete all required fields prior to submission.',
    write: 'Add your company website to submit your application.',
  },
  {
    id: 'error',
    avoid: 'Oops! Something went wrong.',
    write: 'We could not save your changes. Check your connection and try again.',
  },
];

const Swatch = ({ token }: { token: string }) => (
  <span
    aria-hidden="true"
    className="inline-block size-6 shrink-0 rounded-[var(--corner-sm)] shadow-[inset_0_0_0_1px_var(--separator)] align-middle"
    style={{ background: `var(${token})` }}
  />
);

const PaletteTable = ({ caption, colors }: { caption: string; colors: BrandColor[] }) => (
  <div className="overflow-x-auto">
    <Table
      caption={caption}
      size="sm"
      rows={colors}
      rowId={(row) => row.id}
      columns={[
        {
          key: 'name',
          header: 'Name',
          cell: (row) => (
            <span className="inline-flex items-center gap-3">
              <Swatch token={row.token} />
              {row.name}
            </span>
          ),
        },
        {
          key: 'hex',
          header: 'Hex',
          cell: (row) => (
            <span className="inline-flex flex-col gap-0.5">
              <Code>{row.hex}</Code>
              {row.printSubstitute ? (
                <span className="text-footnote text-[var(--label-secondary)]">
                  Print <Code>{row.printSubstitute}</Code>
                </span>
              ) : null}
            </span>
          ),
        },
        { key: 'token', header: 'Token', cell: (row) => <Code>{row.token}</Code> },
        { key: 'use', header: 'Use it for', cell: (row) => row.use },
      ]}
    />
  </div>
);

export const Brand = () => (
  <PageBody>
    <PageHeading
      title="Brand guidelines"
      lede="How MassChallenge shows up in our web products and websites: the name, color, type and voice. The standard is the MassChallenge brand guidelines from MassChallenge Marketing, and Propellant applies them. Most of it is already built into Propellant, so when you use its components and tokens (the named values for color, type and spacing), you follow these guidelines without extra work."
    />

    <Section title="The name">
      <Rules
        items={[
          'Write MassChallenge as one word with a capital M and a capital C.',
          'Do not abbreviate it to MC in running text. The MC monogram is a logo, not a word.',
          'Do not add a trademark symbol to the name or the logo.',
        ]}
      />
      <Prose>
        The logo has its own page. It covers versions, treatments, clear space and minimum sizes.{' '}
        <a href="#logo" className="text-[var(--tint)]">
          Read the logo guidelines
        </a>
        .
      </Prose>
    </Section>

    <Section title="The Propellant mark">
      <Prose>
        Propellant has a mark of its own. It stands for the design system and nothing else: this
        site, Storybook (our workshop for trying out components), the repository and the package.
        Like the MassChallenge logo, it pairs a gray stem with a teal bowl and sets the name beside
        a thin divider. It is built from Propellant&apos;s capsule shapes, and the stem breaks into
        two fading capsules: the exhaust that gives the system its name.
      </Prose>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(min(100%,13rem),1fr))]">
        <div className="flex min-h-28 items-center justify-center rounded-[var(--corner-lg)] bg-[var(--gray-0)] p-6 shadow-[inset_0_0_0_1px_var(--gray-100)]">
          <img src={lockupColor} alt="Propellant lockup in color" className="h-10 w-auto" />
        </div>
        <div className="flex min-h-28 items-center justify-center rounded-[var(--corner-lg)] bg-[var(--teal-900)] p-6">
          <img src={lockupWhite} alt="Propellant lockup in white" className="h-10 w-auto" />
        </div>
        <div className="flex min-h-28 items-center justify-center rounded-[var(--corner-lg)] bg-[var(--gray-0)] p-6 shadow-[inset_0_0_0_1px_var(--gray-100)]">
          <img src={icon} alt="Propellant app icon" className="size-16" />
        </div>
      </div>
      <Rules
        items={[
          'Use the Propellant mark only to refer to the design system. Never use it in place of the MassChallenge logo in a product or website, and never place the two marks so they read as one.',
          'The clear space and things to avoid for the MassChallenge logo apply to this mark too. Keep the mark and the icon at least 16px tall, and the lockup at least 24px tall.',
          <>
            The files are in <Code>assets/brand</Code>: lockups and marks in color, white and black,
            and the app icon.
          </>,
        ]}
      />
    </Section>

    <Section title="Color" wide>
      <PaletteTable caption="Core colors" colors={CORE_COLORS} />
      <PaletteTable caption="Supporting blues" colors={SUPPORTING_COLORS} />
      <Prose>
        The MC Gradient runs from Navy to Ocean, at any angle (<Code>--mc-gradient</Code>).
      </Prose>
      <div
        aria-hidden="true"
        className="h-16 max-w-[var(--width-reading)] bg-[image:var(--mc-gradient)]"
      />
      <Subsection title="Warm accents">
        <Prose>
          Use one warm accent per piece, in small doses: a word, a tag, a rule or a stat. Never as a
          large background. For print, use the listed substitute.
        </Prose>
        <PaletteTable caption="Warm accents" colors={WARM_ACCENTS} />
      </Subsection>
      <Subsection title="Using color">
        <Rules
          items={[
            'Cyan only on dark backgrounds: Navy, Black and Deep Teal.',
            'MC Blue is for the logo and shapes, not text. On light backgrounds, colored text is Teal.',
            'Orange takes dark text, never white.',
            'Raspberry, Orange and Lime are decoration. They never signal status, and the status colors (error, warning and success) are never decoration.',
            'CMYK values are approximate until confirmed with a printer proof.',
            <>
              Charts use the colors in this order: {CHART_ORDER.join(', ')}. Label the data
              directly.
            </>,
            <>
              The signed in products keep their interface teal, <Code>--tint</Code>, for now. A
              later release moves it to the new Teal. In interfaces, use the semantic tokens on the{' '}
              <a href="#color" className="text-[var(--tint)]">
                color page
              </a>{' '}
              rather than the hex values above.
            </>,
          ]}
        />
      </Subsection>
      <Subsection title="Approved pairings">
        <div className="overflow-x-auto">
          <Table
            caption="Approved pairings, verified for contrast"
            size="sm"
            rows={APPROVED_PAIRINGS}
            rowId={(row) => row.id}
            columns={[
              {
                key: 'pairing',
                header: 'Pairing',
                cell: (row) => `${row.foreground} on ${row.background}`,
              },
              {
                key: 'ratio',
                header: 'Contrast ratio',
                cell: (row) => `${row.ratio.toFixed(1)}:1`,
              },
            ]}
          />
        </div>
      </Subsection>
    </Section>

    <Section title="Typography">
      <div className="overflow-x-auto">
        <Table
          caption="Typefaces"
          size="sm"
          rows={TYPEFACES}
          rowId={(row) => row.id}
          columns={[
            { key: 'name', header: 'Typeface', cell: (row) => row.name },
            { key: 'use', header: 'Use it for', cell: (row) => row.use },
          ]}
        />
      </div>
      <div className="flex flex-col gap-3 bg-[var(--mc-navy)] p-6">
        <p className="m-0 font-[family-name:var(--type-family-brand)] font-normal uppercase text-callout tracking-[0.3em] text-[var(--gray-0)]">
          Eyebrow
        </p>
        <p className="m-0 font-[family-name:var(--type-family-brand)] font-semibold uppercase text-[2.5rem] leading-none text-[var(--gray-0)]">
          Oswald headlines <span className="text-[var(--mc-cyan)]">in two tones</span>
        </p>
        <p className="m-0 text-title3 font-normal leading-normal text-[var(--gray-0)]">
          Lato carries the reading text, in sentence case.
        </p>
      </div>
      <Rules
        items={[
          'Gotham, Bebas, Arial, Montserrat and Open Sans are retired. In Office and email, fall back to Aptos Narrow Bold in capitals for headers and Aptos for body text.',
          'Never set body copy in Oswald or in capitals.',
          'In the signed in products nothing changes: Oswald is never used, and titles, labels and buttons are in sentence case.',
          <>
            In products, use the eleven named text styles on the{' '}
            <a href="#typography" className="text-[var(--tint)]">
              typography page
            </a>{' '}
            rather than choosing sizes by eye.
          </>,
          'Use tabular figures (digits of equal width) wherever numbers line up in columns.',
          'Keep lines of running text to about 68 characters.',
        ]}
      />
    </Section>

    <Section title="Voice">
      <Prose>
        MassChallenge sounds bold and ambitious. The home page of our website leads with &ldquo;We
        back the rare humans with the grit to solve the toughest challenges,&rdquo; and the About
        page calls us &ldquo;a global network turning bold ideas into outcomes that matter.&rdquo;
        Our products should sound like the same people: direct, plain spoken and on the side of the
        founders we serve. In a product the stakes are practical, so keep the confidence and drop
        the slogans.
      </Prose>
      <Rules
        items={[
          'Get to the point. Use short sentences and everyday words, the way you would explain it to a colleague.',
          'Write as a person, not a system. Use "we" for MassChallenge and "you" for the person reading.',
          'Be confident without hype. Skip buzzwords such as leverage, seamless and robust, and skip exclamation marks.',
          'Write for the whole community. Use the words the people using the product use: programs, startups, applications, mentors, judges.',
          'Use sentence case for every title, label and button.',
          'Put a verb on every button that says what happens, such as Save changes or Submit application.',
          'When something goes wrong, say what happened and how to fix it. Do not apologize or blame.',
          'Use commas, colons and periods. Do not use em dashes or en dashes.',
        ]}
      />
      <Subsection title="Do and don't">
        <div className="overflow-x-auto">
          <Table
            caption="Voice in practice"
            size="sm"
            rows={VOICE_EXAMPLES}
            rowId={(row) => row.id}
            columns={[
              { key: 'avoid', header: "Don't write", cell: (row) => row.avoid },
              { key: 'write', header: 'Write', cell: (row) => row.write },
            ]}
          />
        </div>
      </Subsection>
    </Section>

    <Section title="Iconography">
      <Rules
        items={[
          'In brand material, icons are single color line icons, in Teal on light backgrounds and Cyan on dark ones, always beside a word.',
          'In products, icons sit beside text: their stroke follows the weight of the text and their size follows its text style.',
          'Use one icon per idea across a product.',
          'An icon that acts alone, without a visible label, needs an accessible name.',
        ]}
      />
    </Section>
  </PageBody>
);
