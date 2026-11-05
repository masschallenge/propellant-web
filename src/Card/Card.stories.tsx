import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Card } from './Card';
import { Button } from '../Button/Button';
import { hide } from '../../.storybook/controls';

const meta = {
  title: 'Components/Data display/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A plain content surface: a white group on the grouped page background, 12px corners, no border and no shadow.',
          'The header holds a title, description, media, actions and an overflow menu; the footer pins to the bottom.',
          '',
          "Import: `import { Card } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
      story: { height: '280px' },
    },
  },
  args: {
    title: 'Round 2 judging',
    description: '18 of 24 judges have submitted scores.',
    children: 'Scores lock when the round closes on Friday at 5 pm.',
  },
  argTypes: { className: hide, as: hide },
} satisfies Meta<typeof Card>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const HeaderOnly: Story = {
  args: {
    children: undefined,
    title: 'No sessions scheduled',
    description: 'Mentors can add office hours.',
  },
};

export const WithMenu: Story = {
  args: {
    menu: [
      { label: 'Edit round' },
      { label: 'Duplicate' },
      { label: 'Delete round', danger: true },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'More options' });
    await userEvent.click(trigger);
    await expect(canvas.getByRole('menu', { name: 'Card actions' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('menu')).toBeNull();
  },
};

export const WithFooter: Story = {
  args: {
    headerDivider: true,
    footer: (
      <>
        <Button variant="gray" size="sm">
          Remind judges
        </Button>
        <Button size="sm">Open scores</Button>
      </>
    ),
  },
};

export const WithBadge: Story = {
  args: { titleBadge: 'Live', titleBadgeDot: true },
};

export const Interactive: Story = {
  args: { interactive: true, title: 'Boston 2026 cohort', description: '84 startups' },
};
