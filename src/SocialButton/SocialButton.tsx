import * as React from 'react';
import type { ReactNode } from 'react';

export type SocialBrand =
  | 'gray'
  | 'facebook'
  | 'black'
  | 'dribbble'
  | 'google'
  | 'apple'
  | 'twitter'
  | 'figma'
  | 'linkedin'
  | 'microsoft';
export type SocialTreatment = 'brand' | 'color' | 'gray';
export type SocialSize = 'md' | 'lg';

export interface SocialButtonProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  brand?: SocialBrand;
  treatment?: SocialTreatment;
  size?: SocialSize;
  iconOnly?: boolean;
  block?: boolean;
  loading?: boolean;
  mark?: ReactNode;
  disabled?: boolean;
  href?: string;
  children?: ReactNode;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const GOOGLE_PATHS = [
  [
    '#4285F4',
    'M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z',
  ],
  [
    '#34A853',
    'M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z',
  ],
  [
    '#FBBC05',
    'M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z',
  ],
  [
    '#EA4335',
    'M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z',
  ],
];
const FIGMA_PATHS = [
  ['#0ACF83', 'M8 24c2.21 0 4-1.79 4-4v-4H8c-2.21 0-4 1.79-4 4s1.79 4 4 4z'],
  ['#A259FF', 'M4 12c0-2.21 1.79-4 4-4h4v8H8c-2.21 0-4-1.79-4-4z'],
  ['#F24E1E', 'M4 4c0-2.21 1.79-4 4-4h4v8H8C5.79 8 4 6.21 4 4z'],
  ['#FF7262', 'M12 0h4c2.21 0 4 1.79 4 4s-1.79 4-4 4h-4V0z'],
  ['#1ABCFE', 'M20 12c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z'],
];
const MICROSOFT_PATHS = [
  ['#F25022', 'M1 1h10v10H1z'],
  ['#7FBA00', 'M12 1h10v10H12z'],
  ['#00A4EF', 'M1 12h10v10H1z'],
  ['#FFB900', 'M12 12h10v10H12z'],
];
const LINKEDIN_PATH =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z';
const MONO_MARKS: Record<
  Exclude<SocialBrand, 'gray' | 'black'>,
  { viewBox: string; paths: string[] }
> = {
  google: { viewBox: '0 0 48 48', paths: GOOGLE_PATHS.map((entry) => entry[1]) },
  facebook: {
    viewBox: '0 0 24 24',
    paths: [
      'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z',
    ],
  },
  apple: {
    viewBox: '0 0 24 24',
    paths: [
      'M17.05 12.54c-.03-2.9 2.37-4.29 2.48-4.36-1.35-1.98-3.46-2.25-4.21-2.28-1.79-.18-3.5 1.05-4.41 1.05-.9 0-2.31-1.03-3.8-1-1.96.03-3.77 1.14-4.78 2.9-2.04 3.53-.52 8.76 1.46 11.63.97 1.4 2.12 2.98 3.63 2.92 1.46-.06 2.01-.94 3.77-.94 1.76 0 2.26.94 3.8.91 1.57-.03 2.56-1.43 3.52-2.84 1.11-1.63 1.57-3.21 1.59-3.29-.03-.02-3.05-1.17-3.08-4.63zM14.19 3.99c.8-.98 1.34-2.33 1.19-3.68-1.15.05-2.55.77-3.38 1.74-.74.86-1.39 2.24-1.22 3.56 1.29.1 2.6-.65 3.41-1.62z',
    ],
  },
  twitter: {
    viewBox: '0 0 24 24',
    paths: [
      'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25h6.83l4.713 6.231 5.447-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z',
    ],
  },
  figma: { viewBox: '0 0 24 24', paths: FIGMA_PATHS.map((entry) => entry[1]) },
  linkedin: { viewBox: '0 0 24 24', paths: [LINKEDIN_PATH] },
  microsoft: { viewBox: '0 0 23 23', paths: MICROSOFT_PATHS.map((entry) => entry[1]) },
  dribbble: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm7.93 5.53c1.43 1.74 2.29 3.96 2.32 6.37-.34-.07-3.72-.76-7.13-.33-.08-.18-.15-.37-.23-.56-.21-.5-.44-1-.68-1.49 3.77-1.54 5.49-3.76 5.72-3.99zM12 1.86c2.6 0 4.98.98 6.78 2.58-.19.27-1.74 2.35-5.38 3.71C11.72 4.98 9.86 2.6 9.58 2.24 10.36 2 11.17 1.86 12 1.86zM7.53 2.96c.27.35 2.09 2.74 3.8 5.86-4.8 1.28-9.04 1.25-9.5 1.25.67-3.19 2.82-5.84 5.7-7.11zM1.61 12.01v-.31c.44.01 5.43.07 10.56-1.47.3.57.57 1.15.83 1.74-.13.04-.27.08-.4.12-5.3 1.71-8.12 6.39-8.36 6.78-1.62-1.8-2.61-4.18-2.61-6.79zm3.99 8.06c.16-.32 2.06-3.99 7.86-6.01l.06-.02c1.45 3.76 2.04 6.92 2.19 7.82-3.36 1.44-7.28.9-10.11-1.79zm11.94.79c-.11-.63-.65-3.65-1.99-7.36 3.21-.51 6.02.33 6.37.44-.44 2.79-2.05 5.2-4.38 6.92z',
    ],
  },
};

const COLORED_MARKS: Partial<Record<SocialBrand, { viewBox: string; paths: string[][] }>> = {
  google: { viewBox: '0 0 48 48', paths: GOOGLE_PATHS },
  microsoft: { viewBox: '0 0 23 23', paths: MICROSOFT_PATHS },
  figma: { viewBox: '0 0 24 24', paths: FIGMA_PATHS },
};

const builtInMark = (brand: SocialBrand, isColored: boolean) => {
  const colored = isColored ? COLORED_MARKS[brand] : undefined;
  if (colored) {
    return (
      <svg viewBox={colored.viewBox} className="w-full h-full block" aria-hidden="true">
        {colored.paths.map(([fill, path]) => (
          <path key={path} fill={fill} d={path} />
        ))}
      </svg>
    );
  }
  const mono = brand === 'gray' || brand === 'black' ? MONO_MARKS.apple : MONO_MARKS[brand];
  return (
    <svg
      viewBox={mono.viewBox}
      fill="currentColor"
      className="w-full h-full block"
      aria-hidden="true"
    >
      {mono.paths.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
};

const NEUTRAL =
  'bg-[var(--bg)] text-[var(--label)] shadow-[inset_0_0_0_var(--hairline)_var(--control-border)] hover:not-disabled:bg-[var(--bg-secondary)] active:not-disabled:bg-[var(--fill-tertiary)]';

const ON_BLACK =
  'bg-[var(--sb-black-bg)] text-[var(--sb-on-brand-fg)] hover:not-disabled:bg-[var(--sb-black-bg-hover)]';

const BRAND_SURFACES: Record<SocialBrand, string> = {
  gray: NEUTRAL,
  google: NEUTRAL,
  microsoft: NEUTRAL,
  facebook:
    'bg-[var(--sb-facebook-bg)] text-[var(--gray-0)] hover:not-disabled:bg-[var(--sb-facebook-bg-hover)]',
  dribbble:
    'bg-[var(--sb-dribbble-bg)] text-[var(--gray-0)] hover:not-disabled:bg-[var(--sb-dribbble-bg-hover)]',
  linkedin:
    'bg-[var(--sb-linkedin-bg)] text-[var(--gray-0)] hover:not-disabled:bg-[var(--sb-linkedin-bg-hover)]',
  black: ON_BLACK,
  apple: ON_BLACK,
  twitter: ON_BLACK,
  figma: ON_BLACK,
};

const COLOR_MARK_TINTS: Partial<Record<SocialBrand, string>> = {
  facebook: 'var(--sb-facebook-bg)',
  dribbble: 'var(--sb-dribbble-bg)',
  linkedin: 'var(--sb-linkedin-bg)',
  apple: 'var(--label)',
  twitter: 'var(--label)',
  black: 'var(--label)',
  gray: 'var(--label-tertiary)',
};

const SIZES: Record<SocialSize, { shell: string; iconOnly: string; mark: string }> = {
  md: {
    shell: 'min-h-[var(--control-md)] px-3.5 text-callout',
    iconOnly: 'w-[var(--control-md)]',
    mark: 'w-[var(--icon-sm)] h-[var(--icon-sm)]',
  },
  lg: {
    shell: 'min-h-[var(--control-lg)] px-[18px] text-body',
    iconOnly: 'w-[var(--control-lg)]',
    mark: 'w-[var(--icon-lg)] h-[var(--icon-lg)]',
  },
};

export const SocialButton = ({
  brand = 'gray',
  treatment = 'brand',
  size = 'lg',
  iconOnly = false,
  block = false,
  mark,
  loading = false,
  disabled = false,
  href,
  className,
  children,
  ...rest
}: SocialButtonProps) => {
  const sizing = SIZES[size];
  const isNeutral = treatment !== 'brand' || BRAND_SURFACES[brand] === NEUTRAL;
  const classes = joinClasses(
    'relative inline-flex items-center justify-center gap-2 border-0 rounded-[var(--corner-capsule)] font-medium whitespace-nowrap no-underline cursor-pointer select-none',
    'transition-colors duration-[var(--duration-instant)] ease-[var(--ease-standard)] active:transition-none',
    'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]',
    'disabled:cursor-not-allowed',
    loading ? 'pointer-events-none' : 'disabled:opacity-[var(--opacity-disabled)]',
    sizing.shell,
    iconOnly && joinClasses('px-0', sizing.iconOnly),
    block && 'w-full',
    isNeutral ? NEUTRAL : BRAND_SURFACES[brand],
    className,
  );

  const isColoredMark = treatment !== 'gray' && Boolean(COLORED_MARKS[brand]);
  const markColor = mark
    ? undefined
    : treatment === 'gray'
      ? disabled
        ? undefined
        : 'var(--label-tertiary)'
      : treatment === 'color' && !isColoredMark
        ? COLOR_MARK_TINTS[brand]
        : undefined;
  const markNode = mark ?? builtInMark(brand, isColoredMark);

  const content = loading ? (
    <span
      className={joinClasses(
        'flex-none rounded-full border-2 border-current border-t-transparent animate-spin',
        sizing.mark,
      )}
      aria-hidden="true"
    />
  ) : (
    <>
      <span
        className={joinClasses('flex-none flex', sizing.mark)}
        style={markColor ? { color: markColor } : undefined}
        aria-hidden="true"
      >
        {markNode}
      </span>
      {iconOnly ? null : <span>{children}</span>}
    </>
  );

  if (href && !disabled) {
    return (
      <a href={href} className={classes} aria-busy={loading || undefined} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  );
};
