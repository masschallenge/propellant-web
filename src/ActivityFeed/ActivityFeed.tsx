import * as React from 'react';
import type { ReactNode } from 'react';
import { Avatar } from '../Avatar/Avatar';

export interface ActivityItem {
  id: string;
  name: string;
  action?: ReactNode;
  when: string;
  avatarSrc?: string;
  initials?: string;
  neutral?: boolean;
  online?: boolean;
  message?: ReactNode;
  handle?: string;
  unread?: boolean;
  detail?: ReactNode;
}

export type ActivityFeedVariant = 'divided' | 'connected' | 'spaced';

export interface ActivityFeedProps {
  items: ActivityItem[];
  variant?: ActivityFeedVariant;
  'aria-label'?: string;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const INSET_SEPARATOR =
  "after:content-[''] after:absolute after:left-[calc(var(--avatar-md)+var(--space-3))] after:right-0 after:top-0 after:h-[var(--hairline)] after:bg-[var(--separator)]";

const SPINE =
  "before:content-[''] before:absolute before:left-[calc(var(--avatar-md)/2-1px)] before:top-[calc(var(--avatar-md)+var(--space-3)+var(--space-1))] before:-bottom-1 before:w-0.5 before:rounded-[var(--corner-capsule)] before:bg-[var(--separator)]";

export const ActivityFeed = ({
  items,
  variant = 'divided',
  'aria-label': ariaLabel = 'Activity',
  className,
}: ActivityFeedProps) => (
  <ul
    aria-label={ariaLabel}
    className={joinClasses(
      'list-none m-0 rounded-[var(--corner-lg)] bg-[var(--bg)]',
      variant === 'spaced' ? 'flex flex-col gap-5 p-4' : 'px-4 py-1',
      className,
    )}
  >
    {items.map((item, index) => {
      const isMessage = item.message !== undefined;
      return (
        <li
          key={item.id}
          className={joinClasses(
            'relative flex gap-3',
            variant !== 'spaced' && 'py-3',
            variant === 'divided' && index > 0 && INSET_SEPARATOR,
            variant === 'connected' && index < items.length - 1 && SPINE,
          )}
        >
          <Avatar
            src={item.avatarSrc}
            initials={item.initials}
            neutral={item.neutral}
            status={item.online ? 'online' : undefined}
            size="md"
          />
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <p className="m-0 flex items-baseline gap-x-1.5 flex-wrap text-callout text-[var(--label-secondary)]">
              <span
                className={joinClasses(
                  'fs-mask text-[var(--label)]',
                  item.unread ? 'font-semibold' : 'font-medium',
                )}
              >
                {item.name}
              </span>
              {item.handle ? (
                <span className="fs-mask text-[var(--label-tertiary)]">{item.handle}</span>
              ) : null}
              {isMessage ? (
                <span className="text-footnote text-[var(--label-tertiary)] before:content-['·'] before:mr-1.5">
                  {item.when}
                </span>
              ) : (
                <span>{item.action}</span>
              )}
            </p>
            {isMessage ? (
              <p className="fs-mask m-0 text-callout text-[var(--label)]">{item.message}</p>
            ) : null}
            {item.detail ? (
              <div className="fs-mask text-subheadline text-[var(--label-secondary)]">
                {item.detail}
              </div>
            ) : null}
            {isMessage ? null : (
              <span className="text-footnote text-[var(--label-tertiary)]">{item.when}</span>
            )}
          </div>
          {item.unread ? (
            <span
              className="flex-none self-start w-2 h-2 mt-1.5 rounded-full bg-[var(--tint)]"
              role="img"
              aria-label="Unread"
            />
          ) : null}
        </li>
      );
    })}
  </ul>
);
