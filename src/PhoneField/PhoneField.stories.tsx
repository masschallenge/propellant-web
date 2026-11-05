import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { PhoneField } from './PhoneField';
import type { PhoneFieldProps } from './PhoneField';
import { field } from '../../.storybook/stack';
import { appearance, content, hide, state } from '../../.storybook/controls';

const COUNTRIES = [
  { code: 'US', label: 'United States', dialCode: '1' },
  { code: 'CA', label: 'Canada', dialCode: '1' },
  { code: 'GB', label: 'United Kingdom', dialCode: '44' },
  { code: 'IL', label: 'Israel', dialCode: '972' },
  { code: 'MX', label: 'Mexico', dialCode: '52' },
  { code: 'CH', label: 'Switzerland', dialCode: '41' },
];

const Controlled = (args: PhoneFieldProps) => {
  const [value, setValue] = React.useState({ country: args.country, number: args.number });
  return <PhoneField {...args} country={value.country} number={value.number} onChange={setValue} />;
};

const meta = {
  title: 'Components/Inputs/PhoneField',
  component: PhoneField,
  tags: ['autodocs'],
  decorators: [field],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Phone number input with a searchable calling code picker. Data-agnostic: the app supplies the countries and owns parsing, formatting, and validation.',
          '',
          "Import: `import { PhoneField } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    label: 'Mobile',
    countries: COUNTRIES,
    country: 'US',
    number: '',
    placeholder: '617 555 0100',
    onChange: () => {},
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], ...appearance },
    required: { control: 'boolean', ...state },
    invalid: { control: 'boolean', ...state },
    disabled: { control: 'boolean', ...state },
    label: { control: 'text', ...content },
    hint: { control: 'text', ...content },
    countries: hide,
    country: hide,
    number: hide,
    onChange: hide,
    onBlur: hide,
    className: hide,
  },
  render: (args) => <Controlled {...args} />,
} satisfies Meta<typeof PhoneField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Filled: Story = { args: { country: 'GB', number: '7700 900123' } };
export const Invalid: Story = {
  args: {
    required: true,
    invalid: true,
    number: '555',
    hint: 'Enter a full number so mentors can reach you.',
  },
};
export const Disabled: Story = { args: { disabled: true, number: '617 555 0100' } };

export const PickCountry: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('combobox', { name: 'Country code' }));
    await userEvent.keyboard('Israel');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('combobox', { name: 'Country code' })).toHaveTextContent('+972');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Mobile' }), '50 123 4567');
    await expect(canvas.getByRole('textbox', { name: 'Mobile' })).toHaveValue('50 123 4567');
  },
};
