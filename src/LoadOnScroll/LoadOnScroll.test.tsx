import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LoadOnScroll } from './LoadOnScroll';

type IntersectionCallback = (entries: { isIntersecting: boolean }[]) => void;

const stubIntersectionObserver = () => {
  const observers: { callback: IntersectionCallback; options?: IntersectionObserverInit }[] = [];
  const disconnect = vi.fn();
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: IntersectionCallback, options?: IntersectionObserverInit) {
        observers.push({ callback, options });
      }
      observe = vi.fn();
      disconnect = disconnect;
    },
  );
  const scrollIntoView = (isIntersecting = true) =>
    act(() => observers.at(-1)?.callback([{ isIntersecting }]));
  return { observers, disconnect, scrollIntoView };
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('LoadOnScroll', () => {
  it('asks for the next page when the end of the list scrolls into view', () => {
    const { observers, scrollIntoView } = stubIntersectionObserver();
    const onLoadMore = vi.fn();
    render(<LoadOnScroll hasMore onLoadMore={onLoadMore} />);
    expect(observers.at(-1)?.options).toEqual({ rootMargin: '400px' });
    scrollIntoView(false);
    expect(onLoadMore).not.toHaveBeenCalled();
    scrollIntoView();
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('shows placeholder rows while the next page comes and offers no button', () => {
    stubIntersectionObserver();
    const { container } = render(<LoadOnScroll hasMore isLoading placeholderRows={4} />);
    expect(container.querySelectorAll('[data-placeholder-row]')).toHaveLength(4);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('keeps one status region mounted and announces loading, then how many loaded', () => {
    stubIntersectionObserver();
    const { rerender } = render(<LoadOnScroll hasMore itemCount={12} />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('');
    rerender(<LoadOnScroll hasMore isLoading itemCount={12} loadingLabel="Loading applications" />);
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('Loading applications');
    rerender(<LoadOnScroll hasMore itemCount={24} />);
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('12 more loaded');
    rerender(<LoadOnScroll hasMore isLoading itemCount={24} />);
    rerender(<LoadOnScroll hasMore={false} itemCount={25} />);
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('1 more loaded');
  });

  it('says more loaded when it does not know the count', () => {
    stubIntersectionObserver();
    const { rerender } = render(<LoadOnScroll hasMore isLoading />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading more');
    rerender(<LoadOnScroll hasMore />);
    expect(screen.getByRole('status')).toHaveTextContent('More loaded');
  });

  it('stops watching while a page loads and starts again once it arrives', () => {
    const { observers, disconnect } = stubIntersectionObserver();
    const { rerender } = render(<LoadOnScroll hasMore />);
    expect(observers).toHaveLength(1);
    rerender(<LoadOnScroll hasMore isLoading />);
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(observers).toHaveLength(1);
    rerender(<LoadOnScroll hasMore />);
    expect(observers).toHaveLength(2);
  });

  it('stops watching after an error and offers Retry instead of looping', async () => {
    const { observers, disconnect } = stubIntersectionObserver();
    const onLoadMore = vi.fn();
    const { rerender } = render(<LoadOnScroll hasMore onLoadMore={onLoadMore} />);
    rerender(
      <LoadOnScroll hasMore onLoadMore={onLoadMore} error="More applications could not load." />,
    );
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(observers).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('More applications could not load.');
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    expect(observers).toHaveLength(1);
  });

  it('only keeps its status region once every page has loaded', () => {
    const { observers } = stubIntersectionObserver();
    const { container } = render(<LoadOnScroll hasMore={false} onLoadMore={vi.fn()} />);
    expect(observers).toHaveLength(0);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(container.querySelector('[data-load-on-scroll-sentinel]')).toBeNull();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls the latest handler without watching again', () => {
    const { observers, scrollIntoView } = stubIntersectionObserver();
    const firstHandler = vi.fn();
    const latestHandler = vi.fn();
    const { rerender } = render(<LoadOnScroll hasMore onLoadMore={firstHandler} />);
    rerender(<LoadOnScroll hasMore onLoadMore={latestHandler} />);
    expect(observers).toHaveLength(1);
    scrollIntoView();
    expect(firstHandler).not.toHaveBeenCalled();
    expect(latestHandler).toHaveBeenCalledTimes(1);
  });

  it('offers a Load more button where IntersectionObserver is missing', async () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const onLoadMore = vi.fn();
    const { container } = render(
      <LoadOnScroll hasMore onLoadMore={onLoadMore} loadMoreLabel="Load more applications" />,
    );
    expect(container.querySelector('[data-load-on-scroll-sentinel]')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Load more applications' }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });
});
