import { afterEach, describe, expect, it, vi } from 'vitest';
import { releaseScrollPadding, reserveScrollPadding, scrollContainerOf } from './scrollPadding';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.documentElement.style.scrollPaddingTop = '';
});

const nest = (...overflows: string[]) => {
  const elements = overflows.map((overflow) => {
    const element = document.createElement('div');
    element.style.overflowY = overflow;
    return element;
  });
  elements.reduce<HTMLElement>((parent, child) => {
    parent.appendChild(child);
    return child;
  }, document.body);
  return elements;
};

describe('scrollContainerOf', () => {
  it('finds the nearest ancestor that clips or scrolls, as sticky positioning does', () => {
    const [frame, wrapper, header] = nest('auto', 'visible', 'visible');
    expect(scrollContainerOf(header)).toBe(frame);
    expect(scrollContainerOf(wrapper)).toBe(frame);
  });

  it('falls back to the document when nothing between it and the body scrolls', () => {
    const [, header] = nest('visible', 'visible');
    expect(scrollContainerOf(header)).toBe(document.documentElement);
  });
});

describe('scroll padding claims', () => {
  it('adds the tallest claim to the starting padding and restores it in any release order', () => {
    const scroller = document.documentElement;
    scroller.style.scrollPaddingTop = '8px';
    const appToolbar = Symbol('app toolbar');
    const pageToolbar = Symbol('page toolbar');

    reserveScrollPadding(scroller, appToolbar, 52);
    reserveScrollPadding(scroller, pageToolbar, 96);
    expect(scroller.style.scrollPaddingTop).toBe('104px');

    releaseScrollPadding(scroller, pageToolbar);
    expect(scroller.style.scrollPaddingTop).toBe('60px');
    reserveScrollPadding(scroller, pageToolbar, 40);
    releaseScrollPadding(scroller, appToolbar);
    expect(scroller.style.scrollPaddingTop).toBe('48px');
    releaseScrollPadding(scroller, pageToolbar);
    expect(scroller.style.scrollPaddingTop).toBe('8px');
  });

  it('adds to padding a stylesheet sets and leaves no inline value behind', () => {
    const scroller = document.documentElement;
    const computedStyle = window.getComputedStyle;
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      const style = computedStyle(element);
      return element === scroller && !scroller.style.scrollPaddingTop
        ? ({ ...style, scrollPaddingTop: '12px' } as CSSStyleDeclaration)
        : style;
    });
    const toolbar = Symbol('toolbar');
    reserveScrollPadding(scroller, toolbar, 52);
    expect(scroller.style.scrollPaddingTop).toBe('64px');
    reserveScrollPadding(scroller, toolbar, 60);
    expect(scroller.style.scrollPaddingTop).toBe('72px');
    releaseScrollPadding(scroller, toolbar);
    expect(scroller.style.scrollPaddingTop).toBe('');
  });

  it('treats a starting padding of auto as none', () => {
    const scroller = document.documentElement;
    const computedStyle = window.getComputedStyle;
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) =>
      element === scroller
        ? ({ ...computedStyle(element), scrollPaddingTop: 'auto' } as CSSStyleDeclaration)
        : computedStyle(element),
    );
    const toolbar = Symbol('toolbar');
    reserveScrollPadding(scroller, toolbar, 52);
    expect(scroller.style.scrollPaddingTop).toBe('52px');
    releaseScrollPadding(scroller, toolbar);
  });

  it('keeps each scroller separate and ignores a release that was never reserved', () => {
    const [frame] = nest('auto');
    const frameToolbar = Symbol('frame toolbar');
    reserveScrollPadding(frame, frameToolbar, 60);
    releaseScrollPadding(document.documentElement, frameToolbar);
    expect(frame.style.scrollPaddingTop).toBe('60px');
    expect(document.documentElement.style.scrollPaddingTop).toBe('');
    releaseScrollPadding(frame, frameToolbar);
    expect(frame.style.scrollPaddingTop).toBe('');
  });
});
