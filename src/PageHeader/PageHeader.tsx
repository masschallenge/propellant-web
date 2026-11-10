import * as React from 'react';
import type { ReactNode } from 'react';
import { Button } from '../Button/Button';
import { imageFitClass } from '../internal/imageFit';

export interface PageHeaderProps {
  title: string;
  meta?: ReactNode;
  subtitle?: ReactNode;
  above?: ReactNode;
  backLabel?: string;
  onBack?: () => void;
  banner?: boolean | 'lime';
  avatarSrc?: string;
  avatarAlt?: string;
  verified?: boolean;
  actions?: ReactNode;
  toolbar?: ReactNode;
  centered?: boolean;
  framed?: boolean;
  divided?: boolean;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const BackGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

export const PageHeader = ({
  title,
  meta,
  subtitle,
  above,
  backLabel,
  onBack,
  banner = false,
  avatarSrc,
  avatarAlt = '',
  verified = false,
  actions,
  toolbar,
  centered = false,
  framed = false,
  divided = false,
  className,
}: PageHeaderProps) => {
  const hasBanner = banner !== false;

  const avatar = avatarSrc ? (
    <span className={joinClasses('relative flex-none', hasBanner && '-mt-12')}>
      <img
        src={avatarSrc}
        alt={avatarAlt}
        className={joinClasses(
          'block rounded-full shadow-[0_0_0_4px_var(--bg)] bg-[var(--bg-secondary)]',
          imageFitClass(),
          hasBanner ? 'w-24 h-24' : 'w-20 h-20',
        )}
      />
      {verified ? (
        <span
          role="img"
          aria-label="Verified"
          className="absolute right-0 bottom-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--success-solid)] text-[var(--on-success)] shadow-[0_0_0_3px_var(--bg)]"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5"
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
  ) : null;

  const body = (
    <>
      {hasBanner ? (
        <div
          role="presentation"
          data-banner={banner === 'lime' ? 'lime' : 'default'}
          className="h-[var(--phdr-banner-height)] bg-[var(--brand-surface)]"
        />
      ) : null}

      <div
        className={joinClasses(
          'flex flex-col gap-3',
          framed && (hasBanner ? 'px-6 pb-6' : 'p-6'),
          centered && 'items-center text-center',
        )}
      >
        {above}

        {backLabel ? (
          <Button
            variant="plain"
            size="sm"
            onClick={onBack}
            iconLeading={<BackGlyph />}
            className="self-start -ml-2"
          >
            {backLabel}
          </Button>
        ) : null}

        <div
          className={joinClasses(
            'flex gap-x-5 gap-y-3 flex-wrap',
            centered ? 'flex-col items-center' : hasBanner ? 'items-end' : 'items-start',
          )}
        >
          {avatar}
          <div
            className={joinClasses(
              'flex-1 flex flex-col gap-1',
              centered ? 'items-center min-w-0' : 'min-w-60',
            )}
          >
            <h1 className="m-0 text-large-title text-[var(--label)] text-balance">{title}</h1>
            {meta ? <span className="text-body text-[var(--label-secondary)]">{meta}</span> : null}
            {subtitle ? (
              <span className="text-subheadline text-[var(--label-secondary)] text-pretty">
                {subtitle}
              </span>
            ) : null}
          </div>
          {actions ? (
            <div
              className={joinClasses(
                'flex gap-2 flex-wrap flex-none items-center',
                !centered && 'ml-auto self-center',
              )}
            >
              {actions}
            </div>
          ) : null}
        </div>

        {toolbar}
      </div>
    </>
  );

  if (framed) {
    return (
      <header
        className={joinClasses(
          'rounded-[var(--corner-lg)] bg-[var(--bg)] overflow-hidden',
          className,
        )}
      >
        {body}
      </header>
    );
  }
  return (
    <header
      className={joinClasses(
        divided &&
          'pb-5 border-0 border-b-[length:var(--hairline)] border-solid border-[var(--separator)]',
        className,
      )}
    >
      {body}
    </header>
  );
};
