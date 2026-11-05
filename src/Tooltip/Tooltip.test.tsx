import * as React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Tooltip, TooltipTrigger } from './Tooltip';

afterEach(cleanup);

const renderTip = (onDialogEscape = vi.fn()) => {
  render(
    <div data-propellant onKeyDown={(event) => event.key === 'Escape' && onDialogEscape()}>
      <Tooltip content="Judges per panel" description="The number of judges each panel needs.">
        <TooltipTrigger aria-label="About judges per panel" />
      </Tooltip>
      <button type="button">Elsewhere</button>
    </div>,
  );
  return {
    trigger: screen.getByRole('button', { name: 'About judges per panel' }),
    onDialogEscape,
  };
};

describe('Tooltip', () => {
  it('opens on hover, stays open while the pointer is on the bubble, and closes when it leaves', async () => {
    const { trigger } = renderTip();

    await userEvent.hover(trigger);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Judges per panel');
    expect(tooltip).toHaveTextContent('The number of judges each panel needs.');
    expect(tooltip.closest('[data-propellant]')).not.toBeNull();
    expect(tooltip.className).toContain('before:h-1.5');

    await userEvent.hover(tooltip);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await userEvent.unhover(tooltip);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens on keyboard focus, describes the trigger, and stays open when the pointer leaves', async () => {
    const { trigger } = renderTip();

    await userEvent.tab();

    expect(trigger).toHaveFocus();
    const tooltip = screen.getByRole('tooltip');
    expect(trigger.parentElement).toHaveAttribute('aria-describedby', tooltip.id);
    fireEvent.mouseLeave(trigger.parentElement as HTMLElement);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await userEvent.tab();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('closes on Escape without the surrounding dialog seeing it', async () => {
    const { trigger, onDialogEscape } = renderTip();
    await userEvent.hover(trigger);

    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(onDialogEscape).not.toHaveBeenCalled();
  });

  it('marks the Escape it used as handled', async () => {
    const { trigger } = renderTip();
    await userEvent.hover(trigger);
    const escape = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });

    act(() => {
      window.dispatchEvent(escape);
    });

    expect(escape.defaultPrevented).toBe(true);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('toggles with a tap on touch screens', () => {
    const { trigger } = renderTip();
    const tap = () => {
      fireEvent.pointerDown(trigger, { pointerType: 'touch' });
      fireEvent.mouseEnter(trigger.parentElement as HTMLElement);
      act(() => trigger.focus());
      fireEvent.click(trigger);
    };

    tap();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.pointerDown(trigger, { pointerType: 'touch' });
    fireEvent.click(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('ignores a tap when disabled', () => {
    render(
      <Tooltip content="Help" disabled>
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Trigger' });

    fireEvent.pointerDown(trigger, { pointerType: 'touch' });
    fireEvent.click(trigger);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('stays open when forced, for specimens', () => {
    render(
      <Tooltip content="Copy link" open>
        <button type="button">Copy</button>
      </Tooltip>,
    );

    expect(screen.getByRole('tooltip')).toHaveTextContent('Copy link');
  });
});

const advance = (milliseconds: number) =>
  act(() => {
    vi.advanceTimersByTime(milliseconds);
  });

const rect = (box: Partial<DOMRect>) =>
  ({ top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0, ...box }) as DOMRect;

describe('Tooltip timing and truncation', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('opens at once on hover by default and closes on leave', () => {
    render(<Tooltip content="Help">Trigger</Tooltip>);

    fireEvent.mouseEnter(screen.getByText('Trigger'));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Help');
    fireEvent.mouseLeave(screen.getByText('Trigger'));
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('waits for the delay and cancels when the pointer leaves first', () => {
    render(
      <Tooltip content="Help" delay={300}>
        Trigger
      </Tooltip>,
    );
    const trigger = screen.getByText('Trigger');

    fireEvent.mouseEnter(trigger);
    advance(200);
    fireEvent.mouseLeave(trigger);
    advance(200);
    expect(screen.queryByRole('tooltip')).toBeNull();

    fireEvent.focus(trigger);
    advance(300);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('dismisses on Escape', () => {
    render(<Tooltip content="Help">Trigger</Tooltip>);

    fireEvent.mouseEnter(screen.getByText('Trigger'));
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('opens only for truncated content when asked', () => {
    render(
      <Tooltip content="Full text" onlyWhenTruncated block>
        <span>Clipped</span>
      </Tooltip>,
    );
    const content = screen.getByText('Clipped');

    fireEvent.mouseEnter(content);
    expect(screen.queryByRole('tooltip')).toBeNull();

    Object.defineProperty(content, 'scrollWidth', { value: 300 });
    Object.defineProperty(content, 'clientWidth', { value: 100 });
    fireEvent.mouseEnter(content);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Full text');
    expect(content.parentElement).toHaveClass('block');
  });

  it('opens when an ellipsis inside a composite trigger clips its text', () => {
    render(
      <Tooltip content="Strong advance with conditions" onlyWhenTruncated block>
        <div>
          <button type="button">
            <span style={{ textOverflow: 'ellipsis' }}>Strong advance…</span>
          </button>
        </div>
      </Tooltip>,
    );
    const label = screen.getByText('Strong advance…');

    fireEvent.mouseEnter(label);
    expect(screen.queryByRole('tooltip')).toBeNull();

    Object.defineProperty(label, 'scrollWidth', { value: 300 });
    Object.defineProperty(label, 'clientWidth', { value: 100 });
    fireEvent.mouseEnter(label);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Strong advance with conditions');
  });

  it('opens when a line clamp inside the trigger hides lines', () => {
    const computedStyle = window.getComputedStyle;
    const clampSpy = vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      const style = computedStyle(element);
      if (!(element as HTMLElement).dataset.clamped) return style;
      return {
        textOverflow: 'clip',
        getPropertyValue: (property: string) =>
          property === '-webkit-line-clamp' ? '3' : style.getPropertyValue(property),
      } as CSSStyleDeclaration;
    });
    render(
      <Tooltip content="Every line" onlyWhenTruncated block>
        <div>
          <p data-clamped="true">Some lines</p>
        </div>
      </Tooltip>,
    );
    const clamped = screen.getByText('Some lines');
    Object.defineProperty(clamped, 'scrollHeight', { value: 90 });
    Object.defineProperty(clamped, 'clientHeight', { value: 60 });

    fireEvent.mouseEnter(clamped);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Every line');
    clampSpy.mockRestore();
  });

  it('ignores an inner element that overflows without an ellipsis', () => {
    render(
      <Tooltip content="Full text" onlyWhenTruncated block>
        <div>
          <span>Scrolls</span>
        </div>
      </Tooltip>,
    );
    const inner = screen.getByText('Scrolls');
    Object.defineProperty(inner, 'scrollWidth', { value: 300 });
    Object.defineProperty(inner, 'clientWidth', { value: 100 });

    fireEvent.mouseEnter(inner);

    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('never opens when disabled', () => {
    render(
      <Tooltip content="Help" disabled>
        Trigger
      </Tooltip>,
    );

    fireEvent.mouseEnter(screen.getByText('Trigger'));

    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});

describe('Tooltip layer', () => {
  const renderPortal = () => {
    render(
      <div data-testid="clip" className="overflow-hidden">
        <Tooltip content={'Line one\nLine two'} wide placement="bottom">
          Trigger
        </Tooltip>
      </div>,
    );
    return screen.getByText('Trigger');
  };

  it('renders a wide bubble outside clipping containers with line breaks kept', () => {
    const trigger = renderPortal();

    fireEvent.mouseEnter(trigger);

    const bubble = screen.getByRole('tooltip');
    expect(screen.getByTestId('clip')).not.toContainElement(bubble);
    expect(bubble).toHaveClass('whitespace-pre-wrap', 'overflow-y-auto');
    expect(bubble).toHaveClass('fixed');
  });

  it('places the bubble below, flipping above when it does not fit, inside the viewport', () => {
    const spy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
    spy.mockImplementation(function (this: HTMLElement) {
      return this.getAttribute('role') === 'tooltip'
        ? rect({ width: 200, height: 100 })
        : rect({ top: 700, bottom: 720, left: 1000, width: 80, height: 20 });
    });
    window.innerWidth = 1024;
    window.innerHeight = 768;
    const trigger = renderPortal();

    fireEvent.mouseEnter(trigger);

    const bubble = screen.getByRole('tooltip');
    expect(bubble.style.top).toBe('594px');
    expect(bubble.style.left).toBe('816px');
    spy.mockRestore();
  });

  it('follows the trigger when the page scrolls instead of closing', () => {
    const trigger = renderPortal();

    fireEvent.mouseEnter(trigger);
    fireEvent.scroll(window);

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});
