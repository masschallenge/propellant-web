import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ColorPicker, type ColorPickerProps } from './ColorPicker';
import { HStack } from '../../.storybook/stack';
import { appearance, content, events, hide } from '../../.storybook/controls';

const VARIANTS: NonNullable<ColorPickerProps['variant']>[] = [
  'full',
  'minimal',
  'swatch-picker',
  'swatch-card',
  'palette',
  'hue',
  'alpha',
];

const meta = {
  title: 'Components/Inputs/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Colour picker for cohort and program branding: a saturation area, hue and alpha rails, brand swatches, a format menu, and seven variants from the full panel down to a single hue or alpha rail.',
          '',
          "Import: `import { ColorPicker } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    defaultValue: '#0FACBD',
    variant: 'full',
    withAlpha: true,
    showFormat: true,
    showOpacity: true,
    swatchSize: 'md',
    onChange: fn(),
  },
  argTypes: {
    variant: { control: 'select', options: VARIANTS, ...appearance },
    swatchSize: { control: 'inline-radio', options: ['sm', 'md', 'lg'], ...appearance },
    withAlpha: { control: 'boolean', ...appearance },
    showFormat: { control: 'boolean', ...appearance },
    showOpacity: { control: 'boolean', ...appearance },
    title: { control: 'text', ...content },
    subtitle: { control: 'text', ...content },
    savedLabel: { control: 'text', ...content },
    onChange: { ...events },
    value: hide,
    defaultValue: hide,
    swatches: hide,
    tabs: hide,
    activeTab: hide,
    format: hide,
    formats: hide,
    opacity: hide,
    hue: hide,
    footerLinks: hide,
    onClose: hide,
    onTabChange: hide,
    onFormatChange: hide,
    onOpacityChange: hide,
    onHueChange: hide,
    onAddSwatch: hide,
    className: hide,
  },
} satisfies Meta<typeof ColorPicker>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <HStack>
      {VARIANTS.map((variant) => (
        <ColorPicker
          key={variant}
          {...args}
          variant={variant}
          title={variant === 'full' || variant === 'minimal' ? undefined : variant}
        />
      ))}
    </HStack>
  ),
};

export const Minimal: Story = { args: { variant: 'minimal' } };
export const SwatchCard: Story = {
  args: { variant: 'swatch-card', title: 'Cohort colours', subtitle: 'Fall 2026' },
};
export const Palette: Story = { args: { variant: 'palette' } };
export const SwatchPicker: Story = { args: { variant: 'swatch-picker' } };
export const WithoutAlpha: Story = { args: { withAlpha: false } };

export const OpenFormat: Story = {
  tags: ['interaction', '!autodocs'],
  args: { onFormatChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Color format' }));
    const listbox = await canvas.findByRole('listbox', { name: 'Color format' });
    await userEvent.click(within(listbox).getByRole('option', { name: 'RGB' }));
    await expect(args.onFormatChange).toHaveBeenCalledWith('RGB');
  },
};
