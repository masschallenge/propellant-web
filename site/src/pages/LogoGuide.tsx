import type { ReactNode } from 'react';
import { Logo, Table } from '../../../src/index';
import type { LogoTreatment } from '../../../src/index';
import { Code, CodeBlock, Note, PageBody, PageHeading, Prose, Rules, Section } from '../parts/Page';

const FILES_URL = 'https://github.com/masschallenge/propellant-web/tree/main/assets/logos';

const LOGO_COLORS = [
  { id: 'gray', part: 'M and wordmark', hex: '#828486' },
  { id: 'teal', part: 'C and divider', hex: '#17ACBC' },
];

const TREATMENTS: {
  treatment: LogoTreatment;
  title: string;
  use: string;
  surface: string;
}[] = [
  {
    treatment: 'color',
    title: 'Full color',
    use: 'White and light neutral backgrounds, such as the page and content surfaces.',
    surface: 'bg-[var(--gray-0)] shadow-[inset_0_0_0_1px_var(--gray-100)]',
  },
  {
    treatment: 'white',
    title: 'White',
    use: 'The brand teal, dark surfaces, dark mode and photographs dark enough to keep the logo legible.',
    surface: 'bg-[var(--teal-900)]',
  },
  {
    treatment: 'black',
    title: 'Black',
    use: 'Single color print, and light backgrounds that the full color logo does not suit.',
    surface: 'bg-[var(--yellow-400)]',
  },
];

const SIZES = [
  {
    id: 'horizontal',
    lockup: 'Horizontal',
    minimum: '24px. Below this the wordmark stops being readable; use the monogram instead.',
  },
  { id: 'monogram', lockup: 'Monogram', minimum: '16px.' },
];

const MISUSES = [
  { id: 'stretch', caption: 'Do not stretch or squash the logo.', className: 'h-8 scale-y-50' },
  { id: 'rotate', caption: 'Do not rotate or skew the logo.', className: 'h-8 -rotate-12' },
  {
    id: 'recolor',
    caption: 'Do not change the logo colors.',
    className: 'h-8 [filter:hue-rotate(150deg)_saturate(3)]',
  },
  {
    id: 'effects',
    caption: 'Do not add shadows, glows or other effects.',
    className: 'h-8 [filter:drop-shadow(0_4px_6px_rgb(0_0_0/0.6))]',
  },
];

const Tile = ({
  surface,
  children,
  caption,
}: {
  surface: string;
  children: ReactNode;
  caption: ReactNode;
}) => (
  <figure className="m-0 flex flex-col gap-3 min-w-0">
    <div
      className={`flex min-h-36 items-center justify-center overflow-hidden rounded-[var(--corner-lg)] p-8 ${surface}`}
    >
      {children}
    </div>
    <figcaption className="text-callout text-[var(--label)]">{caption}</figcaption>
  </figure>
);

const Grid = ({ children }: { children: ReactNode }) => (
  <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(min(100%,15rem),1fr))]">
    {children}
  </div>
);

export const LogoGuide = () => (
  <PageBody>
    <PageHeading
      title="Logo"
      lede="The logo is the most recognizable part of the MassChallenge brand, so we treat it with care. Use the files we supply or the Logo component, and never redraw, retype or recolor it."
    />

    <Section title="Lockups" wide>
      <Grid>
        <Tile
          surface="bg-[var(--gray-0)] shadow-[inset_0_0_0_1px_var(--gray-100)]"
          caption={
            <>
              <strong className="font-semibold">Horizontal.</strong> The default. Headers, sign in
              pages, footers, documents and anywhere the full name should be read.
            </>
          }
        >
          <Logo className="h-10" />
        </Tile>
        <Tile
          surface="bg-[var(--gray-0)] shadow-[inset_0_0_0_1px_var(--gray-100)]"
          caption={
            <>
              <strong className="font-semibold">Monogram.</strong> Small spaces where the horizontal
              lockup would fall below its minimum size: favicons, app icons, avatars and compact
              navigation.
            </>
          }
        >
          <Logo lockup="monogram" className="h-14" />
        </Tile>
      </Grid>
      <div className="max-w-[var(--width-reading)] flex flex-col gap-4">
        <Prose>
          A lockup is a fixed arrangement of the logo&apos;s parts. The horizontal lockup is the MC
          monogram, a thin vertical divider and the MASSCHALLENGE wordmark. Keep the three parts
          together, at the proportions in the files. Use the monogram on its own only where the
          MassChallenge name is already clear from the context.
        </Prose>
      </div>
    </Section>

    <Section title="Logo colors">
      <div className="overflow-x-auto">
        <Table
          caption="Colors in the logo artwork"
          size="sm"
          rows={LOGO_COLORS}
          rowId={(row) => row.id}
          columns={[
            {
              key: 'part',
              header: 'Part',
              cell: (row) => (
                <span className="inline-flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-block size-6 shrink-0 rounded-[var(--corner-sm)]"
                    style={{ background: row.hex }}
                  />
                  {row.part}
                </span>
              ),
            },
            { key: 'hex', header: 'Hex', cell: (row) => <Code>{row.hex}</Code> },
          ]}
        />
      </div>
      <Prose>
        These are the colors of the logo files. They belong to the logo only; interface colors come
        from the brand palette and the tokens.
      </Prose>
    </Section>

    <Section title="Treatments" wide>
      <Grid>
        {TREATMENTS.map((item) => (
          <Tile
            key={item.treatment}
            surface={item.surface}
            caption={
              <>
                <strong className="font-semibold">{item.title}.</strong> {item.use}
              </>
            }
          >
            <Logo treatment={item.treatment} className="h-8" />
          </Tile>
        ))}
      </Grid>
      <div className="max-w-[var(--width-reading)] flex flex-col gap-4">
        <Prose>
          A treatment is the color version of the logo you pick for a background. The one color
          treatments are the same artwork in a single color, so the gap between the M and the C
          stays open. Each treatment exists for both lockups.
        </Prose>
        <CodeBlock label="Logo component">{`import { Logo } from '@masschallenge/propellant-web';

<Logo />
<Logo treatment="white" />
<Logo lockup="monogram" treatment="black" className="h-8" />`}</CodeBlock>
        <Prose>
          For anything that is not a React page, such as an email, a document or a favicon (the
          small icon in a browser tab), use the image files.{' '}
          <a href={FILES_URL} className="text-[var(--tint)]">
            Get the logo files
          </a>
          .
        </Prose>
      </div>
    </Section>

    <Section title="Clear space">
      <Prose>
        Give the logo room to breathe. Keep the space around it free of text, images and edges. The
        clear space on every side is half the height of the logo. A horizontal logo shown 32px tall
        needs 16px of clear space all around.
      </Prose>
      <figure className="m-0 flex flex-col gap-3">
        <div className="flex justify-center rounded-[var(--corner-lg)] bg-[var(--gray-0)] p-8 shadow-[inset_0_0_0_1px_var(--gray-100)]">
          <div className="p-4 outline-1 outline-dashed outline-[var(--teal-600)] bg-[var(--teal-50)]">
            <Logo className="h-8" />
          </div>
        </div>
        <figcaption className="text-callout text-[var(--label)]">
          The shaded area is the clear space for a logo 32px tall: 16px on every side.
        </figcaption>
      </figure>
    </Section>

    <Section title="Minimum size">
      <div className="overflow-x-auto">
        <Table
          caption="Smallest height on screen"
          size="sm"
          rows={SIZES}
          rowId={(row) => row.id}
          columns={[
            { key: 'lockup', header: 'Lockup', cell: (row) => row.lockup },
            { key: 'minimum', header: 'Smallest height', cell: (row) => row.minimum },
          ]}
        />
      </div>
      <div className="flex flex-wrap items-center gap-8 rounded-[var(--corner-lg)] bg-[var(--gray-0)] p-8 shadow-[inset_0_0_0_1px_var(--gray-100)]">
        <Logo className="h-6" />
        <Logo lockup="monogram" className="h-4" />
      </div>
      <Note>
        Both logos above are shown at their minimum height. The Logo component renders at 24px tall
        by default; size it with a height class such as <Code>h-8</Code> and the width follows.
      </Note>
    </Section>

    <Section title="Placement">
      <Rules
        items={[
          'Place the logo at the start of a header or sidebar, aligned with the content below it.',
          "In a product, link the logo to the product's home.",
          <>
            Give the logo an accessible name of MassChallenge. When the name is written right beside
            it, mark the logo as decorative with <Code>{'<Logo label="" />'}</Code>.
          </>,
        ]}
      />
    </Section>

    <Section title="Things to avoid" wide>
      <Grid>
        {MISUSES.map((misuse) => (
          <Tile
            key={misuse.id}
            surface="bg-[var(--gray-0)] shadow-[inset_0_0_0_1px_var(--gray-100)]"
            caption={misuse.caption}
          >
            <Logo label="" className={misuse.className} />
          </Tile>
        ))}
        <Tile
          surface="bg-[var(--teal-900)]"
          caption="Do not place the full color logo on the brand teal or dark backgrounds."
        >
          <Logo label="" className="h-8" />
        </Tile>
      </Grid>
      <div className="max-w-[var(--width-reading)]">
        <Rules
          items={[
            'Do not rearrange the lockup, resize its parts or remove the divider.',
            'Do not recreate the wordmark in a font or type the name in its place.',
            'Do not place the logo inside a shape or container that crowds its clear space.',
            'Do not place the logo on busy photographs; use the white treatment on a dark, quiet area.',
            'Do not use the monogram as a letter in a word or headline.',
          ]}
        />
      </div>
    </Section>
  </PageBody>
);
