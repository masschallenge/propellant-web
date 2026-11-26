import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ScoreScale, type ScoreScaleValue } from './ScoreScale';
import { appearance, content, events, hide, state } from '../../.storybook/controls';

const meta = {
  title: 'Components/Inputs/ScoreScale',
  component: ScoreScale,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A single choice from a row of numbers, min to max, with an optional N/A. Each score is a square that fills with the tint when chosen. Captions under the row name the ends of the scale: the low one starts under the first square and the high one ends under the last number, not under N/A.',
          'The squares are native radios in a `radiogroup`, so the arrow keys move the choice. Name the group with `aria-labelledby` or `aria-label`.',
          '',
          "Import: `import { ScoreScale } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    min: 1,
    max: 5,
    allowNotApplicable: true,
    lowLabel: '1 · No proof yet',
    highLabel: '5 · Peer reviewed',
    'aria-label': 'Clinical evidence',
    onChange: fn(),
  },
  argTypes: {
    min: { control: 'number', ...appearance },
    max: { control: 'number', ...appearance },
    allowNotApplicable: { control: 'boolean', ...appearance },
    disabled: { control: 'boolean', ...state },
    notApplicableLabel: { control: 'text', ...content },
    lowLabel: { control: 'text', ...content },
    highLabel: { control: 'text', ...content },
    onChange: { ...events },
    value: hide,
    defaultValue: hide,
    className: hide,
  },
} satisfies Meta<typeof ScoreScale>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Selected: Story = {
  args: { defaultValue: 4 },
};

export const NotApplicableSelected: Story = {
  args: { defaultValue: 'not-applicable' },
};

export const TenPoint: Story = {
  args: { min: 1, max: 10, lowLabel: '1 · Weak', highLabel: '10 · Exceptional', defaultValue: 7 },
};

export const WithoutCaptions: Story = {
  args: { lowLabel: undefined, highLabel: undefined, allowNotApplicable: false },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 3 },
};

const ControlledScale = () => {
  const [score, setScore] = React.useState<ScoreScaleValue | null>(null);
  return (
    <div className="grid gap-[var(--space-2)]">
      <span id="criterion-label" className="text-callout font-semibold text-[var(--label)]">
        Clinical evidence
      </span>
      <ScoreScale
        min={1}
        max={5}
        value={score}
        onChange={setScore}
        allowNotApplicable
        lowLabel="1 · No proof yet"
        highLabel="5 · Peer reviewed"
        aria-labelledby="criterion-label"
      />
    </div>
  );
};

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  render: () => <ControlledScale />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radiogroup', { name: 'Clinical evidence' })).toBeVisible();
    await userEvent.click(canvas.getByText('2'));
    await expect(canvas.getByRole('radio', { name: '2' })).toBeChecked();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('radio', { name: '3' })).toBeChecked();
    await userEvent.click(canvas.getByText('N/A'));
    await expect(canvas.getByRole('radio', { name: 'N/A' })).toBeChecked();
  },
};
