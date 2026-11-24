import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { Patterns } from './Patterns';

afterEach(cleanup);

describe('Patterns page bulk confirm example', () => {
  it('opens no dialog and traps no focus until someone asks for the confirm', async () => {
    render(<Patterns />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const trigger = screen.getByRole('button', { name: 'Decline 80' });
    trigger.focus();
    await userEvent.tab();
    expect(trigger).not.toHaveFocus();
    expect(document.activeElement).not.toBe(document.body);
  });

  it('opens the confirm from its button and gives focus back when it closes', async () => {
    render(<Patterns />);
    const trigger = screen.getByRole('button', { name: 'Decline 80' });
    await userEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Decline 80 startups?' });
    expect(dialog).toBeInTheDocument();
    const affectedRegion = screen.getByRole('region', { name: 'Declining 80 startups' });
    expect(affectedRegion).toHaveAttribute('tabindex', '0');
    expect(within(affectedRegion).getAllByRole('listitem')).toHaveLength(80);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    const reopened = screen.getByRole('dialog', { name: 'Decline 80 startups?' });
    await userEvent.click(within(reopened).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

describe('Patterns page guidance', () => {
  it('keeps explicit Save and Cancel for dialogs and create flows beside autosave', () => {
    render(<Patterns />);
    expect(screen.getByText(/Dialogs and create flows keep explicit buttons/)).toHaveTextContent(
      'Save and Cancel',
    );
  });
});
