import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RadioCardGroup } from './RadioCardGroup';

afterEach(cleanup);

const SCORES = [
  { value: '1', title: '1', hint: 'Not evidenced', ariaLabel: '1 Not evidenced' },
  { value: '2', title: '2', ariaLabel: '2' },
  {
    value: 'na',
    title: 'N/A',
    hint: 'Not applicable',
    ariaLabel: 'N/A Not applicable',
    distinct: true,
  },
];

describe('RadioCardGroup side by side', () => {
  it('places row cards in a wrapping grid and keeps them one radio group', () => {
    render(
      <RadioCardGroup
        legend="How judges give availability"
        sideBySide
        options={[
          { value: 'generic', title: 'Generic' },
          { value: 'focused', title: 'Focused' },
          { value: 'both', title: 'Generic and Focused' },
        ]}
      />,
    );

    const group = screen.getByRole('group', { name: 'How judges give availability' });
    const grid = screen.getByRole('radio', { name: /^Generic$/ }).closest('.grid');
    expect(grid).not.toBeNull();
    expect(group).toContainElement(grid as HTMLElement);
    expect(grid?.className).toContain('auto-fit');
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });
});

const TYPE_OPTIONS = [
  { value: 'score', title: 'Score', hint: 'A number on a scale' },
  { value: 'labeled', title: 'Labeled scale', hint: 'Pick one labeled level' },
  { value: 'written', title: 'Written feedback', hint: 'Words, with a minimum' },
];

describe('RadioCardGroup without a selection mark', () => {
  it('lays markless cards out in equal columns with no mark and keeps the native radios', () => {
    render(
      <RadioCardGroup
        legend="Type"
        control="none"
        sideBySide
        options={TYPE_OPTIONS}
        defaultValue="score"
      />,
    );
    const score = screen.getByRole('radio', { name: /Score/ });
    const card = score.closest('label') as HTMLElement;
    const grid = card.parentElement as HTMLElement;
    expect(grid).toHaveClass(
      'grid',
      'sm:grid-flow-col',
      'sm:auto-cols-fr',
      'gap-[var(--space-2-5)]',
    );
    expect(card.querySelector('span[aria-hidden="true"]')).toBeNull();
    expect(card).toHaveClass(
      'rounded-[var(--corner-tile)]',
      'py-[var(--space-3)]',
      'px-[var(--space-3-5)]',
    );
    expect(card.className).toContain('shadow-[inset_0_0_0_var(--stroke-strong)_var(--tint)]');
    const resting = screen.getByRole('radio', { name: /Written feedback/ }).closest('label');
    expect(resting?.className).toContain('shadow-[inset_0_0_0_1px_var(--separator)]');
    expect(screen.getByText('Words, with a minimum')).toHaveClass(
      'text-footnote',
      'text-[var(--label-tertiary)]',
    );
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('moves the selection with the arrow keys', async () => {
    const onChange = vi.fn();
    render(
      <RadioCardGroup
        legend="Type"
        control="none"
        sideBySide
        options={TYPE_OPTIONS}
        defaultValue="score"
        onChange={onChange}
      />,
    );
    await userEvent.tab();
    expect(screen.getByRole('radio', { name: /Score/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: /Labeled scale/ })).toBeChecked();
    expect(onChange).toHaveBeenCalledWith('labeled');
  });
});

describe('RadioCardGroup tiles', () => {
  it('renders compact tiles named by their option labels with the caption under the value', () => {
    render(<RadioCardGroup layout="tile" legend="Problem" options={SCORES} />);
    const group = screen.getByRole('group', { name: 'Problem' });
    const first = screen.getByRole('radio', { name: '1 Not evidenced' });
    expect(group).toContainElement(first);
    expect(first.closest('label')).toHaveTextContent('1Not evidenced');
    expect(screen.getByRole('radio', { name: '2' }).closest('label')?.textContent).toBe('2');
  });

  it('marks a distinct option with a dashed edge and keeps others solid', () => {
    render(<RadioCardGroup layout="tile" legend="Problem" options={SCORES} />);
    expect(screen.getByRole('radio', { name: 'N/A Not applicable' }).closest('label')).toHaveClass(
      'outline-dashed',
    );
    expect(screen.getByRole('radio', { name: '2' }).closest('label')).not.toHaveClass(
      'outline-dashed',
    );
  });

  it('selects with a click and reports the value', async () => {
    const onChange = vi.fn();
    render(
      <RadioCardGroup
        layout="tile"
        legend="Problem"
        options={SCORES}
        value="1"
        onChange={onChange}
      />,
    );
    expect(screen.getByRole('radio', { name: '1 Not evidenced' })).toBeChecked();
    await userEvent.click(screen.getByText('N/A'));
    expect(onChange).toHaveBeenCalledWith('na');
  });

  it('gives unselected tiles the error edge while there is an error', () => {
    render(<RadioCardGroup layout="tile" legend="Problem" error="Score this." options={SCORES} />);
    expect(screen.getByRole('radio', { name: '2' }).closest('label')?.className).toContain(
      'var(--critical)',
    );
    expect(screen.getByRole('radio', { name: '2' }).closest('label')?.className).toContain(
      'hover:bg-[var(--bg-secondary)]',
    );
    expect(
      screen.getByRole('radio', { name: 'N/A Not applicable' }).closest('label')?.className,
    ).toContain('outline-[var(--critical)]');
  });

  it('describes the group by its description and error', () => {
    render(
      <RadioCardGroup
        layout="tile"
        legend="Problem"
        description="Whose problem this is."
        error="Score this criterion."
        options={SCORES}
      />,
    );
    expect(screen.getByRole('group', { name: 'Problem' })).toHaveAccessibleDescription(
      'Whose problem this is. Score this criterion.',
    );
  });

  it('leaves a plain row group undescribed and without tiles', () => {
    render(<RadioCardGroup legend="Plan" options={[{ value: 'a', title: 'Annual' }]} />);
    expect(screen.getByRole('group', { name: 'Plan' })).not.toHaveAttribute('aria-describedby');
    expect(screen.getByRole('radio')).not.toHaveAttribute('aria-label');
  });
});

describe('RadioCardGroup emphasis', () => {
  const tiles = (emphasis?: 'default' | 'strong') =>
    render(
      <RadioCardGroup
        layout="tile"
        legend="Problem"
        description="Whose problem this is"
        options={SCORES}
        emphasis={emphasis}
      />,
    );

  it('keeps the quiet legend, description, captions and narrow tiles by default', () => {
    tiles();
    expect(screen.getByText('Problem')).toHaveClass('font-medium', 'text-[var(--label-secondary)]');
    expect(screen.getByText('Whose problem this is').className).toContain('--label-tertiary');
    expect(screen.getByText('Not evidenced').className).toContain('font-normal');
    expect(screen.getByText('1').className).toContain('font-semibold');
    const label = screen.getByRole('radio', { name: '2' }).closest('label') as HTMLElement;
    expect(label.className).toContain('px-1.5');
    expect(label.parentElement?.className).toContain('minmax(5rem,1fr)');
  });

  it('weights the legend, description and captions up and widens the tiles when strong', () => {
    tiles('strong');
    expect(screen.getByText('Problem')).toHaveClass('font-semibold', 'text-[var(--label)]');
    expect(screen.getByText('Whose problem this is').className).toContain('font-medium');
    expect(screen.getByText('Not evidenced').className).toContain('font-semibold');
    expect(screen.getByText('1').className).toContain('font-bold');
    expect(screen.getByText('1').className).not.toContain('font-black');
    const label = screen.getByRole('radio', { name: '2' }).closest('label') as HTMLElement;
    expect(label.className).toContain('min-w-0 px-2');
    expect(label.parentElement?.className).toContain('minmax(6.25rem,1fr)');
  });
});

describe('RadioCardGroup native input', () => {
  it('fills the selected card with an opaque tint wash and rings it without a hover lift', () => {
    render(
      <RadioCardGroup
        legend="Sessions"
        defaultValue="am"
        options={[
          { value: 'am', title: 'Morning' },
          { value: 'pm', title: 'Afternoon' },
        ]}
      />,
    );
    const selected = screen.getByRole('radio', { name: 'Morning' }).closest('label');
    const resting = screen.getByRole('radio', { name: 'Afternoon' }).closest('label');
    expect(selected?.className).toContain('var(--tint-fill)');
    expect(selected?.className).toContain('var(--tint)]');
    expect(resting?.className).toContain('hover:bg-[var(--bg-secondary)]');
    expect(resting?.className).not.toContain('translate-y');
  });

  it('stays visually hidden at a real 1px size in the card corner, off the text', () => {
    render(<RadioCardGroup legend="Sessions" options={[{ value: 'am', title: 'Morning' }]} />);
    const input = screen.getByRole('radio', { name: 'Morning' });
    expect(input).toHaveClass('absolute', 'top-0', 'left-0', 'w-px', 'h-px', 'opacity-0');
    expect(input).not.toHaveClass('w-0');
    expect(input.closest('label')).toHaveClass('relative');
    expect(input.closest('label')?.className).toContain('has-[input:focus-visible]:outline');
  });

  it('still selects when the card text is clicked', async () => {
    const onChange = vi.fn();
    render(
      <RadioCardGroup
        legend="Sessions"
        onChange={onChange}
        options={[{ value: 'am', title: 'Morning' }]}
      />,
    );

    await userEvent.click(screen.getByText('Morning'));

    expect(onChange).toHaveBeenCalledWith('am');
  });
});

const START_OPTIONS = [
  {
    value: 'copy',
    title: 'Copy an existing program',
    icon: <svg data-testid="copy-icon" />,
    badge: 'Recommended',
  },
  { value: 'scratch', title: 'Start from scratch', icon: <svg data-testid="plus-icon" /> },
];

describe('RadioCardGroup choice cards', () => {
  it('puts the icon, badge and radio on top and the title on its own line', () => {
    render(
      <RadioCardGroup
        layout="choice"
        sideBySide
        legend="How do you want to start?"
        options={START_OPTIONS}
        defaultValue="copy"
      />,
    );
    const copy = screen.getByRole('radio', { name: /Copy an existing program/ });
    const card = copy.closest('label') as HTMLElement;
    const [topRow, title] = Array.from(card.children).filter(
      (child) => child.tagName === 'SPAN',
    ) as HTMLElement[];
    expect(topRow).toContainElement(screen.getByTestId('copy-icon'));
    expect(topRow).toHaveTextContent('Recommended');
    expect(title).toHaveTextContent('Copy an existing program');
    expect(title).toHaveClass('text-headline');
  });

  it('shows the badge as a neutral label without a dot', () => {
    render(<RadioCardGroup layout="choice" options={START_OPTIONS} defaultValue="copy" />);
    const badge = screen.getByText('Recommended').parentElement as HTMLElement;
    expect(badge).toHaveAttribute('data-tone', 'neutral');
    expect(badge).toHaveClass('rounded-[var(--corner-sm)]');
    expect(badge.querySelector('.rounded-full')).toBeNull();
  });

  it('tints the selected card icon and greys the others', async () => {
    const onChange = vi.fn();
    render(<RadioCardGroup layout="choice" options={START_OPTIONS} onChange={onChange} />);
    const scratchIcon = screen.getByTestId('plus-icon').parentElement as HTMLElement;
    expect(scratchIcon).toHaveClass('bg-[var(--fill-secondary)]');
    await userEvent.click(screen.getByRole('radio', { name: 'Start from scratch' }));
    expect(onChange).toHaveBeenCalledWith('scratch');
    expect(scratchIcon).toHaveClass('bg-[var(--tint-fill)]', 'text-[var(--tint)]');
  });
});

describe('RadioCardGroup density', () => {
  const companies = [{ value: 'careloop', title: 'CareLoop', hint: 'Founder, Owner' }];

  it('keeps the default row padding, alignment and type unless compact is asked for', () => {
    render(<RadioCardGroup legend="Apply as" options={companies} />);
    const card = screen.getByRole('radio', { name: /CareLoop/ }).closest('label');
    expect(card).toHaveClass('p-[var(--space-4)]', 'items-start');
    expect(screen.getByText('CareLoop')).toHaveClass('text-callout');
    expect(screen.getByText('Founder, Owner')).toHaveClass('text-[var(--label-secondary)]');
  });

  it('draws the compact row with 14px padding, centred content and a body title', () => {
    render(<RadioCardGroup legend="Apply as" density="compact" options={companies} />);
    const card = screen.getByRole('radio', { name: /CareLoop/ }).closest('label');
    expect(card).toHaveClass('p-[var(--space-3-5)]', 'items-center');
    expect(card).not.toHaveClass('bg-[var(--radio-card-compact-selected-bg)]');
    expect(card).not.toHaveClass('p-[var(--space-4)]', 'items-start');
    expect(screen.getByText('CareLoop')).toHaveClass('text-body', 'font-semibold');
    expect(screen.getByText('Founder, Owner')).toHaveClass('text-[var(--label-tertiary)]');
    const circle = screen.getByRole('radio', { name: /CareLoop/ }).nextElementSibling;
    expect(circle).toHaveClass('w-5', 'h-5', 'rounded-full');
    expect(circle).not.toHaveClass('mt-px');
    expect(circle).toHaveClass('shadow-[inset_0_0_0_var(--stroke-strong)_var(--control-border)]');
  });

  it('keeps the 18px circle on the default row', () => {
    render(<RadioCardGroup legend="Apply as" options={companies} />);
    const circle = screen.getByRole('radio', { name: /CareLoop/ }).nextElementSibling;
    expect(circle).toHaveClass('w-4.5', 'h-4.5');
    expect(circle).not.toHaveClass('w-5');
    expect(circle).toHaveClass('mt-px');
    expect(circle).toHaveClass('shadow-[inset_0_0_0_1px_var(--control-border)]');
  });

  it('accepts compact only on the row layout and ignores it on others at runtime', () => {
    render(
      // @ts-expect-error compact density is only typed for the row layout
      <RadioCardGroup legend="Track" layout="card" density="compact" options={companies} />,
    );
    const card = screen.getByRole('radio', { name: /CareLoop/ }).closest('label');
    expect(card).toHaveClass('p-[var(--space-4)]');
  });

  it('fills a selected compact row with its own light tint and keeps the default fill', () => {
    const { unmount } = render(
      <RadioCardGroup
        legend="Apply as"
        density="compact"
        defaultValue="careloop"
        options={companies}
      />,
    );
    const compactCard = screen.getByRole('radio', { name: /CareLoop/ }).closest('label');
    expect(compactCard).toHaveClass('bg-[var(--radio-card-compact-selected-bg)]');
    expect(compactCard?.className).not.toContain('--tint-fill');
    unmount();
    render(<RadioCardGroup legend="Apply as" defaultValue="careloop" options={companies} />);
    const defaultCard = screen.getByRole('radio', { name: /CareLoop/ }).closest('label');
    expect(defaultCard?.className).toContain('linear-gradient(var(--tint-fill),var(--tint-fill))');
  });
});
