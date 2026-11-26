import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Textarea } from './Textarea';
import { IconButton } from '../IconButton/IconButton';
import { field } from '../../.storybook/stack';
import { appearance, content, hide, state } from '../../.storybook/controls';

const meta = {
  title: 'Components/Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  decorators: [field],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Multi-line text input with label, hint, and validation states. Without `rows` it keeps a minimum height for its size; with `rows`, the rows set the height, so `rows={2}` gives a short two line field.',
          '`accessory` sits at the bottom right inside the border, such as a dictation button, and the text keeps clear of it. `footer` is a full width bar inside the border under the text, such as a recording bar. Both share the field focus ring.',
          '',
          "Import: `import { Textarea } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { label: 'Notes for the panel', placeholder: 'Add a note for the other judges', rows: 4 },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'], ...appearance },
    emphasis: { control: 'inline-radio', options: ['default', 'strong'], ...appearance },
    rows: { control: 'number', ...appearance },
    required: { control: 'boolean', ...state },
    invalid: { control: 'boolean', ...state },
    disabled: { control: 'boolean', ...state },
    label: { control: 'text', ...content },
    hint: { control: 'text', ...content },
    hintEnd: { control: 'text', ...content },
    className: hide,
  },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Invalid: Story = {
  args: { invalid: true, hint: 'Add a note before you submit your scores.' },
};
export const Disabled: Story = { args: { disabled: true } };
export const WithCounter: Story = {
  args: { hint: 'Visible to the program team.', hintEnd: '0/7500', maxLength: 7500 },
};
export const StrongLabel: Story = {
  args: {
    label: 'Feedback for the founders',
    emphasis: 'strong',
    hint: 'Shared with the founding team.',
    hintEnd: '150 characters remaining',
  },
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    const label = within(canvasElement).getByText('Feedback for the founders');
    await expect(label).toHaveClass('font-semibold');
  },
};

export const TwoRows: Story = {
  args: {
    label: 'Guidance for evaluators',
    rows: 2,
    placeholder: 'What should evaluators look for?',
  },
};

const micGlyph = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
  </svg>
);

const stopGlyph = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <rect x="7" y="7" width="10" height="10" rx="2" />
  </svg>
);

const closeGlyph = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17 7 7 17M7 7l10 10" />
  </svg>
);

export const WithAccessory: Story = {
  args: {
    label: 'Feedback for the founders',
    rows: 4,
    accessory: (
      <IconButton variant="gray" shape="capsule" size="sm" aria-label="Dictate feedback">
        {micGlyph}
      </IconButton>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    label: 'Feedback for the founders',
    rows: 4,
    footer: (
      <div className="flex items-center gap-[var(--space-3)] px-[var(--space-3)] py-[var(--space-2)]">
        <span className="flex-1 h-[var(--space-4)] rounded-[var(--corner-sm)] bg-[var(--tint-fill)]" />
        <span className="text-footnote tabular-nums text-[var(--label-secondary)]">0:14</span>
        <IconButton size="sm" aria-label="Cancel dictation">
          {closeGlyph}
        </IconButton>
        <IconButton variant="filled" shape="capsule" size="sm" aria-label="Stop dictation">
          {stopGlyph}
        </IconButton>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Stop dictation' })).toBeVisible();
  },
};
