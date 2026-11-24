import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { LoadOnScroll } from './LoadOnScroll';
import { ListRow, ListSection } from '../List/List';
import { hide } from '../../.storybook/controls';

const PAGE_SIZE = 12;
const TOTAL_STARTUPS = 36;

const startupName = (index: number) => `Startup ${String(index + 1).padStart(2, '0')}`;

const StartupList = ({ loadDelay = 400 }: { loadDelay?: number }) => {
  const [loadedCount, setLoadedCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const loadNextPage = () => {
    setIsLoading(true);
    window.setTimeout(() => {
      setLoadedCount((count) => Math.min(count + PAGE_SIZE, TOTAL_STARTUPS));
      setIsLoading(false);
    }, loadDelay);
  };
  return (
    <div
      data-testid="startup-scroller"
      className="h-[360px] w-[min(480px,100%)] overflow-y-auto rounded-[var(--corner-lg)] bg-[var(--bg-grouped)] p-4"
    >
      <ListSection title="Applications">
        {Array.from({ length: loadedCount }, (_unused, index) => (
          <ListRow key={index} title={startupName(index)} value="Submitted" />
        ))}
      </ListSection>
      <LoadOnScroll
        hasMore={loadedCount < TOTAL_STARTUPS}
        isLoading={isLoading}
        onLoadMore={loadNextPage}
        loadingLabel="Loading more applications"
      />
    </div>
  );
};

const meta = {
  title: 'Components/Feedback/LoadOnScroll',
  component: LoadOnScroll,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Loads the next page of a long working list as the end of it scrolls into view, with placeholder rows while the page comes. There is no Load more button. Put it right after the list; it watches a line at the end and calls `onLoadMore` once that line comes within `rootMargin` of the viewport.',
          'Use it for long lists people work through in the console. Public pages and very large result sets that people jump around in keep `Pagination`.',
          '',
          "Import: `import { LoadOnScroll } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { hasMore: true, isLoading: true, placeholderRows: 3 },
  argTypes: {
    onLoadMore: hide,
    className: hide,
  },
} satisfies Meta<typeof LoadOnScroll>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {};

export const WorkingList: Story = {
  render: () => <StartupList />,
};

export const LoadsAsYouScroll: Story = {
  tags: ['interaction', '!autodocs'],
  render: () => <StartupList loadDelay={50} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText(/^Startup \d+$/)).toHaveLength(PAGE_SIZE);
    const scroller = canvas.getByTestId('startup-scroller');
    scroller.scrollTop = scroller.scrollHeight;
    await waitFor(() => expect(canvas.getAllByText(/^Startup \d+$/)).toHaveLength(PAGE_SIZE * 2));
    scroller.scrollTop = scroller.scrollHeight;
    await waitFor(() => expect(canvas.getAllByText(/^Startup \d+$/)).toHaveLength(TOTAL_STARTUPS));
    await expect(canvas.queryByRole('button', { name: /load more/i })).toBeNull();
  },
};
