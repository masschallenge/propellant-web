import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Skeleton, SkeletonGroup } from './Skeleton';
import { appearance, hide } from '../../.storybook/controls';

const SHAPES = ['text', 'heading', 'pill', 'block', 'circle'] as const;

const meta = {
  title: 'Components/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Loading placeholder shaped like the content that is coming, so nothing jumps when it arrives.',
          '',
          "Import: `import { Skeleton, SkeletonGroup } from '@masschallenge/propellant-web'`",
          '',
          'Wrap bones in `SkeletonGroup`: one `role="status"` with a visually hidden label beside an `aria-busy` region of bones. The pulse stops under `prefers-reduced-motion`.',
        ].join('\n'),
      },
    },
  },
  args: { shape: 'text' },
  argTypes: {
    shape: { control: 'inline-radio', options: SHAPES, ...appearance },
    width: { control: 'text', ...appearance },
    height: { control: 'text', ...appearance },
    className: hide,
  },
} satisfies Meta<typeof Skeleton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const PageShape: Story = {
  render: () => (
    <SkeletonGroup label="Loading your schedule" className="flex flex-col gap-5">
      <Skeleton shape="heading" width="40%" />
      <Skeleton width="60%" />
      <div className="flex gap-2">
        <Skeleton shape="pill" width="30%" />
        <Skeleton shape="pill" width="30%" />
      </div>
      <Skeleton shape="block" height="8rem" />
      <Skeleton shape="block" height="8rem" />
    </SkeletonGroup>
  ),
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status');
    await expect(status.closest('[aria-busy]')).toBeNull();
    await expect(status.nextElementSibling).toHaveAttribute('aria-busy', 'true');
    await expect(status).toHaveTextContent('Loading your schedule');
  },
};
