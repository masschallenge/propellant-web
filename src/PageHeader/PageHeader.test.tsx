import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PageHeader } from './PageHeader';

afterEach(cleanup);

describe('PageHeader', () => {
  it('sets the title as a large title in label color, never tinted or heavy', () => {
    render(<PageHeader title="Round 2 judging" />);
    const heading = screen.getByRole('heading', { level: 1, name: 'Round 2 judging' });
    expect(heading.className).toContain('text-large-title');
    expect(heading.className).toContain('text-[var(--label)]');
    expect(heading.className).not.toContain('--tint');
    expect(heading.className).not.toContain('font-black');
    expect(heading.className).not.toContain('uppercase');
  });

  it('shows the subtitle in secondary subheadline and actions on the trailing side', () => {
    render(
      <PageHeader
        title="Judges"
        subtitle="24 judges across 6 panels"
        actions={<button type="button">Invite judges</button>}
      />,
    );
    const subtitle = screen.getByText('24 judges across 6 panels');
    expect(subtitle.className).toContain('text-subheadline');
    expect(subtitle.className).toContain('text-[var(--label-secondary)]');
    const actions = screen.getByRole('button', { name: 'Invite judges' }).parentElement;
    expect(actions?.className).toContain('ml-auto');
  });

  it('runs the back action', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<PageHeader title="Ada Lovelace" backLabel="All judges" onBack={onBack} />);
    await user.click(screen.getByRole('button', { name: 'All judges' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('draws a flat cover, a framed group without a ring, and a verified mark', () => {
    const { container } = render(
      <PageHeader title="Ada" banner="lime" framed avatarSrc="/ada.png" avatarAlt="Ada" verified />,
    );
    const header = container.querySelector('header') as HTMLElement;
    expect(header.className).toContain('bg-[var(--bg)]');
    expect(header.className).not.toContain('shadow');
    const cover = container.querySelector('[data-banner]') as HTMLElement;
    expect(cover.className).toContain('bg-[var(--brand-surface)]');
    expect(cover.className).not.toContain('gradient');
    expect(screen.getByRole('img', { name: 'Verified' })).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Ada' })).toHaveAttribute('src', '/ada.png');
  });

  it('adds a hairline under a divided bare header', () => {
    const { container } = render(<PageHeader title="Cohort" divided />);
    expect(container.querySelector('header')?.className).toContain(
      'border-b-[length:var(--hairline)]',
    );
  });
});
