import * as React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ScoreScale, type ScoreScaleValue } from './ScoreScale';

afterEach(cleanup);

const LabelledScale = (props: Partial<React.ComponentProps<typeof ScoreScale>>) => (
  <>
    <span id="criterion">Clinical evidence</span>
    <ScoreScale min={1} max={5} aria-labelledby="criterion" {...props} />
  </>
);

describe('ScoreScale', () => {
  it('renders one radio per score in a group named by aria-labelledby', () => {
    render(<LabelledScale />);
    const group = screen.getByRole('radiogroup', { name: 'Clinical evidence' });
    const radios = screen.getAllByRole('radio');
    expect(radios.map((radio) => radio.getAttribute('value'))).toEqual(['1', '2', '3', '4', '5']);
    radios.forEach((radio) => expect(group).toContainElement(radio));
  });

  it('adds a not applicable option after the scores when allowed', () => {
    render(<LabelledScale allowNotApplicable notApplicableLabel="Not scored" />);
    const notApplicable = screen.getByRole('radio', { name: 'Not scored' });
    expect(screen.getAllByRole('radio').at(-1)).toBe(notApplicable);
    expect(notApplicable.closest('label')).toHaveClass(
      'px-[var(--space-2-5)]',
      'text-[var(--label-tertiary)]',
    );
  });

  it('draws squares with a separator ring at rest and a tint fill when selected', () => {
    render(<LabelledScale value={3} />);
    const resting = screen.getByRole('radio', { name: '2' }).closest('label') as HTMLElement;
    const selected = screen.getByRole('radio', { name: '3' }).closest('label') as HTMLElement;
    expect(resting).toHaveClass('w-8.5', 'h-8.5', 'rounded-[var(--corner-md)]', 'bg-[var(--bg)]');
    expect(resting.className).toContain('shadow-[inset_0_0_0_1px_var(--separator)]');
    expect(selected).toHaveClass('bg-[var(--tint)]', 'text-[var(--on-tint)]');
    expect(screen.getByRole('radio', { name: '3' })).toBeChecked();
  });

  it('reports a click and leaves the value to a controlling parent', async () => {
    const onChange = vi.fn();
    render(<LabelledScale value={2} onChange={onChange} allowNotApplicable />);
    await userEvent.click(screen.getByText('4'));
    expect(onChange).toHaveBeenCalledWith(4);
    expect(screen.getByRole('radio', { name: '2' })).toBeChecked();
    await userEvent.click(screen.getByText('N/A'));
    expect(onChange).toHaveBeenLastCalledWith('not-applicable');
  });

  it('moves the selection with the arrow keys', async () => {
    const Controlled = () => {
      const [score, setScore] = React.useState<ScoreScaleValue | null>(2);
      return <LabelledScale value={score} onChange={setScore} />;
    };
    render(<Controlled />);
    await userEvent.tab();
    expect(screen.getByRole('radio', { name: '2' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: '3' })).toBeChecked();
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(screen.getByRole('radio', { name: '1' })).toBeChecked();
  });

  it('describes the group by its captions and fits them to the scores, not to N/A', () => {
    render(
      <LabelledScale
        allowNotApplicable
        lowLabel="1 · No proof yet"
        highLabel="5 · Peer reviewed"
      />,
    );
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAccessibleDescription('1 · No proof yet 5 · Peer reviewed');
    const captions = screen.getByText('5 · Peer reviewed').parentElement as HTMLElement;
    const scoreColumn = captions.parentElement as HTMLElement;
    expect(scoreColumn).toContainElement(screen.getByRole('radio', { name: '5' }));
    expect(scoreColumn).not.toContainElement(screen.getByRole('radio', { name: 'N/A' }));
    expect(captions).toHaveClass('w-0', 'min-w-full', 'text-footnote');
    expect(screen.getByText('5 · Peer reviewed')).toHaveClass('ml-auto', 'text-right');
  });

  it('ignores clicks when disabled', async () => {
    const onChange = vi.fn();
    render(<LabelledScale disabled onChange={onChange} />);
    screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled());
    await userEvent.click(screen.getByText('3'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps its own value when uncontrolled', async () => {
    render(<LabelledScale defaultValue={1} />);
    await userEvent.click(screen.getByText('5'));
    expect(screen.getByRole('radio', { name: '5' })).toBeChecked();
  });
});

describe('ScoreScale single caption', () => {
  it('describes the group by the low caption alone', () => {
    render(<LabelledScale lowLabel="No proof yet" />);
    expect(screen.getByRole('radiogroup')).toHaveAccessibleDescription('No proof yet');
  });

  it('describes the group by the high caption alone', () => {
    render(<LabelledScale highLabel="Peer reviewed" />);
    expect(screen.getByRole('radiogroup')).toHaveAccessibleDescription('Peer reviewed');
  });
});
