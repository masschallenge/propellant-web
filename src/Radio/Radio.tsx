import * as React from 'react';
import type { ReactNode } from 'react';
import { ErrorGlyph, FIELD_LABEL_TONE } from '../TextField/fieldText';
import {
  HIDDEN_INPUT,
  SelectionText,
  indicatorClasses,
  joinClasses,
  selectionRowClasses,
  type SelectionDensity,
  type SelectionSize,
} from '../Checkbox/selectionControl';

type NativeRadioProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'type'>;

export interface RadioProps extends NativeRadioProps {
  label?: ReactNode;
  hint?: ReactNode;
  size?: SelectionSize;
  density?: SelectionDensity;
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
    {
      label,
      hint,
      size = 'md',
      density = 'default',
      error = false,
      disabled = false,
      id,
      className,
      ...rest
    },
    forwardedRef,
  ) => {
    const isCompact = density === 'compact';
    const indicatorSize = isCompact ? 'sm' : size;
    const textSize = isCompact ? 'md' : size;
    const generatedId = React.useId();
    const fieldId = id || generatedId;
    const hintId = `${fieldId}-hint`;
    const labelId = `${fieldId}-label`;

    return (
      <label htmlFor={fieldId} className={selectionRowClasses(size, disabled, className, density)}>
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
            indicatorClasses(indicatorSize, error, density),
            'rounded-full',
            "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:rounded-full before:bg-[var(--on-tint)]",
            DOT_SIZES[indicatorSize],
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
          size={textSize}
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
  density?: SelectionDensity;
  className?: string;
  children?: ReactNode;
}

const radioGroupChildProps = (
  child: React.ReactElement<RadioProps>,
  groupName: string,
  density: SelectionDensity,
) => ({
  ...(child.props.name ? {} : { name: groupName }),
  ...(density === 'compact' && !child.props.density ? { density } : {}),
});

export const RadioGroup = ({
  legend,
  error,
  name,
  density = 'default',
  className,
  children,
}: RadioGroupProps) => {
  const generatedId = React.useId();
  const groupName = name || `radio-${generatedId}`;
  const errorId = `${groupName}-error`;
  const namedChildren = React.Children.map(children, (child) =>
    React.isValidElement<RadioProps>(child) && child.type === Radio
      ? React.cloneElement(child, radioGroupChildProps(child, groupName, density))
      : child,
  );
  return (
    <fieldset
      className={joinClasses(
        'flex flex-col items-start m-0 p-0 border-0',
        density === 'compact' ? 'gap-0' : 'gap-0.5',
        className,
      )}
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
