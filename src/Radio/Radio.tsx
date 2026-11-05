import * as React from 'react';
import type { ReactNode } from 'react';
import { ErrorGlyph, FIELD_LABEL_TONE } from '../TextField/fieldText';
import {
  HIDDEN_INPUT,
  SelectionText,
  indicatorClasses,
  joinClasses,
  selectionRowClasses,
  type SelectionSize,
} from '../Checkbox/selectionControl';

type NativeRadioProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'type'>;

export interface RadioProps extends NativeRadioProps {
  label?: ReactNode;
  hint?: ReactNode;
  size?: SelectionSize;
  error?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const DOT_SIZES: Record<SelectionSize, string> = {
  sm: 'before:w-1.5 before:h-1.5',
  md: 'before:w-2 before:h-2',
};

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    { label, hint, size = 'md', error = false, disabled = false, id, className, ...rest },
    forwardedRef,
  ) => {
    const generatedId = React.useId();
    const fieldId = id || generatedId;
    const hintId = `${fieldId}-hint`;
    const labelId = `${fieldId}-label`;

    return (
      <label htmlFor={fieldId} className={selectionRowClasses(size, disabled, className)}>
        <input
          ref={forwardedRef}
          id={fieldId}
          type="radio"
          className={HIDDEN_INPUT}
          disabled={disabled}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={hint ? hintId : undefined}
          {...rest}
        />
        <span
          aria-hidden="true"
          className={joinClasses(
            indicatorClasses(size, error),
            'rounded-full',
            "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:rounded-full before:bg-[var(--on-tint)]",
            DOT_SIZES[size],
            'before:-translate-x-1/2 before:-translate-y-1/2 before:scale-0',
            'before:transition-transform before:duration-[var(--spring-snappy-duration)] before:ease-[var(--spring-snappy)]',
            'peer-checked:bg-[var(--tint)] peer-checked:shadow-none peer-checked:before:scale-100',
          )}
        />
        <SelectionText
          label={label}
          hint={hint}
          labelId={labelId}
          hintId={hintId}
          size={size}
          hasError={error}
        />
      </label>
    );
  },
);

Radio.displayName = 'Radio';

export interface RadioGroupProps {
  legend?: ReactNode;
  error?: ReactNode;
  name?: string;
  className?: string;
  children?: ReactNode;
}

export const RadioGroup = ({ legend, error, name, className, children }: RadioGroupProps) => {
  const generatedId = React.useId();
  const groupName = name || `radio-${generatedId}`;
  const errorId = `${groupName}-error`;
  const namedChildren = React.Children.map(children, (child) =>
    React.isValidElement<RadioProps>(child) && child.type === Radio && !child.props.name
      ? React.cloneElement(child, { name: groupName })
      : child,
  );
  return (
    <fieldset
      className={joinClasses('flex flex-col items-start gap-0.5 m-0 p-0 border-0', className)}
      aria-describedby={error ? errorId : undefined}
    >
      {legend ? (
        <legend className={joinClasses('p-0 mb-1', FIELD_LABEL_TONE.default)}>{legend}</legend>
      ) : null}
      {namedChildren}
      {error ? (
        <p
          id={errorId}
          className="flex items-start gap-1 m-0 mt-1 text-footnote text-[var(--critical)]"
        >
          <ErrorGlyph />
          {error}
        </p>
      ) : null}
    </fieldset>
  );
};
