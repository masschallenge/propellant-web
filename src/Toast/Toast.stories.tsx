import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Toast } from './Toast';
import { VStack } from '../../.storybook/stack';
import { appearance, content, events, hide } from '../../.storybook/controls';

const TONES = ['default', 'gray', 'brand', 'success', 'warning', 'error'] as const;

const TONE_TITLES: Record<(typeof TONES)[number], string> = {
  default: 'Draft saved',
  gray: 'Sync paused',
  brand: 'New judge comment',
  success: 'Cohort published',
  warning: 'Two panels are short a judge',
  error: 'Schedule could not be generated',
};

const meta = {
  title: 'Components/Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Floating notification card on the elevated surface. Six tones shown as a plain status glyph, a timestamp, action links, an upload progress bar, custom leading media, and a dismiss button.',
          '',
          "Import: `import { Toast } from '@masschallenge/propellant-web'`",
          '',
          'Accessibility: `error` renders `role="alert"`, every other tone `role="status"`. Renders in place; a stack manager handles portalling and auto-dismiss.',
        ].join('\n'),
      },
    },
  },
  args: {
    title: 'Round 2 schedule saved',
    children: 'Judges will see their new panel times right away.',
    tone: 'default',
    onDismiss: fn(),
  },
  argTypes: {
    tone: { control: 'select', options: TONES, ...appearance },
    title: { control: 'text', ...content },
    children: { control: 'text', ...content },
    when: { control: 'text', ...content },
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 }, ...content },
    onDismiss: { ...events },
    actions: hide,
    media: hide,
    progressLabel: hide,
    className: hide,
  },
} satisfies Meta<typeof Toast>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: (args) => (
    <VStack>
      {TONES.map((tone) => (
        <Toast key={tone} {...args} tone={tone} title={TONE_TITLES[tone]} />
      ))}
    </VStack>
  ),
};

export const WithActions: Story = {
  args: {
    tone: 'brand',
    title: 'New judge comment',
    actions: [
      { label: 'Reply', onClick: fn() },
      { label: 'Mark as read', muted: true, onClick: fn() },
    ],
  },
};

export const WithTimestamp: Story = { args: { when: '2 minutes ago' } };

export const WithProgress: Story = {
  args: {
    title: 'Uploading pitch-deck.pdf',
    children: undefined,
    progress: 62,
    progressLabel: 'Upload progress',
  },
};

export const Dismiss: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Dismiss notification' }),
    );
    await expect(args.onDismiss).toHaveBeenCalledTimes(1);
  },
};
