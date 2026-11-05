import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tooltip, TooltipTrigger } from './Tooltip';
import { Button } from '../Button/Button';
import { appearance, content, hide } from '../../.storybook/controls';

const PLACEMENTS = [
  'top',
  'top-left',
  'top-right',
  'bottom',
  'bottom-left',
  'bottom-right',
  'left',
  'right',
] as const;

const meta = {
  title: 'Components/Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Hover and focus tooltip on the elevated surface, in footnote text, with an optional secondary line and eight placements that flip when there is no room.',
          '',
          "Import: `import { Tooltip, TooltipTrigger } from '@masschallenge/propellant-web'`",
          '',
          'Companion: `TooltipTrigger` is the standard help glyph anchor with a full size hit target.',
        ].join('\n'),
      },
    },
  },
  args: {
    content: 'Copy invite link',
    placement: 'top',
    children: <Button variant="gray">Invite judges</Button>,
  },
  argTypes: {
    placement: { control: 'select', options: PLACEMENTS, ...appearance },
    content: { control: 'text', ...content },
    description: { control: 'text', ...content },
    open: hide,
    children: hide,
    className: hide,
  },
} satisfies Meta<typeof Tooltip>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithDescription: Story = {
  args: { content: 'Judges per panel', description: 'The number of judges each panel needs.' },
};

export const HelpGlyph: Story = {
  args: {
    content: 'Scores stay private until the round closes',
    children: <TooltipTrigger aria-label="About score privacy" />,
  },
};

export const FullText: Story = {
  args: {
    content:
      'What problem does your company solve, and for whom?\nDescribe the customer and the pain in a few sentences.',
    wide: true,
    delay: 300,
    placement: 'bottom',
    children: <Button variant="gray">What problem does...</Button>,
  },
};

export const Placements: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, max-content)',
        gap: 64,
        padding: 48,
      }}
    >
      {PLACEMENTS.map((placement) => (
        <Tooltip key={placement} {...args} placement={placement} open>
          <Button variant="gray">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const Open: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Invite judges' });
    await userEvent.hover(trigger);
    const tooltip = await within(document.body).findByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await userEvent.unhover(trigger);
  },
};
