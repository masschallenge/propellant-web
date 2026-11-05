import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { RadioCardGroup, type RadioCardOption } from './RadioCardGroup';
import { appearance, content, events, hide } from '../../.storybook/controls';

const boxed = (Story: React.ComponentType) => (
  <div style={{ width: 'min(440px, 100%)' }}>
    <Story />
  </div>
);

const bolt = (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
  </svg>
);

const PLAN_OPTIONS: RadioCardOption[] = [
  {
    value: 'in-person',
    title: 'In person',
    hint: 'Judge at the Boston office on demo day',
    price: '4 slots',
    icon: bolt,
  },
  {
    value: 'remote',
    title: 'Remote',
    hint: 'Score pitches from the recorded sessions',
    price: '12 slots',
    icon: bolt,
  },
  {
    value: 'either',
    title: 'Either',
    hint: 'Place me wherever the round needs judges',
    price: 'Flexible',
    icon: bolt,
    badge: 'Most helpful',
  },
];

const CARD_OPTIONS: RadioCardOption[] = [
  {
    value: 'gold',
    title: 'Gold track',
    price: '$100K',
    per: 'equity-free award',
    hint: 'For startups ready to raise their next round',
    icon: bolt,
  },
  {
    value: 'silver',
    title: 'Silver track',
    price: '$50K',
    per: 'equity-free award',
    hint: 'For startups still proving early traction',
    icon: bolt,
    badge: 'Open now',
  },
];

const PAYMENT_OPTIONS: RadioCardOption[] = [
  {
    value: 'google',
    title: 'Google Calendar',
    hint: 'judge@example.com',
    mark: 'G',
    links: [
      { label: 'Edit', onClick: fn() },
      { label: 'Disconnect', onClick: fn() },
    ],
  },
  {
    value: 'outlook',
    title: 'Outlook',
    hint: 'mentor@example.com',
    mark: 'O',
    links: [
      { label: 'Edit', onClick: fn() },
      { label: 'Disconnect', onClick: fn() },
    ],
  },
];

const meta = {
  title: 'Components/Inputs/RadioCardGroup',
  component: RadioCardGroup,
  tags: ['autodocs'],
  decorators: [boxed],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Selectable cards with single (radio) or multiple (checkbox) semantics, row or tall card layout, and icon, avatar, mark, and badge treatments.',
          '',
          "Import: `import { RadioCardGroup } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    options: PLAN_OPTIONS,
    defaultValue: 'remote',
    legend: 'How would you like to judge?',
    selectionMode: 'single',
    control: 'auto',
    layout: 'row',
    controlOnRight: false,
    onChange: fn(),
  },
  argTypes: {
    selectionMode: { control: 'inline-radio', options: ['single', 'multiple'], ...appearance },
    control: { control: 'inline-radio', options: ['auto', 'check', 'radio'], ...appearance },
    layout: { control: 'inline-radio', options: ['row', 'card', 'tile'], ...appearance },
    emphasis: { control: 'inline-radio', options: ['default', 'strong'], ...appearance },
    controlOnRight: { control: 'boolean', ...appearance },
    legend: { control: 'text', ...content },
    onChange: { ...events },
    options: hide,
    value: hide,
    defaultValue: hide,
    className: hide,
  },
} satisfies Meta<typeof RadioCardGroup>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Card: Story = {
  args: { options: CARD_OPTIONS, layout: 'card', defaultValue: 'silver', legend: 'Program track' },
};

export const Multiple: Story = {
  args: {
    selectionMode: 'multiple',
    defaultValue: ['remote'],
    legend: 'Formats you can judge',
    controlOnRight: true,
  },
};

export const Payment: Story = {
  args: {
    options: PAYMENT_OPTIONS,
    defaultValue: 'google',
    control: 'radio',
    controlOnRight: true,
    legend: 'Calendar for round invites',
  },
};

export const WithDisabledOption: Story = {
  args: {
    options: [PLAN_OPTIONS[0], { ...PLAN_OPTIONS[1], disabled: true }, PLAN_OPTIONS[2]],
    defaultValue: 'in-person',
  },
};

const SCORE_OPTIONS = [
  { value: '1', title: '1', hint: 'Not evidenced', ariaLabel: '1 Not evidenced' },
  { value: '2', title: '2', hint: 'Thin evidence', ariaLabel: '2 Thin evidence' },
  { value: '3', title: '3', ariaLabel: '3' },
  { value: '4', title: '4', hint: 'Solid', ariaLabel: '4 Solid' },
  { value: '5', title: '5', hint: 'Exceptional', ariaLabel: '5 Exceptional' },
  {
    value: 'na',
    title: 'N/A',
    hint: 'Not applicable',
    ariaLabel: 'N/A Not applicable',
    distinct: true,
  },
];

export const Tiles: Story = {
  args: {
    options: SCORE_OPTIONS,
    layout: 'tile',
    legend: 'Problem',
    description: 'Whose problem this is and what it costs them today.',
    defaultValue: '4',
  },
};

export const TilesWithError: Story = {
  args: {
    options: SCORE_OPTIONS,
    layout: 'tile',
    legend: 'Problem',
    error: 'Score this criterion.',
  },
};

export const StrongTiles: Story = {
  args: {
    options: SCORE_OPTIONS,
    layout: 'tile',
    emphasis: 'strong',
    legend: 'Problem',
    description: 'Whose problem this is and what it costs them today.',
    defaultValue: '4',
  },
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Problem')).toHaveClass('font-semibold');
    await expect(
      canvas.getByText('Whose problem this is and what it costs them today.'),
    ).toHaveClass('font-medium');
  },
};

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Either'));
    await expect(args.onChange).toHaveBeenCalledWith('either');
  },
};
