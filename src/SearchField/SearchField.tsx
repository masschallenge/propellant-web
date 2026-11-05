import * as React from 'react';

export type SearchFieldSize = 'sm' | 'md' | 'lg';

export interface SearchFieldProps extends Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'size' | 'onChange' | 'value' | 'defaultValue' | 'type'
> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  clearLabel?: string;
  size?: SearchFieldSize;
  isPrivate?: boolean;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const SIZES: Record<SearchFieldSize, string> = {
  sm: 'h-[var(--control-sm)] pl-2.5 pr-1 text-subheadline',
  md: 'h-[var(--control-md)] pl-3 pr-1 text-callout',
  lg: 'h-[var(--control-lg)] pl-3.5 pr-1.5 text-body',
};

export const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      value,
      defaultValue = '',
      onChange,
      onClear,
      clearLabel = 'Clear search',
      size = 'md',
      isPrivate = true,
      placeholder = 'Search',
      className,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const current = value === undefined ? internalValue : value;
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const setValue = (next: string) => {
      if (value === undefined) setInternalValue(next);
      onChange?.(next);
    };

    return (
      <div
        className={joinClasses(
          'relative inline-flex items-center gap-1.5 min-w-0 rounded-[var(--corner-capsule)] bg-[var(--bg)] text-[var(--label-tertiary)]',
          'shadow-[inset_0_0_0_1px_var(--control-border)] focus-within:shadow-[inset_0_0_0_1px_var(--focus-color)] focus-within:outline-[length:var(--focus-width)] focus-within:outline-solid focus-within:outline-offset-1 focus-within:outline-[var(--focus-color)]',
          disabled && 'opacity-[var(--opacity-disabled)]',
          SIZES[size],
          className,
        )}
      >
        <svg
          viewBox="0 0 24 24"
          className="flex-none w-[var(--icon-sm)] h-[var(--icon-sm)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-4.2-4.2" />
        </svg>
        <input
          ref={(element) => {
            inputRef.current = element;
            if (typeof ref === 'function') ref(element);
            else if (ref) ref.current = element;
          }}
          type="search"
          value={current}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && current) {
              event.preventDefault();
              setValue('');
              onClear?.();
            }
          }}
          className={joinClasses(
            'flex-1 min-w-0 h-full border-0 bg-transparent p-0 text-[var(--label)] placeholder:text-[var(--label-tertiary)] outline-none [&::-webkit-search-cancel-button]:hidden',
            isPrivate && 'fs-mask',
          )}
          {...rest}
        />
        {current ? (
          <button
            type="button"
            aria-label={clearLabel}
            onClick={() => {
              setValue('');
              onClear?.();
              inputRef.current?.focus();
            }}
            className="relative flex-none inline-flex items-center justify-center w-6 h-6 rounded-full border-0 bg-[var(--fill)] text-[var(--label-secondary)] cursor-pointer hover:bg-[var(--fill-secondary)] focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-1 focus-visible:outline-[var(--focus-color)]"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M17 7 7 17M7 7l10 10" />
            </svg>
          </button>
        ) : null}
      </div>
    );
  },
);

SearchField.displayName = 'SearchField';
