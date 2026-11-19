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

  it('shows an uploaded photo whole, never cropped, on a quiet background', () => {
    render(<Avatar src="/photo.png" alt="Amara Koroma" />);
    const photo = screen.getByRole('img', { name: 'Amara Koroma' });
    expect(photo).toHaveClass('object-contain', 'bg-[var(--bg-secondary)]');
    expect(photo).not.toHaveClass('object-cover');
  });

  it('crops to fill only when the image is designated as auto croppable', () => {
    render(<Avatar src="/illustration.png" alt="Illustration" autoCrop />);
    const image = screen.getByRole('img', { name: 'Illustration' });
    expect(image).toHaveClass('object-cover');
    expect(image).not.toHaveClass('object-contain');
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

  describe('tone', () => {
    it.each([
      ['gray', 'bg-[var(--avatar-gray-bg)]', 'text-[var(--avatar-gray-fg)]'],
      ['amber', 'bg-[var(--avatar-amber-bg)]', 'text-[var(--avatar-amber-fg)]'],
      ['green', 'bg-[var(--avatar-green-bg)]', 'text-[var(--avatar-green-fg)]'],
      ['teal', 'bg-[var(--avatar-teal-bg)]', 'text-[var(--avatar-teal-fg)]'],
    ] as const)('paints %s initials from the avatar tone tokens', (tone, background, label) => {
      render(<Avatar initials="F" tone={tone} />);
      const face = screen.getByText('F');
      expect(face).toHaveClass(background, label);
      expect(face).not.toHaveClass('bg-[var(--fill)]', 'text-[var(--label-secondary)]');
    });

    it('wins over neutral', () => {
      render(<Avatar initials="M" tone="gray" neutral />);
      const face = screen.getByText('M');
      expect(face).toHaveClass('bg-[var(--avatar-gray-bg)]');
      expect(face).not.toHaveClass('bg-[var(--fill-secondary)]');
    });

    it('leaves a photo on its quiet background', () => {
      render(<Avatar src="/photo.png" alt="Amara Koroma" tone="green" />);
      const photo = screen.getByRole('img', { name: 'Amara Koroma' });
      expect(photo).toHaveClass('bg-[var(--bg-secondary)]');
      expect(photo).not.toHaveClass('bg-[var(--avatar-green-bg)]');
    });
  });

  it('sizes the compact avatar at 26px with caption 2 initials', () => {
    const { container } = render(<Avatar initials="ZE" size="compact" />);
    expect(container.firstElementChild).toHaveClass(
      'w-[var(--avatar-compact)]',
      'h-[var(--avatar-compact)]',
    );
    expect(screen.getByText('ZE')).toHaveClass('text-caption2');
  });

  describe('count', () => {
    it('shows the unread count as a capsule at the top right corner', () => {
      const { container } = render(<Avatar initials="AK" count={3} />);
      const badge = container.querySelector('[data-count]');
      expect(badge).toHaveTextContent('3');
      expect(badge).toHaveAttribute('data-count', '3');
      expect(badge).toHaveClass(
        'absolute',
        '-top-1.25',
        '-right-1.75',
        'min-w-4.5',
        'h-4.5',
        'rounded-[var(--corner-capsule)]',
        'bg-[var(--critical-solid)]',
        'text-[var(--on-critical)]',
      );
    });

    it('reads a label instead of the bare number', () => {
      const { container } = render(<Avatar initials="AK" count={3} />);
      expect(container.querySelector('[data-count]')).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getByText('3 unread')).toHaveClass('sr-only');
    });

    it('reads a custom label when given one', () => {
      render(<Avatar initials="AK" count={1} countLabel="1 unread message" />);
      expect(screen.getByText('1 unread message')).toHaveClass('sr-only');
      expect(screen.queryByText('1 unread')).not.toBeInTheDocument();
    });

    it.each([0, -2, undefined])('shows nothing when the count is %s', (count) => {
      const { container } = render(<Avatar initials="AK" count={count} />);
      expect(container.querySelector('[data-count]')).not.toBeInTheDocument();
      expect(screen.queryByText(/unread/)).not.toBeInTheDocument();
    });

    it('keeps the photo and its name alongside the count', () => {
      render(<Avatar src="/photo.png" alt="Amara Koroma" count={12} />);
      expect(screen.getByRole('img', { name: 'Amara Koroma' })).toBeInTheDocument();
      expect(screen.getByText('12 unread')).toBeInTheDocument();
    });
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
