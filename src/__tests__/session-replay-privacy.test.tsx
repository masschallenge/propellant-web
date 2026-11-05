import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ActivityFeed } from '../ActivityFeed/ActivityFeed';
import { Avatar } from '../Avatar/Avatar';
import { SearchField } from '../SearchField/SearchField';
import { Textarea } from '../Textarea/Textarea';
import { TextField } from '../TextField/TextField';
import { VerificationCodeInput } from '../VerificationCodeInput/VerificationCodeInput';

afterEach(cleanup);

const isMasked = (element: Element) => element.closest('.fs-mask') !== null;

describe('session replay privacy', () => {
  it('masks what people type into text fields and text areas', () => {
    render(
      <>
        <TextField label="Email" />
        <TextField label="Invitees" tags={['founder@example.org']} />
        <Textarea label="Bio" />
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveClass('fs-mask');
    expect(screen.getByRole('textbox', { name: 'Invitees' })).toHaveClass('fs-mask');
    expect(isMasked(screen.getByText('founder@example.org'))).toBe(true);
    expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveClass('fs-mask');
  });

  it('masks verification code digits', () => {
    render(<VerificationCodeInput length={4} />);

    expect(screen.getByRole('textbox', { name: 'Digit 1 of 4' })).toHaveClass('fs-mask');
  });

  it('excludes avatars and masks searches', () => {
    const { container } = render(
      <>
        <Avatar initials="GH" alt="Grace Hopper" />
        <SearchField aria-label="Search people" defaultValue="Taji" />
      </>,
    );

    expect(container.firstElementChild).toHaveClass('fs-exclude');
    expect(isMasked(screen.getByRole('searchbox', { name: 'Search people' }))).toBe(true);
  });

  it('masks activity names and quoted comments but keeps the action readable', () => {
    render(
      <ActivityFeed
        items={[
          {
            id: 'comment',
            name: 'Grace Hopper',
            action: 'commented on the application',
            when: '2h ago',
            detail: 'Strong founding team',
          },
        ]}
      />,
    );

    expect(isMasked(screen.getByText('Grace Hopper'))).toBe(true);
    expect(isMasked(screen.getByText('Strong founding team'))).toBe(true);
    expect(isMasked(screen.getByText('commented on the application'))).toBe(false);
  });
});
