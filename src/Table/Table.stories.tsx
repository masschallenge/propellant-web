import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Table, TableCard, TableCellStack, TableEmptyState, TableFooter } from './Table';
import type { TableColumn } from './Table';
import { Button } from '../Button/Button';
import { appearance, content, events, hide, state } from '../../.storybook/controls';

interface Startup {
  id: string;
  name: string;
  handle: string;
  stage: string;
  location: string;
  score: number;
}

const STARTUPS: Startup[] = [
  {
    id: 's1',
    name: 'Northwind Robotics',
    handle: 'northwind.io',
    stage: 'Series A',
    location: 'Boston, MA',
    score: 92,
  },
  {
    id: 's2',
    name: 'Verdant Bio',
    handle: 'verdant.bio',
    stage: 'Seed',
    location: 'Austin, TX',
    score: 88,
  },
  {
    id: 's3',
    name: 'Lumen Health',
    handle: 'lumenhealth.com',
    stage: 'Pre-seed',
    location: 'Toronto, ON',
    score: 74,
  },
  {
    id: 's4',
    name: 'Cobalt Freight',
    handle: 'cobaltfreight.com',
    stage: 'Series A',
    location: 'Chicago, IL',
    score: 81,
  },
];

const COLUMNS: TableColumn<Startup>[] = [
  {
    key: 'name',
    header: 'Startup',
    sortable: true,
    cell: (row) => <TableCellStack primary={row.name} secondary={row.handle} />,
  },
  { key: 'stage', header: 'Stage' },
  { key: 'location', header: 'Location' },
  { key: 'score', header: 'Score', align: 'right', sortable: true },
];

const meta = {
  title: 'Components/Data display/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Data grid with sortable headers, built-in row selection, two densities, zebra striping, and optional per-row actions.',
          'No outer border or shadow: the grid sits on a white surface (use `TableCard`) with hairline rows, a quiet header row, and tabular numerals in right aligned columns.',
          '',
          "Import: `import { Table } from '@masschallenge/propellant-web'`",
          '',
          'Companions: `TableCard` (header, toolbar, body and footer), `TableCellStack` (two line cell), `TableFooter` (pagination row), and `TableEmptyState` (empty or error body).',
        ].join('\n'),
      },
    },
  },
  args: {
    columns: COLUMNS,
    rows: STARTUPS,
    caption: 'Cohort startups by review score',
    size: 'md',
    zebra: false,
    divider: true,
    selectable: false,
    onSort: fn(),
    onSelectionChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'], ...appearance },
    zebra: { control: 'boolean', ...appearance },
    divider: { control: 'boolean', ...appearance },
    selectable: { control: 'boolean', ...state },
    caption: { control: 'text', ...content },
    sortKey: { control: 'text', ...state },
    sortDir: { control: 'inline-radio', options: ['ascending', 'descending'], ...state },
    onSort: { ...events },
    onSelectionChange: { ...events },
    columns: hide,
    rows: hide,
    selectedIds: hide,
    defaultSelectedIds: hide,
    rowId: hide,
    rowLabel: hide,
    rowActions: hide,
    className: hide,
  },
} satisfies Meta<typeof Table>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Zebra: Story = { args: { zebra: true, divider: false } };

export const Small: Story = { args: { size: 'sm' } };

export const Sorted: Story = { args: { sortKey: 'score', sortDir: 'descending' } };

export const WithRowActions: Story = {
  args: {
    rowActions: (row) => (
      <Button variant="plain" size="sm" aria-label={`Review ${(row as Startup).name}`}>
        Review
      </Button>
    ),
  },
};

export const Selectable: Story = {
  args: { selectable: true, rowLabel: (row) => (row as Startup).name },
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all rows' }));
    await expect(args.onSelectionChange).toHaveBeenCalledWith(['s1', 's2', 's3', 's4']);
    await expect(canvas.getByRole('checkbox', { name: 'Select all rows' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select Verdant Bio' }));
    await expect(canvas.getByRole('checkbox', { name: 'Select all rows' })).toHaveAttribute(
      'aria-checked',
      'mixed',
    );
  },
};

export const SortInteraction: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Score' }));
    await expect(args.onSort).toHaveBeenCalledWith('score');
  },
};

export const InCard: Story = {
  render: (args) => (
    <div style={{ padding: 24, maxWidth: 880 }}>
      <TableCard
        title="Cohort startups"
        count="4 startups"
        description="Review scores across the Boston 2026 cohort."
        actions={<Button variant="filled">Add startup</Button>}
        footer={<TableFooter page={1} pageCount={6} onPageChange={fn()} />}
      >
        <Table {...args} caption="Cohort startups by review score" />
      </TableCard>
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div style={{ padding: 24, maxWidth: 880 }}>
      <TableCard title="Cohort startups" description="Review scores across the Boston 2026 cohort.">
        <TableEmptyState
          tone="teal"
          title="No startups yet"
          description="Startups appear here once applications are accepted into the cohort."
          actions={<Button variant="filled">Add startup</Button>}
          ghostRows
        />
      </TableCard>
    </div>
  ),
};
