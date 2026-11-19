import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { RoleTag } from './RoleTag';
import type { RoleTagTone } from './RoleTag';

afterEach(cleanup);

const FILLS: [RoleTagTone, string][] = [
  ['admin', 'bg-[var(--critical-fill)]'],
  ['pm', 'bg-[var(--tint-fill)]'],
  ['judge', 'bg-[var(--warning-fill)]'],
  ['startup', 'bg-[var(--success-fill)]'],
  ['mentor', 'bg-[var(--role-tag-mentor-fill)]'],
  ['neutral', 'bg-[var(--fill-secondary)]'],
];

describe('RoleTag', () => {
  it('shows the role in uppercase while keeping the words it was given', () => {
    render(<RoleTag tone="admin">Admin</RoleTag>);
    const tag = screen.getByText('Admin');
    expect(tag).toHaveClass('uppercase', 'text-caption2', 'min-h-4.5', 'leading-5');
    expect(tag).toHaveTextContent(/^Admin$/);
  });

  it.each(FILLS)('gives the %s role its own soft fill', (tone, fill) => {
    render(<RoleTag tone={tone}>Role</RoleTag>);
    const tag = screen.getByText('Role');
    expect(tag).toHaveAttribute('data-tone', tone);
    expect(tag).toHaveClass(fill);
  });

  it('sets the mentor label in its own color from the mentor tokens', () => {
    render(<RoleTag tone="mentor">Mentor</RoleTag>);
    expect(screen.getByText('Mentor')).toHaveClass('text-[var(--role-tag-mentor-label)]');
  });

  it('is neutral unless a role is named', () => {
    render(<RoleTag>Mentor</RoleTag>);
    expect(screen.getByText('Mentor')).toHaveAttribute('data-tone', 'neutral');
  });

  it('passes attributes and classes through', () => {
    render(
      <RoleTag tone="pm" className="ml-auto" title="Program manager">
        PM
      </RoleTag>,
    );
    const tag = screen.getByText('PM');
    expect(tag).toHaveClass('ml-auto');
    expect(tag).toHaveAttribute('title', 'Program manager');
  });
});
