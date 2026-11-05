import { Table } from '../../../src/index';
import { Code, CodeBlock, Note, PageBody, PageHeading, Prose, Rules, Section } from '../parts/Page';

const WAYS = [
  {
    id: 'react',
    building: 'A React application',
    use: 'Components, tokens and text style utilities',
  },
  { id: 'tailwind', building: 'A website styled with Tailwind CSS', use: 'Tokens and utilities' },
  {
    id: 'css',
    building: 'A website with its own CSS',
    use: 'Tokens through CSS custom properties',
  },
];

const APPEARANCES = [
  {
    id: 'system',
    value: 'system',
    effect: 'Follows the light or dark setting of the operating system.',
  },
  { id: 'light', value: 'light', effect: 'Always light.' },
  { id: 'dark', value: 'dark', effect: 'Always dark.' },
];

export const Usage = () => (
  <PageBody>
    <PageHeading
      title="Usage"
      lede="Propellant works in React applications, in websites styled with Tailwind CSS, and in any website through its tokens alone."
    />

    <Section title="Pick your setup" wide>
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
      <Note>Propellant needs Node 22 or later and, for components, React 19.</Note>
    </Section>

    <Section title="Install">
      <CodeBlock label="Install with npm">{`npm install github:masschallenge/propellant-web#v1.0.0`}</CodeBlock>
      <CodeBlock label="Install with Yarn">{`yarn add github:masschallenge/propellant-web#v1.0.0`}</CodeBlock>
    </Section>

    <Section title="Load the styles">
      <Prose>
        Components are styled with Tailwind CSS 4. Import Tailwind, the scoped tokens and the
        utilities, and point Tailwind at the package source so it generates the classes the
        components use. The stylesheet includes the fonts.
      </Prose>
      <CodeBlock label="Global stylesheet">{`@import 'tailwindcss';
@import '@masschallenge/propellant-web/styles.scoped.css';
@import '@masschallenge/propellant-web/utilities.css';
@source '../node_modules/@masschallenge/propellant-web/src';`}</CodeBlock>
      <Prose>
        The package ships TypeScript source. Vite compiles it with no setup; in Next.js add it to{' '}
        <Code>transpilePackages</Code>.
      </Prose>
      <CodeBlock label="Next.js configuration">{`const nextConfig = {
  transpilePackages: ['@masschallenge/propellant-web'],
};

export default nextConfig;`}</CodeBlock>
    </Section>

    <Section title="Render inside the boundary">
      <Prose>
        Tokens apply inside an element with the <Code>data-propellant</Code> attribute. Everything
        outside it keeps its existing styles, so a product can adopt Propellant one page at a time.
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
        Signed in applications use <Code>AppShell</Code> with a <Code>Sidebar</Code> for places and
        a <Code>Toolbar</Code> for context. Pass your router's link component to <Code>linkAs</Code>{' '}
        to keep client side navigation.
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
    </Section>

    <Section title="Websites">
      <Prose>
        With Tailwind, load the styles as above and use tokens in arbitrary values and the text
        style utilities. Public pages may set their main headline in the brand display face.
      </Prose>
      <CodeBlock label="Website section">{`<section data-propellant class="bg-[var(--bg-grouped)] px-[var(--page-margin)] py-12">
  <h1 class="font-[family-name:var(--type-family-brand)] uppercase text-display">Apply now</h1>
  <p class="text-body text-[var(--label-secondary)]">Find the program that fits your startup.</p>
</section>`}</CodeBlock>
      <Prose>
        Without Tailwind, import the token stylesheet and use the custom properties directly. To
        apply the tokens to a whole site without a boundary element, import{' '}
        <Code>@masschallenge/propellant-web/styles.css</Code> instead.
      </Prose>
      <CodeBlock label="Tokens in plain CSS">{`@import '@masschallenge/propellant-web/styles.scoped.css';

.card {
  background: var(--bg);
  border-radius: var(--corner-lg);
  padding: var(--space-6);
  color: var(--label);
  font-family: var(--type-family);
}`}</CodeBlock>
    </Section>

    <Section title="What stays with you">
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
