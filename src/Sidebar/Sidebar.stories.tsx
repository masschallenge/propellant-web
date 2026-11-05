import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Sidebar, SidebarItem, SidebarSection } from './Sidebar';
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
          'The list of destinations in the AppShell sidebar. Sections group destinations under a footnote title; the current destination takes a gray fill and semibold label and is announced with `aria-current="page"`. Items render as links when given `href` (pass `linkAs` for a router link) and close the compact overlay once chosen.',
          '',
          "Import: `import { Sidebar, SidebarSection, SidebarItem } from '@masschallenge/propellant-web'`",
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
