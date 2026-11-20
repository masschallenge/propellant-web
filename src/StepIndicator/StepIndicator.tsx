import * as React from 'react';

export interface StepIndicatorStep {
  id: string;
  label: string;
}

export type StepIndicatorCompact = 'auto' | 'always' | 'never';

export interface StepIndicatorProps extends Omit<
  React.ComponentPropsWithoutRef<'nav'>,
  'children' | 'onSelect'
> {
  steps: StepIndicatorStep[];
  currentIndex: number;
  onStepSelect?: (index: number) => void;
  isStepReachable?: (index: number) => boolean;
  compact?: StepIndicatorCompact;
  label?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const FOCUS_RING =
  'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]';

const STEP_SHAPE =
  'inline-flex items-center gap-2 py-1 pl-1 pr-2 rounded-[var(--corner-capsule)] text-callout whitespace-nowrap';

const NUMBER_SHAPE =
  'flex-none inline-flex items-center justify-center w-5.5 h-5.5 rounded-full text-caption font-bold tabular-nums';

const CheckGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

type StepState = 'done' | 'current' | 'visited' | 'upcoming';

const stepState = (index: number, currentIndex: number, isReachable: boolean): StepState => {
  if (index < currentIndex) return 'done';
  if (index === currentIndex) return 'current';
  return isReachable ? 'visited' : 'upcoming';
};

const STATE_TEXT: Record<StepState, string> = {
  done: 'text-[var(--label)] font-medium',
  current: 'bg-[var(--tint-fill)] text-[var(--tint-hover)] font-semibold',
  visited: 'text-[var(--label)] font-medium',
  upcoming: 'text-[var(--label-secondary)] font-medium',
};

const STATE_NUMBER: Record<StepState, string> = {
  done: 'bg-[var(--tint)] text-[var(--on-tint)]',
  current: 'bg-[var(--tint)] text-[var(--on-tint)]',
  visited: 'bg-[var(--tint-fill)] text-[var(--tint-hover)]',
  upcoming: 'bg-[var(--fill-secondary)] text-[var(--label-secondary)]',
};

const SCREEN_READER_STATE: Record<StepState, string> = {
  done: ' (done)',
  current: ' (current step)',
  visited: ' (visited)',
  upcoming: ' (not started)',
};

export const StepIndicator = ({
  steps,
  currentIndex,
  onStepSelect,
  isStepReachable,
  compact = 'auto',
  label = 'Steps',
  className,
  ...rest
}: StepIndicatorProps) => {
  const currentStep = steps[currentIndex];

  const fullList = (
    <ol
      className={joinClasses(
        'm-0 p-0 list-none items-center gap-1.5',
        compact === 'auto' ? 'hidden sm:flex' : 'flex',
      )}
    >
      {steps.map((step, index) => {
        const isReachable = isStepReachable ? isStepReachable(index) : index < currentIndex;
        const state = stepState(index, currentIndex, isReachable);
        const isSelectable = index !== currentIndex && isReachable && Boolean(onStepSelect);
        const number = (
          <span className={joinClasses(NUMBER_SHAPE, STATE_NUMBER[state])} aria-hidden="true">
            {state === 'done' ? <CheckGlyph /> : index + 1}
          </span>
        );
        const content = (
          <>
            {number}
            {step.label}
            <span className="sr-only">{SCREEN_READER_STATE[state]}</span>
          </>
        );
        return (
          <li key={step.id} className="flex items-center gap-1.5">
            {isSelectable ? (
              <button
                type="button"
                aria-label={`${step.label}${SCREEN_READER_STATE[state]}`}
                onClick={() => onStepSelect?.(index)}
                className={joinClasses(
                  STEP_SHAPE,
                  STATE_TEXT[state],
                  'border-0 bg-transparent cursor-pointer font-[inherit] hover:bg-[var(--fill-tertiary)]',
                  FOCUS_RING,
                )}
              >
                {content}
              </button>
            ) : (
              <span
                aria-current={state === 'current' ? 'step' : undefined}
                className={joinClasses(STEP_SHAPE, STATE_TEXT[state])}
              >
                {content}
              </span>
            )}
            {index < steps.length - 1 ? (
              <span
                className="flex-none w-4.5 h-[var(--stroke-strong)] rounded-full bg-[var(--separator-strong)]"
                aria-hidden="true"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );

  const compactSummary = currentStep ? (
    <p
      className={joinClasses(
        'm-0 text-callout text-[var(--label-secondary)]',
        compact === 'auto' && 'sm:hidden',
      )}
      aria-current="step"
    >
      <span className="font-semibold text-[var(--tint-hover)]">
        Step {currentIndex + 1} of {steps.length}
      </span>{' '}
      · {currentStep.label}
    </p>
  ) : null;

  return (
    <nav aria-label={label} className={className} {...rest}>
      {compact === 'always' ? null : fullList}
      {compact === 'never' ? null : compactSummary}
    </nav>
  );
};
