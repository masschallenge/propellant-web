import * as React from 'react';
import type { ReactNode } from 'react';

export interface PageContainerProps {
  size?: 'default' | 'wide' | 'full';
  as?: React.ElementType;
  children?: ReactNode;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const MAX_WIDTH: Record<NonNullable<PageContainerProps['size']>, string> = {
  default: 'max-w-[960px]',
  wide: 'max-w-[var(--width-page)]',
  full: 'max-w-none',
};

export const PageContainer = ({
  size = 'default',
  as: Element = 'div',
  children,
  className,
}: PageContainerProps) => (
  <Element
    className={joinClasses(
      'w-full mx-auto flex flex-col gap-[var(--space-6)]',
      MAX_WIDTH[size],
      className,
    )}
  >
    {children}
  </Element>
);
