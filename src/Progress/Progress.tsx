import * as React from 'react';

export interface ProgressProps {
  value: number;
  label?: string;
  valuePosition?: 'none' | 'right' | 'below' | 'float-top' | 'float-bottom';
  className?: string;
  'aria-label'?: string;
  tone?: 'accent' | 'success';
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

const FILL_MOTION = 'duration-[var(--spring-smooth-duration)] ease-[var(--spring-smooth)]';

export const Progress = ({
  value,
  label,
  valuePosition = 'right',
  className,
  tone = 'accent',
  'aria-label': ariaLabel,
}: ProgressProps) => {
  const percent = clampPercent(value);
  const bar = (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={ariaLabel || label || 'Progress'}
      className="relative flex-1 h-1.5 rounded-[var(--corner-capsule)] bg-[var(--fill-secondary)] overflow-hidden"
    >
      <span
        className={joinClasses(
          'absolute inset-y-0 left-0 rounded-[var(--corner-capsule)] transition-[width]',
          FILL_MOTION,
          tone === 'success' ? 'bg-[var(--success-solid)]' : 'bg-[var(--tint)]',
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
  const percentText = (
    <span className="flex-none text-subheadline font-medium tabular-nums text-[var(--label-secondary)]">
      {`${percent}%`}
    </span>
  );
  const isFloating = valuePosition === 'float-top' || valuePosition === 'float-bottom';

  return (
    <div className={joinClasses('w-full', className)}>
      {label ? (
        <span className="block mb-1.5 text-subheadline text-[var(--label-secondary)]">{label}</span>
      ) : null}
      <div className={joinClasses('relative', !isFloating && 'flex items-center gap-3')}>
        {isFloating ? (
          <>
            <span
              className={joinClasses(
                'absolute -translate-x-1/2 px-2 py-1 rounded-[var(--corner-md)] text-footnote font-medium tabular-nums whitespace-nowrap',
                'bg-[var(--bg-elevated)] text-[var(--label)] shadow-[var(--shadow-float)]',
                valuePosition === 'float-top'
                  ? 'bottom-[calc(100%+var(--space-2))]'
                  : 'top-[calc(100%+var(--space-2))]',
              )}
              style={{ left: `${percent}%` }}
            >
              {`${percent}%`}
            </span>
            <div className="flex">{bar}</div>
          </>
        ) : (
          <>
            {bar}
            {valuePosition === 'right' ? percentText : null}
          </>
        )}
      </div>
      {valuePosition === 'below' ? (
        <div className="mt-1.5 flex justify-end">{percentText}</div>
      ) : null}
    </div>
  );
};

const RING_SIZES = { sm: 64, md: 96, lg: 136 } as const;

export interface ProgressRingProps {
  value: number;
  size?: 'sm' | 'md' | 'lg' | number;
  thickness?: number;
  label?: string;
  sublabel?: string;
  tone?: 'accent' | 'success';
  className?: string;
  'aria-label'?: string;
}

export const ProgressRing = ({
  value,
  size = 'md',
  thickness,
  label,
  sublabel,
  tone,
  className,
  'aria-label': ariaLabel,
}: ProgressRingProps) => {
  const percent = clampPercent(value);
  const diameter = typeof size === 'number' ? size : (RING_SIZES[size] ?? RING_SIZES.md);
  const stroke = thickness || Math.max(6, Math.round(diameter / 11));
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = diameter / 2;
  const isComplete = (tone || (percent >= 100 ? 'success' : 'accent')) === 'success';
  const centerText = label ?? `${percent}%`;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={ariaLabel || (label ? `${label} progress` : 'Progress')}
      className={joinClasses(
        'relative inline-flex items-center justify-center align-middle',
        className,
      )}
      style={{ width: diameter, height: diameter }}
    >
      <svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        className="block"
        aria-hidden="true"
      >
        <g transform={`rotate(-90 ${center} ${center})`}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className="stroke-[var(--fill-secondary)]"
          />
          {percent > 0 ? (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              strokeWidth={stroke}
              strokeLinecap="round"
              className={joinClasses(
                'transition-[stroke-dasharray]',
                FILL_MOTION,
                isComplete ? 'stroke-[var(--success-solid)]' : 'stroke-[var(--tint)]',
              )}
              strokeDasharray={`${(percent / 100) * circumference} ${circumference}`}
            />
          ) : null}
        </g>
      </svg>
      <span
        className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none"
        style={{ padding: stroke + 4, gap: Math.max(2, Math.round(diameter / 32)) }}
      >
        {sublabel ? (
          <span
            className="font-medium text-[var(--label-secondary)]"
            style={{ fontSize: Math.max(12, Math.round(diameter / 8)) }}
          >
            {sublabel}
          </span>
        ) : null}
        <span
          className="font-semibold tabular-nums text-[var(--label)]"
          style={{ fontSize: Math.max(14, Math.round(diameter / 4.8)) }}
        >
          {centerText}
        </span>
      </span>
    </div>
  );
};

export const RadialProgress = ProgressRing;

export interface ProgressCircleProps {
  value: number;
  size?: number;
  half?: boolean;
  showValue?: boolean;
  centerLabel?: string;
  caption?: string;
  className?: string;
  'aria-label'?: string;
}

export const ProgressCircle = ({
  value,
  size = 120,
  half = false,
  showValue = true,
  centerLabel,
  caption,
  className,
  'aria-label': ariaLabel,
}: ProgressCircleProps) => {
  const percent = clampPercent(value);
  const stroke = Math.max(6, Math.round(size / 12));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = half ? circumference / 2 : circumference;
  const filledLength = (percent / 100) * arcLength;
  const center = size / 2;
  const height = half ? center + stroke : size;
  const halfRotation = half ? `rotate(180 ${center} ${center})` : undefined;

  return (
    <div className={joinClasses('inline-flex flex-col items-center gap-2', className)}>
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={size}
          height={height}
          viewBox={`0 0 ${size} ${height}`}
          className="block"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label={ariaLabel || caption || 'Progress'}
        >
          <g transform={half ? '' : `rotate(-90 ${center} ${center})`}>
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              strokeWidth={stroke}
              strokeLinecap="round"
              className="stroke-[var(--fill-secondary)]"
              strokeDasharray={half ? `${arcLength} ${circumference}` : undefined}
              transform={halfRotation}
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              strokeWidth={stroke}
              strokeLinecap="round"
              className={joinClasses(
                'stroke-[var(--tint)] transition-[stroke-dasharray]',
                FILL_MOTION,
              )}
              strokeDasharray={`${filledLength} ${circumference}`}
              transform={halfRotation}
            />
          </g>
        </svg>
        <div
          className={joinClasses(
            'absolute inset-0 flex flex-col items-center text-center',
            half ? 'justify-end pb-2' : 'justify-center',
          )}
        >
          {showValue ? (
            <span
              className="font-semibold tabular-nums leading-[1.1] text-[var(--label)]"
              style={{ fontSize: Math.round(size / 5) }}
            >
              {`${percent}%`}
            </span>
          ) : null}
          {centerLabel ? (
            <span className="text-footnote text-[var(--label-secondary)]">{centerLabel}</span>
          ) : null}
        </div>
      </div>
      {caption ? (
        <span className="text-footnote text-[var(--label-secondary)]">{caption}</span>
      ) : null}
    </div>
  );
};
