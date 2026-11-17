import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { AppShell, useAppShell } from './AppShell';
import { Toolbar } from '../Toolbar/Toolbar';
import { Sidebar, SidebarItem, SidebarSection, SidebarSeparator } from '../Sidebar/Sidebar';
import type { SidebarMarkerState } from '../Sidebar/Sidebar';
import { RoleTag } from '../RoleTag/RoleTag';
import { Avatar } from '../Avatar/Avatar';
import { Logo } from '../Logo/Logo';
import { MC_MONOGRAM } from '../assets/logos';
import { ListRow, ListSection } from '../List/List';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { Button } from '../Button/Button';
import { Banner } from '../Banner/Banner';
import { SearchField } from '../SearchField/SearchField';
import { icons } from '../../.storybook/icons';
import { hide } from '../../.storybook/controls';

const STAGES = [
  { id: 'applications', label: 'Applications' },
  { id: 'review', label: 'Review' },
  { id: 'pitch-day', label: 'Pitch day' },
  { id: 'cohort', label: 'Cohort' },
];

const DESTINATIONS = [
  { id: 'overview', label: 'Overview', icon: icons.star },
  { id: 'startups', label: 'Startups', icon: icons.check, count: 12 },
  { id: 'mentors', label: 'Mentors', icon: icons.person },
  { id: 'events', label: 'Events', icon: icons.calendar },
];

const DemoSidebar = ({
  current,
  onNavigate,
}: {
  current: string;
  onNavigate: (destination: string) => void;
}) => (
  <Sidebar
    label="Main"
    header={<span className="text-headline text-[var(--label)]">MassChallenge</span>}
    footer={
      <SidebarSection>
        <SidebarItem icon={icons.person} onClick={() => onNavigate('account')}>
          Ada Lovelace
        </SidebarItem>
      </SidebarSection>
    }
  >
    <SidebarSection title="Boston 2026">
      {DESTINATIONS.map((destination) => (
        <SidebarItem
          key={destination.id}
          icon={destination.icon}
          count={destination.count}
          current={current === destination.id}
          onClick={() => onNavigate(destination.id)}
        >
          {destination.label}
        </SidebarItem>
      ))}
    </SidebarSection>
    <SidebarSection title="Network">
      <SidebarItem
        icon={icons.search}
        current={current === 'network'}
        onClick={() => onNavigate('network')}
      >
        Directory
      </SidebarItem>
    </SidebarSection>
  </Sidebar>
);

const ShellDemo = ({ appearance }: { appearance?: 'system' | 'light' | 'dark' }) => {
  const [destination, setDestination] = useState('overview');
  const [stage, setStage] = useState('review');
  return (
    <AppShell
      appearance={appearance}
      sidebar={<DemoSidebar current={destination} onNavigate={setDestination} />}
      toolbar={
        <Toolbar
          leading={
            <Button variant="plain" size="sm" iconTrailing={icons.chevron}>
              Boston 2026
            </Button>
          }
          trailing={<SearchField aria-label="Search startups" size="sm" className="w-44" />}
          accessory={
            <SegmentedControl
              aria-label="Program stage"
              items={STAGES}
              value={stage}
              onChange={setStage}
              size="sm"
            />
          }
        />
      }
    >
      <div className="flex flex-col gap-8 max-w-[var(--width-form)]">
        <h1 className="m-0 text-large-title text-[var(--label)]">Round 1</h1>
        <ListSection title="Review" footer="Judges see startups once the round opens.">
          <ListRow title="Startups in review" value="128" />
          <ListRow title="Judges assigned" value="42" />
          <ListRow title="Reviews submitted" value="311" />
        </ListSection>
        <ListSection title="Actions">
          <ListRow title="Assign judges" href="#assign" icon={icons.person} />
          <ListRow title="Export scores" onClick={() => undefined} icon={icons.arrow} />
          <ListRow title="Close the round" destructive onClick={() => undefined} />
        </ListSection>
      </div>
    </AppShell>
  );
};

const meta = {
  title: 'Components/Layout/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'The application frame: a sidebar of destinations, a toolbar for the current context, and one main landmark. On wide windows (1024px and up) the sidebar is a translucent column the toolbar button can hide; on compact windows it becomes a modal overlay that closes on Escape, on the scrim or after a destination is chosen. A skip link leads to the main content. Set `appearance` to opt a surface into the dark theme or the system setting.',
          '',
          'Set `sidebarCollapse="rail"` to collapse the sidebar to a column of icons instead of hiding it. The sidebar header then carries the Collapse menu and Expand menu button. The rail opens only by click: Expand menu pins the full tree again, a parent icon pins it with that parent expanded, and only Collapse menu returns to the rail. Pass `sidebarStorageKey` to remember the choice and `defaultSidebarCollapsed` to start in the rail.',
          '',
          "Import: `import { AppShell, Toolbar, Sidebar, SidebarSection, SidebarItem } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  argTypes: {
    sidebar: hide,
    toolbar: hide,
    banner: hide,
    footer: hide,
    children: hide,
    className: hide,
  },
} satisfies Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Application: Story = {
  render: () => <ShellDemo />,
};

export const Dark: Story = {
  render: () => <ShellDemo appearance="dark" />,
  parameters: { backgrounds: { disable: true } },
};

export const Compact: Story = {
  render: () => <ShellDemo />,
  parameters: { viewport: { defaultViewport: 'mobile2' } },
  globals: { viewport: { value: 'mobile2' } },
};

export const WithBanner: Story = {
  render: () => (
    <AppShell
      banner={
        <Banner tone="masquerade" full title="Viewing as Ada Lovelace">
          Changes you make are saved to her account.
        </Banner>
      }
      toolbar={<Toolbar title="Startups" />}
    >
      <p className="m-0 text-body text-[var(--label-secondary)]">
        A surface without destinations skips the sidebar.
      </p>
    </AppShell>
  ),
};

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  render: () => <ShellDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const startups = await canvas.findByRole('button', { name: /^Startups/ });
    await userEvent.click(startups);
    await expect(startups).toHaveAttribute('aria-current', 'page');
    const pitchDay = canvas.getByRole('radio', { name: 'Pitch day' });
    await userEvent.click(pitchDay);
    await expect(pitchDay).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      '#main-content',
    );
  },
};

const consoleIcon = (shapes: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {shapes}
  </svg>
);

const CONSOLE_ICONS = {
  home: consoleIcon(<path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" />),
  network: consoleIcon(
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
    </>,
  ),
  programs: consoleIcon(<path d="m12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5" />),
  overview: consoleIcon(
    <>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </>,
  ),
  settings: consoleIcon(
    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />,
  ),
  applications: consoleIcon(
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" />,
  ),
  review: consoleIcon(
    <path d="m9 11 3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />,
  ),
  platform: consoleIcon(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
    </>,
  ),
  account: consoleIcon(<path d="m18 15-6-6-6 6" />),
};

const CONSOLE_STAGES: { id: string; label: string; state: SidebarMarkerState; steps: string[] }[] =
  [
    {
      id: 'application',
      label: 'Application',
      state: 'done',
      steps: ['Setup', 'Questions', 'Applications', 'Invite applicants'],
    },
    { id: 'prescreening', label: 'Pre-screening', state: 'done', steps: ['Triage', 'Advancement'] },
    {
      id: 'review',
      label: 'Online review',
      state: 'now',
      steps: ['Rubric and settings', 'Judges', 'Progress', 'Advancement'],
    },
    {
      id: 'pitch',
      label: 'Pitch round',
      state: 'next',
      steps: ['Round settings', 'Schedule', 'Pitch day', 'Advancement'],
    },
    {
      id: 'cohort',
      label: 'Cohort',
      state: 'next',
      steps: ['Mentor matching', 'Mentor sessions', 'Founder reports'],
    },
    { id: 'close', label: 'Close', state: 'next', steps: ['Results'] },
  ];

const ROLE_DESTINATIONS = [
  { id: 'applications', label: 'Your applications', icon: 'applications', tone: 'startup' },
  { id: 'review-queue', label: 'Review queue', icon: 'review', tone: 'judge' },
  { id: 'platform', label: 'Platform settings', icon: 'platform', tone: 'admin' },
] as const;

const ROLE_TAG_LABELS = { startup: 'Startup', judge: 'Judge', admin: 'Admin' } as const;

const MARKER_LABELS: Record<SidebarMarkerState, string> = {
  done: 'completed',
  now: 'in progress',
  next: 'not started',
};

const ConsoleHeader = () => (
  <span className="flex items-center gap-2 text-headline text-[var(--label)]">
    <Logo lockup="monogram" className="h-4.5" />
    Accelerate
  </span>
);

const ConsoleAccount = () => {
  const isRail = Boolean(useAppShell()?.isRail);
  const avatar = <Avatar initials="AL" size={isRail ? 'xs' : 'sm'} />;
  if (isRail)
    return (
      <button
        type="button"
        aria-label="Account menu"
        className="w-full min-h-10 inline-flex items-center justify-center rounded-[var(--corner-md)] border-0 bg-transparent cursor-pointer"
      >
        {avatar}
      </button>
    );
  return (
    <button
      type="button"
      aria-label="Account menu"
      className="w-full min-h-10 flex items-center gap-2.5 px-2 rounded-[var(--corner-md)] border-0 bg-transparent cursor-pointer text-left"
    >
      {avatar}
      <span className="flex-1 min-w-0">
        <span className="block text-callout font-semibold text-[var(--label)]">Ada Lovelace</span>
        <span className="block text-footnote text-[var(--label-tertiary)]">Program manager</span>
      </span>
      <span className="flex-none inline-flex w-[var(--icon-lg)] h-[var(--icon-lg)] text-[var(--label-tertiary)]">
        {CONSOLE_ICONS.account}
      </span>
    </button>
  );
};

const ConsoleSidebar = ({
  current,
  onNavigate,
}: {
  current: string;
  onNavigate: (destination: string) => void;
}) => {
  const choose = (destination: string) => (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onNavigate(destination);
  };
  const isInStage = (stage: (typeof CONSOLE_STAGES)[number]) =>
    stage.steps.some((step) => `${stage.id}/${step}` === current);
  const topItem = (destination: string, label: string, icon: ReactNode) => (
    <SidebarItem
      href={`#${destination}`}
      icon={icon}
      current={current === destination}
      onClick={choose(destination)}
    >
      {label}
    </SidebarItem>
  );
  return (
    <Sidebar label="Console" header={<ConsoleHeader />} footer={<ConsoleAccount />}>
      <SidebarSection>
        {topItem('home', 'Home', CONSOLE_ICONS.home)}
        <SidebarItem
          href="#network"
          icon={CONSOLE_ICONS.network}
          inTrail={current === 'network/profile'}
          subitems={
            <SidebarItem
              href="#network-profile"
              current={current === 'network/profile'}
              onClick={choose('network/profile')}
            >
              Profile
            </SidebarItem>
          }
        >
          Network
        </SidebarItem>
        {topItem('programs', 'Programs', CONSOLE_ICONS.programs)}
        <SidebarItem
          href="#program"
          media={{ src: MC_MONOGRAM, alt: '' }}
          inTrail={current === 'overview' || CONSOLE_STAGES.some(isInStage)}
          collapsible={false}
          onClick={choose('overview')}
          subitems={
            <>
              {topItem('overview', 'Overview', CONSOLE_ICONS.overview)}
              {CONSOLE_STAGES.map((stage, stageIndex) => (
                <SidebarItem
                  key={stage.id}
                  marker={{
                    state: stage.state,
                    number: stageIndex + 1,
                    label: MARKER_LABELS[stage.state],
                  }}
                  defaultExpanded={stage.state === 'now' || isInStage(stage)}
                  subitems={stage.steps.map((step) => (
                    <SidebarItem
                      key={step}
                      href={`#${stage.id}-${step}`}
                      onClick={choose(`${stage.id}/${step}`)}
                      current={current === `${stage.id}/${step}`}
                    >
                      {step}
                    </SidebarItem>
                  ))}
                >
                  {stage.label}
                </SidebarItem>
              ))}
              <SidebarSeparator />
              {topItem('program-settings', 'Program settings', CONSOLE_ICONS.settings)}
            </>
          }
        >
          HealthTech Traction 2027
        </SidebarItem>
        <SidebarSeparator />
        {ROLE_DESTINATIONS.map((destination) => (
          <SidebarItem
            key={destination.id}
            href={`#${destination.id}`}
            icon={CONSOLE_ICONS[destination.icon]}
            current={current === destination.id}
            onClick={choose(destination.id)}
            accessory={
              <RoleTag tone={destination.tone}>{ROLE_TAG_LABELS[destination.tone]}</RoleTag>
            }
          >
            {destination.label}
          </SidebarItem>
        ))}
      </SidebarSection>
    </Sidebar>
  );
};

const RailDemo = ({ defaultSidebarCollapsed }: { defaultSidebarCollapsed?: boolean }) => {
  const [destination, setDestination] = useState('review/Progress');
  return (
    <AppShell
      sidebarCollapse="rail"
      defaultSidebarCollapsed={defaultSidebarCollapsed}
      sidebar={<ConsoleSidebar current={destination} onNavigate={setDestination} />}
      toolbar={<Toolbar title="HealthTech Traction 2027" />}
    >
      <h1 className="m-0 text-large-title text-[var(--label)]">Progress</h1>
    </AppShell>
  );
};

export const Tree: Story = {
  render: () => <RailDemo />,
};

export const Rail: Story = {
  render: () => <RailDemo defaultSidebarCollapsed />,
};

export const RailInteraction: Story = {
  tags: ['interaction', '!autodocs'],
  render: () => <RailDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button', { name: 'Show sidebar' })).toBeNull();
    await expect(canvas.getByRole('link', { name: 'Platform settings, Admin' })).toBeVisible();
    const review = canvas.getByRole('button', { name: 'Online review, in progress' });
    await expect(review).toHaveAttribute('aria-expanded', 'true');
    await expect(
      canvas.getByRole('link', { name: 'HealthTech Traction 2027' }),
    ).not.toHaveAttribute('aria-current');
    await expect(canvas.getByRole('link', { name: 'Progress' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    const network = canvas.getByRole('button', { name: 'Network' });
    await userEvent.click(network);
    await expect(network).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(canvas.getByRole('link', { name: 'Profile' }));
    await expect(canvas.getByRole('link', { name: 'Profile' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await userEvent.click(canvas.getByRole('link', { name: 'Progress' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse menu' }));
    await expect(canvas.queryByRole('link', { name: 'Progress' })).toBeNull();
    await expect(canvas.getByRole('link', { name: 'Platform settings' })).toBeInTheDocument();
    const program = canvas.getByRole('link', { name: 'HealthTech Traction 2027' });
    await expect(program).toHaveClass('bg-[var(--fill)]');
    await expect(program).toHaveAttribute('aria-current', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Expand menu' }));
    await expect(canvas.getByRole('link', { name: 'Progress' })).toBeVisible();
    await userEvent.click(canvas.getByRole('link', { name: 'Progress' }));
    await expect(canvas.getByRole('button', { name: 'Collapse menu' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse menu' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Network' }));
    await expect(canvas.getByRole('button', { name: 'Collapse menu' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Network' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(canvas.getByRole('link', { name: 'Profile' })).toBeVisible();
  },
};
