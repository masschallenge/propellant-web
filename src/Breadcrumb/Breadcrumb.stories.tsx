import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Breadcrumb } from './Breadcrumb';
import { VStack } from '../../.storybook/stack';
import { appearance, content, events, hide, state } from '../../.storybook/controls';

const VARIANTS = ['plain', 'line', 'pill'] as const;
const SEPARATORS = ['chevron', 'slash'] as const;

const ITEMS = [
  { label: 'Programs', href: '#' },
  { label: 'Boston 2026 cohort', href: '#' },
  { label: 'Applicants' },
];
const ACCOUNTS = [
  { name: 'Acme Health', sub: 'Program lead' },
  { name: 'Northwind Labs', sub: 'Judge' },
];

const meta = {
  title: 'Components/Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Location trail. Ancestors are plain capsule links, the account switcher is a gray capsule, and the current page reads in label color (bold, underlined, or a tint fill capsule in the pill variant).',
          'Optional home icon, a collapse control, and an organization and account segment.',
          '',
          "Import: `import { Breadcrumb } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    items: ITEMS,
    separator: 'chevron',
    variant: 'plain',
    onAccountChange: fn(),
  },
  argTypes: {
    items: { control: 'object', ...content },
    separator: { control: 'inline-radio', options: SEPARATORS, ...appearance },
    variant: { control: 'inline-radio', options: VARIANTS, ...appearance },
    homeHref: { control: 'text', ...appearance },
    activeAccount: { control: 'number', ...state },
    accountMenuOpen: { control: 'boolean', ...state },
    onAccountChange: { ...events },
    org: hide,
    account: hide,
    className: hide,
  },
} satisfies Meta<typeof Breadcrumb>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <VStack>
      {VARIANTS.map((variant) => (
        <Breadcrumb key={variant} {...args} variant={variant} />
      ))}
    </VStack>
  ),
};

export const Separators: Story = {
  render: (args) => (
    <VStack>
      {SEPARATORS.map((separator) => (
        <Breadcrumb key={separator} {...args} separator={separator} />
      ))}
    </VStack>
  ),
};

export const WithHome: Story = { args: { homeHref: '#' } };

export const Collapsed: Story = {
  args: {
    homeHref: '#',
    items: [
      { label: 'More', ellipsis: true },
      { label: 'Boston 2026 cohort', href: '#' },
      { label: 'Applicants' },
    ],
  },
};

export const AccountSwitcher: Story = {
  args: { org: { label: 'MassChallenge' }, account: ACCOUNTS, items: [{ label: 'Dashboard' }] },
};

export const AccountMenuOpen: Story = {
  tags: ['interaction', '!autodocs'],
  args: {
    org: { label: 'MassChallenge' },
    account: ACCOUNTS,
    accountMenuOpen: true,
    items: [{ label: 'Dashboard' }],
  },
};

export const SwitchAccount: Story = {
  tags: ['interaction', '!autodocs'],
  args: { org: { label: 'MassChallenge' }, account: ACCOUNTS, items: [{ label: 'Dashboard' }] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Acme Health/ }));
    await userEvent.click(canvas.getByRole('menuitemradio', { name: /Northwind Labs/ }));
    await expect(args.onAccountChange).toHaveBeenCalledWith(1);
  },
};

export const InPageCrumb: Story = {
  args: {
    items: [
      { label: 'Application Dashboard', onClick: fn() },
      { label: 'HeartPath AI' },
      { label: 'Feedback Report' },
    ],
  },
};
