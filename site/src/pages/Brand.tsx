import { Table } from '../../../src/index';
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
    use: 'All interface and body text. It is Lato 2.0 at 400, 500, 600 and 700, plus 400 italic, shipped with Propellant.',
  },
  {
    id: 'oswald',
    name: 'Oswald',
    use: 'Display headlines on public websites and pages, set in capitals. Never inside signed in applications.',
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
      lede="How the MassChallenge brand appears in web applications and websites: the name, color, type and voice. Propellant puts most of this into code, so a product built with its components and tokens follows it by default."
    />

    <Section title="The name">
      <Rules
        items={[
          'Write MassChallenge as one word with a capital M and a capital C.',
          'Do not abbreviate it to MC in running text. The MC monogram is a logo, not a word.',
          'Do not add a trademark symbol in interfaces.',
        ]}
      />
      <Prose>
        The logo has its own page, covering lockups, treatments, clear space and minimum sizes.{' '}
        <a href="#logo" className="text-[var(--tint)]">
          Read the logo guidelines
        </a>
        .
      </Prose>
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
            'Neutrals carry a slight teal tint, so grays and teals sit together comfortably.',
            'Pair every status color with a word or a symbol, never color alone.',
            <>
              Text meets a contrast of at least 4.5:1, and the edges of controls at least 3:1, in
              light and dark themes. Use the semantic tokens on the{' '}
              <a href="#color" className="text-[var(--tint)]">
                color page
              </a>{' '}
              rather than the hex values above in interfaces.
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
          'Use tabular figures wherever numbers line up in columns.',
          'Keep lines of running text to about 68 characters.',
        ]}
      />
    </Section>

    <Section title="Voice">
      <Rules
        items={[
          'Write plainly, the way a knowledgeable person talks. Prefer short sentences.',
          'Use the words the people using the product use: programs, startups, applications, mentors, judges.',
          'Put a verb on every button that says what happens, such as Save changes or Submit application.',
          'When something goes wrong, say what happened and how to fix it. Do not apologize or blame.',
          'Use commas, colons and periods. Do not use em dashes or en dashes.',
        ]}
      />
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
