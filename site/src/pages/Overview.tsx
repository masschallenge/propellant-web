import { Button, ListRow, ListSection } from '../../../src/index';
import { components, tokens, version } from 'virtual:propellant-site-data';
import { Note, PageBody, Prose, Section } from '../parts/Page';
import { PropellantBrand } from '../parts/PropellantBrand';

const RULES = [
  {
    title: 'Put the work first',
    detail:
      'Every product screen has one sidebar and one toolbar, and nothing else in the way. The page you came for starts near the top.',
  },
  {
    title: 'Teal means you can do something',
    detail:
      'Buttons, links and anything you can select are teal. Headings, names and numbers stay neutral, so the color always means the same thing.',
  },
  {
    title: 'Let words do the organizing',
    detail:
      'Clear headings and spacing group things together, instead of boxes inside boxes. Shadows are saved for things that pop up over the page.',
  },
  {
    title: 'Comfortable on any screen',
    detail:
      'Controls stay compact when you use a mouse and grow to a finger-friendly 44px on touch screens.',
  },
  {
    title: 'Built for everyone',
    detail:
      'Every piece is designed to meet the WCAG 2.1 AA accessibility standard and checked by automated tests: readable contrast, full keyboard use and labels that screen readers can announce, in light and dark mode.',
  },
];

export const Overview = () => {
  const moduleCount = new Set(components.map((component) => component.module)).size;
  return (
    <PageBody>
      <header className="flex flex-col gap-5 max-w-[var(--width-reading)] pt-4">
        <PropellantBrand kind="mark" className="size-20" />
        <p className="m-0 text-subheadline font-semibold text-[var(--label-secondary)]">
          The MassChallenge design system, version {version}
        </p>
        <h1 className="m-0 font-[family-name:var(--type-family-brand)] font-medium uppercase text-[clamp(2.75rem,8vw,4.5rem)] leading-[0.95] tracking-[0.01em] text-[var(--label)]">
          Propellant
        </h1>
        <p className="m-0 text-title3 font-normal text-[var(--label-secondary)] [text-wrap:balance]">
          Propellant is how MassChallenge looks, sounds and works on the web. It gives our teams one
          set of building blocks, so every website and product we make feels like it came from the
          same place, and works for everyone who uses it.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button href="#usage">Start building</Button>
          <Button href="#brand" variant="gray">
            Brand guidelines
          </Button>
        </div>
      </header>

      <Section title="What is a design system?">
        <Prose>
          A design system is a shared kit for making websites and apps: our colors and fonts, ready
          made pieces like buttons and forms, and the guidance for putting them together. Instead of
          every team starting from scratch, everyone builds from the same parts.
        </Prose>
        <Prose>
          That saves time, and it means founders, experts and collaborators get the same clear,
          accessible experience wherever they meet MassChallenge online.
        </Prose>
      </Section>

      <Section title="What is inside">
        <ListSection>
          <ListRow title="Components" value={String(moduleCount)} href="#components" />
          <ListRow title="Design tokens" value={String(tokens.length)} href="#tokens" />
          <ListRow title="Logo treatments" value="3" href="#logo" />
          <ListRow title="Package" value="@masschallenge/propellant-web" href="#usage" />
        </ListSection>
        <Prose>
          Components are the ready made pieces, like buttons, menus and tables. Design tokens are
          the named colors, sizes and spacing they are built from. Both numbers come straight from
          the code, and every example on this site uses the exact parts teams install.
        </Prose>
      </Section>

      <Section title="What we believe">
        <Prose>
          Five ideas shape every screen we build. When a design breaks one, we change the design or
          write down why.
        </Prose>
        <ListSection>
          {RULES.map((rule) => (
            <ListRow key={rule.title} title={rule.title} subtitle={rule.detail} />
          ))}
        </ListSection>
      </Section>

      <Section title="Where it comes from">
        <Prose>
          The MassChallenge team built Propellant for the people we serve. Its foundations were
          inspired by Apple&apos;s Human Interface Guidelines and Google&apos;s Material Design.
        </Prose>
        <Note>
          Apple and Human Interface Guidelines are trademarks of Apple Inc. Google and Material
          Design are trademarks of Google LLC. Propellant is not affiliated with, sponsored by or
          endorsed by Apple or Google.
        </Note>
      </Section>

      <Section title="Where to go next">
        <ListSection>
          <ListRow
            title="Using Propellant"
            subtitle="Add Propellant to your website or app"
            href="#usage"
          />
          <ListRow title="Brand" subtitle="Our name, colors, type and voice" href="#brand" />
          <ListRow title="Logo" subtitle="How to use the MassChallenge logo well" href="#logo" />
          <ListRow title="Color" subtitle="Our colors and when to use each one" href="#color" />
          <ListRow
            title="Components"
            subtitle="See every building block in action"
            href="#components"
          />
        </ListSection>
      </Section>
    </PageBody>
  );
};
