import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PopUpButton } from './PopUpButton';

afterEach(cleanup);

const options = [
  { value: 'advance', label: 'Advance', description: 'Strong fit, move on' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'decline', label: 'Do not advance', description: 'Not a fit this cycle' },
];

const renderSelect = (props: Partial<Parameters<typeof PopUpButton>[0]> = {}) => {
  const onChange = vi.fn();
  render(
    <PopUpButton ariaLabel="Recommendation" options={options} onChange={onChange} {...props} />,
  );
  return { onChange, trigger: screen.getByRole('combobox', { name: 'Recommendation' }) };
};

describe('PopUpButton option descriptions', () => {
  it('names each option by its label and describes it with its help text', () => {
    const { trigger } = renderSelect();

    fireEvent.click(trigger);

    const advance = screen.getByRole('option', { name: 'Advance' });
    expect(advance).toHaveAccessibleDescription('Strong fit, move on');
    expect(screen.getByRole('option', { name: 'Maybe' })).not.toHaveAttribute('aria-describedby');
    expect(screen.getByRole('listbox')).toHaveClass('max-w-[22.5rem]');
  });

  it('matches the trigger width when no option has a description', () => {
    const { trigger } = renderSelect({ options: [{ value: 'a', label: 'Alpha' }] });

    fireEvent.click(trigger);

    expect(screen.getByRole('listbox').style.minWidth).toBe('');
    expect(screen.getByRole('listbox')).not.toHaveClass('max-w-[22.5rem]');
  });
});

describe('PopUpButton tone and size', () => {
  it('tints the trigger with the tone fill', () => {
    const { trigger } = renderSelect({ tone: 'warning', value: 'maybe' });

    expect(trigger).toHaveAttribute('data-tone', 'warning');
    expect(trigger.style.backgroundColor).toBe('var(--warning-fill)');
  });

  it('leaves a neutral trigger on the default field background', () => {
    const { trigger } = renderSelect();

    expect(trigger.style.backgroundColor).toBe('');
  });

  it('renders a dense trigger and a wider footnote menu at xs', () => {
    const { trigger } = renderSelect({ size: 'xs', options: [{ value: 'a', label: 'Alpha' }] });

    fireEvent.click(trigger);

    expect(trigger).toHaveClass('min-h-[var(--control-sm)]', 'text-footnote');
    expect(screen.getByRole('listbox')).toHaveClass('text-footnote', 'max-w-[22.5rem]');
  });

  it('sizes the default trigger to the medium control height', () => {
    const { trigger } = renderSelect();

    expect(trigger).toHaveClass('propellant-field', 'min-h-[var(--control-md)]', 'text-callout');
  });
});

describe('PopUpButton keyboard', () => {
  it('opens on the chosen value and moves with arrows, Home and End', () => {
    const { trigger } = renderSelect({ value: 'maybe' });

    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(trigger).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[1].id);

    fireEvent.keyDown(trigger, { key: 'End' });
    expect(trigger).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[2].id);
    fireEvent.keyDown(trigger, { key: 'Home' });
    expect(trigger).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[0].id);
    fireEvent.keyDown(trigger, { key: 'ArrowUp' });
    expect(trigger).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[2].id);
  });

  it('commits with Enter and keeps focus on the trigger', () => {
    const { trigger, onChange } = renderSelect();
    trigger.focus();

    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith('maybe');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('jumps by typed text, cycling on a repeated first letter', () => {
    vi.useFakeTimers();
    const { trigger } = renderSelect({
      options: [
        { value: 'a', label: 'Advance' },
        { value: 'm', label: 'Maybe' },
        { value: 'd', label: 'Do not advance' },
        { value: 'd2', label: 'Defer' },
      ],
    });

    fireEvent.keyDown(trigger, { key: 'd' });
    expect(trigger).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[2].id);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    fireEvent.keyDown(trigger, { key: 'd' });
    expect(trigger).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[3].id);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    fireEvent.keyDown(trigger, { key: 'm' });
    fireEvent.keyDown(trigger, { key: 'a' });
    expect(trigger).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[1].id);
    fireEvent.keyDown(trigger, { key: 'z' });
    expect(trigger).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[1].id);
    vi.useRealTimers();
  });

  it('closes on Escape without letting the key reach outer listeners', () => {
    const outer = vi.fn();
    window.addEventListener('keydown', outer);
    const { trigger } = renderSelect();

    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Escape' });

    expect(screen.queryByRole('listbox')).toBeNull();
    expect(outer).not.toHaveBeenCalled();
    window.removeEventListener('keydown', outer);
  });

  it('closes when focus tabs away', () => {
    const { trigger } = renderSelect();

    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Tab' });

    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('PopUpButton menu', () => {
  it('floats the menu on the elevated surface and highlights the active row with the tint', () => {
    const { trigger } = renderSelect({ value: 'maybe' });

    fireEvent.click(trigger);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveClass('bg-[var(--bg-elevated)]', 'shadow-[var(--shadow-float)]');
    expect(screen.getByRole('option', { name: 'Maybe' })).toHaveClass('bg-[var(--tint)]');
    fireEvent.mouseEnter(screen.getByRole('option', { name: 'Advance' }));
    expect(screen.getByRole('option', { name: 'Advance' })).toHaveClass('bg-[var(--tint)]');
    expect(screen.getByRole('option', { name: 'Maybe' })).not.toHaveClass('bg-[var(--tint)]');
    expect(screen.getByRole('option', { name: 'Maybe' })).toHaveAttribute('aria-selected', 'true');
  });
});

describe('PopUpButton tags', () => {
  const tagOptions = [
    { value: 'health', label: 'Healthcare' },
    { value: 'climate', label: 'Climate' },
    { value: 'fintech', label: 'Fintech' },
  ];

  it('adds a filtered option with Enter and removes chips by button or Backspace', () => {
    const onTagsChange = vi.fn();
    const { rerender } = render(
      <PopUpButton
        label="Industries"
        options={tagOptions}
        tagValues={['health']}
        onTagsChange={onTagsChange}
      />,
    );
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'cli' } });
    expect(screen.getAllByRole('option')).toHaveLength(1);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onTagsChange).toHaveBeenLastCalledWith(['health', 'climate']);

    fireEvent.click(screen.getByRole('button', { name: 'Remove Healthcare' }));
    expect(onTagsChange).toHaveBeenLastCalledWith([]);

    rerender(
      <PopUpButton
        label="Industries"
        options={tagOptions}
        tagValues={['health', 'fintech']}
        onTagsChange={onTagsChange}
      />,
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Backspace' });
    expect(onTagsChange).toHaveBeenLastCalledWith(['health']);
  });
});

describe('PopUpButton pointer', () => {
  it('keeps focus on the trigger while an option is pressed and offers no empty choice', () => {
    const { trigger, onChange } = renderSelect({ value: 'advance' });
    trigger.focus();
    fireEvent.click(trigger);

    const maybe = screen.getByRole('option', { name: 'Maybe' });
    expect(fireEvent.mouseDown(maybe)).toBe(false);
    fireEvent.click(maybe);

    expect(onChange).toHaveBeenCalledWith('maybe');
    expect(trigger).toHaveFocus();
    fireEvent.click(trigger);
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });
});
