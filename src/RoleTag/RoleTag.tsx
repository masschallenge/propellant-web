import * as React from 'react';
import type { ReactNode } from 'react';

export type RoleTagTone = 'admin' | 'pm' | 'judge' | 'startup' | 'mentor' | 'neutral';

export interface RoleTagProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> {
  tone?: RoleTagTone;
  children: ReactNode;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const TONES: Record<RoleTagTone, string> = {
  admin: 'bg-[var(--critical-fill)] text-[var(--critical)]',
  pm: 'bg-[var(--tint-fill)] text-[var(--tint)]',
  judge: 'bg-[var(--warning-fill)] text-[var(--warning)]',
  startup: 'bg-[var(--success-fill)] text-[var(--success)]',
  mentor: 'bg-[var(--role-tag-mentor-fill)] text-[var(--role-tag-mentor-label)]',
  neutral: 'bg-[var(--fill-secondary)] text-[var(--label-secondary)]',
};

export const RoleTag = ({ tone = 'neutral', className, children, ...rest }: RoleTagProps) => (
  <span
    data-tone={tone}
    className={joinClasses(
      'flex-none inline-flex items-center min-h-4.5 px-1.5 rounded-[var(--corner-sm)] whitespace-nowrap uppercase text-caption2 leading-5 font-semibold',
      TONES[tone],
      className,
    )}
    {...rest}
  >
    {children}
  </span>
);
