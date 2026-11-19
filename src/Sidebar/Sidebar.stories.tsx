import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Sidebar, SidebarItem, SidebarSection, SidebarSeparator } from './Sidebar';
import type { SidebarItemProps, SidebarItemSize, SidebarMarkerState } from './Sidebar';
import { AppShell } from '../AppShell/AppShell';
import { Toolbar } from '../Toolbar/Toolbar';
import { RoleTag } from '../RoleTag/RoleTag';
import { MC_MONOGRAM } from '../assets/logos';
import { icons } from '../../.storybook/icons';
import { hide } from '../../.storybook/controls';

const meta = {
  title: 'Components/Layout/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'The list of destinations in the AppShell sidebar. Sections group destinations under a footnote title; the current destination takes a gray fill and semibold label and is announced with `aria-current="page"`. Items render as links when given `href` (pass `linkAs` for a router link) and close the compact overlay once chosen. Items are the small control height by default; `size="md"` gives top level places the medium control height.',
          '',
          'Pass `subitems` to nest destinations as a tree of disclosure lists. A parent is a button that only opens and closes its list, uncontrolled with `defaultExpanded` or controlled with `expanded` and `onExpandedChange`; it never navigates and never closes the sidebar, so only leaves are destinations. Set `collapsible={false}` for a parent that always shows its list, with no chevron; with an `href` it stays a link, and without one it is a plain row that takes no focus and no clicks. Top level items with nothing nested keep the height `size` gives them, while parents, nested rows and program rows take the tree sizes. In an AppShell with `sidebarCollapse="rail"`, as in the console, every top level row takes the tree size too: the Tree and Program Under Persona stories render that way, and Tree In Hide Mode shows the same tree with flat small and medium top level rows. Children of an icon row line up with its label, leaves take the smaller secondary row, a `marker` shows a stage as done, now or next, `media` shows a logo beside a program name, labels wrap to two lines, and `SidebarSeparator` draws a hairline between groups.',
          '',
          "Import: `import { Sidebar, SidebarSection, SidebarItem, SidebarSeparator } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  argTypes: {
    header: hide,
    footer: hide,
    children: hide,
    className: hide,
  },
} satisfies Meta<typeof Sidebar>;
export default meta;
type Story = StoryObj<typeof meta>;

const DESTINATIONS = [
  { id: 'overview', label: 'Overview', icon: icons.star },
  { id: 'startups', label: 'Startups', icon: icons.check, count: 12 },
  { id: 'mentors', label: 'Mentors', icon: icons.person },
  { id: 'events', label: 'Events', icon: icons.calendar },
];

const Demo = () => {
  const [current, setCurrent] = useState('startups');
  return (
    <div className="w-[var(--sidebar-width)] h-[480px] bg-[var(--bg-secondary)]">
      <Sidebar
        label="Main"
        header={<span className="text-headline text-[var(--label)]">MassChallenge</span>}
        footer={
          <SidebarSection>
            <SidebarItem icon={icons.person}>Ada Lovelace</SidebarItem>
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
              onClick={() => setCurrent(destination.id)}
            >
              {destination.label}
            </SidebarItem>
          ))}
        </SidebarSection>
        <SidebarSection title="Network">
          <SidebarItem href="#directory" icon={icons.search}>
            Directory
          </SidebarItem>
        </SidebarSection>
      </Sidebar>
    </div>
  );
};

export const Destinations: Story = {
  render: () => <Demo />,
};

export const MediumItems: Story = {
  render: () => (
    <div className="w-[var(--sidebar-width)] h-[480px] bg-[var(--bg-secondary)]">
      <Sidebar label="Main">
        <SidebarSection>
          <SidebarItem href="#home" icon={icons.star} size="md" current>
            Home
          </SidebarItem>
          <SidebarItem href="#network" icon={icons.person} size="md">
            Network
          </SidebarItem>
        </SidebarSection>
        <SidebarSection title="Boston 2026">
          {DESTINATIONS.map((destination) => (
            <SidebarItem
              key={destination.id}
              href={`#${destination.id}`}
              icon={destination.icon}
              count={destination.count}
            >
              {destination.label}
            </SidebarItem>
          ))}
        </SidebarSection>
      </Sidebar>
    </div>
  ),
};

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mentors = canvas.getByRole('button', { name: 'Mentors' });
    await userEvent.click(mentors);
    await expect(mentors).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('button', { name: /^Startups/ })).not.toHaveAttribute(
      'aria-current',
    );
  },
};

const STAGES: {
  id: string;
  label: string;
  state: SidebarMarkerState;
  steps: { id: string; label: string }[];
}[] = [
  {
    id: 'application',
    label: 'Application',
    state: 'done',
    steps: [
      { id: 'application-setup', label: 'Setup' },
      { id: 'application-list', label: 'Applications' },
    ],
  },
  {
    id: 'review',
    label: 'Online review',
    state: 'now',
    steps: [
      { id: 'review-judges', label: 'Judges' },
      { id: 'review-progress', label: 'Progress' },
      { id: 'review-advancement', label: 'Advancement' },
      { id: 'review-recommendations', label: 'Selection committee recommendations' },
    ],
  },
  {
    id: 'pitch',
    label: 'Pitch round',
    state: 'next',
    steps: [
      { id: 'pitch-schedule', label: 'Schedule' },
      { id: 'pitch-day', label: 'Pitch day' },
    ],
  },
];

const MARKER_LABELS: Record<SidebarMarkerState, string> = {
  done: 'completed',
  now: 'in progress',
  next: 'not started',
};

type ChooseDestination = (destination: string) => React.MouseEventHandler<HTMLElement>;

const useTreeCurrent = () => {
  const [current, setCurrent] = useState('review-progress');
  const choose: ChooseDestination = (destination) => (event) => {
    event.preventDefault();
    setCurrent(destination);
  };
  return { current, choose };
};

const stageItems = (current: string, choose: ChooseDestination) =>
  STAGES.map((stage, stageIndex) => (
    <SidebarItem
      key={stage.id}
      marker={{
        state: stage.state,
        number: stageIndex + 1,
        label: MARKER_LABELS[stage.state],
      }}
      defaultExpanded={stage.state === 'now' || stage.steps.some((step) => step.id === current)}
      subitems={stage.steps.map((step) => (
        <SidebarItem
          key={step.id}
          href={`#${step.id}`}
          onClick={choose(step.id)}
          current={current === step.id}
        >
          {step.label}
        </SidebarItem>
      ))}
    >
      {stage.label}
    </SidebarItem>
  ));

const ConsoleFrame = ({ sidebar }: { sidebar: ReactNode }) => (
  <AppShell
    sidebarCollapse="rail"
    sidebar={sidebar}
    toolbar={<Toolbar title="HealthTech Traction 2027" />}
  >
    <h1 className="m-0 text-large-title text-[var(--label)]">Online review</h1>
  </AppShell>
);

const TreeSidebar = ({ consoleSize }: { consoleSize?: SidebarItemSize }) => {
  const { current, choose } = useTreeCurrent();
  return (
    <Sidebar label="Console">
      <SidebarSection>
        <SidebarItem
          href="#home"
          icon={icons.star}
          onClick={choose('home')}
          current={current === 'home'}
        >
          Home
        </SidebarItem>
        <SidebarItem
          href="#program"
          media={{ src: MC_MONOGRAM, alt: '' }}
          onClick={choose('overview')}
          collapsible={false}
          subitems={stageItems(current, choose)}
        >
          HealthTech Traction 2027
        </SidebarItem>
        <SidebarSeparator />
        <SidebarItem
          href="#program-manager"
          icon={icons.person}
          size={consoleSize}
          accessory={<RoleTag tone="pm">PM</RoleTag>}
          onClick={choose('program-manager')}
          current={current === 'program-manager'}
        >
          Program Manager console
        </SidebarItem>
        <SidebarItem
          icon={icons.calendar}
          defaultExpanded
          subitems={
            <>
              <SidebarItem
                href="#mentors"
                onClick={choose('mentors')}
                current={current === 'mentors'}
              >
                Mentor operations
              </SidebarItem>
              <SidebarItem href="#emails" onClick={choose('emails')} current={current === 'emails'}>
                Email templates
              </SidebarItem>
            </>
          }
        >
          Configuration
        </SidebarItem>
      </SidebarSection>
    </Sidebar>
  );
};

export const Tree: Story = {
  render: () => <ConsoleFrame sidebar={<TreeSidebar />} />,
};

export const TreeInCompactOverlay: Story = {
  render: () => <ConsoleFrame sidebar={<TreeSidebar />} />,
  parameters: { viewport: { defaultViewport: 'mobile2' } },
  globals: { viewport: { value: 'mobile2' } },
};

export const TreeInHideMode: Story = {
  render: () => (
    <div className="w-[var(--sidebar-width)] h-[640px] bg-[var(--material-sidebar)]">
      <TreeSidebar consoleSize="md" />
    </div>
  ),
};

export const ExpandedCollapseToggle: Story = {
  tags: ['interaction', '!autodocs'],
  render: () => <ConsoleFrame sidebar={<TreeSidebar />} />,
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', { name: 'Collapse menu' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(getComputedStyle(toggle).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  },
};

export const TreeInteraction: Story = {
  tags: ['interaction', '!autodocs'],
  render: () => <ConsoleFrame sidebar={<TreeSidebar />} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pitch = canvas.getByRole('button', { name: 'Pitch round, not started' });
    await expect(pitch).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(pitch);
    await expect(pitch).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('link', { name: 'Progress' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await userEvent.click(canvas.getByRole('link', { name: 'Schedule' }));
    await expect(canvas.getByRole('link', { name: 'Schedule' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    const configuration = canvas.getByRole('button', { name: 'Configuration' });
    await userEvent.click(configuration);
    await expect(configuration).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('link', { name: 'Email templates' })).toBeNull();
  },
};

const SOLID_COVER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 30"><rect width="40" height="30" fill="#065e6f"/></svg>',
  );

type ProgramRowProps = Pick<SidebarItemProps, 'href' | 'media'>;

const PROGRAM_WITH_COVER: ProgramRowProps = {
  href: '#program',
  media: { src: SOLID_COVER, alt: 'HealthTech logo' },
};

const PersonaProgramSidebar = ({ programRow }: { programRow: ProgramRowProps }) => {
  const { current, choose } = useTreeCurrent();
  return (
    <Sidebar label="Console">
      <SidebarSection>
        <SidebarItem
          href="#home"
          icon={icons.star}
          onClick={choose('home')}
          current={current === 'home'}
        >
          Home
        </SidebarItem>
        <SidebarItem
          icon={icons.person}
          accessory={<RoleTag tone="pm">PM</RoleTag>}
          defaultExpanded
          subitems={
            <SidebarItem
              {...programRow}
              onClick={choose('program')}
              collapsible={false}
              subitems={
                <>
                  <SidebarItem
                    href="#overview"
                    icon={icons.star}
                    onClick={choose('overview')}
                    current={current === 'overview'}
                  >
                    Overview
                  </SidebarItem>
                  {stageItems(current, choose)}
                </>
              }
            >
              HealthTech Traction 2027
            </SidebarItem>
          }
        >
          Program Manager
        </SidebarItem>
      </SidebarSection>
    </Sidebar>
  );
};

export const ProgramUnderPersona: Story = {
  render: () => (
    <ConsoleFrame sidebar={<PersonaProgramSidebar programRow={PROGRAM_WITH_COVER} />} />
  ),
};

export const ProgramWithoutCoverUnderPersona: Story = {
  render: () => <ConsoleFrame sidebar={<PersonaProgramSidebar programRow={{}} />} />,
};

const leftFromNav = (nav: HTMLElement, element: Element) =>
  element.getBoundingClientRect().left - nav.getBoundingClientRect().left;

const heightOf = (element: Element | null) => element?.getBoundingClientRect().height;

const fontSizeOf = (element: Element) => getComputedStyle(element).fontSize;

export const ProgramUnderPersonaAlignment: Story = {
  tags: ['interaction', '!autodocs'],
  render: () => (
    <ConsoleFrame sidebar={<PersonaProgramSidebar programRow={PROGRAM_WITH_COVER} />} />
  ),
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', { name: 'Console' });
    const canvas = within(nav);
    const homeIcon = canvas.getByRole('link', { name: 'Home' }).firstElementChild;
    const logo = canvas.getByRole('img', { name: 'HealthTech logo' });
    const marker = canvasElement.querySelector('[data-marker="now"]');
    const overviewIcon = canvas.getByRole('link', { name: 'Overview' }).firstElementChild;
    const leafText = canvas.getByText('Progress');
    if (!homeIcon || !marker || !overviewIcon) throw new Error('Missing a leading visual');
    await expect({
      topLevelIcon: leftFromNav(nav, homeIcon),
      programLogo: leftFromNav(nav, logo),
      stageMarker: leftFromNav(nav, marker),
      overviewIcon: leftFromNav(nav, overviewIcon),
      leafText: leftFromNav(nav, leafText),
      programRow: leftFromNav(nav, logo.closest('a') ?? logo),
      leafRow: leftFromNav(nav, canvas.getByRole('link', { name: 'Progress' })),
    }).toEqual({
      topLevelIcon: 18,
      programLogo: 18,
      stageMarker: 36,
      overviewIcon: 36,
      leafText: 82,
      programRow: 16,
      leafRow: 16,
    });
    const logoStyle = getComputedStyle(logo);
    await expect({
      outlineWidth: logoStyle.outlineWidth,
      outlineStyle: logoStyle.outlineStyle,
      outlineOffset: logoStyle.outlineOffset,
      outlineColor: logoStyle.outlineColor,
      background: logoStyle.backgroundColor,
      radius: logoStyle.borderRadius,
      fit: logoStyle.objectFit,
    }).toEqual({
      outlineWidth: '1px',
      outlineStyle: 'solid',
      outlineOffset: '-1px',
      outlineColor: 'rgb(219, 225, 227)',
      background: 'rgb(255, 255, 255)',
      radius: '5px',
      fit: 'cover',
    });
    const nameStyle = getComputedStyle(canvas.getByText('HealthTech Traction 2027'));
    const homeStyle = getComputedStyle(canvas.getByText('Home'));
    await expect({
      size: nameStyle.fontSize,
      line: nameStyle.lineHeight,
      weight: nameStyle.fontWeight,
      color: nameStyle.color,
    }).toEqual({ size: '14px', line: '18px', weight: '600', color: homeStyle.color });
    const home = canvas.getByRole('link', { name: 'Home' });
    const programManager = canvas.getByRole('button', { name: 'Program Manager, PM' });
    await expect({
      homeRow: heightOf(home),
      homeLabel: fontSizeOf(canvas.getByText('Home')),
      homeIcon: home.firstElementChild?.getBoundingClientRect().width,
      personaRow: heightOf(programManager),
      personaLabel: fontSizeOf(canvas.getByText('Program Manager')),
      personaIcon: programManager.firstElementChild?.getBoundingClientRect().width,
      programRow: heightOf(logo.closest('a')),
      logoWidth: logo.getBoundingClientRect().width,
      logoHeight: heightOf(logo),
      stageRow: heightOf(canvas.getByRole('button', { name: 'Online review, in progress' })),
      stageLabel: fontSizeOf(canvas.getByText('Online review')),
      leafRow: heightOf(canvas.getByRole('link', { name: 'Progress' })),
      leafLabel: fontSizeOf(leafText),
    }).toEqual({
      homeRow: 36,
      homeLabel: '15px',
      homeIcon: 20,
      personaRow: 36,
      personaLabel: '15px',
      personaIcon: 20,
      programRow: 44,
      logoWidth: 60,
      logoHeight: 36,
      stageRow: 34,
      stageLabel: '15px',
      leafRow: 32,
      leafLabel: '14px',
    });
  },
};

export const ProgramWithoutCoverUnderPersonaAlignment: Story = {
  tags: ['interaction', '!autodocs'],
  render: () => <ConsoleFrame sidebar={<PersonaProgramSidebar programRow={{}} />} />,
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', { name: 'Console' });
    const canvas = within(nav);
    const homeIcon = canvas.getByRole('link', { name: 'Home' }).firstElementChild;
    const programName = canvas.getByText('HealthTech Traction 2027');
    const programRow = programName.closest('li')?.firstElementChild;
    const marker = canvasElement.querySelector('[data-marker="now"]');
    const overviewIcon = canvas.getByRole('link', { name: 'Overview' }).firstElementChild;
    const leafText = canvas.getByText('Progress');
    if (!homeIcon || !programRow || !marker || !overviewIcon) {
      throw new Error('Missing a program row or a leading visual');
    }
    await expect({
      topLevelIcon: leftFromNav(nav, homeIcon),
      programName: leftFromNav(nav, programName),
      stageMarker: leftFromNav(nav, marker),
      overviewIcon: leftFromNav(nav, overviewIcon),
      leafText: leftFromNav(nav, leafText),
    }).toEqual({
      topLevelIcon: 18,
      programName: 18,
      stageMarker: 36,
      overviewIcon: 36,
      leafText: 82,
    });
    const nameStyle = getComputedStyle(programName);
    await expect({
      size: nameStyle.fontSize,
      line: nameStyle.lineHeight,
      weight: nameStyle.fontWeight,
      lineClamp: nameStyle.webkitLineClamp,
      color: nameStyle.color,
    }).toEqual({
      size: '14px',
      line: '18px',
      weight: '600',
      lineClamp: '2',
      color: getComputedStyle(canvas.getByText('Home')).color,
    });
    await expect(canvas.queryByRole('img')).toBeNull();
    await expect(programRow.tagName).toBe('DIV');
    await expect(programRow).not.toHaveAttribute('tabindex');
    await expect(canvas.queryByRole('link', { name: /^HealthTech/ })).toBeNull();
    await expect(canvas.queryByRole('button', { name: /^HealthTech/ })).toBeNull();
  },
};
