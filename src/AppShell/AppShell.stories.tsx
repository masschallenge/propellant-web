import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { AppShell } from './AppShell';
import { Toolbar } from '../Toolbar/Toolbar';
import { Sidebar, SidebarItem, SidebarSection } from '../Sidebar/Sidebar';
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
