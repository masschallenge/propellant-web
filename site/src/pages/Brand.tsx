import { Table } from '../../../src/index';
import lockupColor from '../../../assets/brand/propellant-lockup-color.svg';
import lockupWhite from '../../../assets/brand/propellant-lockup-white.svg';
import icon from '../../../assets/brand/propellant-icon.svg';
import { Code, PageBody, PageHeading, Prose, Rules, Section, Subsection } from '../parts/Page';

const PALETTE = [
  {
    id: 'deep-teal',
    name: 'Deep teal',
    hex: '#044451',
    token: '--teal-900',
    role: 'Brand surfaces, such as the panel of a sign in page',
  },
  {
    id: 'teal',
    name: 'Teal',
    hex: '#065E6F',
    token: '--teal-800',
    role: 'The primary interactive color in light mode',
  },
  {
    id: 'mid-teal',
    name: 'Mid teal',
    hex: '#068DA4',
    token: '--teal-600',
    role: 'Supporting accents',
  },
  {
    id: 'bright-teal',
    name: 'Bright teal',
    hex: '#0FACBD',
    token: '--teal-400',
    role: 'Accents on dark surfaces',
  },
  {
    id: 'pale-teal',
    name: 'Pale teal',
    hex: '#D9F6FA',
    token: '--teal-100',
    role: 'Tinted backgrounds',
  },
  { id: 'mist', name: 'Mist', hex: '#F3FBFC', token: '--teal-50', role: 'The lightest tint' },
  {
    id: 'magenta',
    name: 'Magenta',
    hex: '#BF0261',
    token: '--magenta-600',
    role: 'Destructive actions and errors',
  },
  {
    id: 'yellow',
    name: 'Yellow',
    hex: '#FFC801',
    token: '--yellow-400',
    role: 'Highlights, such as search matches and new items',
  },
];

const TYPEFACES = [
  {
    id: 'sans',
    name: 'Propellant Sans',
    use: 'All text: interfaces, documents, slides, sheets and email. It is Lato 2.0 at 400, 500, 600 and 700, plus 400 italic, shipped with Propellant.',
  },
  {
    id: 'oswald',
    name: 'Oswald',
    use: 'Display headlines, set in capitals, on public pages, slides, social graphics and document titles. Never inside signed in product screens.',
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

export const Brand = () => (
  <PageBody>
    <PageHeading
      title="Brand guidelines"
      lede="How MassChallenge shows up in our web products and websites: the name, color, type and voice. Most of it is already built into Propellant, so when you use its components and tokens (the named values for color, type and spacing), you follow these guidelines without extra work."
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
        The logo has its own page. It covers lockups, treatments, clear space and minimum sizes.{' '}
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
      <div className="overflow-x-auto">
        <Table
          caption="Brand palette"
          size="sm"
          rows={PALETTE}
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
            { key: 'hex', header: 'Hex', cell: (row) => <Code>{row.hex}</Code> },
            { key: 'token', header: 'Token', cell: (row) => <Code>{row.token}</Code> },
            { key: 'role', header: 'Role', cell: (row) => row.role },
          ]}
        />
      </div>
      <Subsection title="Using color">
        <Rules
          items={[
            'Teal means you can act on something: buttons, links, selected controls and focus. Do not use it for headings, names or numbers.',
            'Magenta means something is wrong or cannot be undone. Never use it decoratively.',
            'Yellow highlights. Always set dark text on it.',
            'Our grays carry a slight teal tint, so they sit comfortably next to the teals.',
            'Pair every status color with a word or a symbol, never color alone.',
            <>
              Text stands out from its background by a contrast ratio of at least 4.5:1, and the
              edges of controls by at least 3:1, in light and dark themes. In interfaces, use the
              semantic tokens (named for their job, not their color) on the{' '}
              <a href="#color" className="text-[var(--tint)]">
                color page
              </a>{' '}
              rather than the hex values above.
            </>,
          ]}
        />
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
      <div className="flex flex-col gap-4 rounded-[var(--corner-lg)] bg-[var(--bg)] p-6">
        <p className="m-0 font-[family-name:var(--type-family-brand)] font-medium uppercase text-[2.5rem] leading-none tracking-[0.01em] text-[var(--label)]">
          Oswald headlines
        </p>
        <p className="m-0 text-title3 text-[var(--label)]">
          Propellant Sans sets every label, paragraph and number in a product.
        </p>
      </div>
      <Rules
        items={[
          'Use sentence case for titles, labels and buttons. Capitals belong only to Oswald headlines and the wordmark.',
          <>
            Use the eleven named text styles on the{' '}
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
          'Icons sit beside text: their stroke follows the weight of the text and their size follows its text style.',
          'Use one icon per idea across a product.',
          'An icon that acts alone, without a visible label, needs an accessible name.',
        ]}
      />
    </Section>
  </PageBody>
);
