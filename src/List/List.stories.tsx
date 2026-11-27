import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ListRow, ListSection } from './List';
import { Switch } from '../Switch/Switch';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { SearchField } from '../SearchField/SearchField';
import { icons } from '../../.storybook/icons';
import { MC_MONOGRAM } from '../assets/logos';
import { content, hide } from '../../.storybook/controls';

const meta = {
  title: 'Components/Data display/List',
  component: ListSection,
  subcomponents: { ListRow },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'An inset grouped list: rows on a content surface with 12px corners, separated by hairlines that start at the text. Use it for settings, summaries and short lists of destinations. Rows can show a value, an icon, an accessory such as a switch (labelled by the row title), a selection check, or a chevron when they lead somewhere. Destructive actions sit in their own section.',
          '',
          "In place of the icon, `media` shows an image: a program logo as a 64 by 38 thumbnail with 5px corners and a separator ring, or a company logo as a 36px squircle with `shape: 'squircle'`. Images show whole on a quiet background unless `autoCrop` is set for an image we own. Leave `alt` empty when the title already names the program or company.",
          '',
          "`media={{ tile: { icon, tone } }}` leads with an `IconTile` instead, for to do items, with the separator starting at the text. `titleEmphasis: 'strong'` sets the title in semibold callout type.",
          '',
          "`density: 'roomy'` gives every row in the section 14px vertical and 20px horizontal padding with 14px between the lead, the text and the trailing content, for spacious home lists, and moves the separator inset to match. `'dense'` shortens rows for long pickers.",
          '',
          "`media={{ avatar: { initials, src, alt, tone, size } }}` leads with a round `Avatar`, 36px at `size: 'md'` (the default) or 26px at `size: 'compact'` for dense recipient rows, in the `gray`, `amber` or `green` tone to tell groups of people apart. The separator starts at the text.",
          '',
          "`valueStyle: 'subheadline'` sets the value in secondary subheadline type, for progress such as \"3 of 6 done\", and `valueStyle: 'callout'` in callout type in the label color, for counts such as the People card. The default value stays in tertiary body type.",
          '',
          "`subtitlePosition: 'inline'` sets the subtitle after the title on one line in tertiary type, both truncating, for a name and a company.",
          '',
          '`headingProps` passes attributes and a `ref` to the title heading, so an app can move focus to it with `tabIndex: -1`, for example after switching tabs or loading a page, and screen readers announce it as a heading.',
          '',
          '`framed` moves the title and `trailing` content into a header band inside a box ringed with the separator color, for a list inside a dialog such as a recipient list with a search field.',
          '',
          'A row that holds its own buttons must not be a link or button itself, so leave out `href` and `onClick`, pass the buttons as the `accessory` (a fragment is fine) and give `openHref` for a separate chevron link after them. It is named "Open" and the row title by default, or by `openLabel` when given, and rendered with `linkAs`.',
          '',
          "Import: `import { ListSection, ListRow } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    title: 'Round 1',
    footer: 'Judges see startups once the round opens.',
    density: 'regular',
  },
  argTypes: {
    title: { control: 'text', ...content },
    footer: { control: 'text', ...content },
    density: { control: 'inline-radio', options: ['regular', 'dense', 'roomy'] },
    framed: { control: 'boolean' },
    trailing: hide,
    titleAs: hide,
    headingProps: hide,
    children: hide,
    className: hide,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[var(--width-form)] p-6 bg-[var(--bg-grouped)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListSection>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = {
  render: (args) => (
    <ListSection {...args}>
      <ListRow title="Startups in review" value="128" />
      <ListRow title="Judges assigned" value="42" />
      <ListRow title="Status" accessory={<Badge tone="success">Open</Badge>} />
    </ListSection>
  ),
};

export const Settings: Story = {
  args: { title: 'Notifications', footer: 'Sent at 9:00 AM in the program timezone.' },
  render: (args) => (
    <ListSection {...args}>
      <ListRow title="Email judges when assigned" accessory={<Switch defaultChecked />} />
      <ListRow title="Remind judges before the deadline" accessory={<Switch />} />
      <ListRow title="Reminder lead time" value="2 days" href="#lead-time" />
    </ListSection>
  ),
};

export const Navigation: Story = {
  args: { title: 'Manage', footer: undefined },
  render: (args) => (
    <div className="flex flex-col gap-8">
      <ListSection {...args}>
        <ListRow title="Judges" subtitle="42 assigned" icon={icons.person} href="#judges" />
        <ListRow title="Schedule" icon={icons.calendar} href="#schedule" />
        <ListRow title="Rubric" icon={icons.star} href="#rubric" />
      </ListSection>
      <ListSection>
        <ListRow title="Close the round" destructive onClick={() => undefined} />
      </ListSection>
    </div>
  ),
};

const PROGRAM_LOGO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 38"><rect width="64" height="38" fill="#065e6f"/><circle cx="32" cy="19" r="10" fill="#d9f6fa"/></svg>',
  );

export const Media: Story = {
  args: { title: 'Reviews', footer: undefined },
  render: (args) => (
    <div className="flex flex-col gap-8">
      <ListSection {...args}>
        <ListRow
          title="HealthTech Traction 2027"
          subtitle="Online selection. Due Mon, Nov 30"
          value="3 of 6 done"
          media={{ src: PROGRAM_LOGO, autoCrop: true }}
          href="#healthtech"
        />
        <ListRow
          title="MassChallenge Boston 2027"
          subtitle="Logo shown whole"
          media={{ src: MC_MONOGRAM }}
          href="#boston"
        />
      </ListSection>
      <ListSection title="Your startups">
        <ListRow
          title="CareLoop"
          subtitle="Pilot pricing review"
          media={{ src: MC_MONOGRAM, shape: 'squircle' }}
          href="#careloop"
        />
        <ListRow
          title="Willow Fertility"
          subtitle="Partnerships"
          media={{ src: PROGRAM_LOGO, shape: 'squircle', autoCrop: true }}
          href="#willow"
        />
      </ListSection>
    </div>
  ),
};

export const Tiles: Story = {
  args: { title: 'To do', footer: undefined },
  render: (args) => (
    <ListSection {...args}>
      <ListRow
        title="Accept your Pitching selection panel"
        titleEmphasis="strong"
        subtitle="HealthTech Traction 2027, Panel A. Tue, Dec 8 @ 9:00 AM ET"
        media={{ tile: { icon: icons.calendar, tone: 'teal' } }}
        accessory={
          <>
            <Button variant="gray" size="sm">
              Decline
            </Button>
            <Button size="sm">Accept</Button>
          </>
        }
        openHref="#panel"
        openLabel="Open the panel invite"
      />
      <ListRow
        title="Finish 3 reviews for Sanofi THRIVE Challenge"
        titleEmphasis="strong"
        subtitle="3 of 6 done. Due Mon, Nov 30 @ 11:59 PM ET"
        media={{ tile: { icon: icons.check, tone: 'gray' } }}
        accessory={
          <Button variant="tinted" size="sm">
            Continue reviewing
          </Button>
        }
        openHref="#queue"
        openLabel="Open the review queue"
      />
      <ListRow
        title="How did Online selection go?"
        titleEmphasis="strong"
        subtitle="HealthTech Traction 2027. One question"
        media={{ tile: { icon: icons.star, tone: 'orange' } }}
        href="#survey"
      />
    </ListSection>
  ),
};

export const Roomy: Story = {
  args: { title: 'To do', footer: undefined, density: 'roomy' },
  render: (args) => (
    <ListSection {...args}>
      <ListRow
        title="Finish 3 reviews for Sanofi THRIVE Challenge"
        titleEmphasis="strong"
        subtitle="3 of 6 done. Due Mon, Nov 30 @ 11:59 PM ET"
        media={{ tile: { icon: icons.check, tone: 'gray' } }}
        accessory={
          <Button variant="tinted" size="sm">
            Continue reviewing
          </Button>
        }
        openHref="#queue"
        openLabel="Open the review queue"
      />
      <ListRow
        title="HealthTech Traction 2027"
        subtitle="Online selection. Due Mon, Nov 30"
        media={{ src: PROGRAM_LOGO, autoCrop: true }}
        href="#healthtech"
      />
      <ListRow title="Judging guide" subtitle="Read before your first review" href="#guide" />
    </ListSection>
  ),
};

export const People: Story = {
  args: { title: 'People', footer: undefined, density: 'roomy' },
  render: (args) => (
    <ListSection {...args}>
      <ListRow
        title="Founders"
        titleEmphasis="strong"
        subtitle="Across 4,120 applications"
        value="2,184"
        valueStyle="callout"
        media={{ avatar: { initials: 'F', tone: 'green' } }}
        href="#founders"
      />
      <ListRow
        title="Evaluators"
        titleEmphasis="strong"
        subtitle="286 active in a program now"
        value="612"
        valueStyle="callout"
        media={{ avatar: { initials: 'E', tone: 'amber' } }}
        href="#evaluators"
      />
      <ListRow
        title="Mentors"
        titleEmphasis="strong"
        subtitle="41 matched to a startup now"
        value="148"
        valueStyle="callout"
        media={{ avatar: { initials: 'M', tone: 'gray' } }}
        href="#mentors"
      />
      <ListRow
        title="Program managers"
        titleEmphasis="strong"
        subtitle="Running 12 active programs"
        value="24"
        valueStyle="callout"
        media={{ avatar: { initials: 'PM', tone: 'teal' } }}
        href="#program-managers"
      />
      <ListRow
        title="Admins"
        titleEmphasis="strong"
        value="5"
        valueStyle="callout"
        media={{ avatar: { initials: 'A', tone: 'gray' } }}
        href="#admins"
      />
    </ListSection>
  ),
};

export const ValueStyles: Story = {
  args: { title: 'Your programs', footer: undefined, density: 'roomy' },
  render: (args) => (
    <ListSection {...args}>
      <ListRow
        title="Sanofi THRIVE Challenge"
        titleEmphasis="strong"
        subtitle="Online selection. Due Mon, Nov 30 @ 11:59 PM ET"
        value="3 of 6 done"
        valueStyle="subheadline"
        media={{ src: PROGRAM_LOGO, autoCrop: true }}
        href="#sanofi"
      />
      <ListRow
        title="Founders"
        titleEmphasis="strong"
        subtitle="Across 4,120 applications"
        value="2,184"
        valueStyle="callout"
        media={{ avatar: { initials: 'F', tone: 'green' } }}
        href="#founders"
      />
      <ListRow
        title="Startups in review"
        titleEmphasis="strong"
        subtitle="Default value style"
        value="128"
        media={{ tile: { icon: icons.check, tone: 'gray' } }}
        href="#review"
      />
    </ListSection>
  ),
};

const RECIPIENTS = [
  { initials: 'ZE', name: 'Zoe Engel', company: 'Hazel Rx', progress: '90% done' },
  { initials: 'BU', name: 'Ben Ulrich', company: 'Willow Med', progress: '90% done' },
  { initials: 'ZQ', name: 'Zoe Quintero', company: 'Pebble Therapeutics', progress: '85% done' },
  { initials: 'BB', name: 'Ben Brandt', company: 'Coral Nutrition', progress: '80% done' },
];

export const Recipients: Story = {
  args: { title: '52 founders', footer: undefined, density: 'dense', framed: true },
  render: (args) => (
    <ListSection
      {...args}
      trailing={<SearchField size="sm" placeholder="Find" aria-label="Find a founder" />}
    >
      {RECIPIENTS.map((recipient) => (
        <ListRow
          key={recipient.name}
          title={recipient.name}
          titleEmphasis="strong"
          subtitle={recipient.company}
          subtitlePosition="inline"
          value={recipient.progress}
          media={{ avatar: { initials: recipient.initials, size: 'compact' } }}
        />
      ))}
    </ListSection>
  ),
};

export const Selection: Story = {
  args: { title: 'Timezone', footer: undefined, density: 'dense' },
  render: (args) => (
    <ListSection {...args}>
      <ListRow title="Eastern time" selected onClick={() => undefined} />
      <ListRow title="Central time" onClick={() => undefined} />
      <ListRow title="Pacific time" onClick={() => undefined} />
    </ListSection>
  ),
};

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  args: { title: 'Actions', footer: undefined },
  render: (args) => {
    const onExport = fn();
    return (
      <ListSection {...args}>
        <ListRow title="Export scores" onClick={onExport} data-testid="export" />
        <ListRow title="Email judges" accessory={<Switch />} />
      </ListSection>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('switch', { name: 'Email judges' });
    await userEvent.click(control);
    await expect(control).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByRole('button', { name: 'Export scores' })).toBeEnabled();
  },
};

const HeadingFocusDemo = (args: Story['args']) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusHeading = () => headingRef.current?.focus();
  return (
    <div className="flex flex-col gap-4">
      <Button variant="gray" onClick={focusHeading}>
        Go to the to do list
      </Button>
      <ListSection {...args} headingProps={{ ref: headingRef, tabIndex: -1 }}>
        <ListRow title="Review applications" />
        <ListRow title="Invite judges" />
      </ListSection>
    </div>
  );
};

export const HeadingFocus: Story = {
  tags: ['interaction', '!autodocs'],
  args: { title: 'To do', titleAs: 'h2', footer: undefined },
  render: (args) => <HeadingFocusDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Go to the to do list' }));
    const heading = canvas.getByRole('heading', { level: 2, name: 'To do' });
    await expect(heading).toHaveFocus();
    await expect(canvas.getByRole('region', { name: 'To do' })).toBeInTheDocument();
  },
};

export const SectionWithLogo: Story = {
  render: () => (
    <ListSection
      title="Sanofi THRIVE Challenge"
      titleAs="h2"
      subtitle="Online selection"
      media={{ src: MC_MONOGRAM, alt: '' }}
    >
      <ListRow
        icon={icons.check}
        title="3 reviews left"
        titleEmphasis="strong"
        subtitle="Due Mon, Nov 30 @ 11:59 PM ET. About 60 min"
        accessory={<Button variant="filled">Continue</Button>}
      />
    </ListSection>
  ),
};
