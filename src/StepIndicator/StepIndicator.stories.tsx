import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { StepIndicator } from './StepIndicator';
import { VStack } from '../../.storybook/stack';
import { appearance, content, events, hide, state } from '../../.storybook/controls';

const STEPS = [
  { id: 'start', label: 'Start' },
  { id: 'stages', label: 'Stages' },
  { id: 'team', label: 'Team' },
  { id: 'review', label: 'Review' },
];

const COMPACT = ['auto', 'always', 'never'] as const;

const meta = {
  title: 'Components/Navigation/StepIndicator',
  component: StepIndicator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Shows where a person is in a short multi-step flow, such as a modal that creates a program. The current step is a pill with a filled number, finished steps carry a check, and steps still to come are muted.',
          'Pass `onStepSelect` to let people go back to a finished step. By default steps ahead are not selectable; pass `isStepReachable` to allow a step ahead that the person has already reached, which shows as visited. Below the small breakpoint, `compact="auto"` swaps the list for "Step 2 of 4 · Stages".',
          '',
          "Import: `import { StepIndicator } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { steps: STEPS, currentIndex: 1, compact: 'never', label: 'Steps' },
  argTypes: {
    currentIndex: { control: { type: 'number', min: 0, max: 3 }, ...state },
    compact: { control: 'inline-radio', options: COMPACT, ...appearance },
    label: { control: 'text', ...content },
    steps: hide,
    onStepSelect: { ...events, control: false },
    isStepReachable: hide,
    className: hide,
  },
} satisfies Meta<typeof StepIndicator>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Progress: Story = {
  render: (args) => (
    <VStack>
      {STEPS.map((step, index) => (
        <StepIndicator key={step.id} {...args} currentIndex={index} />
      ))}
    </VStack>
  ),
};

export const Compact: Story = {
  args: { compact: 'always', currentIndex: 1 },
};

const ChoosableSteps = () => {
  const [currentIndex, setCurrentIndex] = React.useState(3);
  return (
    <StepIndicator
      steps={STEPS}
      currentIndex={currentIndex}
      onStepSelect={setCurrentIndex}
      compact="never"
    />
  );
};

export const BackToAFinishedStep: Story = {
  render: () => <ChoosableSteps />,
};

const ReturnToVisitedSteps = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const furthestReached = 3;
  return (
    <StepIndicator
      steps={STEPS}
      currentIndex={currentIndex}
      onStepSelect={setCurrentIndex}
      isStepReachable={(index) => index <= furthestReached}
      compact="never"
    />
  );
};

export const ForwardToAVisitedStep: Story = {
  render: () => <ReturnToVisitedSteps />,
};

const handleStepSelect = fn();

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  args: { currentIndex: 2, onStepSelect: handleStepSelect },
  play: async ({ canvasElement }) => {
    handleStepSelect.mockClear();
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Start (done)' }));
    await expect(handleStepSelect).toHaveBeenCalledWith(0);
  },
};
