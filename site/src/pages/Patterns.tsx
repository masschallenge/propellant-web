import { useState } from 'react';
import {
  Badge,
  Banner,
  Button,
  DisclosureGroup,
  EmptyState,
  IconButton,
  ListRow,
  ListSection,
  Menu,
  Sheet,
  Skeleton,
  Stepper,
  Switch,
  Table,
  TextField,
  Toast,
} from '../../../src/index';
import { Code, PageBody, PageHeading, Prose, Rules, Section } from '../parts/Page';

const STARTUPS = [
  {
    id: 'northwind',
    name: 'Northwind Robotics',
    track: 'Hardware',
    evaluators: '3 of 3',
    score: 92,
    status: 'Scored',
  },
  {
    id: 'verdant',
    name: 'Verdant Bio',
    track: 'Health',
    evaluators: '2 of 3',
    score: 88,
    status: 'Needs evaluator',
  },
  {
    id: 'lumen',
    name: 'Lumen Health',
    track: 'Health',
    evaluators: '3 of 3',
    score: 74,
    status: 'In review',
  },
  {
    id: 'cobalt',
    name: 'Cobalt Freight',
    track: 'Climate',
    evaluators: '1 of 3',
    score: 81,
    status: 'Needs evaluator',
  },
];

const URGENT_STATUSES = new Set(['Needs evaluator']);

const MoreGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="1.75" />
    <circle cx="12" cy="12" r="1.75" />
    <circle cx="19" cy="12" r="1.75" />
  </svg>
);

const NEEDS_ATTENTION = [
  { id: 'behind', sentence: '12 evaluators are behind on 47 reviews.', action: 'Email 12' },
  { id: 'reads', sentence: '9 applications have fewer than 3 reads.', action: 'Reassign 27 reads' },
  { id: 'ties', sentence: '3 startups tie at rank 40.', action: 'Advance 42' },
];

const NeedsAttention = () => (
  <div className="max-w-[var(--width-form)]">
    <ListSection title="Needs attention">
      {NEEDS_ATTENTION.map((group) => (
        <ListRow
          key={group.id}
          title={group.sentence}
          accessory={
            <Button size="sm" variant="gray">
              {group.action}
            </Button>
          }
        />
      ))}
    </ListSection>
  </div>
);

const NAMED_STARTUPS = [
  'Northwind Robotics',
  'Verdant Bio',
  'Lumen Health',
  'Cobalt Freight',
  'Harbor Analytics',
  'Pillar Energy',
];

const DECLINED_COUNT = 80;

const AFFECTED_STARTUPS = Array.from(
  { length: DECLINED_COUNT },
  (_unused, index) => NAMED_STARTUPS[index] ?? `Startup ${index + 1}`,
);

const BulkConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  return (
    <div className="relative flex items-start h-120 max-w-[var(--width-form)] p-5 rounded-[var(--corner-lg)] bg-[var(--bg-grouped)] overflow-hidden">
      <Button destructive onClick={() => setIsOpen(true)}>
        Decline 80
      </Button>
      <Sheet
        open={isOpen}
        inline
        onClose={close}
        hideIcon
        title="Decline 80 startups?"
        footer={
          <>
            <Button variant="gray" onClick={close}>
              Cancel
            </Button>
            <Button destructive onClick={close}>
              Decline 80 and email 80
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <p className="m-0 text-callout text-[var(--label)]">
            All 80 founders get their result by email now.{' '}
            <a href="#preview-email" className="text-[var(--tint)] underline underline-offset-2">
              Preview email
            </a>
          </p>
          <div
            role="region"
            aria-label={`Declining ${DECLINED_COUNT} startups`}
            tabIndex={0}
            className="max-h-40 overflow-y-auto rounded-[var(--corner-lg)] bg-[var(--bg-secondary)] focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]"
          >
            <ul className="m-0 p-0 list-none">
              {AFFECTED_STARTUPS.map((name) => (
                <li key={name} className="px-3 py-2 text-callout text-[var(--label)]">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Sheet>
    </div>
  );
};

const INITIAL_CRITERIA = ['Team', 'Market', 'Traction', 'Use of funds'];

const ReorderableCriteria = () => {
  const [criteria, setCriteria] = useState(INITIAL_CRITERIA);
  const move = (fromIndex: number, toIndex: number) =>
    setCriteria((current) => {
      const reordered = [...current];
      const [moved] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, moved);
      return reordered;
    });
  return (
    <div className="max-w-[var(--width-form)]">
      <ListSection title="Criteria">
        {criteria.map((criterion, index) => (
          <ListRow
            key={criterion}
            title={criterion}
            accessory={
              <Menu
                align="end"
                trigger={
                  <IconButton variant="plain" size="sm" aria-label={`${criterion} actions`}>
                    <MoreGlyph />
                  </IconButton>
                }
                items={[
                  {
                    label: 'Move up',
                    disabled: index === 0,
                    onSelect: () => move(index, index - 1),
                  },
                  {
                    label: 'Move down',
                    disabled: index === criteria.length - 1,
                    onSelect: () => move(index, index + 1),
                  },
                  { separator: true },
                  {
                    label: 'Remove',
                    destructive: true,
                    onSelect: () =>
                      setCriteria((current) => current.filter((name) => name !== criterion)),
                  },
                ]}
              />
            }
          />
        ))}
      </ListSection>
    </div>
  );
};

const StageSettings = () => {
  const [evaluatorsPerStartup, setEvaluatorsPerStartup] = useState(3);
  return (
    <div className="flex flex-col gap-6 max-w-[var(--width-form)]">
      <ListSection title="Online selection">
        <ListRow title="Scoring rubric" value="Standard 2026" href="#forms" />
        <ListRow
          title="Evaluators per startup"
          accessory={
            <Stepper
              aria-label="Evaluators per startup"
              value={evaluatorsPerStartup}
              onChange={setEvaluatorsPerStartup}
              min={1}
              max={6}
              size="sm"
            />
          }
        />
        <ListRow title="Show other evaluators' scores" accessory={<Switch />} />
        <ListRow title="Email evaluators when assigned" accessory={<Switch defaultChecked />} />
      </ListSection>
      <ListSection>
        <ListRow title="Delete stage" destructive onClick={() => undefined} />
      </ListSection>
    </div>
  );
};

export const Patterns = () => (
  <PageBody>
    <PageHeading
      title="Patterns"
      lede="Patterns are proven ways to put components together for screens we build again and again. Start here for settings, things that need attention, bulk confirms, ordered and long lists, review queues, status messages and the moments when there is nothing to show yet."
    />

    <Section title="Settings as grouped lists" wide>
      <Prose>
        Most settings are a short list of named values: a stage's rubric, how many evaluators, who
        gets emailed. A grouped list reads faster than a column of boxed fields. It puts each value
        next to its name, and a switch or stepper takes effect right away.
      </Prose>
      <StageSettings />
      <Rules
        items={[
          'Group related settings under a short section title. Add a section footer only when it carries information people need.',
          'Rows that open another screen show a chevron (a small arrow). Rows that change a value in place show the control and no chevron.',
          'Settings pages and profiles save each change as it is made and confirm it with a short Saved toast. They have no Save button.',
          'Dialogs and create flows keep explicit buttons, such as Save and Cancel or Create and Cancel. A page either saves as you go or has a Save button, never both.',
          'Never show a setting that cannot be changed, such as an Always on row. Something that should always be on is not a setting.',
          'Prefer automatic behavior to a Run button when a setting already decides what should happen.',
          'Destructive actions, the ones that delete or cannot be undone, get their own section at the bottom, centered and in the critical color.',
        ]}
      />
      <div className="max-w-90">
        <Toast title="Saved" announce={false} />
      </div>
    </Section>

    <Section title="Needs attention" wide>
      <Prose>
        Everything that needs someone to act goes in one list called Needs attention, near the top
        of the page. Each item is a sentence with a count and one action that resolves it.
      </Prose>
      <NeedsAttention />
      <Rules
        items={[
          'Group items by kind, never one row per person: "12 evaluators are behind on 47 reviews." with one action, "Email 12".',
          'Name each action for what it does and the count it affects. No Do all, Fix all or Send all buttons.',
          'No status badges in the list. The sentence says what is wrong.',
          'Opening a group shows the people or items in it.',
          'Needs attention is the only name for this list. Use a Banner only for a single notice about the whole page, such as a spending limit reached.',
        ]}
      />
    </Section>

    <Section title="Confirming bulk actions" wide>
      <Prose>
        An action that changes outcomes, sends messages to people or deletes asks first, in a Sheet
        that shows exactly who is affected.
      </Prose>
      <BulkConfirm />
      <Rules
        items={[
          'The title is a question that names the action and the count.',
          'A scrollable list shows everyone affected, and one line states the consequence.',
          'When email goes out, a Preview email link sits beside that line. Bulk email always opens this confirm, never a bare mailto link.',
          'The confirm button names the action and the count, such as Decline 80. Destructive confirms use the destructive button.',
          'A low impact bulk action that sends nothing skips the confirm and offers Undo in a toast instead.',
        ]}
      />
    </Section>

    <Section title="Reorderable lists" wide>
      <Prose>
        Lists whose order matters, such as questions or criteria, show the order itself and no
        numbers. People reorder them by dragging the handle on a row, and every row also offers Move
        up and Move down in its menu, so a single click does the same.
      </Prose>
      <ReorderableCriteria />
      <Rules
        items={[
          'No numbers on ordered lists. The order shows the sequence.',
          'Every draggable row has Move up and Move down in its ⋯ menu, disabled at the ends.',
          'Rows open their detail when clicked, so the menu never offers Open or View.',
        ]}
      />
    </Section>

    <Section title="Long lists" wide>
      <Rules
        items={[
          <>
            Long working lists in the console load as people scroll. Put <Code>LoadOnScroll</Code>{' '}
            after the list; it shows placeholder rows while the next page comes. Never add a Load
            more button.
          </>,
          <>
            Only public pages use <Code>Pagination</Code>.
          </>,
        ]}
      />
    </Section>

    <Section title="Forms that collect text" wide>
      <Prose>
        When people type, use fields with a visible label above. Add a hint below only for a real
        constraint, such as a file type or a character limit, never to repeat the label. Keep a form
        to one column under 640px wide, and tuck secondary options behind a disclosure, a section
        that opens when clicked.
      </Prose>
      <form
        className="flex flex-col gap-4 max-w-[var(--width-form)] p-5 rounded-[var(--corner-lg)] bg-[var(--bg)]"
        onSubmit={(event) => event.preventDefault()}
      >
        <TextField label="Startup name" defaultValue="Northwind Robotics" />
        <TextField label="Website" type="url" placeholder="https://" />
        <DisclosureGroup title="Advanced">
          <TextField label="Internal note" hint="Up to 280 characters." maxLength={280} />
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
        Tables carry most of the work. They sit on the content background with no outer border and
        use dense rows. Numbers are right aligned in tabular figures so they line up, and every
        status gets a word, not just a color.
      </Prose>
      <Rules
        items={[
          'Statuses are neutral gray badges. Only warning and critical add color, as a small dot beside the word.',
          'Use badges sparingly and prefer plain text. Aim for one kind of badge on a screen.',
          'Badges are capsules. Roles use RoleTag, never a badge. Role tags read their own tokens, which still share the status hues until design picks role colors.',
          'Every row opens its detail when clicked, with a chevron at the right.',
        ]}
      />
      <div className="overflow-x-auto">
        <Table
          caption="Applications in Online selection"
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
            { key: 'evaluators', header: 'Evaluators', cell: (startup) => startup.evaluators },
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
                <Badge dot={URGENT_STATUSES.has(startup.status) ? 'warning' : undefined}>
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
          'Screen readers announce critical banners right away; the others wait until the reader is free.',
          'Toasts, brief pop up messages, confirm an action the person just took and leave on their own. Anything a person must act on goes in Needs attention, or in a banner when it is one notice about the whole page.',
        ]}
      />
    </Section>

    <Section title="Nothing to show yet" wide>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        <div className="p-6 rounded-[var(--corner-lg)] bg-[var(--bg)]">
          <EmptyState
            title="No evaluators assigned"
            description="Evaluators you assign appear here."
            actions={<Button size="sm">Assign evaluators</Button>}
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
          'Use EmptyState: a short title, one plain line, its symbol, and at most one action. No illustration in the console.',
          'Say what will appear and give the one action that makes it appear. Never explain how the feature works.',
          'Give every primary list an empty state wherever it can really be empty: before applications open, inbox zero, no search results.',
          'Loading placeholders take the shape of the content, so the page does not jump when it arrives.',
        ]}
      />
    </Section>
  </PageBody>
);
