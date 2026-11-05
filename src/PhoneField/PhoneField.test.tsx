import * as React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PhoneField } from './PhoneField';
import type { PhoneFieldValue } from './PhoneField';

afterEach(cleanup);

const COUNTRIES = [
  { code: 'US', label: 'United States', dialCode: '1' },
  { code: 'GB', label: 'United Kingdom', dialCode: '44' },
];

const Controlled = ({ onChange }: { onChange: (next: PhoneFieldValue) => void }) => {
  const [value, setValue] = React.useState<PhoneFieldValue>({ country: 'US', number: '' });
  return (
    <PhoneField
      label="Mobile"
      countries={COUNTRIES}
      country={value.country}
      number={value.number}
      onChange={(next) => {
        onChange(next);
        setValue(next);
      }}
    />
  );
};

describe('PhoneField', () => {
  it('groups both controls under the label and names the number input by it', () => {
    render(
      <PhoneField
        label="Mobile"
        required
        countries={COUNTRIES}
        country="US"
        number=""
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole('group', { name: 'Mobile' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Mobile' })).toBeRequired();
    expect(screen.getByRole('combobox', { name: 'Country code' })).toHaveTextContent('+1');
    expect(screen.getByRole('combobox', { name: 'Country code' })).toHaveTextContent(
      'United States',
    );
  });

  it('reports typed numbers with the current country', async () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Mobile' }), '61');
    expect(onChange).toHaveBeenLastCalledWith({ country: 'US', number: '61' });
  });

  it('reports a country pick with the current number', async () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Mobile' }), '7');
    await userEvent.click(screen.getByRole('combobox', { name: 'Country code' }));
    await userEvent.click(screen.getByRole('option', { name: /United Kingdom/ }));
    expect(onChange).toHaveBeenLastCalledWith({ country: 'GB', number: '7' });
  });

  it('describes the number by the hint and marks it invalid', () => {
    render(
      <PhoneField
        label="Mobile"
        invalid
        hint="Invalid phone number."
        countries={COUNTRIES}
        country="US"
        number="5"
        onChange={() => {}}
      />,
    );
    const input = screen.getByRole('textbox', { name: 'Mobile' });
    expect(input).toHaveAccessibleDescription('Invalid phone number.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('combobox', { name: 'Country code' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('fires onBlur from the number input and disables both controls', async () => {
    const onBlur = vi.fn();
    const { rerender } = render(
      <PhoneField
        label="Mobile"
        countries={COUNTRIES}
        country="US"
        number=""
        onChange={() => {}}
        onBlur={onBlur}
      />,
    );
    await userEvent.click(screen.getByRole('textbox', { name: 'Mobile' }));
    await userEvent.tab();
    expect(onBlur).toHaveBeenCalledTimes(1);
    rerender(
      <PhoneField
        label="Mobile"
        disabled
        countries={COUNTRIES}
        country="US"
        number=""
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole('textbox', { name: 'Mobile' })).toBeDisabled();
    expect(screen.getByRole('combobox', { name: 'Country code' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('renders without a label or hint', () => {
    render(
      <PhoneField
        countries={COUNTRIES}
        country="US"
        number=""
        onChange={() => {}}
        placeholder="Number"
      />,
    );
    const input = screen.getByPlaceholderText('Number');
    expect(input).not.toHaveAttribute('aria-labelledby');
    expect(input).not.toHaveAttribute('aria-describedby');
  });
});

describe('PhoneField sizing', () => {
  it('pairs the medium number input with the matching-height calling code trigger', () => {
    render(<PhoneField countries={COUNTRIES} country="US" number="" onChange={() => {}} />);
    expect(screen.getByRole('combobox', { name: 'Country code' }).className).toContain(
      'min-h-[var(--control-md)]',
    );
  });
});
