import { useState } from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DatePicker } from './DatePicker';
import { Sheet } from '../Sheet/Sheet';

afterEach(cleanup);

const ControlledPicker = ({
  start,
  onChange,
}: {
  start: string;
  onChange: (value: string) => void;
}) => {
  const [chosen, setChosen] = useState(start);
  return (
    <DatePicker
      label="Window start"
      clearable
      value={chosen}
      onChange={(next: string) => {
        setChosen(next);
        onChange(next);
      }}
    />
  );
};

describe('DatePicker label', () => {
  it('names the trigger with the field label and the chosen date', () => {
    render(<DatePicker label="Window start" defaultValue="2026-11-12" />);

    expect(screen.getByRole('combobox', { name: 'Window start Nov 12, 2026' })).toBeInTheDocument();
    expect(screen.getByText('Window start')).toBeVisible();
  });

  it('names the trigger from the visible label and its own text, not a copied label', () => {
    render(<DatePicker label="Window start" defaultValue="2026-11-12" />);
    const trigger = screen.getByRole('combobox');

    expect(trigger).not.toHaveAttribute('aria-label');
    expect(trigger.getAttribute('aria-labelledby')?.split(' ')).toEqual([
      screen.getByText('Window start').id,
      screen.getByText('Nov 12, 2026').id,
    ]);
    expect(trigger).toHaveAccessibleName('Window start Nov 12, 2026');
  });

  it('names an empty trigger with its placeholder and marks a required field', () => {
    render(<DatePicker label="Window end" required placeholder="Pick a day" />);

    expect(screen.getByRole('combobox', { name: 'Window end Pick a day' })).toHaveAttribute(
      'aria-required',
      'true',
    );
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps the name when the caller hides the visible label', () => {
    render(<DatePicker label="Window start" hideLabel defaultValue="2026-11-12" />);

    expect(screen.getByRole('combobox', { name: 'Window start Nov 12, 2026' })).toBeInTheDocument();
    expect(screen.getByText('Window start')).toHaveClass('sr-only');
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-label');
  });

  it('adds the chosen time to the name', () => {
    render(
      <DatePicker
        label="Call"
        defaultValue="2026-11-12"
        timeSlots={['9:00 AM', '10:00 AM']}
        defaultTimeValue="10:00 AM"
      />,
    );

    expect(screen.getByRole('combobox')).toHaveAccessibleName('Call Nov 12, 2026 10:00 AM');
  });

  it('names an unlabelled trigger by its date alone', () => {
    render(<DatePicker defaultValue="2026-11-12" />);

    expect(screen.getByRole('combobox', { name: 'Nov 12, 2026' })).not.toHaveAttribute(
      'aria-required',
    );
  });
});

describe('DatePicker range trigger', () => {
  it('reads the chosen range with "to" between the days', () => {
    render(<DatePicker label="Window" rangeValue={['2026-08-10', '2026-08-14']} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Aug 10, 2026 to Aug 14, 2026');
  });

  it('leaves the end open until it is picked', () => {
    render(<DatePicker label="Window" rangeValue={['2026-08-10', '']} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Aug 10, 2026 to …');
  });
});

describe('DatePicker popup', () => {
  it('points the trigger at the open calendar dialog named by the label', () => {
    render(<DatePicker label="Window start" defaultValue="2026-11-12" />);
    const trigger = screen.getByRole('combobox', { name: /^Window start/ });
    expect(trigger).not.toHaveAttribute('aria-controls');

    fireEvent.click(trigger);

    const calendar = screen.getByRole('dialog', { name: 'Window start' });
    expect(trigger).toHaveAttribute('aria-controls', calendar.id);
  });
});

describe('DatePicker invalid and hint', () => {
  it('flags the trigger and links the hint as its description', () => {
    const { rerender } = render(
      <DatePicker
        label="Window end"
        invalid
        hint="Window end must be on or after the window start"
      />,
    );
    const trigger = screen.getByRole('combobox', { name: /^Window end/ });

    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAttribute('data-invalid', 'true');
    expect(trigger).toHaveAccessibleDescription('Window end must be on or after the window start');

    rerender(<DatePicker label="Window end" hint="Round timezone: America/New_York" />);
    expect(trigger).not.toHaveAttribute('aria-invalid');
    expect(trigger).not.toHaveAttribute('data-invalid');
    expect(trigger).toHaveAccessibleDescription('Round timezone: America/New_York');
  });

  it('has no description without a hint', () => {
    render(<DatePicker label="Window end" />);

    expect(screen.getByRole('combobox', { name: /^Window end/ })).not.toHaveAttribute(
      'aria-describedby',
    );
  });
});

describe('DatePicker clear', () => {
  it('empties the value, reports an empty string and returns focus to the trigger', () => {
    const onChange = vi.fn();
    render(<ControlledPicker start="2026-11-12" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear Window start' }));

    expect(onChange).toHaveBeenCalledWith('');
    const trigger = screen.getByRole('combobox', { name: 'Window start Select date' });
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Clear Window start' })).not.toBeInTheDocument();
  });

  it('offers no clear button when empty, disabled or not clearable', () => {
    const { rerender } = render(<DatePicker label="Window start" clearable />);
    expect(screen.queryByRole('button', { name: /^Clear/ })).not.toBeInTheDocument();

    rerender(<DatePicker label="Window start" clearable disabled defaultValue="2026-11-12" />);
    expect(screen.queryByRole('button', { name: /^Clear/ })).not.toBeInTheDocument();

    rerender(<DatePicker label="Window start" defaultValue="2026-11-12" />);
    expect(screen.queryByRole('button', { name: /^Clear/ })).not.toBeInTheDocument();
  });
});

describe('DatePicker min and max', () => {
  const openBounded = (onChange: (value: string) => void) => {
    render(
      <DatePicker
        label="Window end"
        defaultValue="2026-11-12"
        min="2026-11-10"
        max="2026-11-20"
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('combobox', { name: /^Window end/ }));
  };

  it('disables the days outside the range and ignores picking them', () => {
    const onChange = vi.fn();
    openBounded(onChange);

    const beforeMin = screen.getByRole('button', { name: 'November 9, 2026' });
    const afterMax = screen.getByRole('button', { name: 'November 21, 2026' });
    expect(beforeMin).toHaveAttribute('aria-disabled', 'true');
    expect(afterMax).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: 'November 10, 2026' })).not.toHaveAttribute(
      'aria-disabled',
    );

    fireEvent.click(beforeMin);
    fireEvent.click(afterMax);
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'November 15, 2026' }));
    expect(onChange).toHaveBeenCalledWith('2026-11-15');
  });

  it('lets the keyboard move across a disabled day without picking it', () => {
    const onChange = vi.fn();
    openBounded(onChange);

    const chosen = screen.getByRole('button', { name: 'November 12, 2026' });
    fireEvent.keyDown(chosen, { key: 'ArrowLeft' });
    fireEvent.keyDown(screen.getByRole('button', { name: 'November 11, 2026' }), {
      key: 'ArrowLeft',
    });
    fireEvent.keyDown(screen.getByRole('button', { name: 'November 10, 2026' }), {
      key: 'ArrowLeft',
    });
    const blocked = screen.getByRole('button', { name: 'November 9, 2026' });

    expect(blocked).toHaveFocus();
    fireEvent.click(blocked);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('opens an empty bounded picker on the month that holds the range', () => {
    render(<DatePicker label="Window end" min="2031-03-02" />);
    fireEvent.click(screen.getByRole('combobox', { name: /^Window end/ }));

    expect(screen.getByRole('grid', { name: 'March 2031' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'March 2, 2031' })).toHaveAttribute('tabindex', '0');
  });

  it('marks no day disabled without bounds', () => {
    render(<DatePicker label="Date" defaultValue="2026-11-12" />);
    fireEvent.click(screen.getByRole('combobox', { name: /^Date/ }));

    expect(
      screen
        .getAllByRole('button')
        .filter((button) => button.getAttribute('aria-disabled') === 'true'),
    ).toHaveLength(0);
  });
});

describe('DatePicker default month', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('opens an empty picker on the current month', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2027, 1, 10, 12));
    render(<DatePicker label="Date" />);
    fireEvent.click(screen.getByRole('combobox', { name: /^Date/ }));

    expect(screen.getByRole('grid', { name: 'February 2027' })).toBeInTheDocument();
  });

  it('opens an empty picker on the latest allowed month when today is past it', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2027, 1, 10, 12));
    render(<DatePicker label="Date" max="2026-09-20" />);
    fireEvent.click(screen.getByRole('combobox', { name: /^Date/ }));

    expect(screen.getByRole('grid', { name: 'September 2026' })).toBeInTheDocument();
  });
});

describe('DatePicker wording', () => {
  it('names the month and year choosers and the year page with words, not dashes', () => {
    render(<DatePicker label="Date" defaultValue="2026-11-12" />);
    fireEvent.click(screen.getByRole('combobox', { name: /^Date/ }));

    expect(screen.getByRole('button', { name: 'Choose year, currently 2026' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Choose month, currently November' }));
    fireEvent.click(screen.getByRole('button', { name: 'Choose year, currently 2026' }));
    expect(screen.getByText('2016 to 2027')).toBeInTheDocument();
  });

  it('joins the range readouts with "to" and shows the format for an empty end', () => {
    render(
      <DatePicker
        label="Dates"
        inline
        withFooter
        showInput
        rangeValue={['2026-11-12', '']}
        onRangeChange={vi.fn()}
      />,
    );

    expect(screen.getByText('to')).toBeInTheDocument();
    expect(screen.getByText('MM/DD/YYYY')).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/[\u2013\u2014]/);
  });
});

describe('DatePicker Escape', () => {
  it('closes the calendar, returns focus to the trigger and marks the key handled', () => {
    const outerEscape = vi.fn((event: KeyboardEvent) => event.defaultPrevented);
    window.addEventListener('keydown', outerEscape);
    render(<DatePicker label="Window start" defaultValue="2026-11-12" />);
    const trigger = screen.getByRole('combobox', { name: /^Window start/ });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(screen.getByRole('button', { name: 'November 12, 2026' }), {
      key: 'Escape',
    });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
    expect(outerEscape).toHaveReturnedWith(true);
    window.removeEventListener('keydown', outerEscape);
  });

  it('steps back from the year view before closing', () => {
    render(<DatePicker label="Window start" defaultValue="2026-11-12" />);
    const trigger = screen.getByRole('combobox', { name: /^Window start/ });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: /^Choose year/ }));
    expect(screen.getByRole('grid', { name: 'Choose a year' })).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('gridcell', { name: '2026' }), { key: 'Escape' });
    expect(screen.getByRole('grid', { name: 'Choose a month' })).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('DatePicker inside a Sheet', () => {
  const renderInModal = (onChange: (value: string) => void) =>
    render(
      <Sheet open onClose={() => undefined} title="Add panel">
        <DatePicker
          label="Date"
          value="2026-08-11"
          min="2026-08-10"
          max="2026-08-14"
          onChange={onChange}
        />
        <button type="button">After the field</button>
      </Sheet>,
    );

  it('opens the calendar inside the dialog and focuses the chosen day', async () => {
    renderInModal(vi.fn());

    await userEvent.click(screen.getByRole('combobox', { name: /^Date/ }));

    const dialog = screen.getByRole('dialog', { name: 'Add panel' });
    expect(within(dialog).getByRole('dialog', { name: 'Date' })).toBeInTheDocument();
    expect(document.activeElement).toHaveAttribute('data-iso', '2026-08-11');
  });

  it('picks a date with the keyboard and hands focus back to the trigger', async () => {
    const onChange = vi.fn();
    renderInModal(onChange);
    const trigger = screen.getByRole('combobox', { name: /^Date/ });

    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toHaveAttribute('data-iso', '2026-08-12');
    await userEvent.tab();
    expect(screen.getByRole('dialog', { name: 'Add panel' })).toContainElement(
      document.activeElement as HTMLElement,
    );
    await userEvent.tab({ shift: true });
    await userEvent.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith('2026-08-12');
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });
});

describe('DatePicker days from the next and previous month', () => {
  it('picks a next month day shown after the month ends and moves the view there', () => {
    const onChange = vi.fn();
    render(<DatePicker label="Window end" inline defaultValue="2026-11-12" onChange={onChange} />);
    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'December 3, 2026' }));

    expect(onChange).toHaveBeenCalledWith('2026-12-03');
    expect(screen.getByRole('grid', { name: 'December 2026' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'December 3, 2026' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('picks a previous month day shown before the month starts', () => {
    const onChange = vi.fn();
    render(
      <DatePicker label="Window start" inline defaultValue="2026-12-10" onChange={onChange} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'November 30, 2026' }));

    expect(onChange).toHaveBeenCalledWith('2026-11-30');
    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
  });

  it('closes the popover after picking a next month day and reopens on that month', () => {
    const onChange = vi.fn();
    render(<DatePicker label="Window end" defaultValue="2026-11-12" onChange={onChange} />);
    const trigger = screen.getByRole('combobox', { name: /^Window end/ });
    fireEvent.click(trigger);

    fireEvent.click(screen.getByRole('button', { name: 'December 12, 2026' }));

    expect(onChange).toHaveBeenCalledWith('2026-12-12');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAccessibleName('Window end Dec 12, 2026');
    fireEvent.click(trigger);
    expect(screen.getByRole('grid', { name: 'December 2026' })).toBeInTheDocument();
  });

  it('names the shown neighbour days with their month and keeps them de-emphasised', () => {
    render(<DatePicker label="Date" inline defaultValue="2026-11-12" />);
    const outsideDay = screen.getByRole('button', { name: 'December 1, 2026' });
    const insideDay = screen.getByRole('button', { name: 'November 30, 2026' });

    expect(outsideDay).toHaveAttribute('data-outside', 'true');
    expect(outsideDay).toHaveClass('text-[var(--label-tertiary)]', 'cursor-pointer');
    expect(outsideDay).not.toHaveAttribute('aria-disabled');
    expect(outsideDay).toHaveAttribute('tabindex', '-1');
    expect(insideDay).not.toHaveAttribute('data-outside');
    expect(insideDay).toHaveClass('text-[var(--label)]');
  });

  it('keeps a next month day past max disabled and the view on the current month', () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        label="Window end"
        inline
        defaultValue="2026-11-12"
        max="2026-12-02"
        onChange={onChange}
      />,
    );
    const allowed = screen.getByRole('button', { name: 'December 2, 2026' });
    const pastMax = screen.getByRole('button', { name: 'December 3, 2026' });
    expect(allowed).not.toHaveAttribute('aria-disabled');
    expect(pastMax).toHaveAttribute('aria-disabled', 'true');
    expect(pastMax).toHaveClass('line-through', 'cursor-not-allowed');

    fireEvent.click(pastMax);

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
  });

  it('keeps a previous month day before min disabled', () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        label="Window start"
        inline
        defaultValue="2026-12-10"
        min="2026-12-01"
        onChange={onChange}
      />,
    );
    const beforeMin = screen.getByRole('button', { name: 'November 30, 2026' });
    expect(beforeMin).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(beforeMin);

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('grid', { name: 'December 2026' })).toBeInTheDocument();
  });

  it('moves the keyboard into the next month and back across the boundary', () => {
    render(<DatePicker label="Date" inline defaultValue="2026-11-30" />);

    fireEvent.keyDown(screen.getByRole('button', { name: 'November 30, 2026' }), {
      key: 'ArrowRight',
    });
    expect(screen.getByRole('grid', { name: 'December 2026' })).toBeInTheDocument();
    expect(document.activeElement).toHaveAttribute('data-iso', '2026-12-01');
    expect(document.activeElement).not.toHaveAttribute('data-outside');

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'ArrowLeft' });
    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
    expect(document.activeElement).toHaveAttribute('data-iso', '2026-11-30');
    expect(document.activeElement).not.toHaveAttribute('data-outside');
  });

  it('moves the keyboard a week back into the previous month', () => {
    render(<DatePicker label="Date" inline defaultValue="2026-12-03" />);

    fireEvent.keyDown(screen.getByRole('button', { name: 'December 3, 2026' }), {
      key: 'ArrowUp',
    });

    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
    expect(document.activeElement).toHaveAttribute('data-iso', '2026-11-26');
  });

  it('picks a next month day with the keyboard and Enter', async () => {
    const onChange = vi.fn();
    render(<DatePicker label="Window end" defaultValue="2026-11-30" onChange={onChange} />);
    const trigger = screen.getByRole('combobox', { name: /^Window end/ });

    trigger.focus();
    await userEvent.keyboard('{Enter}');
    expect(document.activeElement).toHaveAttribute('data-iso', '2026-11-30');
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toHaveAttribute('data-iso', '2026-12-07');
    await userEvent.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith('2026-12-07');
    expect(trigger).toHaveFocus();
  });

  it('ends a range on a next month day', () => {
    const onRangeChange = vi.fn();
    render(
      <DatePicker
        label="Window"
        inline
        rangeValue={['2026-11-20', '']}
        onRangeChange={onRangeChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'December 4, 2026' }));

    expect(onRangeChange).toHaveBeenCalledWith(['2026-11-20', '2026-12-04']);
  });

  it('shows the band and the end on next month days of a range', () => {
    render(
      <DatePicker
        label="Window"
        inline
        rangeValue={['2026-11-20', '2026-12-04']}
        onRangeChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'December 4, 2026' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(
      screen.getByRole('button', { name: 'December 2, 2026' }).closest('[role="gridcell"]'),
    ).toHaveClass('bg-[var(--tint-fill)]');
  });

  it('fills the chosen day with a tint circle and sets today in tint text', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 5, 12));
    render(<DatePicker label="Date" inline defaultValue="2026-11-12" />);
    vi.useRealTimers();

    expect(screen.getByRole('button', { name: 'November 12, 2026' })).toHaveClass(
      'rounded-full',
      'bg-[var(--tint)]',
      'text-[var(--on-tint)]',
    );
    const today = screen.getByRole('button', { name: 'November 5, 2026' });
    expect(today).toHaveAttribute('aria-current', 'date');
    expect(today).toHaveClass('text-[var(--tint)]');
  });

  it('shows each day once across two months and picks only from the outer edges', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 15, 12));
    const onRangeChange = vi.fn();
    render(
      <DatePicker
        label="Window"
        inline
        dualMonth
        rangeValue={['', '']}
        onRangeChange={onRangeChange}
      />,
    );
    vi.useRealTimers();
    const october = screen.getByRole('grid', { name: 'October 2026' });
    const november = screen.getByRole('grid', { name: 'November 2026' });

    expect(screen.getAllByRole('button', { name: 'November 1, 2026' })).toHaveLength(1);
    expect(within(november).getByRole('button', { name: 'November 1, 2026' })).toBeInTheDocument();
    expect(within(october).queryByRole('button', { name: 'November 1, 2026' })).toBeNull();
    expect(within(october).getByRole('button', { name: 'September 30, 2026' })).toHaveAttribute(
      'data-outside',
      'true',
    );

    fireEvent.click(within(november).getByRole('button', { name: 'December 5, 2026' }));

    expect(onRangeChange).toHaveBeenCalledWith(['2026-12-05', '']);
    expect(screen.getByRole('grid', { name: 'December 2026' })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'January 2027' })).toBeInTheDocument();
  });
});
