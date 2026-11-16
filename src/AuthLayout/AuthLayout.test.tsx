import { render, cleanup, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { AuthLayout } from './AuthLayout';

afterEach(cleanup);

describe('AuthLayout', () => {
  it('puts the brand panel on the brand surface with the brand face only on the hero', () => {
    const { container } = render(
      <AuthLayout eyebrow="Founders" headline="Build what comes next">
        <form aria-label="Sign in" />
      </AuthLayout>,
    );
    const panel = container.querySelector('.propellant-auth-brand') as HTMLElement;
    expect(panel.className).toContain('bg-[var(--brand-surface)]');
    expect(panel.className).toContain('text-[var(--on-brand-surface)]');
    const headline = screen.getByRole('heading', { level: 1, name: 'Build what comes next' });
    expect(headline.className).toContain('uppercase');
    expect(headline.className).toContain('[font-family:var(--type-family-brand)]');
    expect(headline.className).not.toContain('font-[900]');
    const eyebrow = screen.getByText('Founders');
    expect(eyebrow.className).not.toContain('uppercase');
    expect(eyebrow.className).toContain('text-[var(--brand-accent)]');
  });

  it('renders the auth screen in the main column and owns a propellant boundary', () => {
    const { container } = render(
      <AuthLayout>
        <form aria-label="Sign in" />
      </AuthLayout>,
    );
    expect(container.firstElementChild).toHaveAttribute('data-propellant');
    expect(screen.getByRole('main')).toContainElement(
      screen.getByRole('form', { name: 'Sign in' }),
    );
    expect(container.querySelector('style')).toBeNull();
  });

  it('shows the version unless it is omitted', () => {
    const { rerender } = render(<AuthLayout version="v2.1.0" />);
    expect(screen.getByText('v2.1.0')).toBeTruthy();
    rerender(<AuthLayout version="" />);
    expect(screen.queryByText('v2.1.0')).toBeNull();
  });

  it('keeps the split brand panel by default', () => {
    const { container } = render(<AuthLayout />);
    expect(container.querySelector('.propellant-auth-brand')).not.toBeNull();
    expect(container.querySelector('.propellant-auth-mark')).toBeNull();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('centers the form under the logo without a brand panel', () => {
    const { container } = render(
      <AuthLayout variant="centered" version="v2.1.0">
        <form aria-label="Sign in" />
      </AuthLayout>,
    );
    expect(container.querySelector('.propellant-auth-brand')).toBeNull();
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
    const main = screen.getByRole('main');
    const logo = within(main).getByRole('img', { name: 'MassChallenge' });
    const form = screen.getByRole('form', { name: 'Sign in' });
    expect(logo.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(form.parentElement).toHaveClass('max-w-90');
    expect(screen.getByText('v2.1.0')).toBeInTheDocument();
  });

  it('shows a given brand in place of the logo in the centered variant', () => {
    render(
      <AuthLayout variant="centered" brand={<span>MassChallenge Accelerate</span>}>
        <form aria-label="Sign in" />
      </AuthLayout>,
    );
    const main = screen.getByRole('main');
    expect(within(main).getByText('MassChallenge Accelerate')).toBeInTheDocument();
    expect(within(main).queryByRole('img', { name: 'MassChallenge' })).toBeNull();
  });
});
