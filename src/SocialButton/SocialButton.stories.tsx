import type { Meta, StoryObj } from '@storybook/react-vite';
import { SocialButton } from './SocialButton';
import { HStack } from '../../.storybook/stack';
import { appearance, content, hide, state } from '../../.storybook/controls';

const BRANDS = [
  'gray',
  'facebook',
  'black',
  'dribbble',
  'google',
  'apple',
  'twitter',
  'figma',
  'linkedin',
  'microsoft',
] as const;
const TREATMENTS = ['brand', 'color', 'gray'] as const;

const meta = {
  title: 'Components/Actions/SocialButton',
  component: SocialButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Sign in button for an identity provider, with the provider mark. A capsule like `Button`: brand fills the provider color, color keeps a white surface with the full color mark, and gray mutes the mark.',
          'Use `block` for stacked sign in options on the login page. Provider colors are brand identities, so they live in component tokens.',
          '',
          "Import: `import { SocialButton } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: { brand: 'google', treatment: 'color', size: 'lg', children: 'Continue with Google' },
  argTypes: {
    brand: { control: 'select', options: BRANDS, ...appearance },
    treatment: { control: 'inline-radio', options: TREATMENTS, ...appearance },
    size: { control: 'inline-radio', options: ['md', 'lg'], ...appearance },
    iconOnly: { control: 'boolean', ...appearance },
    block: { control: 'boolean', ...appearance },
    loading: { control: 'boolean', ...state },
    disabled: { control: 'boolean', ...state },
    href: { control: 'text', ...appearance },
    children: { control: 'text', ...content },
    className: hide,
  },
} satisfies Meta<typeof SocialButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Treatments: Story = {
  render: (args) => (
    <HStack>
      {TREATMENTS.map((treatment) => (
        <SocialButton key={treatment} {...args} treatment={treatment}>
          {treatment}
        </SocialButton>
      ))}
    </HStack>
  ),
};
export const Brands: Story = {
  render: (args) => (
    <HStack>
      {BRANDS.map((brand) => (
        <SocialButton key={brand} {...args} brand={brand} iconOnly aria-label={brand} />
      ))}
    </HStack>
  ),
};
export const IconOnly: Story = { args: { iconOnly: true, 'aria-label': 'Google' } };
export const Loading: Story = { args: { loading: true } };

export const SignInChoices: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-80">
      <SocialButton brand="google" treatment="color" block>
        Continue with Google
      </SocialButton>
      <SocialButton brand="microsoft" treatment="color" block>
        Continue with Microsoft
      </SocialButton>
      <SocialButton brand="linkedin" treatment="color" block>
        Continue with LinkedIn
      </SocialButton>
    </div>
  ),
};
