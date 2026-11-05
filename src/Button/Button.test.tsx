import * as React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

afterEach(cleanup);

const classesOf = (element: HTMLElement) => element.className.split(' ');

describe('Button styles', () => {
  it.each([
    ['filled', '[--button-bg:var(--tint)]', '[--button-fg:var(--on-tint)]'],
    ['tinted', '[--button-bg:var(--tint-fill)]', '[--button-fg:var(--tint)]'],
    ['gray', '[--button-bg:var(--fill-secondary)]', '[--button-fg:var(--label)]'],
    ['plain', '[--button-bg:transparent]', '[--button-fg:var(--tint)]'],
  ] as const)('paints %s from its own tokens', (variant, background, foreground) => {
    render(<Button variant={variant}>Save round</Button>);
    const classes = classesOf(screen.getByRole('button', { name: 'Save round' }));
    expect(classes).toContain(background);
    expect(classes).toContain(foreground);
  });

  it.each([
    ['filled', '[--button-bg:var(--critical-solid)]'],
    ['tinted', '[--button-bg:var(--critical-fill)]'],
    ['gray', '[--button-fg:var(--critical)]'],
    ['plain', '[--button-fg:var(--critical)]'],
  ] as const)('applies the destructive role to %s', (variant, token) => {
    render(
      <Button variant={variant} destructive>
        Remove judge
      </Button>,
    );
    const classes = classesOf(screen.getByRole('button'));
    expect(classes).toContain(token);
    expect(classes).toContain('[--button-ring:var(--focus-color-critical)]');
  });

  it('defaults to a filled, regular capsule', () => {
    render(<Button>Save round</Button>);
    const classes = classesOf(screen.getByRole('button'));
    expect(classes).toContain('[--button-bg:var(--tint)]');
    expect(classes).toContain('min-h-[var(--control-md)]');
    expect(classes).toContain('rounded-[var(--corner-capsule)]');
  });

  it.each([
    ['sm', 'min-h-[var(--control-sm)]'],
    ['md', 'min-h-[var(--control-md)]'],
    ['lg', 'min-h-[var(--control-lg)]'],
  ] as const)('sizes %s from the control height tokens', (size, height) => {
    render(<Button size={size}>Save</Button>);
    expect(classesOf(screen.getByRole('button'))).toContain(height);
  });

  it('keeps a hit area of at least the hit target', () => {
    render(<Button size="sm">Save</Button>);
    expect(classesOf(screen.getByRole('button'))).toContain(
      'before:h-[max(100%,var(--hit-target))]',
    );
  });

  it('takes three pixels off the icon side for optical balance', () => {
    render(<Button iconLeading={<svg />}>Add judge</Button>);
    expect(classesOf(screen.getByRole('button'))).toContain('pl-[11px]');
  });
});

describe('Button inline', () => {
  it('drops padding and height for a plain button inside text', () => {
    render(
      <Button variant="plain" inline href="#">
        Review the rubric
      </Button>,
    );
    const classes = classesOf(screen.getByRole('link', { name: 'Review the rubric' }));
    expect(classes).toContain('px-0');
    expect(classes).toContain('min-h-0');
    expect(classes).not.toContain('min-h-[var(--control-md)]');
  });

  it('ignores inline on other styles', () => {
    render(
      <Button variant="filled" inline>
        Save
      </Button>,
    );
    expect(classesOf(screen.getByRole('button'))).toContain('min-h-[var(--control-md)]');
  });
});

describe('Button labels', () => {
  it('keeps the label on one line by default', () => {
    render(<Button>Open program dashboard</Button>);
    expect(screen.getByText('Open program dashboard').className).toBe('');
  });

  it('lets the label wrap and the button grow', () => {
    render(<Button wrap>Review the updated judging rubric for Round 2</Button>);
    const classes = classesOf(screen.getByRole('button'));
    expect(classes).toContain('py-1.5');
    expect(classes).toContain('max-w-full');
    expect(screen.getByText('Review the updated judging rubric for Round 2').className).toContain(
      'whitespace-normal',
    );
  });

  it('truncates a long label but keeps it in the accessible name', () => {
    render(<Button truncate>Review the updated judging rubric for Round 2</Button>);
    expect(
      screen.getByRole('button', { name: 'Review the updated judging rubric for Round 2' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Review the updated judging rubric for Round 2').className).toContain(
      'truncate',
    );
  });

  it('renders only the icon when icon-only', () => {
    render(<Button iconOnly aria-label="Next" iconLeading={<svg data-testid="icon" />} />);
    expect(screen.getByRole('button', { name: 'Next' })).toContainElement(
      screen.getByTestId('icon'),
    );
  });
});

describe('Button states', () => {
  it('blocks activation while loading and announces it is busy', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('stays focusable when soft disabled but ignores activation', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled focusableWhenDisabled onClick={onClick}>
        Publish
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Publish' });
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders a disabled link as a disabled button', () => {
    render(
      <Button href="/next" disabled>
        Continue
      </Button>,
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });
});

describe('Button links', () => {
  it('renders an anchor when given an href', () => {
    render(<Button href="/programs/overview">View overview</Button>);
    expect(screen.getByRole('link', { name: 'View overview' })).toHaveAttribute(
      'href',
      '/programs/overview',
    );
  });

  it('renders through a router link component', () => {
    const RouterLink = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<'a'>>(
      (props, ref) => <a ref={ref} data-router="" {...props} />,
    );
    RouterLink.displayName = 'RouterLink';
    render(
      <Button href="/programs" linkAs={RouterLink}>
        Programs
      </Button>,
    );
    expect(screen.getByRole('link', { name: 'Programs' })).toHaveAttribute('data-router');
  });

  it('stays focusable while loading but blocks activation', async () => {
    const onClick = vi.fn();
    render(
      <Button href="/next" loading onClick={onClick}>
        Continue
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Continue' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('aria-busy', 'true');
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });
});
