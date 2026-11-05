import { Button, SearchField, SegmentedControl } from '../../../src/index';
import { tokens } from 'virtual:propellant-site-data';
import { Code, PageBody, PageHeading, Prose, Rules, Section } from '../parts/Page';
import { TokenTable } from '../parts/TokenTable';

const SIZE_TOKENS = [
  '--control-sm',
  '--control-md',
  '--control-lg',
  '--hit-target',
  '--row-dense',
  '--row',
  '--row-tall',
  '--toolbar-height',
  '--sidebar-width',
  '--inspector-width',
];

const WIDTH_TOKENS = ['--page-margin', '--width-form', '--width-reading', '--width-page'];

const pick = (names: string[]) =>
  names
    .map((name) => tokens.find((token) => token.name === name))
    .filter((token): token is (typeof tokens)[number] => Boolean(token));

export const Layout = () => (
  <PageBody>
    <PageHeading
      title="Layout and density"
      lede="Most work in MassChallenge products happens at a desk, so we size controls and spacing to fit a lot on screen without feeling cramped. On a touch screen, the same controls grow so a finger can hit them easily."
    />

    <Section title="Three control sizes">
      <Prose>
        Regular, 32px, is the default. Small is for dense tables and toolbars. Large is for the
        single main action on a page with little else on it. On a coarse pointer (a finger rather
        than a mouse) every size grows, so the same markup works on a tablet.
      </Prose>
      <div className="flex flex-wrap items-center gap-3 p-5 rounded-[var(--corner-lg)] bg-[var(--bg)]">
        <Button size="sm">Small</Button>
        <Button>Regular</Button>
        <Button size="lg">Large</Button>
        <SearchField aria-label="Search startups" size="sm" className="w-44" />
        <SegmentedControl
          aria-label="Calendar range"
          size="sm"
          defaultValue="week"
          items={[
            { id: 'day', label: 'Day' },
            { id: 'week', label: 'Week' },
            { id: 'month', label: 'Month' },
          ]}
        />
      </div>
      <Rules
        items={[
          'Small controls keep a 28px invisible hit area, or 44px on touch, through a pseudo element. The newer WCAG 2.2 AA asks for at least 24px, so we clear it with room to spare.',
          'Rows are 36px in dense tables, 44px in lists and 56px for two line rows.',
          'Spacing comes in multiples of 4px. The common steps are 4, 8, 12, 16, 20, 24, 32 and 48.',
        ]}
      />
      <TokenTable tokens={pick(SIZE_TOKENS)} caption="Control, row and frame sizes" />
    </Section>

    <Section title="How wide things get">
      <Prose>
        Forms stop at 640px and running text at about 68 characters, so lines stay easy to read.
        Tables use the full width of the content column. Page margins grow with the window: 16px on
        a phone, 24px from 768px, 32px from 1280px.
      </Prose>
      <TokenTable tokens={pick(WIDTH_TOKENS)} caption="Page margins and content widths" />
    </Section>

    <Section title="Why we do not use 44px everywhere">
      <Prose>
        44px is a size made for fingers. On a desktop it makes tables, toolbars and forms feel
        bloated. Propellant meets WCAG 2.2 AA target sizes everywhere through an invisible hit area,
        and switches to touch sizes through <Code>@media (pointer: coarse)</Code>.
      </Prose>
    </Section>
  </PageBody>
);
