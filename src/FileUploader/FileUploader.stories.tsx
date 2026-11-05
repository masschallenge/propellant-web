import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { FileUploader, FileRow } from './FileUploader';
import { field, VStack } from '../../.storybook/stack';
import { appearance, content, events, hide, state } from '../../.storybook/controls';

const meta = {
  title: 'Components/Inputs/FileUploader',
  component: FileUploader,
  tags: ['autodocs'],
  decorators: [field],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Drop zone that accepts files by drag-and-drop or the browse link, with disabled and error tones.',
          '',
          "Import: `import { FileUploader, FileRow } from '@masschallenge/propellant-web'`",
          '',
          'Companion: `FileRow` renders an uploaded or in-progress file with status, progress, a type badge, and retry/remove controls.',
        ].join('\n'),
      },
    },
  },
  args: {
    label: 'Drag and drop files here, or',
    ctaLabel: 'browse',
    hint: 'PDF, DOCX or PNG up to 10 MB',
    multiple: false,
    disabled: false,
    error: false,
    onFiles: fn(),
  },
  argTypes: {
    accept: { control: 'text', ...appearance },
    multiple: { control: 'boolean', ...appearance },
    disabled: { control: 'boolean', ...state },
    error: { control: 'boolean', ...state },
    label: { control: 'text', ...content },
    ctaLabel: { control: 'text', ...content },
    hint: { control: 'text', ...content },
    onFiles: { ...events },
    className: hide,
  },
} satisfies Meta<typeof FileUploader>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Disabled: Story = { args: { disabled: true } };

export const Error: Story = {
  args: { error: true, hint: 'This pitch deck is larger than the 10 MB limit.' },
};

export const Multiple: Story = {
  args: { multiple: true, hint: 'Add your pitch deck and any supporting documents.' },
};

export const WithFiles: Story = {
  render: (args) => (
    <VStack>
      <FileUploader {...args} />
      <FileRow
        name="pitch-deck.pdf"
        meta="2.4 MB, PDF"
        badge={{ text: 'PDF', tone: 'danger' }}
        onRemove={fn()}
      />
      <FileRow
        name="financial-model.xlsx"
        meta="8.1 MB"
        status="uploading"
        progress={62}
        progressStyle="bar"
      />
      <FileRow
        name="team-photo.png"
        meta="1.2 MB"
        status="failed"
        badge={{ text: 'PNG', tone: 'brand' }}
        onRetry={fn()}
        onRemove={fn()}
      />
    </VStack>
  ),
};

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['hello'], 'notes.pdf', { type: 'application/pdf' });
    await userEvent.upload(input, file);
    await expect(args.onFiles).toHaveBeenCalled();
  },
};
