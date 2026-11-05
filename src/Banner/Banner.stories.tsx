import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Banner } from './Banner';
import { Button } from '../Button/Button';
import { VStack } from '../../.storybook/stack';
import { appearance, content, events, hide } from '../../.storybook/controls';

const TONES = ['neutral', 'info', 'success', 'warning', 'critical'] as const;

const meta = {
  title: 'Components/Feedback/Banner',
  component: Banner,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'An inline message about the page or a task on it. The tone sets a soft fill and a glyph, so the state never depends on color alone. Critical banners are announced as alerts, the rest as status. Use `full` for an edge-to-edge strip and `solid` (or the masquerade tone) for a strong bar such as impersonation.',
          '',
          "Import: `import { Banner } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    tone: 'info',
    title: 'Scoring opens Monday',
    children: 'Judges can start reviewing applications on Nov 18 at 9:00 AM.',
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: [...TONES, 'masquerade'],
      ...appearance,
    },
    full: { control: 'boolean', ...appearance },
    solid: { control: 'boolean', ...appearance },
    title: { control: 'text', ...content },
    children: { control: 'text', ...content },
    onDismiss: { ...events },
    actions: hide,
    icon: hide,
    className: hide,
  },
} satisfies Meta<typeof Banner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: (args) => (
    <VStack>
      {TONES.map((tone) => (
        <Banner key={tone} {...args} tone={tone} title={`${tone[0].toUpperCase()}${tone.slice(1)}`}>
          Judges can start reviewing applications on Nov 18 at 9:00 AM.
        </Banner>
      ))}
    </VStack>
  ),
};

export const WithActions: Story = {
  args: {
    tone: 'warning',
    title: 'Three applications need a second judge',
    children: 'Scores stay private until every application has two judges.',
    actions: (
      <>
        <Button size="sm" variant="tinted">
          Assign judges
        </Button>
        <Button size="sm" variant="plain">
          Remind me later
        </Button>
      </>
    ),
  },
};

export const FullWidth: Story = {
  args: {
    full: true,
    tone: 'masquerade',
    title: 'Viewing as Ada Lovelace, applicant',
    children: undefined,
    actions: (
      <Button size="sm" variant="gray">
        Stop viewing
      </Button>
    ),
  },
};

export const Dismissible: Story = {
  args: { onDismiss: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Dismiss' }));
    await expect(args.onDismiss).toHaveBeenCalledTimes(1);
  },
};
