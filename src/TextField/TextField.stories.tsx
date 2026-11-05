import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { TextField } from './TextField';
import { field, VStack } from '../../.storybook/stack';
import { appearance, content, hide, state } from '../../.storybook/controls';

const SIZES = ['sm', 'md', 'lg'] as const;

const meta = {
  title: 'Components/Inputs/TextField',
  component: TextField,
  tags: ['autodocs'],
  decorators: [field],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Single-line text input with label, hint, icons, addons, password toggle, stepper, tags, and file upload.',
          '',
          "Import: `import { TextField } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { label: 'Work email', placeholder: 'judge@example.com', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES, ...appearance },
    emphasis: { control: 'inline-radio', options: ['default', 'strong'], ...appearance },
    required: { control: 'boolean', ...state },
    invalid: { control: 'boolean', ...state },
    disabled: { control: 'boolean', ...state },
    passwordToggle: { control: 'boolean', ...appearance },
    label: { control: 'text', ...content },
    hint: { control: 'text', ...content },
    hintEnd: { control: 'text', ...content },
    className: hide,
  },
} satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Sizes: Story = {
  render: (args) => (
    <VStack>
      {SIZES.map((size) => (
        <TextField
          key={size}
          {...args}
          size={size}
          label={{ sm: 'Small', md: 'Medium', lg: 'Large' }[size]}
        />
      ))}
    </VStack>
  ),
};
export const Invalid: Story = {
  args: { invalid: true, hint: 'Enter an email address like judge@example.com.' },
};
export const WithHint: Story = {
  args: { hint: 'We send round reminders to this address.' },
};
export const Disabled: Story = { args: { disabled: true } };
export const Password: Story = {
  args: { label: 'Password', passwordToggle: true, type: 'password', placeholder: '' },
};
const PanelCountStepper = () => {
  const [panels, setPanels] = React.useState('1');
  return (
    <TextField
      label="Morning panels"
      hint="From 0 to 10."
      type="number"
      min={0}
      max={10}
      stepper="horizontal"
      decrementLabel="Fewer Morning panels"
      incrementLabel="More Morning panels"
      value={panels}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPanels(event.target.value)}
    />
  );
};

export const Stepper: Story = { render: () => <PanelCountStepper /> };

const CohortTags = () => {
  const [industries, setIndustries] = React.useState(['Fintech', 'Climate']);
  return (
    <TextField
      label="Cohort industries"
      hint="Press Enter to add an industry."
      placeholder="Add an industry"
      tags={industries}
      onTagsChange={setIndustries}
    />
  );
};

export const Tags: Story = {
  render: () => <CohortTags />,
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Cohort industries' });
    await userEvent.type(input, 'Health{Enter}');
    await expect(canvas.getByText('Health')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Fintech' }));
    await expect(canvas.queryByText('Fintech')).not.toBeInTheDocument();
  },
};

export const Addons: Story = {
  render: () => (
    <VStack>
      <TextField label="Company website" leadingAddon="https://" placeholder="acme.com" />
      <TextField label="Ask amount" trailingAddon="USD" placeholder="250,000" />
      <TextField label="Pitch deck" fileUpload />
    </VStack>
  ),
};
export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox');
    await userEvent.type(input, 'judge@example.com');
    await expect(input).toHaveValue('judge@example.com');
  },
};
export const StrongLabelWithCounter: Story = {
  args: {
    label: 'What does your startup do?',
    emphasis: 'strong',
    hint: 'One line, plain language.',
    hintEnd: '0/80 characters',
  },
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('What does your startup do?')).toHaveClass('font-semibold');
    await expect(
      canvas.getByRole('textbox', { name: 'What does your startup do?' }),
    ).toHaveAccessibleDescription('One line, plain language. 0/80 characters');
  },
};
