import * as React from 'react';
import { SingleComboBox } from '../ComboBox/SingleComboBox';
import { TextField } from '../TextField/TextField';
import { FIELD_LABEL_TONE, FieldHint } from '../TextField/fieldText';

export interface PhoneFieldCountry {
  code: string;
  label: string;
  dialCode: string;
}

export interface PhoneFieldValue {
  country: string;
  number: string;
}

export interface PhoneFieldProps {
  label?: string;
  hint?: string;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  countries: PhoneFieldCountry[];
  country: string;
  number: string;
  onChange: (next: PhoneFieldValue) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  countryLabel?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  name?: string;
  className?: string;
}

export const PhoneField = ({
  label,
  hint,
  required = false,
  invalid = false,
  disabled = false,
  countries,
  country,
  number,
  onChange,
  onBlur,
  countryLabel = 'Country code',
  placeholder,
  size = 'md',
  id,
  name,
  className,
}: PhoneFieldProps) => {
  const generatedId = React.useId();
  const fieldId = id || generatedId;
  const legendId = `${fieldId}-legend`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const options = countries.map((option) => ({
    value: option.code,
    label: option.label,
    sub: `+${option.dialCode}`,
    short: `+${option.dialCode}`,
  }));

  return (
    <fieldset
      className={['flex flex-col gap-1.5 min-w-0 m-0 p-0 border-0', className]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
    >
      {label ? (
        <legend
          id={legendId}
          className={`flex items-center gap-1 p-0 mb-1.5 ${FIELD_LABEL_TONE.default}`}
        >
          {label}
          {required ? (
            <span className="text-[var(--critical)]" aria-hidden="true">
              *
            </span>
          ) : null}
        </legend>
      ) : null}
      <div className="flex items-start gap-2 min-w-0">
        <SingleComboBox
          className="flex-none w-28"
          options={options}
          value={country}
          onChange={(next) => {
            if (next) onChange({ country: next, number });
          }}
          ariaLabel={countryLabel}
          searchPlaceholder="Search countries…"
          size={size}
          invalid={invalid}
          disabled={disabled}
          clearable={false}
        />
        <TextField
          className="flex-1"
          id={fieldId}
          name={name}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={number}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ country, number: event.target.value })
          }
          onBlur={onBlur}
          placeholder={placeholder}
          size={size}
          required={required}
          invalid={invalid}
          disabled={disabled}
          aria-labelledby={label ? legendId : undefined}
          aria-describedby={hintId}
        />
      </div>
      {hint ? (
        <FieldHint id={hintId} invalid={invalid}>
          {hint}
        </FieldHint>
      ) : null}
    </fieldset>
  );
};
