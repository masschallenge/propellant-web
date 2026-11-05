import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActivityFeed } from './ActivityFeed';
import { field } from '../../.storybook/stack';
import { appearance, content, hide } from '../../.storybook/controls';

const VARIANTS = ['divided', 'connected', 'spaced'] as const;

const ACTIVITY = [
  {
    id: 'a1',
    name: 'Amara Okafor',
    action: 'submitted an application to Boston 2026',
    when: '2 hours ago',
    initials: 'AO',
    online: true,
  },
  {
    id: 'a2',
    name: 'Lena Brandt',
    action: 'scored a round 1 application',
    when: 'Yesterday',
    initials: 'LB',
    neutral: true,
    detail: 'Strong traction, needs a clearer go-to-market plan.',
  },
  {
    id: 'a3',
    name: 'Diego Ramos',
    action: 'booked mentor office hours',
    when: '2 days ago',
    initials: 'DR',
    unread: true,
  },
];

const MESSAGES = [
  {
    id: 'm1',
    name: 'Priya Nair',
    handle: '@priya',
    message: 'Pitch deck is updated for round 2, ready when you are.',
    when: '9:41 AM',
    initials: 'PN',
    online: true,
  },
  {
    id: 'm2',
    name: 'Tomas Wolff',
    handle: '@tomas',
    message: 'Confirmed for the Thursday judging panel.',
    when: '9:38 AM',
    initials: 'TW',
    neutral: true,
  },
];

const meta = {
  title: 'Components/Data display/ActivityFeed',
  component: ActivityFeed,
  tags: ['autodocs'],
  decorators: [field],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A list of who did what, or chat style messages, on a white group. Divided rows use hairlines inset to the text, connected rows draw a spine between avatars, and spaced rows sit apart.',
          'Avatars use the shared `Avatar` (initials on a neutral fill), unread rows add a dot and a bolder name, and details sit under the line.',
          '',
          "Import: `import { ActivityFeed } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { items: ACTIVITY, variant: 'divided' },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS, ...appearance },
    'aria-label': { control: 'text', ...content },
    items: hide,
    className: hide,
  },
} satisfies Meta<typeof ActivityFeed>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Connected: Story = { args: { variant: 'connected' } };
export const Spaced: Story = { args: { variant: 'spaced' } };
export const Messages: Story = { args: { items: MESSAGES } };
