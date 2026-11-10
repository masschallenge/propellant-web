import * as React from 'react';
import type { ReactNode } from 'react';
import { imageFitClass } from '../internal/imageFit';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline';

export interface AvatarProps extends React.ComponentPropsWithoutRef<'span'> {
  src?: string;
  alt?: string;
  initials?: string;
  neutral?: boolean;
  size?: AvatarSize;
  squircle?: boolean;
  ring?: boolean;
  status?: AvatarStatus;
  verified?: boolean;
  companyBadge?: { src: string; alt?: string };
  autoCrop?: boolean;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const BOX: Record<AvatarSize, string> = {
  xs: 'w-[var(--avatar-xs)] h-[var(--avatar-xs)]',
  sm: 'w-[var(--avatar-sm)] h-[var(--avatar-sm)]',
  md: 'w-[var(--avatar-md)] h-[var(--avatar-md)]',
  lg: 'w-[var(--avatar-lg)] h-[var(--avatar-lg)]',
  xl: 'w-[var(--avatar-xl)] h-[var(--avatar-xl)]',
};

const INITIALS_TEXT: Record<AvatarSize, string> = {
  xs: 'text-caption',
  sm: 'text-footnote',
  md: 'text-subheadline',
  lg: 'text-headline',
  xl: 'text-title2',
};

const PIP: Record<AvatarSize, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
};

const MARK: Record<AvatarSize, string> = {
  xs: 'w-2.5 h-2.5',
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
};

const CORNER_MARK = 'absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2';
const BG_RING = 'shadow-[0_0_0_2px_var(--bg)]';

const PersonGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-[60%] h-[60%]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
  </svg>
);

export const Avatar = ({
  src,
  alt = '',
  initials,
  neutral = false,
  size = 'md',
  squircle = false,
  ring = false,
  status,
  verified = false,
  companyBadge,
  autoCrop = false,
  className,
  ...rest
}: AvatarProps) => {
  const face = joinClasses(
    'w-full h-full block',
    squircle ? 'rounded-[var(--corner-lg)]' : 'rounded-full',
    ring && BG_RING,
  );

  return (
    <span
      className={joinClasses('fs-exclude relative flex-none inline-flex', BOX[size], className)}
      {...rest}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={joinClasses(
            face,
            imageFitClass(autoCrop),
            !autoCrop && 'bg-[var(--bg-secondary)]',
            !ring && 'shadow-[inset_0_0_0_var(--hairline)_var(--separator)]',
          )}
        />
      ) : initials ? (
        <span
          className={joinClasses(
            face,
            'flex items-center justify-center font-semibold select-none text-[var(--label-secondary)]',
            INITIALS_TEXT[size],
            neutral ? 'bg-[var(--fill-secondary)]' : 'bg-[var(--fill)]',
          )}
          {...(alt ? { role: 'img', 'aria-label': alt } : { 'aria-hidden': true })}
        >
          {initials}
        </span>
      ) : (
        <span
          className={joinClasses(
            face,
            'flex items-center justify-center bg-[var(--fill-secondary)] text-[var(--label-tertiary)]',
          )}
          aria-hidden="true"
        >
          <PersonGlyph />
        </span>
      )}
      {status ? (
        <>
          <span
            data-status={status}
            className={joinClasses(
              'absolute right-0 bottom-0 rounded-full',
              BG_RING,
              PIP[size],
              status === 'online' ? 'bg-[var(--success-solid)]' : 'bg-[var(--label-tertiary)]',
            )}
            aria-hidden="true"
          />
          <span className="sr-only">{status === 'online' ? 'Online' : 'Offline'}</span>
        </>
      ) : null}
      {companyBadge ? (
        <span
          className={joinClasses(
            CORNER_MARK,
            'flex items-center justify-center overflow-hidden rounded-[var(--corner-sm)] bg-[var(--bg)]',
            BG_RING,
            MARK[size],
          )}
          role="img"
          aria-label={companyBadge.alt}
        >
          <img src={companyBadge.src} alt="" className="w-full h-full object-contain" />
        </span>
      ) : null}
      {verified ? (
        <span
          className={joinClasses(
            CORNER_MARK,
            'flex items-center justify-center rounded-full bg-[var(--success-solid)] text-[var(--on-success)]',
            BG_RING,
            MARK[size],
          )}
          role="img"
          aria-label="Verified"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-[70%] h-[70%]"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
      ) : null}
    </span>
  );
};

export interface AvatarGroupProps {
  overflow?: number;
  onAdd?: () => void;
  addLabel?: string;
  className?: string;
  children?: ReactNode;
}

export const AvatarGroup = ({
  overflow,
  onAdd,
  addLabel = 'Add person',
  className,
  children,
}: AvatarGroupProps) => (
  <span className={joinClasses('flex items-center [&>*:not(:first-child)]:-ml-2', className)}>
    {children}
    {overflow ? (
      <span className="w-[var(--avatar-md)] h-[var(--avatar-md)] rounded-full flex items-center justify-center text-footnote font-medium tabular-nums text-[var(--label-secondary)] bg-[var(--fill-secondary)] shadow-[0_0_0_2px_var(--bg)]">
        {`+${overflow}`}
      </span>
    ) : null}
    {onAdd ? (
      <button
        type="button"
        aria-label={addLabel}
        onClick={onAdd}
        className="relative !ml-2 w-[var(--avatar-md)] h-[var(--avatar-md)] p-0 rounded-full border-0 bg-[var(--fill-secondary)] text-[var(--label)] cursor-pointer flex items-center justify-center hover:bg-[var(--fill)] focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[max(100%,var(--hit-target))] before:h-[max(100%,var(--hit-target))]"
      >
        <svg
          viewBox="0 0 24 24"
          className="block w-[var(--icon-md)] h-[var(--icon-md)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    ) : null}
  </span>
);
