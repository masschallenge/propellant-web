import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Inspector, InspectorRow } from './Inspector';
import { Button } from '../Button/Button';
import { appearance, content, hide } from '../../.storybook/controls';

const BODY = (
  <>
    <InspectorRow label="Round" value="Round 2" />
    <InspectorRow label="Panel lead" value="Priya Raman" />
    <InspectorRow label="Only panels missing a judge" selected onClick={fn()} />
    <InspectorRow label="Only my cohorts" selected={false} onClick={fn()} />
  </>
);

const FOOTER = (
  <>
    <Button variant="gray">Reset</Button>
    <Button>Apply</Button>
  </>
);

const Launcher = (args: React.ComponentProps<typeof Inspector>) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      style={{
        position: 'relative',
        height: 420,
        overflow: 'hidden',
        borderRadius: 'var(--corner-lg)',
      }}
    >
      <Button onClick={() => setOpen(true)}>Open panel</Button>
      <Inspector {...args} open={open} onClose={() => setOpen(false)} inline />
    </div>
  );
};

const meta = {
  title: 'Components/Overlays/Inspector',
  component: Inspector,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Trailing inspector panel on the elevated surface with a hairline edge, a titled header, header actions, a scrollable body, and a sticky footer. Closes on scrim click, the close button, or Escape.',
          '',
          "Import: `import { Inspector, InspectorRow } from '@masschallenge/propellant-web'`",
          '',
          'Companion: `InspectorRow` is the standard label and value row for inspector bodies. Pass `selected` with `onClick` to make it a toggle.',
        ].join('\n'),
        story: { height: '460px' },
      },
    },
  },
  args: {
    open: false,
    onClose: () => {},
    title: 'Panel filters',
    description: 'Narrow Round 2 panels by status and lead.',
    children: BODY,
    footer: FOOTER,
  },
  argTypes: {
    title: { control: 'text', ...content },
    description: { control: 'text', ...content },
    wide: { control: 'boolean', ...appearance },
    size: { control: 'inline-radio', options: ['md', 'lg', 'xl'], ...appearance },
    flush: { control: 'boolean', ...appearance },
    headerActions: hide,
    footer: hide,
    children: hide,
    inline: hide,
    open: hide,
    onClose: hide,
    className: hide,
  },
  render: (args) => <Launcher {...args} />,
} satisfies Meta<typeof Inspector>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Wide: Story = { args: { wide: true } };
export const ExtraWide: Story = { args: { size: 'xl' } };
export const NoFooter: Story = { args: { footer: undefined } };

export const Open: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open panel' }));
    const dialog = await within(document.body).findByRole('dialog');
    await expect(dialog).toBeVisible();
    await userEvent.keyboard('{Escape}');
  },
};
