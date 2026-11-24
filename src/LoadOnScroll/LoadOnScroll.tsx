import * as React from 'react';
import { Button } from '../Button/Button';
import { Skeleton } from '../Skeleton/Skeleton';
import { scrollContainerOf } from '../internal/scrollPadding';

export interface LoadOnScrollProps {
  hasMore: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  error?: string;
  itemCount?: number;
  placeholderRows?: number;
  loadingLabel?: string;
  loadedLabel?: (newItemCount: number) => string;
  retryLabel?: string;
  loadMoreLabel?: string;
  rootMargin?: string;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const subscribeToNothing = () => () => {};
const browserCanObserve = () => typeof IntersectionObserver !== 'undefined';
const serverCanObserve = () => true;

const defaultLoadedLabel = (newItemCount: number) =>
  newItemCount === 1 ? '1 more loaded' : `${newItemCount} more loaded`;

export const LoadOnScroll = ({
  hasMore,
  isLoading = false,
  onLoadMore,
  error,
  itemCount,
  placeholderRows = 3,
  loadingLabel = 'Loading more',
  loadedLabel = defaultLoadedLabel,
  retryLabel = 'Retry',
  loadMoreLabel = 'Load more',
  rootMargin = '400px',
  className,
}: LoadOnScrollProps) => {
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const loadMoreRef = React.useRef(onLoadMore);
  const canObserve = React.useSyncExternalStore(
    subscribeToNothing,
    browserCanObserve,
    serverCanObserve,
  );
  const [announcement, setAnnouncement] = React.useState(isLoading ? loadingLabel : '');
  const [wasLoading, setWasLoading] = React.useState(isLoading);
  const [countAtLoadStart, setCountAtLoadStart] = React.useState(itemCount);

  if (wasLoading !== isLoading) {
    setWasLoading(isLoading);
    if (isLoading) {
      setCountAtLoadStart(itemCount);
      setAnnouncement(loadingLabel);
    } else if (itemCount !== undefined && countAtLoadStart !== undefined) {
      const newItemCount = itemCount - countAtLoadStart;
      setAnnouncement(newItemCount > 0 ? loadedLabel(newItemCount) : '');
    } else {
      setAnnouncement('More loaded');
    }
  }

  React.useEffect(() => {
    loadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  const isWatching = hasMore && !isLoading && !error && canObserve;

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!isWatching || !sentinel) return;
    const scroller = scrollContainerOf(sentinel);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMoreRef.current?.();
      },
      { root: scroller === document.documentElement ? null : scroller, rootMargin },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isWatching, rootMargin]);

  const showsLoadMoreButton = hasMore && !isLoading && !error && !canObserve;

  return (
    <div className={joinClasses('relative flex flex-col', className)}>
      <span role="status" aria-live="polite" className="sr-only">
        {isLoading ? announcement : (error ?? announcement)}
      </span>
      {isLoading ? (
        <div aria-hidden="true" className="flex flex-col">
          {Array.from({ length: placeholderRows }, (_unused, index) => (
            <div
              key={index}
              data-placeholder-row=""
              className="flex items-center gap-3 min-h-[var(--row)] px-4"
            >
              <Skeleton width={index % 2 ? '55%' : '70%'} />
            </div>
          ))}
        </div>
      ) : null}
      {error && !isLoading ? (
        <div className="flex items-center justify-between gap-3 min-h-[var(--row)] px-4">
          <span aria-hidden="true" className="text-callout text-[var(--label-secondary)]">
            {error}
          </span>
          <Button size="sm" variant="gray" onClick={() => onLoadMore?.()}>
            {retryLabel}
          </Button>
        </div>
      ) : null}
      {showsLoadMoreButton ? (
        <div className="flex justify-center py-2">
          <Button size="sm" variant="gray" onClick={() => onLoadMore?.()}>
            {loadMoreLabel}
          </Button>
        </div>
      ) : null}
      {isWatching ? (
        <div
          ref={sentinelRef}
          aria-hidden="true"
          data-load-on-scroll-sentinel=""
          className="h-px"
        />
      ) : null}
    </div>
  );
};
