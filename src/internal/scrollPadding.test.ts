import { afterEach, describe, expect, it } from 'vitest';
import { releaseScrollPadding, reserveScrollPadding, scrollContainerOf } from './scrollPadding';

afterEach(() => {
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
  it('pads by the tallest claim and restores the original value in any release order', () => {
    const scroller = document.documentElement;
    scroller.style.scrollPaddingTop = '8px';
    const appToolbar = Symbol('app toolbar');
    const pageToolbar = Symbol('page toolbar');

    reserveScrollPadding(scroller, appToolbar, 52);
    reserveScrollPadding(scroller, pageToolbar, 96);
    expect(scroller.style.scrollPaddingTop).toBe('96px');

    releaseScrollPadding(scroller, pageToolbar);
    expect(scroller.style.scrollPaddingTop).toBe('52px');
    reserveScrollPadding(scroller, pageToolbar, 40);
    releaseScrollPadding(scroller, appToolbar);
    expect(scroller.style.scrollPaddingTop).toBe('40px');
    releaseScrollPadding(scroller, pageToolbar);
    expect(scroller.style.scrollPaddingTop).toBe('8px');
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
