import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Logo } from './Logo';
import { appearance, content, hide } from '../../.storybook/controls';

const meta = {
  title: 'Components/Brand/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'The MassChallenge logo in its two lockups and three treatments. Use the full color logo on white or light neutral backgrounds, the white treatment on the brand teal, dark surfaces and photographs, and the black treatment where only one dark color is available. The accessible name defaults to MassChallenge; pass an empty `label` when the name is already written beside the logo.',
          '',
          "Import: `import { Logo } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { lockup: 'horizontal', treatment: 'color' },
  argTypes: {
    lockup: { control: 'inline-radio', options: ['horizontal', 'monogram'], ...appearance },
    treatment: { control: 'inline-radio', options: ['color', 'white', 'black'], ...appearance },
    label: { control: 'text', ...content },
    className: hide,
  },
} satisfies Meta<typeof Logo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { className: 'h-10' } };

export const Lockups: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-10 p-6 bg-[var(--bg)]">
      <Logo {...args} lockup="horizontal" className="h-10" />
      <Logo {...args} lockup="monogram" className="h-10" />
    </div>
  ),
};

export const Treatments: Story = {
  render: () => (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="flex items-center justify-center p-8 rounded-[var(--corner-lg)] bg-[var(--gray-0)]">
        <Logo className="h-8" />
      </div>
      <div className="flex items-center justify-center p-8 rounded-[var(--corner-lg)] bg-[var(--teal-900)]">
        <Logo treatment="white" className="h-8" />
      </div>
      <div className="flex items-center justify-center p-8 rounded-[var(--corner-lg)] bg-[var(--gray-0)]">
        <Logo treatment="black" className="h-8" />
      </div>
    </div>
  ),
};

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    const logo = within(canvasElement).getByRole('img', { name: 'MassChallenge' });
    await expect(logo).toHaveAttribute('data-lockup', 'horizontal');
  },
};
