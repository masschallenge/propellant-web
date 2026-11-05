import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Sheet } from './Sheet';
import { Button } from '../Button/Button';
import { appearance, content, hide } from '../../.storybook/controls';

const Launcher = (args: React.ComponentProps<typeof Sheet>) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <Sheet {...args} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

const meta = {
  title: 'Components/Overlays/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Portalled dialog on the elevated surface over a scrim, with a focus trap and an inert background. Stacked, horizontal, or split layouts. Footer actions sit in a right aligned row and stack full width, primary on top, on narrow screens.',
          '',
          "Import: `import { Sheet } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
      story: { height: '480px' },
    },
  },
  args: {
    open: false,
    onClose: () => {},
    title: 'Delete Round 2?',
    description: 'Judges lose access to their panels and every saved score is removed.',
    tone: 'critical',
    footer: (
      <>
        <Button variant="gray">Cancel</Button>
        <Button variant="filled" destructive>
          Delete round
        </Button>
      </>
    ),
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'info', 'success', 'warning', 'critical'],
      ...appearance,
    },
    layout: { control: 'inline-radio', options: ['stacked', 'horizontal', 'split'], ...appearance },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'], ...appearance },
    title: { control: 'text', ...content },
    description: { control: 'text', ...content },
    open: hide,
    onClose: hide,
    className: hide,
  },
  render: (args) => <Launcher {...args} />,
} satisfies Meta<typeof Sheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Horizontal: Story = {
  args: {
    layout: 'horizontal',
    tone: 'info',
    title: 'Judge access request',
    description: 'Priya Raman asked to join the Healthcare panel for Round 2.',
    footer: (
      <>
        <Button variant="gray">Decline</Button>
        <Button variant="filled">Approve</Button>
      </>
    ),
  },
};
export const Open: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open sheet' }));
    const dialog = await within(document.body).findByRole('dialog');
    await expect(dialog).toBeVisible();
    await userEvent.keyboard('{Escape}');
  },
};

export const Full: Story = {
  args: {
    size: 'full',
    hideIcon: true,
    title: 'Vitala pitch deck',
    description: undefined,
    footer: undefined,
    children: (
      <div className="flex flex-1 items-center justify-center rounded-[var(--corner-lg)] bg-[var(--bg-secondary)]">
        Document preview
      </div>
    ),
  },
};

export const AlertDialog: Story = {
  args: {
    role: 'alertdialog',
    tone: 'warning',
    size: 'sm',
    title: 'Discard this review?',
    description: 'Your scores and feedback have not been submitted. Leaving now discards them.',
    footer: (
      <>
        <Button variant="gray">Keep reviewing</Button>
        <Button variant="filled" destructive>
          Discard
        </Button>
      </>
    ),
  },
};

export const WideFooter: Story = {
  args: {
    size: 'sm',
    tone: 'success',
    title: 'Cohort published',
    description: 'Founders in the Climate cohort can now see their mentors.',
    footerLayout: 'wide',
    footer: (
      <>
        <Button variant="gray">Back to cohort</Button>
        <Button variant="filled">Message founders</Button>
      </>
    ),
  },
};
