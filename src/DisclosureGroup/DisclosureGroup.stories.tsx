import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DisclosureGroup } from './DisclosureGroup';
import { content, events, hide, state } from '../../.storybook/controls';

const meta = {
  title: 'Components/Layout/DisclosureGroup',
  component: DisclosureGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Shows or hides a group of secondary content under a title. The chevron turns with a quick spring. Use it for advanced settings and details people rarely need, not to hide required fields.',
          '',
          "Import: `import { DisclosureGroup } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    title: 'Advanced scoring',
    defaultOpen: false,
    onOpenChange: fn(),
    children: (
      <p className="m-0 text-callout text-[var(--label-secondary)]">
        Normalize scores across judges so a harsh reviewer does not sink a startup.
      </p>
    ),
  },
  argTypes: {
    title: { control: 'text', ...content },
    defaultOpen: { control: 'boolean', ...state },
    onOpenChange: { ...events },
    open: hide,
    trailing: hide,
    children: hide,
    className: hide,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[var(--width-form)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DisclosureGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Open: Story = { args: { defaultOpen: true } };

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Advanced scoring' });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
  },
};
