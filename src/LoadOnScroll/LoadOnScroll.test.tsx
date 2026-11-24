import { act, cleanup, render, screen } from '@testing-library/react';
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

  it('shows placeholder rows and announces loading while the next page comes', () => {
    stubIntersectionObserver();
    const { container } = render(
      <LoadOnScroll hasMore isLoading placeholderRows={4} loadingLabel="Loading applications" />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Loading applications');
    expect(container.querySelectorAll('[data-placeholder-row]')).toHaveLength(4);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
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

  it('renders nothing once every page has loaded', () => {
    const { observers } = stubIntersectionObserver();
    const { container } = render(<LoadOnScroll hasMore={false} onLoadMore={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
    expect(observers).toHaveLength(0);
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

  it('does nothing where IntersectionObserver is missing', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const { container } = render(<LoadOnScroll hasMore onLoadMore={vi.fn()} />);
    expect(container.querySelector('[data-load-on-scroll-sentinel]')).toBeInTheDocument();
  });
});
