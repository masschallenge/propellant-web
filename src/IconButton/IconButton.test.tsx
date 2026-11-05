import * as React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { IconButton } from './IconButton';

afterEach(cleanup);

const classesOf = (element: HTMLElement) => element.className.split(' ');

describe('IconButton', () => {
  it('is a plain rounded rectangle at the regular size by default', () => {
    render(<IconButton aria-label="Edit">e</IconButton>);
    const classes = classesOf(screen.getByRole('button', { name: 'Edit' }));
    expect(classes).toContain('rounded-[var(--corner-md)]');
    expect(classes).toContain('w-[var(--control-md)]');
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it.each([
    ['gray', 'bg-[var(--fill-secondary)]'],
    ['tinted', 'bg-[var(--tint-fill)]'],
    ['filled', 'bg-[var(--tint)]'],
  ] as const)('draws %s as a circle', (variant, background) => {
    render(
      <IconButton aria-label="Add" variant={variant}>
        +
      </IconButton>,
    );
    const classes = classesOf(screen.getByRole('button'));
    expect(classes).toContain('rounded-full');
    expect(classes).toContain(background);
  });

  it('rests muted and turns critical on hover and focus when destructive', () => {
    render(
      <IconButton aria-label="Delete" destructive>
        x
      </IconButton>,
    );
    const classes = classesOf(screen.getByRole('button', { name: 'Delete' }));
    expect(classes).toContain('text-[var(--label-secondary)]');
    expect(classes).toContain('hover:not-disabled:text-[var(--critical)]');
    expect(classes).toContain('focus-visible:not-disabled:text-[var(--critical)]');
    expect(classes).toContain('focus-visible:outline-[var(--focus-color-critical)]');
  });

  it('keeps a hit area of at least the hit target', () => {
    render(
      <IconButton aria-label="More" size="sm">
        m
      </IconButton>,
    );
    expect(classesOf(screen.getByRole('button'))).toContain(
      'before:w-[max(100%,var(--hit-target))]',
    );
  });

  it('forwards its ref to the button', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <IconButton ref={ref} aria-label="More">
        m
      </IconButton>,
    );
    expect(ref.current).toBe(screen.getByRole('button', { name: 'More' }));
  });
});
