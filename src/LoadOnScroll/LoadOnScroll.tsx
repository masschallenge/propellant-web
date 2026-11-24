import * as React from 'react';
import { Skeleton, SkeletonGroup } from '../Skeleton/Skeleton';

export interface LoadOnScrollProps {
  hasMore: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  placeholderRows?: number;
  loadingLabel?: string;
  rootMargin?: string;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

export const LoadOnScroll = ({
  hasMore,
  isLoading = false,
  onLoadMore,
  placeholderRows = 3,
  loadingLabel = 'Loading more',
  rootMargin = '400px',
  className,
}: LoadOnScrollProps) => {
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const loadMoreRef = React.useRef(onLoadMore);
  React.useEffect(() => {
    loadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!hasMore || isLoading || !sentinel || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMoreRef.current?.();
      },
      { rootMargin },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, rootMargin]);

  if (!hasMore && !isLoading) return null;
  return (
    <div className={joinClasses('flex flex-col', className)}>
      {isLoading ? (
        <SkeletonGroup label={loadingLabel} className="flex flex-col">
          {Array.from({ length: placeholderRows }, (_unused, index) => (
            <div
              key={index}
              data-placeholder-row=""
              className="flex items-center gap-3 min-h-[var(--row)] px-4"
            >
              <Skeleton width={index % 2 ? '55%' : '70%'} />
            </div>
          ))}
        </SkeletonGroup>
      ) : null}
      <div ref={sentinelRef} aria-hidden="true" data-load-on-scroll-sentinel="" className="h-px" />
    </div>
  );
};
