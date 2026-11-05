import * as React from 'react';
import { FIELD_LABEL_TONE } from '../TextField/fieldText';

export type SliderRange = [number, number];

type ThumbIndex = 0 | 1;

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  rangeValue?: SliderRange;
  defaultRangeValue?: SliderRange;
  onRangeChange?: (value: SliderRange) => void;
  showChip?: boolean;
  showLabel?: boolean;
  format?: (value: number) => string;
  label?: string;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const formatPlain = (value: number) => String(value);

const clamp = (value: number, lower: number, upper: number) =>
  Math.min(upper, Math.max(lower, value));

const THUMB = joinClasses(
  'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full touch-none cursor-grab active:cursor-grabbing',
  'bg-[var(--gray-0)] shadow-[var(--shadow-thumb)]',
  'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]',
  "after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[max(100%,var(--hit-target))] after:h-[max(100%,var(--hit-target))]",
);

export const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = 40,
  onChange,
  rangeValue,
  defaultRangeValue,
  onRangeChange,
  showChip = false,
  showLabel = false,
  format = formatPlain,
  label,
  disabled = false,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}: SliderProps) => {
  const isRange = Boolean(rangeValue || defaultRangeValue);
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [internalRange, setInternalRange] = React.useState<SliderRange>(
    defaultRangeValue || [20, 70],
  );
  const currentValue = value === undefined ? internalValue : value;
  const currentRange = rangeValue === undefined ? internalRange : rangeValue;
  const trackRef = React.useRef<HTMLDivElement>(null);

  const percentOf = (amount: number) => ((amount - min) / (max - min)) * 100;

  const commit = (nextValue: number, thumbIndex: ThumbIndex) => {
    const bounded = clamp(nextValue, min, max);
    if (isRange) {
      const nextRange: SliderRange =
        thumbIndex === 0
          ? [Math.min(bounded, currentRange[1]), currentRange[1]]
          : [currentRange[0], Math.max(bounded, currentRange[0])];
      if (rangeValue === undefined) setInternalRange(nextRange);
      onRangeChange?.(nextRange);
      return;
    }
    if (value === undefined) setInternalValue(bounded);
    onChange?.(bounded);
  };

  const valueAtPointer = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return null;
    const bounds = track.getBoundingClientRect();
    if (!bounds.width) return null;
    const raw = min + ((clientX - bounds.left) / bounds.width) * (max - min);
    return Math.round(raw / step) * step;
  };

  const followPointer = (thumbIndex: ThumbIndex, startX: number) => {
    const handleMove = (moveEvent: PointerEvent) => {
      const nextValue = valueAtPointer(moveEvent.clientX);
      if (nextValue !== null) commit(nextValue, thumbIndex);
    };
    const handleUp = () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
    };
    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
    const startValue = valueAtPointer(startX);
    if (startValue !== null) commit(startValue, thumbIndex);
  };

  const handleThumbPointerDown =
    (thumbIndex: ThumbIndex) => (event: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.focus();
      followPointer(thumbIndex, event.clientX);
    };

  const handleTrackPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const pointerValue = valueAtPointer(event.clientX);
    if (pointerValue === null) return;
    event.preventDefault();
    const thumbIndex: ThumbIndex =
      isRange && Math.abs(pointerValue - currentRange[1]) < Math.abs(pointerValue - currentRange[0])
        ? 1
        : 0;
    followPointer(thumbIndex, event.clientX);
  };

  const handleKeyDown = (thumbIndex: ThumbIndex) => (event: React.KeyboardEvent) => {
    if (disabled) return;
    const base = isRange ? currentRange[thumbIndex] : currentValue;
    const keyTargets: Record<string, number> = {
      ArrowRight: base + step,
      ArrowUp: base + step,
      ArrowLeft: base - step,
      ArrowDown: base - step,
      Home: min,
      End: max,
    };
    if (!(event.key in keyTargets)) return;
    event.preventDefault();
    commit(keyTargets[event.key], thumbIndex);
  };

  const fallbackName = (thumbIndex: ThumbIndex) =>
    isRange ? (thumbIndex === 0 ? 'Minimum' : 'Maximum') : 'Value';

  const renderThumb = (thumbValue: number, thumbIndex: ThumbIndex) => (
    <div
      key={thumbIndex}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={thumbValue}
      aria-valuetext={format(thumbValue)}
      aria-label={ariaLabel || label || fallbackName(thumbIndex)}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid || undefined}
      aria-disabled={disabled || undefined}
      onPointerDown={handleThumbPointerDown(thumbIndex)}
      onKeyDown={handleKeyDown(thumbIndex)}
      style={{ left: `${percentOf(thumbValue)}%` }}
      className={THUMB}
    >
      {showChip ? (
        <span className="absolute bottom-[calc(100%+var(--space-2))] left-1/2 -translate-x-1/2 inline-flex items-center px-2 py-1 rounded-[var(--corner-lg)] whitespace-nowrap text-footnote font-medium tabular-nums bg-[var(--bg-elevated)] text-[var(--label)] shadow-[var(--shadow-float)]">
          {format(thumbValue)}
        </span>
      ) : null}
      {showLabel ? (
        <span className="absolute top-[calc(100%+var(--space-2))] left-1/2 -translate-x-1/2 whitespace-nowrap text-footnote font-medium tabular-nums text-[var(--label-secondary)]">
          {format(thumbValue)}
        </span>
      ) : null}
    </div>
  );

  const fillStart = isRange ? percentOf(currentRange[0]) : 0;
  const fillEnd = isRange ? percentOf(currentRange[1]) : percentOf(currentValue);

  return (
    <div className={joinClasses('flex flex-col gap-2', className)}>
      {label ? <span className={FIELD_LABEL_TONE.default}>{label}</span> : null}
      <div
        className={joinClasses(
          'relative h-5 touch-none',
          disabled ? 'opacity-[var(--opacity-disabled)] cursor-not-allowed' : 'cursor-pointer',
        )}
        onPointerDown={handleTrackPointerDown}
      >
        <div
          ref={trackRef}
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-[var(--fill-secondary)]"
        >
          <div
            className="absolute top-0 bottom-0 rounded-full bg-[var(--tint)]"
            style={{ left: `${fillStart}%`, width: `${fillEnd - fillStart}%` }}
          />
        </div>
        {isRange
          ? [renderThumb(currentRange[0], 0), renderThumb(currentRange[1], 1)]
          : renderThumb(currentValue, 0)}
      </div>
    </div>
  );
};
