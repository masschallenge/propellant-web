import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Pagination } from './Pagination';
import { VStack } from '../../.storybook/stack';
import { appearance, content, events, hide, state } from '../../.storybook/controls';

const VARIANTS = ['numbers', 'simple', 'group', 'dots', 'lines'] as const;
const ALIGNS = ['between', 'left', 'center', 'right'] as const;
const FRAMES = ['page', 'card', 'none'] as const;

const meta = {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Page navigation for tables and lists: numbered pages, a simple status, a grouped capsule, and dot or line indicators. Previous and next are gray buttons, page numbers are plain, and the current page is a tint fill capsule.',
          'Optional controls add rows per page, a page jump field, and first and last buttons.',
          '',
          "Import: `import { Pagination } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    page: 3,
    pageCount: 10,
    variant: 'numbers',
    frame: 'page',
    align: 'between',
    onPageChange: fn(),
    onRowsPerPageChange: fn(),
  },
  argTypes: {
    page: { control: 'number', ...content },
    pageCount: { control: 'number', ...content },
    variant: { control: 'select', options: VARIANTS, ...appearance },
    frame: { control: 'inline-radio', options: FRAMES, ...appearance },
    align: { control: 'select', options: ALIGNS, ...appearance },
    soft: { control: 'boolean', ...state },
    showStatus: { control: 'boolean', ...state },
    pageJump: { control: 'boolean', ...state },
    firstLast: { control: 'boolean', ...state },
    rowsPerPage: { control: 'number', ...content },
    rowsPerPageLabel: { control: 'text', ...content },
    rowsPerPageOptions: { control: 'object', ...content },
    onPageChange: { ...events },
    onRowsPerPageChange: { ...events },
    className: hide,
  },
} satisfies Meta<typeof Pagination>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <VStack>
      {VARIANTS.map((variant) => (
        <Pagination key={variant} {...args} variant={variant} />
      ))}
    </VStack>
  ),
};

export const Alignments: Story = {
  render: (args) => (
    <VStack>
      {ALIGNS.map((align) => (
        <Pagination key={align} {...args} align={align} />
      ))}
    </VStack>
  ),
};

export const Frames: Story = {
  render: (args) => (
    <VStack>
      {FRAMES.map((frame) => (
        <Pagination key={frame} {...args} frame={frame} />
      ))}
    </VStack>
  ),
};

export const Soft: Story = { args: { soft: true } };
export const Simple: Story = { args: { variant: 'simple' } };
export const WithRowsPerPage: Story = {
  args: { rowsPerPage: 25, rowsPerPageLabel: 'Applications per page' },
};
export const Advanced: Story = { args: { rowsPerPage: 25, pageJump: true, firstLast: true } };

export const ChangePage: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Next page' }));
    await expect(args.onPageChange).toHaveBeenCalledWith(4);
  },
};

export const ChangeRowsPerPage: Story = {
  tags: ['interaction', '!autodocs'],
  args: { rowsPerPage: 25 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Rows per page, 25' }));
    await userEvent.click(canvas.getByRole('option', { name: '50 per page' }));
    await expect(args.onRowsPerPageChange).toHaveBeenCalledWith(50);
  },
};
