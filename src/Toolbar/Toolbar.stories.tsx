import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toolbar } from './Toolbar';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { SearchField } from '../SearchField/SearchField';
import { icons } from '../../.storybook/icons';
import { content, hide, state } from '../../.storybook/controls';

const meta = {
  title: 'Components/Layout/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'The bar across the top of the content column, on the translucent bar material. Leading content names the context (a program picker or a title), trailing content holds the few commands that act on the whole page, and an optional accessory row carries a scope control such as the program stage. Inside an AppShell with a sidebar it adds the sidebar toggle.',
          '',
          "Import: `import { Toolbar } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { title: 'Round 1', sticky: true },
  argTypes: {
    title: { control: 'text', ...content },
    sticky: { control: 'boolean', ...state },
    leading: hide,
    trailing: hide,
    accessory: hide,
    sidebarToggleLabel: hide,
    className: hide,
  },
} satisfies Meta<typeof Toolbar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithCommands: Story = {
  args: {
    title: undefined,
    leading: (
      <Button variant="plain" size="sm" iconTrailing={icons.chevron}>
        Boston 2026
      </Button>
    ),
    trailing: (
      <>
        <SearchField aria-label="Search startups" size="sm" className="w-40" />
        <IconButton aria-label="Add judge">{icons.plus}</IconButton>
        <Button size="sm">Open round</Button>
      </>
    ),
    accessory: (
      <SegmentedControl
        aria-label="Program stage"
        size="sm"
        defaultValue="review"
        items={[
          { id: 'applications', label: 'Applications' },
          { id: 'review', label: 'Review' },
          { id: 'pitch-day', label: 'Pitch day' },
        ]}
      />
    ),
  },
};
