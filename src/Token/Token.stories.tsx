import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Token } from './Token';
import { HStack, VStack } from '../../.storybook/stack';
import { appearance, content, events, hide, state } from '../../.storybook/controls';

const meta = {
  title: 'Components/Inputs/Token',
  component: Token,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A small capsule for a value the person picked or can pick: a tag on a startup, a sector in a filter, an answer in a multiple-choice question. Tokens can be toggled, removed, or both, and can take a category color from data while the label keeps its readable text color. For read-only status, use `Badge`.',
          '',
          'Pass `children` to show rich content in place of the label, such as the letters that matched a search wrapped in `<mark>`. The `label` stays required and is what assistive technology reads, so the highlight never changes the name.',
          '',
          "Import: `import { Token } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { label: 'Climate', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'], ...appearance },
    color: { control: 'color', ...appearance },
    dot: { control: 'boolean', ...appearance },
    wrap: { control: 'boolean', ...appearance },
    selected: { control: 'boolean', ...state },
    disabled: { control: 'boolean', ...state },
    label: { control: 'text', ...content },
    count: { control: 'text', ...content },
    onToggle: { ...events },
    onRemove: { ...events },
    icon: hide,
    children: hide,
    className: hide,
  },
} satisfies Meta<typeof Token>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Kinds: Story = {
  render: () => (
    <VStack>
      <HStack>
        <Token label="Health" />
        <Token label="Climate" count={12} />
        <Token label="Women-led" color="#bf0261" dot />
        <Token label="Fintech" color="#068da4" dot />
      </HStack>
      <HStack>
        <Token label="Hardware" onToggle={fn()} />
        <Token label="Software" onToggle={fn()} selected />
        <Token label="founder@example.org" onRemove={fn()} />
      </HStack>
    </VStack>
  ),
};

export const Toggle: Story = {
  args: { onToggle: fn() },
  play: async ({ args, canvasElement }) => {
    const token = within(canvasElement).getByRole('button', { name: 'Climate' });
    await expect(token).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(token);
    await expect(args.onToggle).toHaveBeenCalledWith(true);
  },
};

export const Remove: Story = {
  args: { onRemove: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Remove Climate' }));
    await expect(args.onRemove).toHaveBeenCalledTimes(1);
  },
};

const highlight = 'rounded-[var(--corner-sm)] bg-[var(--highlight)] text-[var(--on-highlight)]';

export const HighlightedLabel: Story = {
  tags: ['interaction'],
  args: { onToggle: fn() },
  render: (args) => (
    <HStack>
      <Token {...args} label="Climate">
        <mark className={highlight}>Cli</mark>mate
      </Token>
      <Token label="Cleantech" selected onToggle={fn()}>
        <mark className={highlight}>Cl</mark>eantech
      </Token>
      <Token label="Healthcare" onRemove={fn()}>
        Health<mark className={highlight}>care</mark>
      </Token>
    </HStack>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const token = canvas.getByRole('button', { name: 'Climate' });
    await expect(token).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(token);
    await expect(args.onToggle).toHaveBeenCalledWith(true);
    await expect(canvas.getByRole('button', { name: 'Cleantech' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(canvas.getByRole('button', { name: 'Remove Healthcare' })).toBeVisible();
  },
};
