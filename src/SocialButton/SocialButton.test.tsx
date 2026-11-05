import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SocialButton } from './SocialButton';

afterEach(cleanup);

describe('SocialButton', () => {
  it('is a medium weight capsule at the large control height by default', () => {
    render(<SocialButton brand="google">Continue with Google</SocialButton>);
    const button = screen.getByRole('button', { name: 'Continue with Google' });
    expect(button.className).toContain('rounded-[var(--corner-capsule)]');
    expect(button.className).toContain('font-medium');
    expect(button.className).toContain('min-h-[var(--control-lg)]');
    expect(button.className).toContain('bg-[var(--bg)]');
  });

  it('fills the provider color in the brand treatment and stays neutral in color', () => {
    const { rerender } = render(<SocialButton brand="linkedin">LinkedIn</SocialButton>);
    expect(screen.getByRole('button').className).toContain('bg-[var(--sb-linkedin-bg)]');
    rerender(
      <SocialButton brand="linkedin" treatment="color">
        LinkedIn
      </SocialButton>,
    );
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-[var(--bg)]');
    const mark = button.querySelector('span[aria-hidden="true"]') as HTMLElement;
    expect(mark.style.color).toBe('var(--sb-linkedin-bg)');
  });

  it('draws the full color Google mark in the color treatment', () => {
    render(
      <SocialButton brand="google" treatment="color">
        Google
      </SocialButton>,
    );
    const fills = Array.from(screen.getByRole('button').querySelectorAll('path')).map((path) =>
      path.getAttribute('fill'),
    );
    expect(fills).toContain('#4285F4');
  });

  it('forwards handlers, stretches when block, and blocks interaction while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onMouseDown = vi.fn();
    const { rerender } = render(
      <SocialButton brand="microsoft" block onClick={onClick} onMouseDown={onMouseDown}>
        Microsoft
      </SocialButton>,
    );
    const button = screen.getByRole('button', { name: 'Microsoft' });
    expect(button.className).toContain('w-full');
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onMouseDown).toHaveBeenCalledTimes(1);
    rerender(
      <SocialButton brand="microsoft" loading onClick={onClick}>
        Microsoft
      </SocialButton>,
    );
    const busy = screen.getByRole('button');
    expect(busy).toHaveAttribute('aria-busy', 'true');
    expect(busy).toBeDisabled();
    expect(busy.querySelector('.animate-spin')).not.toBeNull();
  });

  it('renders a link when given an href and an icon only button with a label', () => {
    const { rerender } = render(
      <SocialButton brand="apple" href="/auth/apple">
        Apple
      </SocialButton>,
    );
    expect(screen.getByRole('link', { name: 'Apple' })).toHaveAttribute('href', '/auth/apple');
    rerender(<SocialButton brand="apple" iconOnly aria-label="Sign in with Apple" />);
    const button = screen.getByRole('button', { name: 'Sign in with Apple' });
    expect(button.className).toContain('w-[var(--control-lg)]');
  });
});
