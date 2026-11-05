import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DatePicker } from './DatePicker';
import { appearance, content, events, hide, state } from '../../.storybook/controls';

const meta = {
  title: 'Components/Inputs/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Calendar date picker with optional presets, range, dual month, and time slots. Portals its dialog.',
          '',
          "Import: `import { DatePicker } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
      story: { height: '480px' },
    },
  },
  args: { label: 'Demo day', placeholder: 'Select date', onChange: fn() },
  argTypes: {
    withFooter: { control: 'boolean', ...appearance },
    dualMonth: { control: 'boolean', ...appearance },
    inline: { control: 'boolean', ...appearance },
    clearable: { control: 'boolean', ...appearance },
    hideLabel: { control: 'boolean', ...appearance },
    disabled: { control: 'boolean', ...state },
    invalid: { control: 'boolean', ...state },
    required: { control: 'boolean', ...state },
    label: { control: 'text', ...content },
    hint: { control: 'text', ...content },
    min: { control: 'text', ...content },
    max: { control: 'text', ...content },
    onChange: { ...events },
    className: hide,
  },
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Inline: Story = { args: { inline: true, withFooter: true } };
export const Range: Story = {
  args: { inline: true, dualMonth: true, defaultValue: undefined, onRangeChange: fn() },
};
export const Disabled: Story = { args: { disabled: true } };
export const Clearable: Story = {
  args: { label: 'Window start', defaultValue: '2026-07-15', clearable: true, required: true },
};
export const WithHint: Story = {
  args: {
    label: 'Window start',
    defaultValue: '2026-07-15',
    hint: 'Round timezone: America/New_York',
  },
};
export const Invalid: Story = {
  args: {
    label: 'Window end',
    defaultValue: '2026-07-10',
    invalid: true,
    hint: 'Window end must be on or after the window start',
  },
};
export const MinMax: Story = {
  args: { inline: true, defaultValue: '2026-07-15', min: '2026-07-08', max: '2026-07-24' },
};
export const TimeSlots: Story = {
  args: {
    label: 'Judging session',
    inline: true,
    defaultValue: '2026-11-12',
    timeSlots: ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM'],
    defaultTimeValue: '10:30 AM',
    timeSlotsLabel: 'Open slots',
  },
};
export const PickADay: Story = {
  tags: ['interaction', '!autodocs'],
  args: { label: 'Demo day', defaultValue: '2026-11-12' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('combobox', { name: /Demo day/ }));
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(await page.findByRole('button', { name: 'November 19, 2026' }));
    await expect(args.onChange).toHaveBeenCalledWith('2026-11-19');
  },
};
