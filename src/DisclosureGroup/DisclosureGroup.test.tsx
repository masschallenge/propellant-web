import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DisclosureGroup } from './DisclosureGroup';

afterEach(cleanup);

describe('DisclosureGroup', () => {
  it('reveals its content when the title is pressed', async () => {
    const onOpenChange = vi.fn();
    render(
      <DisclosureGroup title="Advanced settings" onOpenChange={onOpenChange}>
        <p>Score normalization</p>
      </DisclosureGroup>,
    );
    const toggle = screen.getByRole('button', { name: 'Advanced settings' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Score normalization')).not.toBeVisible();
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Score normalization')).toBeVisible();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('follows a controlled open state and shows trailing content', async () => {
    const onOpenChange = vi.fn();
    render(
      <DisclosureGroup
        title="Conflicts"
        open
        onOpenChange={onOpenChange}
        trailing={<span>3 found</span>}
      >
        <p>Ada and Acme</p>
      </DisclosureGroup>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Conflicts' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByText('Ada and Acme')).toBeVisible();
    expect(screen.getByText('3 found')).toBeInTheDocument();
  });
});
