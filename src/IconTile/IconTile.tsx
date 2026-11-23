import * as React from 'react';
import type { ReactNode } from 'react';

export type IconTileTone =
  | 'teal'
  | 'gray'
  | 'orange'
  | 'application'
  | 'prescreening'
  | 'online'
  | 'pitch'
  | 'cohort'
  | 'closed';

export type IconTileSize = 'md' | 'lg';

export interface IconTileProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> {
  icon: ReactNode;
  tone?: IconTileTone;
  size?: IconTileSize;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const TONES: Record<IconTileTone, string> = {
  teal: 'bg-[var(--icon-tile-teal-bg)] text-[var(--icon-tile-teal-fg)]',
  gray: 'bg-[var(--icon-tile-gray-bg)] text-[var(--icon-tile-gray-fg)]',
  orange: 'bg-[var(--icon-tile-orange-bg)] text-[var(--icon-tile-orange-fg)]',
  application: 'bg-[var(--icon-tile-application-bg)] text-[var(--icon-tile-application-fg)]',
  prescreening: 'bg-[var(--icon-tile-prescreening-bg)] text-[var(--icon-tile-prescreening-fg)]',
  online: 'bg-[var(--icon-tile-online-bg)] text-[var(--icon-tile-online-fg)]',
  pitch: 'bg-[var(--icon-tile-pitch-bg)] text-[var(--icon-tile-pitch-fg)]',
  cohort: 'bg-[var(--icon-tile-cohort-bg)] text-[var(--icon-tile-cohort-fg)]',
  closed: 'bg-[var(--icon-tile-closed-bg)] text-[var(--icon-tile-closed-fg)]',
};

const SIZES: Record<IconTileSize, string> = {
  md: 'w-[var(--avatar-md)] h-[var(--avatar-md)] rounded-[var(--corner-tile)] [&>svg]:w-[var(--icon-md)] [&>svg]:h-[var(--icon-md)]',
  lg: 'w-[var(--icon-tile-lg-size)] h-[var(--icon-tile-lg-size)] rounded-[var(--corner-lg)] [&>svg]:w-[var(--icon-tile-lg-icon)] [&>svg]:h-[var(--icon-tile-lg-icon)]',
};

export const IconTile = ({
  icon,
  tone = 'teal',
  size = 'md',
  className,
  ...rest
}: IconTileProps) => {
  const isNamed = Boolean(rest['aria-label'] || rest['aria-labelledby']);
  return (
    <span
      data-tone={tone}
      data-size={size}
      {...(isNamed ? { role: 'img' } : { 'aria-hidden': true })}
      className={joinClasses(
        'flex-none inline-flex items-center justify-center',
        SIZES[size],
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {icon}
    </span>
  );
};
