import * as React from 'react';
import type { ReactNode } from 'react';

export type RoleTagTone =
  'admin' | 'pm' | 'evaluator' | 'judge' | 'founder' | 'startup' | 'mentor' | 'neutral';

export interface RoleTagProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> {
  tone?: RoleTagTone;
  children: ReactNode;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const EVALUATOR_TONE = 'bg-[var(--role-tag-evaluator-fill)] text-[var(--role-tag-evaluator-label)]';
const FOUNDER_TONE = 'bg-[var(--role-tag-founder-fill)] text-[var(--role-tag-founder-label)]';

const TONES: Record<RoleTagTone, string> = {
  admin: 'bg-[var(--role-tag-admin-fill)] text-[var(--role-tag-admin-label)]',
  pm: 'bg-[var(--role-tag-pm-fill)] text-[var(--role-tag-pm-label)]',
  evaluator: EVALUATOR_TONE,
  judge: EVALUATOR_TONE,
  founder: FOUNDER_TONE,
  startup: FOUNDER_TONE,
  mentor: 'bg-[var(--role-tag-mentor-fill)] text-[var(--role-tag-mentor-label)]',
  neutral: 'bg-[var(--fill-secondary)] text-[var(--label-secondary)]',
};

export const RoleTag = ({ tone = 'neutral', className, children, ...rest }: RoleTagProps) => (
  <span
    data-tone={tone}
    className={joinClasses(
      'flex-none inline-flex items-center min-h-4.5 px-1.5 rounded-[var(--corner-sm)] whitespace-nowrap text-caption leading-4.5 font-semibold',
      TONES[tone],
      className,
    )}
    {...rest}
  >
    {children}
  </span>
);
