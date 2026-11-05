import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Card } from './Card';

afterEach(cleanup);

describe('Card footer', () => {
  it('pins to the bottom so footers line up across stretched cards', () => {
    render(
      <Card title="Program" footer={<button type="button">Continue</button>}>
        Body
      </Card>,
    );
    const footer = screen.getByRole('button', { name: 'Continue' }).parentElement as HTMLElement;
    expect(footer.className).toContain('mt-auto');
    expect(footer.parentElement?.className).toContain('flex-col');
  });
});

describe('Card surface', () => {
  it('is a flat grouped surface with no border or shadow', () => {
    const { container } = render(<Card title="Round 2 judging">Body</Card>);
    const card = container.firstElementChild as HTMLElement;
    expect(card.tagName).toBe('SECTION');
    expect(card.className).toContain('bg-[var(--bg)]');
    expect(card.className).toContain('rounded-[var(--corner-lg)]');
    expect(card.className).not.toContain('shadow');
    expect(card.className).not.toMatch(/(^|\s)border(\s|$)/);
  });

  it('renders as another element and forwards attributes', () => {
    render(
      <Card as="article" aria-label="Cohort summary" data-setup-card="cohort">
        Body
      </Card>,
    );
    const card = screen.getByRole('article', { name: 'Cohort summary' });
    expect(card.getAttribute('data-setup-card')).toBe('cohort');
  });

  it('sets the title in the headline style and the description in secondary label', () => {
    render(<Card title="Applications" description="42 submitted this week" />);
    expect(screen.getByRole('heading', { name: 'Applications' }).className).toContain(
      'text-headline',
    );
    const description = screen.getByText('42 submitted this week');
    expect(description.className).toContain('text-subheadline');
    expect(description.className).toContain('text-[var(--label-secondary)]');
  });

  it('keeps bottom padding on a header with no body so the title is not clipped', () => {
    render(<Card title="Judging closes Friday" />);
    const header = screen.getByRole('heading').closest('div.flex.items-start.gap-4') as HTMLElement;
    expect(header.className).toContain('pb-5');
    expect(header.className).not.toContain('pb-0');
  });

  it('tucks the body under an open header and pads it all round after a divider', () => {
    const { rerender } = render(<Card title="Mentors">Body text</Card>);
    expect(screen.getByText('Body text').className).toContain('pt-3');
    rerender(
      <Card title="Mentors" headerDivider>
        Body text
      </Card>,
    );
    expect(screen.getByText('Body text').className).toContain('p-5');
  });

  it('drops body padding when flush', () => {
    render(
      <Card title="Startups" flush>
        Flush body
      </Card>,
    );
    expect(screen.getByText('Flush body').className).toBe('');
  });
});

describe('Card menu', () => {
  it('opens from the overflow button, runs an item and closes', async () => {
    const user = userEvent.setup();
    const onArchive = vi.fn();
    render(<Card title="Cohort" menu={[{ label: 'Archive', onSelect: onArchive }]} />);
    const trigger = screen.getByRole('button', { name: 'More options' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await user.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('menu', { name: 'Card actions' })).toBeTruthy();
    await user.click(screen.getByRole('menuitem', { name: 'Archive' }));
    expect(onArchive).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('closes on Escape and on an outside press', async () => {
    const user = userEvent.setup();
    render(<Card title="Cohort" menu={[{ label: 'Rename' }]} />);
    const trigger = screen.getByRole('button', { name: 'More options' });
    await user.click(trigger);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    await user.click(trigger);
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('stays open when controlled', () => {
    render(<Card title="Cohort" menu={[{ label: 'Delete', danger: true }]} menuOpen />);
    fireEvent.keyDown(document, { key: 'Escape' });
    const item = screen.getByRole('menuitem', { name: 'Delete' });
    expect(item.className).toContain('text-[var(--critical)]');
  });
});
