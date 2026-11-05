import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { anchoredPanelStyle, placeBelowOrAbove, useAnchoredPosition } from './anchoredLayer';

const VIEWPORT = { width: 1000, height: 800 };

describe('placeBelowOrAbove', () => {
  it('opens below the anchor when there is room', () => {
    expect(
      placeBelowOrAbove(
        { left: 100, top: 100, bottom: 144, width: 200 },
        { width: 240, height: 300 },
        VIEWPORT,
      ),
    ).toEqual({ left: 100, top: 150, width: 200, available: 642 });
  });

  it('flips above when the room below is short and keeps inside the viewport edge', () => {
    expect(
      placeBelowOrAbove(
        { left: 900, top: 700, bottom: 744, width: 120 },
        { width: 240, height: 300 },
        VIEWPORT,
      ),
    ).toEqual({ left: 752, top: 394, width: 120, available: 686 });
  });

  it('falls back to the anchor width and a default height before the panel measures', () => {
    expect(
      placeBelowOrAbove(
        { left: -20, top: 760, bottom: 790, width: 120 },
        { width: 0, height: 0 },
        VIEWPORT,
      ),
    ).toEqual({ left: 8, top: 474, width: 120, available: 746 });
  });
});

describe('placeBelowOrAbove alignment', () => {
  it('lines the panel up with the anchor end edge when aligned to the end', () => {
    expect(
      placeBelowOrAbove(
        { left: 600, top: 100, bottom: 144, width: 120 },
        { width: 240, height: 300 },
        VIEWPORT,
        'end',
      ),
    ).toEqual({ left: 480, top: 150, width: 120, available: 642 });
  });

  it('keeps an end aligned panel inside the start edge of the viewport', () => {
    expect(
      placeBelowOrAbove(
        { left: 20, top: 100, bottom: 144, width: 40 },
        { width: 240, height: 300 },
        VIEWPORT,
        'end',
      ),
    ).toEqual({ left: 8, top: 150, width: 40, available: 642 });
  });
});

describe('placeBelowOrAbove room', () => {
  it('fills a viewport too short for the minimum, staying on screen', () => {
    expect(
      placeBelowOrAbove(
        { left: 100, top: 40, bottom: 80, width: 200 },
        { width: 240, height: 300 },
        { width: 1000, height: 120 },
      ),
    ).toMatchObject({ top: 8, available: 104 });
  });

  it('keeps a capped select menu on screen in a short window instead of letting the minimum push it past the bottom', () => {
    const viewport = { width: 800, height: 200 };
    const placed = placeBelowOrAbove(
      { left: 0, top: 20, bottom: 60, width: 200 },
      { width: 200, height: 300 },
      viewport,
    );

    expect(placed).toMatchObject({ top: 32, available: 160 });
    expect(placed.top + placed.available).toBeLessThanOrEqual(viewport.height - 8);
  });

  it('leaves a short menu right under its trigger when it already fits', () => {
    expect(
      placeBelowOrAbove(
        { left: 0, top: 20, bottom: 60, width: 200 },
        { width: 200, height: 100 },
        { width: 800, height: 200 },
      ),
    ).toMatchObject({ top: 66, available: 160 });
  });
});

describe('useAnchoredPosition', () => {
  const element = (rect: Partial<DOMRect>, height = 0) => {
    const node = document.createElement('div');
    node.getBoundingClientRect = () =>
      ({ left: 0, top: 0, bottom: 0, width: 0, ...rect }) as DOMRect;
    Object.defineProperty(node, 'offsetHeight', { configurable: true, value: height });
    return node;
  };

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('measures again when the open panel changes size, and stops when closed', () => {
    const observed: Array<() => void> = [];
    const disconnect = vi.fn();
    const observe = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          observed.push(callback);
        }
        observe = observe;
        disconnect = disconnect;
      },
    );
    vi.stubGlobal('innerHeight', 800);
    const anchor = { current: element({ left: 100, top: 600, bottom: 640, width: 200 }) };
    const panel = { current: element({}, 100) };

    const { result, rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) => useAnchoredPosition(isOpen, anchor, panel),
      { initialProps: { isOpen: true } },
    );
    expect(observe).toHaveBeenCalledWith(panel.current);
    expect(result.current?.top).toBe(646);

    Object.defineProperty(panel.current, 'offsetHeight', { configurable: true, value: 400 });
    act(() => observed.forEach((measure) => measure()));
    expect(result.current?.top).toBe(194);

    rerender({ isOpen: false });
    expect(disconnect).toHaveBeenCalled();
    expect(result.current).toBeNull();
  });

  it('still places the panel where ResizeObserver is missing', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    const anchor = { current: element({ left: 10, top: 10, bottom: 50, width: 100 }) };

    const { result } = renderHook(() => useAnchoredPosition(true, anchor, { current: null }));

    expect(result.current).toMatchObject({ left: 10, top: 56 });
  });
});

describe('anchoredPanelStyle', () => {
  it('hides the panel off screen until it is placed', () => {
    expect(anchoredPanelStyle(null)).toMatchObject({
      position: 'fixed',
      visibility: 'hidden',
      left: -9999,
    });
  });

  it('places a measured panel and caps it to the room available', () => {
    const style = anchoredPanelStyle({ left: 10, top: 20, width: 180, available: 300 });

    expect(style).toMatchObject({ left: 10, top: 20, maxHeight: 300, visibility: 'visible' });
    expect(style.width).toBeUndefined();
  });

  it('matches the anchor width and leaves the height free when asked', () => {
    const style = anchoredPanelStyle(
      { left: 10, top: 20, width: 180, available: 300 },
      { matchWidth: true, capsHeight: false },
    );

    expect(style).toMatchObject({ width: 180 });
    expect(style.maxHeight).toBeUndefined();
    expect(anchoredPanelStyle(null, { matchWidth: true })).toMatchObject({ width: 0 });
  });
});
