import * as React from 'react';
import { MC_LOGO_HORIZONTAL, MC_MONOGRAM } from '../assets/logos';

export type LogoLockup = 'horizontal' | 'monogram';
export type LogoTreatment = 'color' | 'white' | 'black';

export interface LogoProps extends Omit<
  React.ComponentPropsWithoutRef<'img'>,
  'src' | 'alt' | 'children'
> {
  lockup?: LogoLockup;
  treatment?: LogoTreatment;
  label?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const SOURCES: Record<LogoLockup, string> = {
  horizontal: MC_LOGO_HORIZONTAL,
  monogram: MC_MONOGRAM,
};

const TREATMENTS: Record<LogoTreatment, string> = {
  color: '',
  white: '[filter:brightness(0)_invert(1)]',
  black: '[filter:brightness(0)]',
};

export const Logo = ({
  lockup = 'horizontal',
  treatment = 'color',
  label = 'MassChallenge',
  className,
  ...rest
}: LogoProps) => (
  <img
    src={SOURCES[lockup]}
    alt={label}
    data-lockup={lockup}
    data-treatment={treatment}
    draggable={false}
    className={joinClasses(
      'block h-6 w-auto max-w-full object-contain',
      TREATMENTS[treatment],
      className,
    )}
    {...rest}
  />
);
