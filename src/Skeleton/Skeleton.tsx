import * as React from 'react';
import type { ReactNode } from 'react';

export type SkeletonShape = 'text' | 'heading' | 'pill' | 'block' | 'circle';

export interface SkeletonProps {
  shape?: SkeletonShape;
  width?: string;
  height?: string;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const SHAPE_CLASS: Record<SkeletonShape, string> = {
  text: 'h-[var(--type-callout-line)] rounded-[var(--corner-sm)]',
  heading: 'h-[var(--type-title2-line)] rounded-[var(--corner-md)]',
  pill: 'h-[var(--control-md)] rounded-[var(--corner-capsule)]',
  block: 'min-h-[var(--control-md)] rounded-[var(--corner-lg)]',
  circle: 'h-[var(--control-md)] w-[var(--control-md)] rounded-[var(--corner-capsule)]',
};

export const Skeleton = ({ shape = 'text', width, height, className }: SkeletonProps) => (
  <span
    aria-hidden="true"
    data-skeleton={shape}
    className={joinClasses(
      'block shrink-0 bg-[var(--fill-secondary)] motion-safe:animate-pulse',
      SHAPE_CLASS[shape],
      className,
    )}
    style={{
      width: shape === 'circle' ? undefined : (width ?? '100%'),
      height: shape === 'block' ? height : undefined,
    }}
  />
);

export interface SkeletonGroupProps {
  label: string;
  children?: ReactNode;
  className?: string;
}

export const SkeletonGroup = ({ label, children, className }: SkeletonGroupProps) => (
  <div className={className}>
    <span role="status" aria-live="polite" className="sr-only">
      {label}
    </span>
    <div aria-busy="true" aria-hidden="true" className="contents">
      {children}
    </div>
  </div>
);
