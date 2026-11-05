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
