import * as React from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
  thick?: boolean;
  longArc?: boolean;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const MARK_SIZES: Record<SpinnerSize, string> = {
  sm: 'w-[var(--spin-size-sm)] h-[var(--spin-size-sm)]',
  md: 'w-[var(--spin-size-md)] h-[var(--spin-size-md)]',
  lg: 'w-[var(--spin-size-lg)] h-[var(--spin-size-lg)]',
  xl: 'w-[var(--spin-size-xl)] h-[var(--spin-size-xl)]',
};

const LABEL_SIZES: Record<SpinnerSize, string> = {
  sm: 'text-subheadline',
  md: 'text-subheadline',
  lg: 'text-callout',
  xl: 'text-callout',
};

const DOT_COUNT = 10;

const SpinnerLabel = ({ label, size }: { label?: string; size: SpinnerSize }) =>
  label ? (
    <span className={joinClasses(LABEL_SIZES[size], 'text-[var(--label-secondary)]')}>{label}</span>
  ) : (
    <span className="sr-only">Loading</span>
  );

export const Spinner = ({
  size = 'md',
  label,
  thick = false,
  longArc = false,
  className,
}: SpinnerProps) => {
  const strokeWidth = thick ? 10 : 6;
  return (
    <div
      role="status"
      aria-live="polite"
      className={joinClasses('inline-flex flex-col items-center gap-3', className)}
    >
      <svg
        viewBox="0 0 100 100"
        className={joinClasses('block', MARK_SIZES[size])}
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-[var(--fill-secondary)]"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={longArc ? '180 84' : '66 198'}
          className="stroke-[var(--tint)] origin-center animate-spin"
          style={{ animationDuration: 'var(--spin-duration)' }}
        />
      </svg>
      <SpinnerLabel label={label} size={size} />
    </div>
  );
};

export interface DotSpinnerProps {
  size?: SpinnerSize;
  label?: string;
  className?: string;
}

const DOT_POSITIONS = Array.from({ length: DOT_COUNT }, (_unused, index) => {
  const angle = (index / DOT_COUNT) * Math.PI * 2 - Math.PI / 2;
  return { index, centerX: 50 + Math.cos(angle) * 36, centerY: 50 + Math.sin(angle) * 36 };
});

export const DotSpinner = ({ size = 'md', label, className }: DotSpinnerProps) => (
  <div
    role="status"
    aria-live="polite"
    className={joinClasses('inline-flex flex-col items-center gap-3', className)}
  >
    <svg
      viewBox="0 0 100 100"
      className={joinClasses('block', MARK_SIZES[size])}
      aria-hidden="true"
    >
      {DOT_POSITIONS.map((dot) => (
        <circle
          key={dot.index}
          cx={dot.centerX}
          cy={dot.centerY}
          r="7"
          className="fill-[var(--tint)] animate-pulse"
          style={{
            animationDuration: 'var(--spin-dot-cycle)',
            animationDelay: `${dot.index / DOT_COUNT}s`,
          }}
        />
      ))}
    </svg>
    <SpinnerLabel label={label} size={size} />
  </div>
);
