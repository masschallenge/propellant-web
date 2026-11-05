import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Calendar, type CalendarEvent } from './Calendar';
import { appearance, content, events as eventsCat, hide } from '../../.storybook/controls';

const boxed = (Story: React.ComponentType) => (
  <div style={{ width: 'min(960px, 100%)' }}>
    <Story />
  </div>
);

const EVENTS: CalendarEvent[] = [
  {
    id: 'e1',
    date: '2026-07-15',
    title: 'Cohort kickoff',
    time: '9:00 AM',
    tone: 'brand',
    startHour: 9,
    endHour: 10,
  },
  {
    id: 'e2',
    date: '2026-07-15',
    title: 'Judge calibration',
    time: '11:00 AM',
    tone: 'success',
    startHour: 11,
    endHour: 11.75,
  },
  {
    id: 'e3',
    date: '2026-07-16',
    title: 'Mentor office hours',
    time: '8:00 AM',
    tone: 'neutral',
    startHour: 8,
    endHour: 8.5,
  },
  {
    id: 'e4',
    date: '2026-07-18',
    title: 'Round 1 scores due',
    time: '10:00 AM',
    tone: 'danger',
    startHour: 10,
    endHour: 11,
  },
  { id: 'e5', date: '2026-07-22', title: 'Demo day', time: 'All day', tone: 'brand' },
];

const meta = {
  title: 'Components/Inputs/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  decorators: [boxed],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Scheduling calendar with a month grid, week and day time grids, a toolbar (search, previous, today, next, view select, add event), and a day view sidebar with a mini month and event detail card.',
          '',
          "Import: `import { Calendar } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    month: '2026-07-01',
    date: '2026-07-15',
    events: EVENTS,
    view: 'month',
    maxPerDay: 2,
    showBadge: true,
    showSearch: true,
    showNav: true,
    showViewSelect: true,
    showSidebar: true,
    onSelectDate: fn(),
    onViewChange: fn(),
    onEventSelect: fn(),
    onAddEvent: fn(),
  },
  argTypes: {
    view: { control: 'inline-radio', options: ['month', 'week', 'day'], ...appearance },
    maxPerDay: { control: { type: 'number', min: 1, max: 6 }, ...appearance },
    showBadge: { control: 'boolean', ...appearance },
    showSearch: { control: 'boolean', ...appearance },
    showNav: { control: 'boolean', ...appearance },
    showViewSelect: { control: 'boolean', ...appearance },
    showSidebar: { control: 'boolean', ...appearance },
    title: { control: 'text', ...content },
    subtitle: { control: 'text', ...content },
    onSelectDate: { ...eventsCat },
    onViewChange: { ...eventsCat },
    onEventSelect: { ...eventsCat },
    events: hide,
    month: hide,
    date: hide,
    tools: hide,
    selectedEventId: hide,
    onSearch: hide,
    onToday: hide,
    onAddEvent: hide,
    onCopyEvent: hide,
    onEditEvent: hide,
    onDeleteEvent: hide,
    dayStartHour: hide,
    dayEndHour: hide,
    className: hide,
  },
} satisfies Meta<typeof Calendar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Week: Story = { args: { view: 'week', dayStartHour: 7, dayEndHour: 13 } };

export const Day: Story = {
  args: {
    view: 'day',
    dayStartHour: 7,
    dayEndHour: 13,
    selectedEventId: 'e1',
    onCopyEvent: fn(),
    onEditEvent: fn(),
    onDeleteEvent: fn(),
  },
};

export const WithAddEvent: Story = { args: { onAddEvent: fn() } };

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole('grid', { name: 'July 2026' });
    const rows = within(grid).getAllByRole('row');
    await expect(rows).toHaveLength(6);
    await expect(within(rows[0]).getAllByRole('columnheader')).toHaveLength(7);
    await expect(within(rows[1]).getAllByRole('gridcell')).toHaveLength(7);
    await userEvent.click(canvas.getByText('Cohort kickoff'));
    await expect(args.onEventSelect).toHaveBeenCalled();
  },
};

const FollowMonth = () => {
  const [month, setMonth] = React.useState('2026-07-01');
  return (
    <>
      <button type="button" onClick={() => setMonth('2026-08-01')}>
        Show August
      </button>
      <Calendar month={month} showSearch={false} showViewSelect={false} />
    </>
  );
};

export const FollowsMonthProp: Story = {
  tags: ['interaction', '!autodocs'],
  render: () => <FollowMonth />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('grid', { name: 'July 2026' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Show August' }));
    await expect(canvas.getByRole('grid', { name: 'August 2026' })).toBeInTheDocument();
  },
};

const SLOT_EVENTS: CalendarEvent[] = [9, 9 + 1 / 3, 9 + 2 / 3, 10, 10 + 1 / 3].map(
  (startHour, index) => ({
    id: 'slot-' + index,
    date: '2026-07-15',
    title: index < 2 ? 'Offered' : '+ Offer',
    tone: index < 2 ? 'brand' : 'neutral',
    startHour,
    endHour: startHour + 1 / 3,
    pressed: index < 2,
  }),
);

export const SubHourSlots: Story = {
  args: {
    view: 'day',
    date: '2026-07-15',
    month: '2026-07-01',
    events: SLOT_EVENTS,
    dayStartHour: 9,
    dayEndHour: 12,
    hourHeight: 96,
    showSidebar: false,
    showNav: false,
    showSearch: false,
    showViewSelect: false,
    onAddEvent: undefined,
  },
};

export const ToggleSlots: Story = {
  tags: ['interaction', '!autodocs'],
  args: { ...SubHourSlots.args, onEventSelect: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const slots = canvas.getAllByRole('button', { name: /Offer/ });
    await expect(slots[0]).toHaveAttribute('aria-pressed', 'true');
    await expect(slots[2]).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(slots[2]);
    await expect(args.onEventSelect).toHaveBeenCalledWith(SLOT_EVENTS[2]);
  },
};
