import { createRef, useState, type ChangeEvent } from 'react';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TextField } from './TextField';

afterEach(cleanup);

describe('TextField invalid state', () => {
  it('flags the field shell so the shared ring draws the error border', () => {
    const { rerender } = render(
      <TextField label="Zip code" invalid hint="Zip code is required." />,
    );
    const input = screen.getByRole('textbox', { name: 'Zip code' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.closest('.propellant-field')).toHaveAttribute('data-invalid', 'true');
    rerender(<TextField label="Zip code" />);
    expect(
      screen.getByRole('textbox', { name: 'Zip code' }).closest('.propellant-field'),
    ).not.toHaveAttribute('data-invalid');
  });
});

const Counter = ({ start }: { start: string }) => {
  const [count, setCount] = useState(start);
  return (
    <TextField
      label="Morning panels"
      type="number"
      min={0}
      max={2}
      stepper="horizontal"
      decrementLabel="Fewer Morning panels"
      incrementLabel="More Morning panels"
      value={count}
      onChange={(event: ChangeEvent<HTMLInputElement>) => setCount(event.target.value)}
    />
  );
};

describe('TextField stepper', () => {
  it('names its buttons, steps within the bounds and marks a button disabled at its bound', () => {
    render(<Counter start="1" />);
    const fewer = screen.getByRole('button', { name: 'Fewer Morning panels' });
    const more = screen.getByRole('button', { name: 'More Morning panels' });
    const input = screen.getByRole('spinbutton', { name: 'Morning panels' });

    fireEvent.click(more);
    expect(input).toHaveValue(2);
    expect(more).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(fewer);
    fireEvent.click(fewer);
    expect(input).toHaveValue(0);
    expect(fewer).toHaveAttribute('aria-disabled', 'true');
    expect(more).not.toHaveAttribute('aria-disabled');
  });

  it('keeps keyboard focus on a button that reaches its bound and ignores further presses', () => {
    render(<Counter start="1" />);
    const more = screen.getByRole('button', { name: 'More Morning panels' });
    const input = screen.getByRole('spinbutton', { name: 'Morning panels' });

    more.focus();
    fireEvent.click(more);
    expect(input).toHaveValue(2);
    expect(more).toBeEnabled();
    expect(more).toHaveFocus();
    fireEvent.click(more);
    expect(input).toHaveValue(2);
    expect(more).toHaveFocus();
  });

  it('clamps a step that would pass a bound', () => {
    render(<Counter start="9" />);

    expect(screen.getByRole('button', { name: 'More Morning panels' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    fireEvent.click(screen.getByRole('button', { name: 'More Morning panels' }));
    expect(screen.getByRole('spinbutton')).toHaveValue(9);
    fireEvent.click(screen.getByRole('button', { name: 'Fewer Morning panels' }));
    expect(screen.getByRole('spinbutton')).toHaveValue(2);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '-4' } });
    expect(screen.getByRole('button', { name: 'Fewer Morning panels' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    fireEvent.click(screen.getByRole('button', { name: 'More Morning panels' }));
    expect(screen.getByRole('spinbutton')).toHaveValue(0);
  });

  it('disables both buttons outright when the whole field is disabled', () => {
    render(<TextField label="Count" stepper="horizontal" defaultValue="3" disabled />);

    expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrement' })).toBeDisabled();
  });

  it('keeps the default names and leaves an unbounded stepper enabled', () => {
    render(<TextField label="Count" stepper="vertical" defaultValue="3" />);

    expect(screen.getByRole('button', { name: 'Increment' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Decrement' })).not.toHaveAttribute('aria-disabled');
  });
});

describe('TextField clear button', () => {
  const SearchField = ({ start = '' }: { start?: string }) => {
    const [text, setText] = useState(start);
    return (
      <TextField
        aria-label="Search panels"
        type="search"
        value={text}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setText(event.target.value)}
        onClear={() => setText('')}
        clearLabel="Clear search"
      />
    );
  };

  it('shows the clear button only while the field holds text', () => {
    render(<SearchField />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search panels' }), {
      target: { value: 'Morning' },
    });

    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('empties the field and returns focus to it', () => {
    render(<SearchField start="Morning" />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));

    const field = screen.getByRole('searchbox', { name: 'Search panels' });
    expect(field).toHaveValue('');
    expect(field).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  it('hides the native search cancel button so only one clear shows', () => {
    render(<SearchField start="Morning" />);
    expect(screen.getByRole('searchbox')).toHaveClass(
      '[&::-webkit-search-cancel-button]:appearance-none',
    );
  });

  it('names the clear button Clear by default and offers none when disabled', () => {
    const { rerender } = render(
      <TextField
        aria-label="Name"
        value="Ada"
        onChange={() => undefined}
        onClear={() => undefined}
      />,
    );
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();

    rerender(
      <TextField
        aria-label="Name"
        value="Ada"
        disabled
        onChange={() => undefined}
        onClear={() => undefined}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('keeps clear out of a field without onClear', () => {
    render(<TextField aria-label="Name" value="Ada" onChange={() => undefined} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveAttribute('onclear');
  });
});

describe('TextField hint row', () => {
  it('describes the input by the hint and the trailing counter in the error tone', () => {
    render(<TextField label="Pitch" invalid hint="Too long." hintEnd="12/10 characters" />);
    const input = screen.getByRole('textbox', { name: 'Pitch' });
    const counter = screen.getByText('12/10 characters');
    expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual([
      screen.getByText('Too long.').id,
      counter.id,
    ]);
    expect(counter.className).toContain('--critical');
  });

  it('keeps the counter alone on the hint row when there is no hint', () => {
    render(<TextField label="Pitch" hintEnd="0/10 characters" />);
    const counter = screen.getByText('0/10 characters');
    expect(counter.className).toContain('--label-tertiary');
    expect(screen.getByRole('textbox', { name: 'Pitch' })).toHaveAttribute(
      'aria-describedby',
      counter.id,
    );
  });

  it('leaves the input undescribed with no hint or counter', () => {
    render(<TextField label="Pitch" />);
    expect(screen.getByRole('textbox', { name: 'Pitch' })).not.toHaveAttribute('aria-describedby');
  });
});

describe('TextField label emphasis', () => {
  it('keeps the quiet secondary label by default', () => {
    render(<TextField label="Email" />);
    const label = screen.getByText('Email');
    expect(label).toHaveClass('text-subheadline', 'font-medium', 'text-[var(--label-secondary)]');
  });

  it('sets the label in semibold primary text when strong', () => {
    render(<TextField label="Short answer" emphasis="strong" />);
    const label = screen.getByText('Short answer');
    expect(label).toHaveClass('text-callout', 'font-semibold', 'text-[var(--label)]');
    expect(screen.getByRole('textbox', { name: 'Short answer' })).toBeInTheDocument();
  });
});

describe('TextField hint tone', () => {
  it('pairs an error hint with a glyph and keeps a plain hint quiet', () => {
    const { rerender } = render(
      <TextField label="Zip code" invalid hint="Zip code is required." />,
    );
    const error = screen.getByText('Zip code is required.');
    expect(error).toHaveClass('text-footnote', 'text-[var(--critical)]');
    expect(error.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    rerender(<TextField label="Zip code" hint="Five digits." />);
    const hint = screen.getByText('Five digits.');
    expect(hint).toHaveClass('text-footnote', 'text-[var(--label-tertiary)]');
    expect(hint.querySelector('svg')).toBeNull();
  });

  it('keeps an outside description alongside its own hint', () => {
    render(<TextField label="Zip code" hint="Five digits." aria-describedby="zip-rules" />);
    expect(
      screen
        .getByRole('textbox', { name: 'Zip code' })
        .getAttribute('aria-describedby')
        ?.split(' '),
    ).toEqual(['zip-rules', screen.getByText('Five digits.').id]);
  });
});

describe('TextField sizes and tags', () => {
  it('sizes the input from the control height tokens', () => {
    const { rerender } = render(<TextField aria-label="Name" size="sm" />);
    expect(screen.getByRole('textbox')).toHaveClass('min-h-[var(--control-sm)]');
    rerender(<TextField aria-label="Name" />);
    expect(screen.getByRole('textbox')).toHaveClass('min-h-[var(--control-md)]');
    rerender(<TextField aria-label="Name" size="lg" />);
    expect(screen.getByRole('textbox')).toHaveClass('min-h-[var(--control-lg)]');
  });

  it('adds a tag on Enter, removes the last on Backspace and offers no remove when disabled', () => {
    const TagField = ({ isDisabled = false }: { isDisabled?: boolean }) => {
      const [tags, setTags] = useState(['Fintech']);
      return (
        <TextField label="Industries" tags={tags} onTagsChange={setTags} disabled={isDisabled} />
      );
    };
    const { unmount } = render(<TagField />);
    const input = screen.getByRole('textbox', { name: 'Industries' });
    fireEvent.change(input, { target: { value: 'Health' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('Health')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove Fintech' }));
    expect(screen.queryByText('Fintech')).not.toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Backspace' });
    expect(screen.queryByText('Health')).not.toBeInTheDocument();
    unmount();

    render(<TagField isDisabled />);
    expect(screen.getByText('Fintech')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove Fintech' })).not.toBeInTheDocument();
  });

  it('opens the file picker and shows the chosen file name', () => {
    const onFileSelect = vi.fn();
    const { container } = render(
      <TextField label="Pitch deck" fileUpload onFileSelect={onFileSelect} />,
    );
    const input = screen.getByRole('textbox', { name: 'Pitch deck' });
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveAttribute('placeholder', 'No file selected');
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['deck'], 'deck.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(onFileSelect).toHaveBeenCalledWith(file);
    expect(input).toHaveValue('deck.pdf');
  });

  it('reveals and hides a password', () => {
    render(<TextField label="Password" type="password" passwordToggle />);
    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    fireEvent.click(toggle);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});

describe('TextField native seams', () => {
  it('forwards its ref to the input and accepts a free form input mode', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextField label="Zip code" ref={ref} inputMode={'decimal' as string} />);
    const input = screen.getByRole('textbox', { name: 'Zip code' });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute('inputmode', 'decimal');
  });

  it('keeps the numeric input mode on a stepper', () => {
    render(<TextField label="Panels" stepper="horizontal" inputMode="text" />);
    expect(screen.getByRole('textbox', { name: 'Panels' })).toHaveAttribute('inputmode', 'numeric');
  });
});
