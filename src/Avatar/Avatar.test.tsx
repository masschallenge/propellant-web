import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Avatar, AvatarGroup } from './Avatar';

afterEach(cleanup);

describe('Avatar', () => {
  it('sets initials on a neutral fill, never the tint', () => {
    render(<Avatar initials="AK" alt="Amara Koroma" />);
    const face = screen.getByRole('img', { name: 'Amara Koroma' });
    expect(face.textContent).toBe('AK');
    expect(face.className).toContain('bg-[var(--fill)]');
    expect(face.className).not.toContain('--tint');
  });

  it('hides decorative initials when there is no alt text', () => {
    render(<Avatar initials="JR" />);
    expect(screen.getByText('JR').getAttribute('aria-hidden')).toBe('true');
  });

  it('uses the quieter fill when neutral', () => {
    render(<Avatar initials="TS" neutral />);
    expect(screen.getByText('TS').className).toContain('bg-[var(--fill-secondary)]');
  });

  it('prefers a photo over initials', () => {
    render(<Avatar src="/judge.png" initials="AK" alt="Amara Koroma" />);
    const photo = screen.getByRole('img', { name: 'Amara Koroma' });
    expect(photo.tagName).toBe('IMG');
    expect(screen.queryByText('AK')).toBeNull();
  });

  it('places the company badge outside the face at the bottom right with a background ring', () => {
    render(<Avatar initials="AK" companyBadge={{ src: '/monogram.svg', alt: 'MassChallenge' }} />);
    const badge = screen.getByRole('img', { name: 'MassChallenge' });
    expect(badge.className).toContain('translate-x-1/2');
    expect(badge.className).toContain('translate-y-1/2');
    expect(badge.className).toContain('shadow-[0_0_0_2px_var(--bg)]');
  });

  it('pairs the presence pip with text', () => {
    const { rerender } = render(<Avatar initials="AK" status="online" />);
    expect(screen.getByText('Online').className).toContain('sr-only');
    rerender(<Avatar initials="AK" status="offline" />);
    expect(screen.getByText('Offline')).toBeTruthy();
  });

  it('names the verified mark', () => {
    render(<Avatar initials="AK" verified />);
    expect(screen.getByRole('img', { name: 'Verified' })).toBeTruthy();
  });

  it('forwards attributes and keeps the session replay exclusion', () => {
    const { container } = render(<Avatar initials="AK" data-judge="j1" className="mr-2" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('data-judge')).toBe('j1');
    expect(root.className).toContain('fs-exclude');
    expect(root.className).toContain('mr-2');
  });
});

describe('AvatarGroup', () => {
  it('shows an overflow count and an add button', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(
      <AvatarGroup overflow={4} onAdd={onAdd} addLabel="Add judge">
        <Avatar initials="AK" ring />
      </AvatarGroup>,
    );
    expect(screen.getByText('+4')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Add judge' }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });
});
