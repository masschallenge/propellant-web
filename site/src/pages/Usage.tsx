import { Table } from '../../../src/index';
import { Code, CodeBlock, Note, PageBody, PageHeading, Prose, Rules, Section } from '../parts/Page';

const WAYS = [
  {
    id: 'builder',
    building: 'A site in WordPress, Squarespace, Webflow, Wix, HubSpot or plain HTML',
    use: 'One stylesheet and a few class names, no install. Follow the websites guide.',
  },
  {
    id: 'react',
    building: 'A React application',
    use: 'Components, tokens and the text style utilities',
  },
  {
    id: 'tailwind',
    building: 'A website styled with Tailwind CSS',
    use: 'Tokens and utilities, plus components where the site uses React',
  },
  {
    id: 'css',
    building: 'A website with its own CSS',
    use: 'Tokens only, through CSS custom properties',
  },
];

const APPEARANCES = [
  {
    id: 'system',
    value: 'system',
    effect: 'Follows the light or dark setting of the operating system.',
  },
  {
    id: 'light',
    value: 'light',
    effect: 'Always light. Use it while a product still has pages designed only for light.',
  },
  { id: 'dark', value: 'dark', effect: 'Always dark.' },
];

export const Usage = () => (
  <PageBody>
    <PageHeading
      title="Using Propellant"
      lede="Propellant gives your product the MassChallenge look, ready to build with: our colors, type and spacing, plus the buttons, forms and app frame that screens are made of. Install it once and every page starts on brand, with keyboard support and contrast already handled, so your team spends its time on the product instead of rebuilding the same pieces."
    />

    <Section title="What you get">
      <Prose>
        Propellant comes in two layers. Tokens are our design decisions given names, such as{' '}
        <Code>--tint</Code> for the color of links and actions or <Code>--corner-lg</Code> for a
        rounded corner. Any website can use them. Components are ready made React pieces, such as{' '}
        <Code>Button</Code> and <Code>AppShell</Code>, built from those tokens.
      </Prose>
      <Prose>
        Because every product draws from the same source, MassChallenge looks and works the same
        everywhere, and a change we make here reaches every team that installs the next version. You
        can start small, too: Propellant only styles the parts of a page you hand to it.
      </Prose>
    </Section>

    <Section title="Pick your setup" wide>
      <Prose>
        Find the row that matches what you are building. The rest of this page follows it.
      </Prose>
      <div className="overflow-x-auto">
        <Table
          caption="Ways to use Propellant"
          size="sm"
          rows={WAYS}
          rowId={(row) => row.id}
          columns={[
            { key: 'building', header: 'You are building', cell: (row) => row.building },
            { key: 'use', header: 'Use', cell: (row) => row.use },
          ]}
        />
      </div>
      <Note>
        Building with a website builder or plain HTML? Skip the rest of this page and follow{' '}
        <a href="#websites" className="text-[var(--tint)]">
          Websites and site builders
        </a>{' '}
        instead. Everything below needs Node 22 or later and, for components, React 19.
      </Note>
    </Section>

    <Section title="Install">
      <Prose>
        Install the package from GitHub at a released version. It is published as{' '}
        <Code>@masschallenge/propellant-web</Code>.
      </Prose>
      <CodeBlock label="Install with npm">{`npm install github:masschallenge/propellant-web#v1.0.0`}</CodeBlock>
      <CodeBlock label="Install with Yarn">{`yarn add github:masschallenge/propellant-web#v1.0.0`}</CodeBlock>
    </Section>

    <Section title="Load the styles">
      <Prose>
        Our components are styled with Tailwind CSS 4. In your global stylesheet, import Tailwind,
        the scoped tokens and the utilities. Then point Tailwind at the package source with{' '}
        <Code>@source</Code>, so it generates the classes the components use. Adjust that path so it
        is relative to the stylesheet.
      </Prose>
      <CodeBlock label="Global stylesheet">{`@import 'tailwindcss';
@import '@masschallenge/propellant-web/styles.scoped.css';
@import '@masschallenge/propellant-web/utilities.css';
@source '../node_modules/@masschallenge/propellant-web/src';`}</CodeBlock>
      <Prose>
        The stylesheet brings the Propellant Sans and Oswald fonts with it, so there is nothing else
        to load.
      </Prose>
    </Section>

    <Section title="Compile the package">
      <Prose>
        Propellant ships as TypeScript source, which your build tool turns into JavaScript. Vite
        does this with no setup. In Next.js, add the package to <Code>transpilePackages</Code>.
      </Prose>
      <CodeBlock label="Next.js configuration">{`const nextConfig = {
  transpilePackages: ['@masschallenge/propellant-web'],
};

export default nextConfig;`}</CodeBlock>
    </Section>

    <Section title="Render inside the boundary">
      <Prose>
        Tokens apply only inside an element with the <Code>data-propellant</Code> attribute. Put it
        near the root of the part of the page Propellant should style. Everything outside it keeps
        its existing styles, so a product can move to Propellant one page at a time.
      </Prose>
      <CodeBlock label="Boundary">{`import { Button } from '@masschallenge/propellant-web';

export const Example = () => (
  <div data-propellant>
    <Button>Save changes</Button>
  </div>
);`}</CodeBlock>
    </Section>

    <Section title="Frame an application">
      <Prose>
        Signed in applications use <Code>AppShell</Code>: a <Code>Sidebar</Code> for places, a{' '}
        <Code>Toolbar</Code> for context and one main area for the page. On windows narrower than
        1024px, the sidebar becomes an overlay that opens from a toolbar button.
      </Prose>
      <CodeBlock label="Application shell">{`import { AppShell, Logo, Sidebar, SidebarItem, SidebarSection, Toolbar } from '@masschallenge/propellant-web';

export const Layout = ({ children }) => (
  <div data-propellant>
    <AppShell
      appearance="system"
      sidebar={
        <Sidebar label="Main" header={<Logo />}>
          <SidebarSection title="Program">
            <SidebarItem href="/overview" current>Overview</SidebarItem>
            <SidebarItem href="/startups">Startups</SidebarItem>
          </SidebarSection>
        </Sidebar>
      }
      toolbar={<Toolbar title="Overview" />}
    >
      {children}
    </AppShell>
  </div>
);`}</CodeBlock>
      <Prose>
        <Code>SidebarItem</Code> and <Code>Button</Code> render plain links by default. Pass your
        router&apos;s link component to <Code>linkAs</Code> to keep client side navigation, where
        pages change without a full reload.
      </Prose>
    </Section>

    <Section title="Choose light or dark">
      <Prose>
        <Code>AppShell</Code> takes an <Code>appearance</Code> value.
      </Prose>
      <div className="overflow-x-auto">
        <Table
          caption="Appearance values"
          size="sm"
          rows={APPEARANCES}
          rowId={(row) => row.id}
          columns={[
            { key: 'value', header: 'appearance', cell: (row) => <Code>{row.value}</Code> },
            { key: 'effect', header: 'Effect', cell: (row) => row.effect },
          ]}
        />
      </div>
      <Prose>
        Outside <Code>AppShell</Code>, set <Code>data-theme=&quot;light&quot;</Code> or{' '}
        <Code>data-theme=&quot;dark&quot;</Code> on the boundary or any element inside it.
      </Prose>
    </Section>

    <Section title="Websites">
      <Prose>
        With Tailwind, load the styles as above. Then use tokens in arbitrary values (Tailwind
        classes with a value in square brackets) and the text style utilities. Public pages may set
        their main headline in the brand display face.
      </Prose>
      <CodeBlock label="Website section">{`<section data-propellant class="bg-[var(--bg-grouped)] px-[var(--page-margin)] py-12">
  <h1 class="font-[family-name:var(--type-family-brand)] uppercase text-display">Apply now</h1>
  <p class="text-body text-[var(--label-secondary)]">Find the program that fits your startup.</p>
</section>`}</CodeBlock>
      <Prose>
        Without Tailwind, import the token stylesheet and use the CSS custom properties (the{' '}
        <Code>var(--name)</Code> values) directly. To apply the tokens to a whole site without a
        boundary element, import <Code>@masschallenge/propellant-web/styles.css</Code> instead. It
        defines the same tokens on <Code>:root</Code>.
      </Prose>
      <CodeBlock label="Tokens in plain CSS">{`@import '@masschallenge/propellant-web/styles.scoped.css';

.card {
  background: var(--bg);
  border-radius: var(--corner-lg);
  padding: var(--space-6);
  color: var(--label);
  font-family: var(--type-family);
}`}</CodeBlock>
      <Prose>
        Use tokens by their role, never the raw values behind them. The{' '}
        <a href="#tokens" className="text-[var(--tint)]">
          token reference
        </a>{' '}
        lists every one with its light, dark, touch and reduced motion values.
      </Prose>
    </Section>

    <Section title="What stays with you">
      <Prose>
        Our components handle focus, keyboard support, contrast and announcements for screen
        readers. A few things only your product can do.
      </Prose>
      <Rules
        items={[
          'Give every page one h1 and a sensible heading order.',
          'Write labels and button text that say what happens.',
          'Give icon only buttons an accessible name.',
          'Keep personal data out of analytics; fields mark their values private by default.',
          'Install a tagged version and read the changelog before moving to a new major version.',
        ]}
      />
    </Section>
  </PageBody>
);
