import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  FilterBar,
  FilterSelect,
  FilterPopover,
  FilterConditions,
  FilterDrawer,
} from './FilterBar';
import { Button } from '../Button/Button';
import { content, events, hide, state } from '../../.storybook/controls';

const TABS = [
  { id: 'all', label: 'All applicants', count: 128 },
  { id: 'shortlist', label: 'Shortlist', count: 24 },
  { id: 'flagged', label: 'Flagged', count: 3 },
];
const SEGMENTS = [
  { id: '12m', label: '12 months' },
  { id: '30d', label: '30 days' },
  { id: '7d', label: '7 days' },
];
const QUICK_CHIPS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week', active: true },
];
const CHIPS = [
  { id: 'round', label: 'Round', menu: true },
  { id: 'cohort', label: 'Cohort', count: 2, active: true },
];
const STATUS_OPTIONS = [
  { value: 'advancing', label: 'Advancing', dot: 'var(--success-solid)' },
  { value: 'review', label: 'In review', dot: 'var(--warning-solid)' },
  { value: 'declined', label: 'Declined' },
];
const CONDITIONS = [
  { field: 'Cohort', operator: 'Equals', value: 'Climate' },
  { field: 'Stage', operator: 'Contains', value: 'Seed' },
];

const meta = {
  title: 'Components/Navigation/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Single row toolbar for lists: a capsule search field, tabs, a segmented range, quick tokens, filter buttons, and right aligned actions. Scrolls horizontally with edge fades on overflow.',
          '',
          "Import: `import { FilterBar } from '@masschallenge/propellant-web'`",
          '',
          'Companions: `FilterButton` (toolbar button on the Button variants), `FilterSelect` (labelled pop-up on the field shell), `FilterPopover` (attached checklist popover), `FilterConditions` (advanced where and builder), and `FilterDrawer` (an Inspector with the condition builder).',
        ].join('\n'),
      },
    },
  },
  args: {
    searchPlaceholder: 'Search applicants',
    onSearchChange: fn(),
    onTabChange: fn(),
    onSegmentChange: fn(),
    onClear: fn(),
  },
  argTypes: {
    searchPlaceholder: { control: 'text', ...content },
    searchValue: { control: 'text', ...content },
    shortcut: { control: 'text', ...content },
    hideSearch: { control: 'boolean', ...state },
    tabs: { control: 'object', ...content },
    tabValue: { control: 'text', ...state },
    segments: { control: 'object', ...content },
    segmentValue: { control: 'text', ...state },
    quickChips: { control: 'object', ...content },
    chips: { control: 'object', ...content },
    clearLabel: { control: 'text', ...content },
    clearActive: { control: 'boolean', ...state },
    onSearchChange: { ...events },
    onTabChange: { ...events },
    onSegmentChange: { ...events },
    onClear: { ...events },
    children: hide,
    actions: hide,
    className: hide,
  },
} satisfies Meta<typeof FilterBar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithTabs: Story = { args: { tabs: TABS, tabValue: 'all' } };

export const WithSegments: Story = { args: { segments: SEGMENTS, segmentValue: '30d' } };

export const WithQuickChips: Story = { args: { quickChips: QUICK_CHIPS } };

export const WithChips: Story = { args: { chips: CHIPS } };

export const WithClear: Story = { args: { chips: CHIPS, clearActive: true } };

export const Composition: Story = {
  render: (args) => (
    <FilterBar
      {...args}
      tabs={TABS}
      tabValue="all"
      actions={
        <>
          <FilterSelect label="Status" options={STATUS_OPTIONS} value="advancing" />
          <FilterPopover
            label="Filters"
            options={[
              { id: 'climate', label: 'Climate', count: 42, checked: true },
              { id: 'health', label: 'Healthcare', count: 31 },
            ]}
          />
          <Button size="md">Export</Button>
        </>
      }
    />
  ),
};

export const AdvancedConditions: Story = {
  render: () => (
    <div className="p-4">
      <FilterConditions
        rows={CONDITIONS}
        fieldOptions={['Cohort', 'Stage', 'Status']}
        onChange={fn()}
        onAdd={fn()}
        onApply={fn()}
        onClear={fn()}
        clearActive
      />
    </div>
  ),
};

const DrawerDemo = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative min-h-96 p-4 overflow-hidden">
      <Button onClick={() => setOpen(true)}>Open filters</Button>
      <FilterDrawer
        inline
        open={open}
        onClose={() => setOpen(false)}
        description="2 conditions applied"
        rows={CONDITIONS}
        onRowsChange={fn()}
        onApply={fn()}
        onClear={fn()}
      />
    </div>
  );
};

export const Drawer: Story = {
  tags: ['interaction', '!autodocs'],
  render: () => <DrawerDemo />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open filters' }));
    const dialog = await within(canvasElement).findByRole('dialog');
    await expect(dialog).toBeVisible();
    await userEvent.keyboard('{Escape}');
  },
};

export const SearchTyping: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole('searchbox'), 'vitala');
    await expect(args.onSearchChange).toHaveBeenCalled();
  },
};
