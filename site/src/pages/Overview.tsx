import { Button, ListRow, ListSection } from '../../../src/index';
import { components, tokens, version } from 'virtual:propellant-site-data';
import { PageBody, Prose, Section } from '../parts/Page';

const RULES = [
  {
    title: 'Content first',
    detail:
      'Chrome is one sidebar and one toolbar. A page title starts near the top of the window.',
  },
  {
    title: 'Teal means you can act',
    detail:
      'The tint marks buttons, links, selected controls and focus. Titles, names and numbers stay neutral.',
  },
  {
    title: 'Hierarchy from type, not boxes',
    detail:
      'Grouped surfaces replace most cards. Borders and shadows are kept for things that float above the page.',
  },
  {
    title: 'Desktop density, touch when needed',
    detail: 'Controls are 32px by default and grow to 44px when the pointer is coarse.',
  },
  {
    title: 'Accessible by default',
    detail:
      'Every component keeps WCAG 2.1 AA contrast, keyboard support and accessible names, in both themes.',
  },
];

export const Overview = () => {
  const moduleCount = new Set(components.map((component) => component.module)).size;
  return (
    <PageBody>
      <header className="flex flex-col gap-5 max-w-[var(--width-reading)] pt-4">
        <p className="m-0 text-subheadline font-semibold text-[var(--label-secondary)]">
          MassChallenge design system, version {version}
        </p>
        <h1 className="m-0 font-[family-name:var(--type-family-brand)] font-medium uppercase text-[clamp(2.75rem,8vw,4.5rem)] leading-[0.95] tracking-[0.01em] text-[var(--label)]">
          Propellant
        </h1>
        <p className="m-0 text-title3 font-normal text-[var(--label-secondary)] [text-wrap:balance]">
          The design system for MassChallenge web applications and websites: brand, tokens,
          components and the guidance that ties them together.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button href="#usage">Start building</Button>
          <Button href="#brand" variant="gray">
            Brand guidelines
          </Button>
        </div>
      </header>

      <Section title="What is in the box">
        <ListSection>
          <ListRow title="Components" value={String(moduleCount)} href="#components" />
          <ListRow title="Design tokens" value={String(tokens.length)} href="#tokens" />
          <ListRow title="Logo treatments" value="3" href="#logo" />
          <ListRow title="Package" value="@masschallenge/propellant-web" href="#usage" />
        </ListSection>
        <Prose>
          The component and token counts are taken from the package source when this site is built,
          and every example runs the same React components the package ships.
        </Prose>
      </Section>

      <Section title="Principles">
        <Prose>
          Each principle can be checked in a design review. When a screen breaks one, the screen
          changes or the principle gets a written exception.
        </Prose>
        <ListSection>
          {RULES.map((rule) => (
            <ListRow key={rule.title} title={rule.title} subtitle={rule.detail} />
          ))}
        </ListSection>
      </Section>

      <Section title="Origins">
        <Prose>
          Propellant was inspired by Apple's Human Interface Guidelines and Google's Material
          Design.
        </Prose>
      </Section>

      <Section title="Where to go next">
        <ListSection>
          <ListRow
            title="Usage"
            subtitle="Add Propellant to an application or website"
            href="#usage"
          />
          <ListRow title="Brand" subtitle="Name, color, type and voice" href="#brand" />
          <ListRow
            title="Logo"
            subtitle="Lockups, treatments, clear space and sizes"
            href="#logo"
          />
          <ListRow title="Color" subtitle="Roles and measured contrast" href="#color" />
          <ListRow title="Components" subtitle="Live examples and props" href="#components" />
        </ListSection>
      </Section>
    </PageBody>
  );
};
