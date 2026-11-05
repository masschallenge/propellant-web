import { useState } from 'react';
import {
  Badge,
  Banner,
  Button,
  DisclosureGroup,
  EmptyState,
  ListRow,
  ListSection,
  Skeleton,
  Stepper,
  Switch,
  Table,
  TextField,
} from '../../../src/index';
import { PageBody, PageHeading, Prose, Rules, Section } from '../parts/Page';

const STARTUPS = [
  {
    id: 'northwind',
    name: 'Northwind Robotics',
    track: 'Hardware',
    judges: '3 of 3',
    score: 92,
    status: 'Scored',
  },
  {
    id: 'verdant',
    name: 'Verdant Bio',
    track: 'Health',
    judges: '2 of 3',
    score: 88,
    status: 'Needs judge',
  },
  {
    id: 'lumen',
    name: 'Lumen Health',
    track: 'Health',
    judges: '3 of 3',
    score: 74,
    status: 'In review',
  },
  {
    id: 'cobalt',
    name: 'Cobalt Freight',
    track: 'Climate',
    judges: '1 of 3',
    score: 81,
    status: 'Needs judge',
  },
];

const STATUS_TONE = {
  Scored: 'success',
  'Needs judge': 'warning',
  'In review': 'info',
} as const;

const RoundSettings = () => {
  const [judgesPerStartup, setJudgesPerStartup] = useState(3);
  return (
    <div className="flex flex-col gap-6 max-w-[var(--width-form)]">
      <ListSection
        title="Online selection"
        footer="Judges see a startup only after its application is complete."
      >
        <ListRow title="Scoring rubric" value="Standard 2026" href="#forms" />
        <ListRow
          title="Judges per startup"
          accessory={
            <Stepper
              aria-label="Judges per startup"
              value={judgesPerStartup}
              onChange={setJudgesPerStartup}
              min={1}
              max={6}
              size="sm"
            />
          }
        />
        <ListRow title="Show other judges' scores" accessory={<Switch />} />
        <ListRow title="Email judges when assigned" accessory={<Switch defaultChecked />} />
      </ListSection>
      <ListSection>
        <ListRow title="Delete round" destructive onClick={() => undefined} />
      </ListSection>
    </div>
  );
};

export const Patterns = () => (
  <PageBody>
    <PageHeading
      title="Patterns"
      lede="How the components combine on common screens: settings, review queues, status and the moments when there is nothing to show yet."
    />

    <Section title="Settings as grouped lists" wide>
      <Prose>
        Most configuration is a short list of named values: a round's rubric, how many judges, who
        gets emailed. A grouped list reads faster than a column of bordered fields, puts the value
        next to its name, and lets a switch or stepper act immediately.
      </Prose>
      <RoundSettings />
      <Rules
        items={[
          'Group related settings under a short section title. Put the explanation in the section footer, not under every row.',
          'Rows that open another screen show a chevron. Rows that change a value in place show the control and no chevron.',
          'Destructive actions get their own section at the bottom, centered and in the critical color.',
        ]}
      />
    </Section>

    <Section title="Forms that collect text" wide>
      <Prose>
        When people type, use fields with a visible label above and a hint below. Keep a form to one
        column under 640px wide, and put secondary options behind a disclosure.
      </Prose>
      <form
        className="flex flex-col gap-4 max-w-[var(--width-form)] p-5 rounded-[var(--corner-lg)] bg-[var(--bg)]"
        onSubmit={(event) => event.preventDefault()}
      >
        <TextField
          label="Startup name"
          hint="As it should appear to judges."
          defaultValue="Northwind Robotics"
        />
        <TextField label="Website" type="url" placeholder="https://" />
        <DisclosureGroup title="Advanced">
          <TextField label="Internal note" hint="Only your team sees this." />
        </DisclosureGroup>
        <div className="flex flex-wrap gap-2 justify-end">
          <Button variant="gray" type="button">
            Cancel
          </Button>
          <Button type="submit">Save startup</Button>
        </div>
      </form>
    </Section>

    <Section title="Review queues" wide>
      <Prose>
        Tables carry most of the work. They sit on the content surface with no outer border, use
        dense rows, right align numbers in tabular figures, and pair every status with a word.
      </Prose>
      <div className="overflow-x-auto">
        <Table
          caption="Applications in online selection"
          size="sm"
          rows={STARTUPS}
          rowId={(startup) => startup.id}
          columns={[
            {
              key: 'name',
              header: 'Startup',
              cell: (startup) => <span className="font-medium">{startup.name}</span>,
            },
            { key: 'track', header: 'Track', cell: (startup) => startup.track },
            { key: 'judges', header: 'Judges', cell: (startup) => startup.judges },
            {
              key: 'score',
              header: 'Score',
              align: 'right',
              cell: (startup) => <span className="tabular-nums">{startup.score}</span>,
            },
            {
              key: 'status',
              header: 'Status',
              cell: (startup) => (
                <Badge tone={STATUS_TONE[startup.status as keyof typeof STATUS_TONE]}>
                  {startup.status}
                </Badge>
              ),
            },
          ]}
        />
      </div>
    </Section>

    <Section title="Status and feedback" wide>
      <div className="flex flex-col gap-3 max-w-[var(--width-form)]">
        <Banner tone="warning" title="Pitching One is overdue.">
          Its window closed on Nov 18. It stays active until you activate another stage.
        </Banner>
        <Banner tone="success" title="Scores published.">
          Founders can see their feedback now.
        </Banner>
      </div>
      <Rules
        items={[
          'Banners sit at the top of the content they describe, not floating over it.',
          'Critical banners are announced right away; the others are announced politely.',
          'Toasts confirm an action the person just took and leave on their own. Anything a person must act on is a banner.',
        ]}
      />
    </Section>

    <Section title="Nothing to show yet" wide>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        <div className="p-6 rounded-[var(--corner-lg)] bg-[var(--bg)]">
          <EmptyState
            title="No judges assigned"
            description="Assign judges to start online selection for this round."
            actions={<Button size="sm">Assign judges</Button>}
          />
        </div>
        <div
          className="flex flex-col gap-3 p-6 rounded-[var(--corner-lg)] bg-[var(--bg)]"
          aria-label="Loading applications"
          role="status"
        >
          <Skeleton width="60%" height="20px" />
          <Skeleton width="90%" />
          <Skeleton width="75%" />
          <Skeleton width="40%" />
        </div>
      </div>
      <Rules
        items={[
          'An empty state says what will appear and gives the one action that makes it appear.',
          'Loading placeholders take the shape of the content, so the page does not jump when it arrives.',
        ]}
      />
    </Section>
  </PageBody>
);
