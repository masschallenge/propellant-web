import type { ComponentPropsWithoutRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ListRow, ListSection } from './List';
import { Switch } from '../Switch/Switch';

afterEach(cleanup);

describe('ListSection', () => {
  it('names the section by its title and shows footer and trailing content', () => {
    render(
      <ListSection title="Notifications" footer="Sent at 9:00 AM." trailing={<button>Edit</button>}>
        <ListRow title="Email" />
      </ListSection>,
    );
    expect(screen.getByRole('region', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByText('Sent at 9:00 AM.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('list')).toHaveClass('rounded-[var(--corner-lg)]', 'bg-[var(--bg)]');
  });

  it('uses the requested heading level', () => {
    render(
      <ListSection title="Judges" titleAs="h2">
        <ListRow title="Ada" />
      </ListSection>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Judges' })).toBeInTheDocument();
  });

  it('shortens rows when dense', () => {
    render(
      <ListSection density="dense">
        <ListRow title="Ada" />
      </ListSection>,
    );
    expect(screen.getByText('Ada').closest('div')).toHaveClass('min-h-[var(--row-dense)]');
  });

  it('pads rows roomily when roomy', () => {
    render(
      <ListSection density="roomy">
        <ListRow title="Ada" />
      </ListSection>,
    );
    const row = screen.getByText('Ada').closest('div');
    expect(row).toHaveClass(
      'min-h-[var(--row)]',
      'gap-[var(--space-3-5)]',
      'px-[var(--space-5)]',
      'py-[var(--space-3-5)]',
    );
    expect(row).not.toHaveClass('px-4', 'gap-3');
  });

  it('insets roomy separators past the roomy padding and gap', () => {
    render(
      <ListSection density="roomy">
        <ListRow title="Plain" />
        <ListRow title="With icon" icon={<svg />} />
        <ListRow title="Program" media={{ src: '/logo.png' }} />
        <ListRow title="Company" media={{ src: '/logo.png', shape: 'squircle' }} />
        <ListRow title="To do" media={{ tile: { icon: <svg /> } }} />
      </ListSection>,
    );
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveClass('[--row-inset:var(--space-5)]');
    expect(items[1]).toHaveClass(
      '[--row-inset:calc(var(--icon-md)+var(--space-5)+var(--space-3-5))]',
    );
    expect(items[2]).toHaveClass('[--row-inset:calc(64px+var(--space-5)+var(--space-3-5))]');
    expect(items[3]).toHaveClass(
      '[--row-inset:calc(var(--avatar-md)+var(--space-5)+var(--space-3-5))]',
    );
    expect(items[4]).toHaveClass(
      '[--row-inset:calc(var(--avatar-md)+var(--space-5)+var(--space-3-5))]',
    );
  });

  it('keeps regular rows at their regular padding', () => {
    render(
      <ListSection>
        <ListRow title="Ada" />
      </ListSection>,
    );
    expect(screen.getByText('Ada').closest('div')).toHaveClass(
      'min-h-[var(--row)]',
      'gap-3',
      'px-4',
      'py-2.5',
    );
  });
});

describe('ListRow', () => {
  it('shows a title, subtitle and value', () => {
    render(
      <ListSection>
        <ListRow title="Round 1" subtitle="Online review" value="42 startups" />
      </ListSection>,
    );
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('Online review')).toBeInTheDocument();
    expect(screen.getByText('42 startups')).toBeInTheDocument();
  });

  it('navigates with a chevron and marks the current page', () => {
    render(
      <ListSection>
        <ListRow title="Judges" href="/judges" selected />
      </ListSection>,
    );
    const link = screen.getByRole('link', { name: 'Judges' });
    expect(link).toHaveAttribute('href', '/judges');
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('runs an action from a button row', async () => {
    const onClick = vi.fn();
    render(
      <ListSection>
        <ListRow title="Export scores" onClick={onClick} />
      </ListSection>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Export scores' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('marks a selected button row as pressed', () => {
    render(
      <ListSection>
        <ListRow title="Eastern time" onClick={() => undefined} selected />
      </ListSection>,
    );
    expect(screen.getByRole('button', { name: 'Eastern time' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('centers a destructive action and colors it critical', () => {
    render(
      <ListSection>
        <ListRow title="Remove judge" destructive onClick={() => undefined} />
      </ListSection>,
    );
    expect(screen.getByText('Remove judge')).toHaveClass('text-[var(--critical)]', 'text-center');
  });

  it('disables a row', () => {
    render(
      <ListSection>
        <ListRow title="Archive" disabled onClick={() => undefined} />
      </ListSection>,
    );
    expect(screen.getByRole('button', { name: 'Archive' })).toBeDisabled();
  });

  it('renders a disabled link row as plain content', () => {
    render(
      <ListSection>
        <ListRow title="Archive" disabled href="/archive" />
      </ListSection>,
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('labels an unlabelled accessory by the row title', () => {
    render(
      <ListSection>
        <ListRow title="Email judges" accessory={<Switch />} />
        <ListRow title="Text judges" accessory={<Switch label="SMS" />} />
      </ListSection>,
    );
    expect(screen.getByRole('switch', { name: 'Email judges' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'SMS' })).toBeInTheDocument();
  });

  it('insets separators past the icon', () => {
    render(
      <ListSection>
        <ListRow title="Plain" />
        <ListRow title="With icon" icon={<svg />} />
      </ListSection>,
    );
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveClass('[--row-inset:16px]');
    expect(items[1]).toHaveClass('[--row-inset:calc(var(--icon-md)+28px)]');
  });

  describe('media', () => {
    it('shows a program logo as a ringed thumbnail in place of the icon', () => {
      render(
        <ListSection>
          <ListRow
            title="HealthTech Traction 2027"
            icon={<svg data-testid="icon" />}
            media={{ src: '/logo.png', alt: 'HealthTech logo' }}
          />
        </ListSection>,
      );
      const logo = screen.getByRole('img', { name: 'HealthTech logo' });
      expect(logo).toHaveAttribute('data-shape', 'logo');
      expect(logo).toHaveClass(
        'w-16',
        'h-9.5',
        'rounded-[var(--corner-thumbnail)]',
        'shadow-[0_0_0_1px_var(--separator)]',
      );
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    });

    it('shows a company logo as a 36px squircle', () => {
      render(
        <ListSection>
          <ListRow
            title="CareLoop"
            media={{ src: '/careloop.png', alt: 'CareLoop logo', shape: 'squircle' }}
          />
        </ListSection>,
      );
      const logo = screen.getByRole('img', { name: 'CareLoop logo' });
      expect(logo).toHaveAttribute('data-shape', 'squircle');
      expect(logo).toHaveClass(
        'w-[var(--avatar-md)]',
        'h-[var(--avatar-md)]',
        'rounded-[var(--corner-tile)]',
      );
    });

    it('shows an uploaded logo whole on a quiet background', () => {
      const { container } = render(
        <ListSection>
          <ListRow title="CareLoop" media={{ src: '/careloop.png' }} />
        </ListSection>,
      );
      const logo = container.querySelector('img');
      expect(logo).toHaveClass('object-contain', 'bg-[var(--bg-secondary)]');
      expect(logo).not.toHaveClass('object-cover');
    });

    it('crops to fill only when the image is marked auto croppable', () => {
      const { container } = render(
        <ListSection>
          <ListRow title="Boston" media={{ src: '/cover.png', autoCrop: true }} />
        </ListSection>,
      );
      const logo = container.querySelector('img');
      expect(logo).toHaveClass('object-cover');
      expect(logo).not.toHaveClass('object-contain', 'bg-[var(--bg-secondary)]');
    });

    it('is decorative when the title already names it', () => {
      const { container } = render(
        <ListSection>
          <ListRow title="CareLoop" media={{ src: '/careloop.png' }} />
        </ListSection>,
      );
      expect(container.querySelector('img')).toHaveAttribute('alt', '');
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('insets separators past the media', () => {
      render(
        <ListSection>
          <ListRow title="Program" media={{ src: '/logo.png' }} />
          <ListRow title="Company" media={{ src: '/logo.png', shape: 'squircle' }} />
        </ListSection>,
      );
      const items = screen.getAllByRole('listitem');
      expect(items[0]).toHaveClass('[--row-inset:calc(64px+28px)]');
      expect(items[1]).toHaveClass('[--row-inset:calc(var(--avatar-md)+28px)]');
    });

    it('keeps the media inside a link row', () => {
      render(
        <ListSection>
          <ListRow
            title="CareLoop"
            href="/startups/careloop"
            media={{ src: '/careloop.png', shape: 'squircle' }}
          />
        </ListSection>,
      );
      const link = screen.getByRole('link', { name: 'CareLoop' });
      expect(link.querySelector('img')).toHaveAttribute('data-shape', 'squircle');
    });

    it('leads with an icon tile in place of the icon', () => {
      const { container } = render(
        <ListSection>
          <ListRow
            title="Accept your panel"
            icon={<svg data-testid="icon" />}
            media={{ tile: { icon: <svg data-testid="tile-icon" />, tone: 'orange' } }}
          />
        </ListSection>,
      );
      const tile = container.querySelector('[data-tone]');
      expect(tile).toHaveAttribute('data-tone', 'orange');
      expect(tile).toHaveAttribute('aria-hidden', 'true');
      expect(tile).toHaveClass('w-[var(--avatar-md)]', 'h-[var(--avatar-md)]');
      expect(tile).toContainElement(screen.getByTestId('tile-icon'));
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
      expect(container.querySelector('img')).not.toBeInTheDocument();
    });

    it('uses the teal tile when no tone is given', () => {
      const { container } = render(
        <ListSection>
          <ListRow title="Review" media={{ tile: { icon: <svg /> } }} />
        </ListSection>,
      );
      expect(container.querySelector('[data-tone]')).toHaveAttribute('data-tone', 'teal');
    });

    it('insets separators past the icon tile', () => {
      render(
        <ListSection>
          <ListRow title="Plain" />
          <ListRow title="To do" media={{ tile: { icon: <svg /> } }} />
        </ListSection>,
      );
      const items = screen.getAllByRole('listitem');
      expect(items[1]).toHaveClass('[--row-inset:calc(var(--avatar-md)+28px)]');
    });
  });

  describe('title emphasis', () => {
    it('sets the title in body type by default', () => {
      render(
        <ListSection>
          <ListRow title="Round 1" />
        </ListSection>,
      );
      const title = screen.getByText('Round 1');
      expect(title).toHaveClass('text-body');
      expect(title).not.toHaveClass('text-callout', 'font-semibold');
    });

    it('sets a strong title in semibold callout type', () => {
      render(
        <ListSection>
          <ListRow title="Accept your panel" titleEmphasis="strong" />
        </ListSection>,
      );
      const title = screen.getByText('Accept your panel');
      expect(title).toHaveClass('text-callout', 'font-semibold');
      expect(title).not.toHaveClass('text-body');
    });
  });

  describe('open link', () => {
    it('shows buttons and a separate chevron link without nesting them', async () => {
      const onAccept = vi.fn();
      render(
        <ListSection>
          <ListRow
            title="Accept your panel"
            accessory={
              <>
                <button type="button">Decline</button>
                <button type="button" onClick={onAccept}>
                  Accept
                </button>
              </>
            }
            openHref="/panels/a"
            openLabel="Open the panel"
          />
        </ListSection>,
      );
      const link = screen.getByRole('link', { name: 'Open the panel' });
      expect(link).toHaveAttribute('href', '/panels/a');
      expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
      const accept = screen.getByRole('button', { name: 'Accept' });
      expect(accept.closest('a')).toBeNull();
      expect(link.querySelector('button')).toBeNull();
      expect(screen.getByRole('button', { name: 'Decline' })).not.toHaveAttribute(
        'aria-labelledby',
      );
      await userEvent.click(accept);
      expect(onAccept).toHaveBeenCalledTimes(1);
    });

    it('names the chevron link Open by default and renders it with linkAs', () => {
      const RouterLink = ({ href, ...rest }: ComponentPropsWithoutRef<'a'>) => (
        <a href={href} data-router="true" {...rest} />
      );
      render(
        <ListSection>
          <ListRow title="Finish reviews" openHref="/queue" linkAs={RouterLink} />
        </ListSection>,
      );
      expect(screen.getByRole('link', { name: 'Open' })).toHaveAttribute('data-router', 'true');
    });

    it('leaves out the chevron link when the whole row is a link or button', () => {
      render(
        <ListSection>
          <ListRow title="Judges" href="/judges" openHref="/other" />
          <ListRow title="Export" onClick={() => undefined} openHref="/other" />
        </ListSection>,
      );
      expect(screen.getAllByRole('link')).toHaveLength(1);
      expect(screen.queryByRole('link', { name: 'Open' })).not.toBeInTheDocument();
    });
  });
});
