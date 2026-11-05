import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageContainer } from './PageContainer';
import { appearance, hide } from '../../.storybook/controls';

const Sample = () => (
  <div className="rounded-[var(--corner-md)] bg-[var(--bg)] p-6 text-[var(--label-secondary)]">
    <h2 className="m-0 text-lg font-bold text-[var(--label)]">Content column</h2>
    <p className="mt-2 text-sm">
      The container centers page content, caps its width, and keeps a consistent side gutter that
      grows at wider breakpoints.
    </p>
  </div>
);

const meta = {
  title: 'Components/Layout/PageContainer',
  component: PageContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Centered content column: 960px by default, the page width token (`--width-page`, 1280px) when wide, or full width. Children stack with a 24px gap. The side gutter comes from the surrounding shell (`--page-margin`).',
          '',
          "Import: `import { PageContainer } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    size: 'default',
    children: <Sample />,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['default', 'wide', 'full'], ...appearance },
    as: hide,
    children: hide,
    className: hide,
  },
} satisfies Meta<typeof PageContainer>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Wide: Story = { args: { size: 'wide' } };

export const Full: Story = { args: { size: 'full' } };
