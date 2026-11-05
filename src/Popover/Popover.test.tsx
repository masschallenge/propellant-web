import { act, render, cleanup, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Popover } from './Popover';
import { SingleComboBox } from '../ComboBox/SingleComboBox';

afterEach(cleanup);

describe('Popover', () => {
  it('toggles a labelled panel from an expandable trigger', async () => {
    render(
      <Popover label="View profile" panelLabel="LinkedIn profile">
        Panel body
      </Popover>,
    );
    const trigger = screen.getByRole('button', { name: 'View profile' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    const panel = screen.getByRole('group', { name: 'LinkedIn profile' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', panel.id);
    await userEvent.click(trigger);
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
  });

  it('closes on Escape, marks it handled, and returns focus to the trigger', async () => {
    render(
      <Popover label="View profile" panelLabel="LinkedIn profile" defaultOpen>
        <a href="#profile">Open in LinkedIn</a>
      </Popover>,
    );
    screen.getByRole('link', { name: 'Open in LinkedIn' }).focus();
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    document.dispatchEvent(escape);
    expect(escape.defaultPrevented).toBe(true);
    expect(await screen.findByRole('button', { name: 'View profile' })).toHaveFocus();
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
  });

  it('ignores other keys and closes on a press outside but not inside', () => {
    render(
      <>
        <button type="button">Elsewhere</button>
        <Popover label="View profile" panelLabel="LinkedIn profile" defaultOpen align="end">
          Panel body
        </Popover>
      </>,
    );
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.pointerDown(screen.getByText('Panel body'));
    const panel = screen.getByRole('group', { name: 'LinkedIn profile' });
    expect(screen.getByRole('button', { name: 'View profile' }).nextElementSibling).toBe(panel);
    expect(panel).toHaveStyle({ position: 'fixed' });
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
  });
});

describe('Popover width', () => {
  const placeTrigger = (left: number, right: number) =>
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left,
      right,
      top: 0,
      bottom: 0,
      width: right - left,
      height: 0,
      x: left,
      y: 0,
      toJSON: () => ({}),
    });

  it('caps the panel at the room between the trigger and the far viewport edge', () => {
    Object.defineProperty(window, 'innerWidth', { value: 320, configurable: true });
    const rect = placeTrigger(40, 140);
    render(
      <Popover label="View profile" panelLabel="LinkedIn profile" defaultOpen>
        Panel body
      </Popover>,
    );
    expect(screen.getByRole('group', { name: 'LinkedIn profile' })).toHaveStyle({
      maxWidth: '264px',
    });
    rect.mockRestore();
  });

  it('measures from the trigger right edge when aligned to the end', () => {
    const rect = placeTrigger(200, 300);
    render(
      <Popover label="View profile" panelLabel="LinkedIn profile" defaultOpen align="end">
        Panel body
      </Popover>,
    );
    expect(screen.getByRole('group', { name: 'LinkedIn profile' })).toHaveStyle({
      maxWidth: '284px',
    });
    rect.mockRestore();
  });

  it('re-measures when the viewport resizes while open', () => {
    Object.defineProperty(window, 'innerWidth', { value: 320, configurable: true });
    const rect = placeTrigger(40, 140);
    render(
      <Popover label="View profile" panelLabel="LinkedIn profile" defaultOpen>
        Panel body
      </Popover>,
    );
    Object.defineProperty(window, 'innerWidth', { value: 400, configurable: true });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(screen.getByRole('group', { name: 'LinkedIn profile' })).toHaveStyle({
      maxWidth: '344px',
    });
    rect.mockRestore();
  });

  it('opens above the trigger when the viewport below is shorter than the panel', () => {
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    const rect = placeTrigger(40, 140);
    rect.mockReturnValue({
      left: 40,
      right: 140,
      top: 700,
      bottom: 740,
      width: 100,
      height: 40,
      x: 40,
      y: 700,
      toJSON: () => ({}),
    });
    render(
      <Popover label="View profile" panelLabel="LinkedIn profile" defaultOpen>
        Panel body
      </Popover>,
    );
    expect(screen.getByRole('group', { name: 'LinkedIn profile' })).toHaveStyle({
      top: '416px',
    });
    rect.mockRestore();
  });
});

describe('Popover truncateLabel', () => {
  it('truncates a text label, titles it with the full label and lets the trigger shrink', () => {
    const longName = 'Bartholomew Alexander Montgomery-Fitzwilliam the Third';
    const { container } = render(
      <Popover label={longName} panelLabel="Contact details" truncateLabel>
        Body
      </Popover>,
    );
    const trigger = screen.getByRole('button', { name: longName });
    expect(trigger).toHaveAttribute('title', longName);
    expect(trigger.querySelector('.truncate')).toHaveTextContent(longName);
    expect(container.firstElementChild).toHaveClass('max-w-full');
  });

  it('keeps the trigger untitled by default', () => {
    render(
      <Popover label="View profile" panelLabel="Profile">
        Body
      </Popover>,
    );
    expect(screen.getByRole('button', { name: 'View profile' })).not.toHaveAttribute('title');
  });
});

describe('Popover with a searchable select inside', () => {
  const renderWithSelect = (onChange = vi.fn()) => {
    render(
      <div data-propellant>
        <Popover label="Change timezone" panelLabel="Timezone" defaultOpen>
          <SingleComboBox
            ariaLabel="Zone"
            options={[
              { value: 'tokyo', label: 'Asia/Tokyo' },
              { value: 'paris', label: 'Europe/Paris' },
            ]}
            onChange={onChange}
          />
        </Popover>
      </div>,
    );
    return onChange;
  };

  it('keeps the panel open while an option in the select menu is picked', async () => {
    const onChange = renderWithSelect();
    const panel = screen.getByRole('group', { name: 'Timezone' });
    expect(panel).toHaveAttribute('data-propellant-layer-host');

    await userEvent.click(screen.getByRole('combobox', { name: 'Zone' }));
    const menu = await screen.findByRole('listbox', { name: 'Zone' });
    expect(panel).toContainElement(menu);
    await userEvent.click(screen.getByRole('option', { name: 'Europe/Paris' }));

    expect(onChange).toHaveBeenCalledWith('paris');
    expect(screen.getByRole('group', { name: 'Timezone' })).toBeInTheDocument();
  });

  it('closes only the select menu on the first Escape, then the panel', async () => {
    renderWithSelect();
    await userEvent.click(screen.getByRole('combobox', { name: 'Zone' }));
    await screen.findByRole('listbox', { name: 'Zone' });

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Timezone' })).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('group', { name: 'Timezone' })).not.toBeInTheDocument();
  });
});
