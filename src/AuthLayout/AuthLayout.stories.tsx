import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthLayout } from './AuthLayout';
import { Button } from '../Button/Button';
import { Separator } from '../Separator/Separator';
import { SocialButton } from '../SocialButton/SocialButton';
import { TextField } from '../TextField/TextField';
import { hide } from '../../.storybook/controls';

const DemoForm = () => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-1">
      <h2 className="m-0 text-title1 text-[var(--label)]">Welcome back</h2>
      <p className="m-0 text-callout text-[var(--label-secondary)]">Continue to your account.</p>
    </div>
    <TextField label="Email" type="email" placeholder="maya@foundry.io" />
    <Button size="lg">Email me a sign in link</Button>
    <Separator label="or" />
    <div className="flex flex-col gap-2">
      <SocialButton brand="google" treatment="color" block>
        Continue with Google
      </SocialButton>
      <SocialButton brand="linkedin" treatment="color" block>
        Continue with LinkedIn
      </SocialButton>
    </div>
  </div>
);

const meta = {
  title: 'Components/Layout/AuthLayout',
  component: AuthLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Split screen sign in layout for public pages: a brand panel (MassChallenge logo, eyebrow, headline, supporting copy, footnote) on the brand surface beside a centered form column, with the app version in the corner.',
          'The hero headline is the one place Propellant sets the brand face (Oswald) in capitals. The brand panel hides below 880px, so the form column carries anything that must show on mobile. Mounts its own `[data-propellant]` boundary; the auth screen (login form, link sent, verifying) renders in `children`.',
          '',
          "Import: `import { AuthLayout } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    eyebrow: 'Founders',
    headline: 'Sign in to keep building what the world needs next.',
    supportingCopy:
      'MassChallenge backs the rare humans with the grit to solve the toughest challenges. Pick up where you left off.',
    version: 'v1.0.0',
    children: <DemoForm />,
  },
  argTypes: {
    eyebrow: { control: 'text' },
    headline: { control: 'text' },
    supportingCopy: { control: 'text' },
    footnote: { control: 'text' },
    version: { control: 'text' },
    children: hide,
    className: hide,
  },
} satisfies Meta<typeof AuthLayout>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Dark: Story = {
  decorators: [
    (Story) => (
      <div data-theme="dark">
        <Story />
      </div>
    ),
  ],
};
