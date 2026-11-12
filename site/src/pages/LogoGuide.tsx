import type { ReactNode } from 'react';
import { Logo, Table } from '../../../src/index';
import type { LogoTreatment } from '../../../src/index';
import { Code, CodeBlock, Note, PageBody, PageHeading, Prose, Rules, Section } from '../parts/Page';

const FILES_URL = 'https://github.com/masschallenge/propellant-web/tree/main/assets/logos';

const LOGO_COLORS = [
  { id: 'gray', part: 'M and wordmark', name: 'MC Gray', hex: '#808285', token: '--mc-gray' },
  { id: 'blue', part: 'C and divider', name: 'MC Blue', hex: '#0EABBC', token: '--mc-blue' },
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
    use: 'White and Warm White only.',
    surface: 'bg-[var(--mc-warm-white)] shadow-[inset_0_0_0_1px_var(--gray-100)]',
  },
  {
    treatment: 'white',
    title: 'White',
    use: 'Navy, Black, Deep Teal, Teal, MC Blue, and photographs with enough contrast.',
    surface: 'bg-[var(--mc-navy)]',
  },
  {
    treatment: 'black',
    title: 'Black',
    use: 'One color print, and light backgrounds that the full color logo does not suit.',
    surface: 'bg-[var(--yellow-400)]',
  },
];

const SIZES = [
  { id: 'vertical', version: 'Vertical', screen: '60px wide', print: '20mm wide' },
  {
    id: 'horizontal',
    version: 'Horizontal',
    screen:
      '160px wide. At the default 24px tall it is about 178px wide. Below 24px tall, use the MC mark instead.',
    print: '30mm wide',
  },
  { id: 'monogram', version: 'MC mark', screen: '16px tall', print: '8mm' },
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

    <Section title="Versions" wide>
      <Grid>
        <Tile
          surface="bg-[var(--gray-0)] shadow-[inset_0_0_0_1px_var(--gray-100)]"
          caption={
            <>
              <strong className="font-semibold">Horizontal.</strong> Where width is plentiful and
              height is tight: headers, footers, sponsor slides and banners. Propellant uses it in
              product headers and sign in pages.
            </>
          }
        >
          <Logo className="h-10" />
        </Tile>
        <Tile
          surface="bg-[var(--gray-0)] shadow-[inset_0_0_0_1px_var(--gray-100)]"
          caption={
            <>
              <strong className="font-semibold">MC mark.</strong> Where the audience already knows
              us. In Propellant: compact navigation, favicons, app icons and avatars.
            </>
          }
        >
          <Logo lockup="monogram" className="h-14" />
        </Tile>
      </Grid>
      <div className="max-w-[var(--width-reading)] flex flex-col gap-4">
        <Prose>
          The vertical logo is the default for most layouts, and local logos are for work tied to
          one site: US sites use the city and international sites use the country. Both come from
          MassChallenge Marketing; Propellant ships the horizontal logo and the MC mark only. Never
          draw or assemble a vertical or local logo, and never type a location next to the logo.
        </Prose>
        <Prose>
          The horizontal logo is the MC mark, a thin vertical divider and the MASSCHALLENGE
          wordmark. Keep the parts together, at the proportions in the files. Use the MC mark on its
          own only where the MassChallenge name is already clear from the context.
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
                    style={{ background: `var(${row.token})` }}
                  />
                  {row.part}
                </span>
              ),
            },
            { key: 'name', header: 'Color', cell: (row) => row.name },
            { key: 'hex', header: 'Hex', cell: (row) => <Code>{row.hex}</Code> },
          ]}
        />
      </div>
      <Prose>
        These are the official logo colors. The image files Propellant ships today measure{' '}
        <Code>#828486</Code> and <Code>#17ACBC</Code>, a shade off. Do not recolor them: official
        artwork from MassChallenge Marketing will replace them. MC Gray is for the logo only, and MC
        Blue is never used for text.
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
          stays open. Each treatment exists for both versions Propellant ships. Never put the white
          logo on light colors such as Cyan, Yellow or Lime, and on a busy photograph add the hero
          overlay or a solid color block behind it.
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
        Keep a clear space around the logo equal to the height of the M in the MASSCHALLENGE
        wordmark, on every side. Nothing enters it: no type, images, edges or other logos. In the
        horizontal files the M is about 40% of the logo&apos;s height, so a horizontal logo shown
        32px tall needs about 13px of clear space all around. Align the horizontal logo to a corner
        or the top edge of its area.
      </Prose>
      <figure className="m-0 flex flex-col gap-3">
        <div className="flex justify-center rounded-[var(--corner-lg)] bg-[var(--gray-0)] p-8 shadow-[inset_0_0_0_1px_var(--gray-100)]">
          <div className="p-[0.8125rem] outline-1 outline-dashed outline-[var(--mc-teal)] bg-[var(--mc-light-tint)]">
            <Logo className="h-8" />
          </div>
        </div>
        <figcaption className="text-callout text-[var(--label)]">
          The shaded area is the clear space for a logo 32px tall: about 13px on every side, the
          height of the M.
        </figcaption>
      </figure>
    </Section>

    <Section title="Minimum size">
      <div className="overflow-x-auto">
        <Table
          caption="Minimum sizes"
          size="sm"
          rows={SIZES}
          rowId={(row) => row.id}
          columns={[
            { key: 'version', header: 'Version', cell: (row) => row.version },
            { key: 'screen', header: 'On screen', cell: (row) => row.screen },
            { key: 'print', header: 'In print', cell: (row) => row.print },
          ]}
        />
      </div>
      <div className="flex flex-wrap items-center gap-8 rounded-[var(--corner-lg)] bg-[var(--gray-0)] p-8 shadow-[inset_0_0_0_1px_var(--gray-100)]">
        <Logo className="h-6" />
        <Logo lockup="monogram" className="h-4" />
      </div>
      <Note>
        The horizontal logo and the MC mark above are shown at the smallest height Propellant uses
        for them. The Logo component renders at 24px tall by default; size it with a height class
        such as <Code>h-8</Code> and the width follows.
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
          surface="bg-[var(--mc-navy)]"
          caption="Do not place the full color logo on dark colors."
        >
          <Logo label="" className="h-8" />
        </Tile>
        <Tile
          surface="bg-[var(--mc-cyan)]"
          caption="Do not place the white logo on light colors such as Cyan, Yellow or Lime."
        >
          <Logo label="" treatment="white" className="h-8" />
        </Tile>
      </Grid>
      <div className="max-w-[var(--width-reading)]">
        <Rules
          items={[
            'Do not outline, flip or crop the logo.',
            'Do not rearrange, rebuild or retype the logo, resize its parts or remove the divider.',
            'Do not create new lockups or sub-logos. Only MassChallenge Marketing creates sub-brand lockups.',
            'Do not place the logo inside a shape or container that crowds its clear space.',
            'Do not place the logo on busy photographs without the hero overlay or a solid color block behind it.',
            'Do not use the MC mark as a letter in a word or headline.',
          ]}
        />
      </div>
    </Section>
  </PageBody>
);
