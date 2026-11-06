import type { ReactNode } from 'react';
import { Table } from '../../../src/index';
import {
  Code,
  CodeBlock,
  Note,
  PageBody,
  PageHeading,
  Prose,
  Rules,
  Section,
  Subsection,
} from '../parts/Page';

const RELEASE_URL = 'https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.0.0';

const THEME_VALUES: { id: string; setting: string; value: string }[] = [
  {
    id: 'body-font',
    setting: 'Body font',
    value: 'Lato, which most builders offer in their font lists',
  },
  {
    id: 'heading-font',
    setting: 'Heading font',
    value: 'Lato for section headings. Oswald, in capitals, for one big headline per page',
  },
  { id: 'text', setting: 'Text color', value: '#1E282B' },
  { id: 'links', setting: 'Link and button color', value: '#065E6F, with white button text' },
  {
    id: 'shape',
    setting: 'Button shape',
    value: 'Fully rounded ends (a capsule), sometimes called a pill shape',
  },
  {
    id: 'dark',
    setting: 'Dark sections',
    value: '#044451 background, with white text and white buttons',
  },
  { id: 'accent', setting: 'Accent on dark sections', value: '#0FACBD' },
  { id: 'highlight', setting: 'Highlight', value: '#FFC801, always with dark text' },
  { id: 'background', setting: 'Page background', value: 'White' },
];

const CLASSES: { id: string; name: string; does: string }[] = [
  {
    id: 'headline',
    name: 'propellant-headline',
    does: 'The big brand headline, in Oswald capitals. Use it once or twice per page.',
  },
  {
    id: 'titles',
    name: 'propellant-title-1, -2, -3',
    does: 'Section headings, from largest to smallest.',
  },
  { id: 'body', name: 'propellant-body', does: 'Paragraph text.' },
  { id: 'caption', name: 'propellant-caption', does: 'Small print, such as dates and notes.' },
  { id: 'text', name: 'propellant-text', does: 'Body font and text color for a whole section.' },
  { id: 'link', name: 'propellant-link', does: 'A teal, underlined link.' },
  {
    id: 'button',
    name: 'propellant-button',
    does: 'The main button: a teal capsule. Works on links and buttons.',
  },
  {
    id: 'secondary',
    name: 'propellant-button propellant-button-secondary',
    does: 'A quieter, light teal button for the second choice.',
  },
  {
    id: 'band',
    name: 'propellant-brand-band',
    does: 'A deep teal section with white text. Buttons and links inside it switch to white.',
  },
];

const Steps = ({ items }: { items: ReactNode[] }) => (
  <ol className="m-0 pl-5 list-decimal flex flex-col gap-2 text-body text-[var(--label)] marker:text-[var(--label-tertiary)]">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ol>
);

const Lead = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold">{children}</strong>
);

export const Websites = () => (
  <PageBody>
    <PageHeading
      title="Websites and site builders"
      lede="You can bring the MassChallenge look to a site built with any website builder, such as WordPress, Squarespace, Webflow, Wix or HubSpot, or with plain HTML. This page shows how."
    />

    <Section title="Settings first, code last">
      <Prose>
        Start with your builder&apos;s own design settings. Every major builder lets you choose
        fonts, colors, button styles and a logo without writing code, and those settings survive
        theme updates and are easy for anyone on your team to change later.
      </Prose>
      <Prose>
        Only reach for the Propellant stylesheet when you need something the settings cannot do, and
        keep custom code to a minimum. Overrides written against a theme&apos;s internals tend to
        break when the theme or builder updates.
      </Prose>
    </Section>

    <Section title="Step 1: Set up your theme" wide>
      <div className="max-w-[var(--width-reading)]">
        <Prose>
          Open your builder&apos;s design or style settings and enter these values. For most sites,
          this step is all you need.
        </Prose>
      </div>
      <div className="overflow-x-auto">
        <Table
          caption="Brand values for theme settings"
          size="sm"
          rows={THEME_VALUES}
          rowId={(row) => row.id}
          columns={[
            { key: 'setting', header: 'Setting', cell: (row) => row.setting },
            { key: 'value', header: 'Value', cell: (row) => row.value },
          ]}
        />
      </div>
      <div className="max-w-[var(--width-reading)]">
        <Prose>
          Propellant Sans, the font in our products, is our name for Lato 2.0, so Lato from a
          builder&apos;s font list is a close match. Write headings and buttons in sentence case,
          and see the{' '}
          <a href="#brand" className="text-[var(--tint)]">
            brand guidelines
          </a>{' '}
          for the full palette and voice.
        </Prose>
      </div>
    </Section>

    <Section title="Step 2: Add the logo">
      <Prose>
        Upload the official logo through your builder&apos;s logo or site identity setting, rather
        than placing it as an image in a page. Use the full color file on light headers and the
        white file on dark ones.
      </Prose>
      <Rules
        items={[
          <Code key="color">assets/logos/masschallenge-logo-horizontal-color.png</Code>,
          <Code key="white">assets/logos/masschallenge-logo-horizontal-white.png</Code>,
          <>
            <Code>assets/logos/masschallenge-logo-monogram-color.png</Code> for small spaces, such
            as a site icon
          </>,
        ]}
      />
      <Prose>
        The{' '}
        <a href="#logo" className="text-[var(--tint)]">
          logo guidelines
        </a>{' '}
        cover clear space, minimum size and which version to use where.
      </Prose>
    </Section>

    <Section title="Step 3 (optional): Add the Propellant stylesheet" wide>
      <div className="max-w-[var(--width-reading)] flex flex-col gap-4">
        <Prose>
          Your theme settings cover the basics. The stylesheet adds the exact Propellant fonts and a
          few ready made classes for the moments the settings cannot reach, such as a brand headline
          in Oswald or a deep teal section. It only styles the elements you add a class to, so it
          never changes the rest of your site.
        </Prose>
        <Prose>
          Add this line to the head of your pages, using your builder&apos;s setting for code in the
          page head (see your builder below).
        </Prose>
        <CodeBlock label="Stylesheet link">{`<link
  rel="stylesheet"
  href="${RELEASE_URL}/dist/website.css"
/>`}</CodeBlock>
        <Note>
          The <Code>@v1.0.0</Code> part pins your site to one release, so it never changes under
          you. When a new version comes out, update the number and check your pages.
        </Note>
        <Prose>Then add class names to the elements you want styled.</Prose>
      </div>
      <div className="overflow-x-auto">
        <Table
          caption="Website classes"
          size="sm"
          rows={CLASSES}
          rowId={(row) => row.id}
          columns={[
            { key: 'name', header: 'Class', cell: (row) => <Code>{row.name}</Code> },
            { key: 'does', header: 'What it does', cell: (row) => row.does },
          ]}
        />
      </div>
      <div className="max-w-[var(--width-reading)]">
        <CodeBlock label="Classes in HTML">{`<section class="propellant-brand-band">
  <h1 class="propellant-headline">Back the rare humans</h1>
  <a class="propellant-button" href="/apply">Apply now</a>
</section>`}</CodeBlock>
      </div>
    </Section>

    <Section title="Your builder">
      <Subsection title="WordPress">
        <Steps
          items={[
            <>
              <Lead>Theme settings first.</Lead> In a block theme, open Appearance, then Editor,
              then Styles, and set the fonts, colors and button style from step 1. In a classic
              theme, use Appearance, then Customize. Upload the logo in the site identity or Site
              Logo setting.
            </>,
            <>
              <Lead>Optional stylesheet.</Lead> If your theme&apos;s settings do not reach far
              enough, a developer can load the stylesheet from a child theme so it survives theme
              updates. Editors can then add a class to any block under Advanced, then Additional CSS
              class(es).
            </>,
          ]}
        />
        <CodeBlock label="WordPress child theme functions.php">{`add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style(
        'propellant',
        '${RELEASE_URL}/dist/website.css',
        [],
        null
    );
});`}</CodeBlock>
      </Subsection>

      <Subsection title="Squarespace">
        <Steps
          items={[
            <>
              <Lead>Site Styles first.</Lead> Open the site&apos;s design or Site Styles panel and
              set the fonts, colors and button shape from step 1. Upload the logo in the header
              settings. This covers most sites completely.
            </>,
            <>
              <Lead>Optional stylesheet.</Lead> On plans that include Code Injection, you can add
              the link from step 3 to the header. Squarespace&apos;s built in blocks do not take
              class names, so use the classes only inside a Code block for the occasional special
              section.
            </>,
          ]}
        />
      </Subsection>

      <Subsection title="Webflow">
        <Steps
          items={[
            <>
              <Lead>Variables and styles first.</Lead> Add the colors and fonts from step 1 as
              variables, then style the body, headings, links and a button class in the Style panel.
              Everything built afterwards inherits them.
            </>,
            <>
              <Lead>Optional stylesheet.</Lead> With a paid plan, you can add the link from step 3
              under Site settings, then Custom code, then Head code, and type a Propellant class
              name into an element&apos;s selector field. Custom code only runs on the published
              site.
            </>,
          ]}
        />
      </Subsection>

      <Subsection title="Wix">
        <Steps
          items={[
            <>
              <Lead>Theme settings first.</Lead> In the editor&apos;s site design or theme settings,
              set the fonts, colors and button design from step 1, and upload the logo.
            </>,
            <>
              <Lead>Optional stylesheet.</Lead> Wix&apos;s editor does not take class names on its
              elements, so the stylesheet only helps inside an Embed HTML element. Most Wix sites
              should not need it.
            </>,
          ]}
        />
      </Subsection>

      <Subsection title="HubSpot">
        <Steps
          items={[
            <>
              <Lead>Theme settings first.</Lead> Edit your theme&apos;s settings to set the fonts,
              colors and button styles from step 1, and upload the logo in the brand or website
              settings.
            </>,
            <>
              <Lead>Optional stylesheet.</Lead> Add the link from step 3 to the site header HTML
              setting, then use the classes in custom modules or templates.
            </>,
          ]}
        />
      </Subsection>

      <Subsection title="Plain HTML">
        <Prose>
          Add the link from step 3 to the <Code>&lt;head&gt;</Code> of each page and use the
          classes. A complete working page is in <Code>examples/website.html</Code> in the
          repository.
        </Prose>
      </Subsection>

      <Subsection title="Any other builder">
        <Prose>
          Look for the builder&apos;s design, style or theme settings and enter the values from step
          1. If it also has a setting for code in the page head and lets you add class names to
          elements, you can use the stylesheet for special sections. If it does not, the theme
          settings alone are enough.
        </Prose>
      </Subsection>
    </Section>

    <Section title="Keep it maintainable">
      <Rules
        items={[
          <>
            <Lead>Prefer settings to code.</Lead> Anything set in your builder&apos;s design
            settings is visible to the next person and survives updates. Custom CSS is easy to
            forget and easy to break.
          </>,
          <>
            <Lead>Avoid overriding your theme.</Lead> If a theme&apos;s style fights a Propellant
            class, change the theme setting instead of writing a more specific CSS rule against the
            theme&apos;s internals.
          </>,
          <>
            <Lead>Pin the version.</Lead> Keep the <Code>@v1.0.0</Code> in the stylesheet link, and
            update it on purpose.
          </>,
          <>
            <Lead>Check the published site.</Lead> In most builders, code in the page head only runs
            on the published site, not in the editor preview.
          </>,
        ]}
      />
    </Section>
  </PageBody>
);
