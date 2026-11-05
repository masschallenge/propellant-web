import * as React from 'react';
import type { ReactNode } from 'react';
import { Token } from '../Token/Token';
import { FieldHintRow, FieldLabel, type FieldLabelEmphasis } from './fieldText';

export type TextFieldSize = 'sm' | 'md' | 'lg';

type NativeInputProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'inputMode'>;

type NativeInputMode = React.ComponentPropsWithoutRef<'input'>['inputMode'];

export interface TextFieldProps extends NativeInputProps {
  inputMode?: NativeInputMode | (string & {});
  label?: ReactNode;
  labelHelp?: string;
  hint?: ReactNode;
  hintEnd?: ReactNode;
  size?: TextFieldSize;
  emphasis?: FieldLabelEmphasis;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  iconLeading?: ReactNode;
  iconTrailing?: ReactNode;
  leadingAddon?: ReactNode;
  trailingAddon?: ReactNode;
  passwordToggle?: boolean;
  stepper?: 'horizontal' | 'vertical';
  stepAmount?: number;
  decrementLabel?: string;
  incrementLabel?: string;
  tags?: string[];
  onTagsChange?: (tags: string[]) => void;
  tagPlacement?: 'inline' | 'outer';
  fileUpload?: boolean;
  onFileSelect?: (file: File) => void;
  onClear?: () => void;
  clearLabel?: string;
  id?: string;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const INPUT_SIZES: Record<TextFieldSize, string> = {
  sm: 'min-h-[var(--control-sm)] px-2.5 text-subheadline',
  md: 'min-h-[var(--control-md)] px-3 text-callout',
  lg: 'min-h-[var(--control-lg)] px-3.5 text-body',
};

const SEGMENT_WIDTHS: Record<TextFieldSize, string> = {
  sm: 'w-[var(--control-sm)]',
  md: 'w-[var(--control-md)]',
  lg: 'w-[var(--control-lg)]',
};

const INSET_FOCUS =
  'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-[var(--focus-color)]';

const DIVIDER_AFTER = 'shadow-[inset_-1px_0_0_0_var(--separator)]';
const DIVIDER_BEFORE = 'shadow-[inset_1px_0_0_0_var(--separator)]';

const ADDON =
  'flex flex-none items-center px-3 text-callout text-[var(--label-secondary)] bg-[var(--bg-secondary)]';

const SEGMENT_BUTTON = joinClasses(
  'flex items-center justify-center p-0 border-0 cursor-pointer bg-transparent text-[var(--label-secondary)]',
  'hover:bg-[var(--fill-tertiary)] active:bg-[var(--fill-secondary)]',
  'disabled:cursor-not-allowed disabled:hover:bg-transparent',
  'aria-disabled:cursor-not-allowed aria-disabled:text-[var(--label-quaternary)] aria-disabled:hover:bg-transparent aria-disabled:active:bg-transparent',
  INSET_FOCUS,
);

const ICON_BUTTON = joinClasses(
  'flex flex-none items-center justify-center p-0 border-0 bg-transparent cursor-pointer rounded-[var(--corner-md)] text-[var(--label-tertiary)] hover:text-[var(--label-secondary)] disabled:cursor-not-allowed',
  INSET_FOCUS,
);

const ICON_SLOT = '[&>svg]:block [&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)]';

const Glyph = ({ path, className }: { path: ReactNode; className: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {path}
  </svg>
);

const toBound = (bound: unknown) =>
  bound === undefined || bound === null || bound === '' ? null : Number(bound);

const setNativeValue = (element: HTMLInputElement, nextValue: string) => {
  const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  descriptor?.set?.call(element, nextValue);
  element.dispatchEvent(new Event('input', { bubbles: true }));
};

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      labelHelp,
      hint,
      hintEnd,
      size = 'md',
      emphasis = 'default',
      required = false,
      invalid = false,
      disabled = false,
      iconLeading,
      iconTrailing,
      leadingAddon,
      trailingAddon,
      passwordToggle = false,
      stepper,
      stepAmount = 1,
      decrementLabel = 'Decrement',
      incrementLabel = 'Increment',
      tags,
      onTagsChange,
      tagPlacement = 'inline',
      fileUpload = false,
      onFileSelect,
      onClear,
      clearLabel = 'Clear',
      id,
      className,
      type,
      min,
      max,
      value,
      readOnly,
      inputMode,
      placeholder,
      onKeyDown,
      onClick,
      'aria-describedby': describedByProp,
      ...rest
    },
    forwardedRef,
  ) => {
    const generatedId = React.useId();
    const fieldId = id || generatedId;
    const hintId = hint ? `${fieldId}-hint` : undefined;
    const hasHintEnd = hintEnd !== undefined && hintEnd !== null;
    const hintEndId = hasHintEnd ? `${fieldId}-hint-end` : undefined;
    const describedBy = [describedByProp, hintId, hintEndId].filter(Boolean).join(' ') || undefined;
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isRevealed, setIsRevealed] = React.useState(false);
    const [fileName, setFileName] = React.useState('');

    const tagList = tags ?? [];
    const isTagField = tags !== undefined && tagPlacement === 'inline';
    const resolvedType = passwordToggle ? (isRevealed ? 'text' : 'password') : type;

    const minimum = toBound(min);
    const maximum = toBound(max);
    const shownValue = toBound(value);
    const isAtMinimum = minimum !== null && shownValue !== null && shownValue <= minimum;
    const isAtMaximum = maximum !== null && shownValue !== null && shownValue >= maximum;

    const step = (direction: 1 | -1) => {
      const element = inputRef.current;
      if (!element || disabled) return;
      if ((direction < 0 && isAtMinimum) || (direction > 0 && isAtMaximum)) return;
      const stepped = (parseFloat(element.value) || 0) + direction * stepAmount;
      const floored = minimum === null ? stepped : Math.max(minimum, stepped);
      const clamped = maximum === null ? floored : Math.min(maximum, floored);
      setNativeValue(element, String(clamped));
    };

    const removeTag = (tag: string) => {
      if (onTagsChange && !disabled) onTagsChange(tagList.filter((existing) => existing !== tag));
    };

    const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const draft = input.value.trim();
      if (event.key === 'Enter' && draft) {
        event.preventDefault();
        if (onTagsChange && !tagList.includes(draft)) onTagsChange([...tagList, draft]);
        input.value = '';
      } else if (event.key === 'Backspace' && !input.value && tagList.length) {
        removeTag(tagList[tagList.length - 1]);
      }
      onKeyDown?.(event);
    };

    const openFilePicker = () => {
      if (!disabled) fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setFileName(file ? file.name : '');
      if (file && onFileSelect) onFileSelect(file);
    };

    const renderTag = (tag: string) => (
      <Token
        key={tag}
        label={tag}
        size="sm"
        className="fs-mask"
        onRemove={disabled ? undefined : () => removeTag(tag)}
      />
    );

    const segmentWidth = SEGMENT_WIDTHS[size];
    const hasClear = Boolean(onClear) && !disabled && Boolean(value);

    return (
      <div
        className={joinClasses(
          'flex flex-col gap-1.5 min-w-0',
          disabled && 'opacity-[var(--opacity-disabled)]',
          className,
        )}
      >
        {label ? (
          <FieldLabel htmlFor={fieldId} emphasis={emphasis} required={required} help={labelHelp}>
            {label}
          </FieldLabel>
        ) : null}
        <div
          className={joinClasses(
            'propellant-field',
            isTagField ? 'flex-wrap items-center gap-1 py-1 px-1.5' : 'items-stretch',
            disabled && 'cursor-not-allowed',
          )}
          data-invalid={invalid ? 'true' : undefined}
        >
          {stepper === 'horizontal' ? (
            <button
              type="button"
              className={joinClasses(SEGMENT_BUTTON, 'flex-none', segmentWidth, DIVIDER_AFTER)}
              aria-label={decrementLabel}
              disabled={disabled}
              aria-disabled={isAtMinimum || undefined}
              onClick={() => step(-1)}
            >
              <Glyph
                className="w-[var(--icon-sm)] h-[var(--icon-sm)]"
                path={<path d="M5 12h14" />}
              />
            </button>
          ) : null}
          {leadingAddon ? (
            <span className={joinClasses(ADDON, DIVIDER_AFTER)}>{leadingAddon}</span>
          ) : null}
          {iconLeading ? (
            <span
              className={joinClasses(
                'flex flex-none items-center pl-3 text-[var(--label-tertiary)]',
                ICON_SLOT,
              )}
              aria-hidden="true"
            >
              {iconLeading}
            </span>
          ) : null}
          {isTagField ? tagList.map(renderTag) : null}
          <input
            id={fieldId}
            ref={inputRef}
            type={resolvedType}
            min={min}
            max={max}
            className={joinClasses(
              'fs-mask flex-1 min-w-0 border-0 bg-transparent outline-none font-normal text-[var(--label)]',
              'placeholder:text-[var(--label-tertiary)] disabled:cursor-not-allowed',
              isTagField
                ? joinClasses(
                    'min-w-20 min-h-6 px-1',
                    size === 'sm' ? 'text-subheadline' : 'text-callout',
                  )
                : INPUT_SIZES[size],
              !isTagField && stepper === 'horizontal' && 'text-center tabular-nums',
              !isTagField && Boolean(iconLeading) && 'pl-2',
              !isTagField && Boolean(leadingAddon) && 'pl-2.5',
              Boolean(onClear) && '[&::-webkit-search-cancel-button]:appearance-none',
            )}
            data-autofill="flood"
            disabled={disabled}
            required={required}
            readOnly={fileUpload || readOnly}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            inputMode={stepper ? 'numeric' : (inputMode as NativeInputMode)}
            value={fileUpload ? fileName : value}
            placeholder={fileUpload ? placeholder || 'No file selected' : placeholder}
            onKeyDown={isTagField ? handleTagKeyDown : onKeyDown}
            onClick={(event) => {
              if (fileUpload) openFilePicker();
              onClick?.(event);
            }}
            {...rest}
          />
          {passwordToggle ? (
            <button
              type="button"
              onClick={() => setIsRevealed(!isRevealed)}
              disabled={disabled}
              aria-label={isRevealed ? 'Hide password' : 'Show password'}
              aria-pressed={isRevealed}
              className={joinClasses(ICON_BUTTON, segmentWidth)}
            >
              {isRevealed ? (
                <Glyph
                  className="w-[var(--icon-md)] h-[var(--icon-md)]"
                  path={
                    <path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 5.2A9.5 9.5 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.3 4M6.2 6.2A17 17 0 0 0 2 12s3.5 7 10 7a9.5 9.5 0 0 0 3.4-.6" />
                  }
                />
              ) : (
                <Glyph
                  className="w-[var(--icon-md)] h-[var(--icon-md)]"
                  path={
                    <>
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  }
                />
              )}
            </button>
          ) : null}
          {hasClear ? (
            <button
              type="button"
              aria-label={clearLabel}
              onClick={() => {
                onClear?.();
                inputRef.current?.focus();
              }}
              className={joinClasses(ICON_BUTTON, segmentWidth)}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-[var(--icon-sm)] h-[var(--icon-sm)]"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" fill="currentColor" />
                <path
                  d="M8.5 8.5l7 7M15.5 8.5l-7 7"
                  className="stroke-[var(--bg)]"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : null}
          {iconTrailing ? (
            <span
              className={joinClasses(
                'flex flex-none items-center pr-3',
                ICON_SLOT,
                invalid ? 'text-[var(--critical)]' : 'text-[var(--label-tertiary)]',
              )}
              aria-hidden="true"
            >
              {iconTrailing}
            </span>
          ) : null}
          {trailingAddon ? (
            <span className={joinClasses(ADDON, DIVIDER_BEFORE)}>{trailingAddon}</span>
          ) : null}
          {stepper === 'horizontal' ? (
            <button
              type="button"
              className={joinClasses(SEGMENT_BUTTON, 'flex-none', segmentWidth, DIVIDER_BEFORE)}
              aria-label={incrementLabel}
              disabled={disabled}
              aria-disabled={isAtMaximum || undefined}
              onClick={() => step(1)}
            >
              <Glyph
                className="w-[var(--icon-sm)] h-[var(--icon-sm)]"
                path={<path d="M12 5v14M5 12h14" />}
              />
            </button>
          ) : null}
          {stepper === 'vertical' ? (
            <span className="flex flex-none flex-col w-7">
              <button
                type="button"
                className={joinClasses(
                  SEGMENT_BUTTON,
                  'w-full flex-1 shadow-[inset_1px_-1px_0_0_var(--separator)]',
                )}
                aria-label={incrementLabel}
                disabled={disabled}
                aria-disabled={isAtMaximum || undefined}
                onClick={() => step(1)}
              >
                <Glyph className="w-3 h-3" path={<path d="M6 15l6-6 6 6" />} />
              </button>
              <button
                type="button"
                className={joinClasses(SEGMENT_BUTTON, 'w-full flex-1', DIVIDER_BEFORE)}
                aria-label={decrementLabel}
                disabled={disabled}
                aria-disabled={isAtMinimum || undefined}
                onClick={() => step(-1)}
              >
                <Glyph className="w-3 h-3" path={<path d="M6 9l6 6 6-6" />} />
              </button>
            </span>
          ) : null}
          {fileUpload ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
                onChange={handleFileChange}
                disabled={disabled}
              />
              <button
                type="button"
                className={joinClasses(
                  'flex flex-none items-center gap-1.5 px-3 border-0 cursor-pointer bg-transparent text-callout font-medium text-[var(--tint)]',
                  'hover:bg-[var(--fill-tertiary)] active:bg-[var(--fill-secondary)] disabled:cursor-not-allowed',
                  DIVIDER_BEFORE,
                  INSET_FOCUS,
                )}
                disabled={disabled}
                onClick={openFilePicker}
              >
                <Glyph
                  className="w-[var(--icon-sm)] h-[var(--icon-sm)]"
                  path={
                    <>
                      <path d="M12 16V4m-4 4 4-4 4 4" />
                      <path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
                    </>
                  }
                />
                Upload
              </button>
            </>
          ) : null}
          <span className="propellant-field-ring" aria-hidden="true" />
        </div>
        {tags !== undefined && tagPlacement === 'outer' ? (
          <div className="flex flex-wrap gap-1.5">{tagList.map(renderTag)}</div>
        ) : null}
        <FieldHintRow
          hint={hint}
          hintId={hintId}
          hintEnd={hintEnd}
          hintEndId={hintEndId}
          invalid={invalid}
        />
      </div>
    );
  },
);

TextField.displayName = 'TextField';
