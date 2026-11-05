import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  FilterBar,
  FilterConditions,
  FilterDrawer,
  FilterPopover,
  FilterSelect,
} from './FilterBar';

afterEach(cleanup);

const OPTIONS = [
  { value: '', label: 'All actions' },
  { value: 'offered', label: 'Offered a slot' },
  { value: 'blocked', label: 'Blocked' },
];

const renderInBar = (onChange = vi.fn()) => {
  render(
    <>
      <button type="button">Elsewhere</button>
      <FilterBar hideSearch>
        <FilterSelect label="Action" options={OPTIONS} value="" onChange={onChange} />
      </FilterBar>
    </>,
  );
  return { onChange, trigger: screen.getByRole('button', { name: /^Action\s*All actions/ }) };
};

describe('FilterSelect', () => {
  it('opens its menu outside the scrolling filter row so it is never clipped', async () => {
    const { trigger } = renderInBar();
    await userEvent.click(trigger);
    const listbox = screen.getByRole('listbox', { name: 'Action' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', listbox.id);
    expect(listbox.closest('.overflow-x-auto')).toBeNull();
    expect(listbox.style.position).toBe('fixed');
    expect(listbox.closest('[data-propellant]')).not.toBeNull();
  });

  it('selects an option on click, closes, and returns focus to the trigger', async () => {
    const { trigger, onChange } = renderInBar();
    await userEvent.click(trigger);
    await userEvent.click(
      within(screen.getByRole('listbox')).getByRole('option', { name: 'Blocked' }),
    );
    expect(onChange).toHaveBeenCalledWith('blocked');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes on a press outside but not on a press inside the menu', async () => {
    const { trigger } = renderInBar();
    await userEvent.click(trigger);
    fireEvent.mouseDown(screen.getByRole('option', { name: 'Blocked' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('toggles closed when the trigger is pressed again', async () => {
    const { trigger } = renderInBar();
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('is operable from the keyboard', async () => {
    const { trigger, onChange } = renderInBar();
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveFocus();
    const optionIds = within(listbox)
      .getAllByRole('option')
      .map((option) => option.id);
    expect(listbox).toHaveAttribute('aria-activedescendant', optionIds[0]);
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    expect(listbox).toHaveAttribute('aria-activedescendant', optionIds[2]);
    await userEvent.keyboard('{Home}');
    expect(listbox).toHaveAttribute('aria-activedescendant', optionIds[0]);
    await userEvent.keyboard('{End}{ArrowUp}{Enter}');
    expect(onChange).toHaveBeenCalledWith('offered');
    expect(trigger).toHaveFocus();
  });

  it('closes on Escape with focus back on the trigger, and on Tab', async () => {
    const { trigger } = renderInBar();
    trigger.focus();
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toHaveFocus();
    await userEvent.keyboard('{ }');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await userEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Tab' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('ignores other keys on the trigger and keeps a forced menu open', async () => {
    const onChange = vi.fn();
    render(
      <FilterSelect label="Status" options={OPTIONS} onChange={onChange} placeholder="Pick" open />,
    );
    const trigger = screen.getByRole('button', { name: /Status\s*Pick/ });
    fireEvent.keyDown(trigger, { key: 'a' });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('option', { name: 'Blocked' }));
    expect(onChange).toHaveBeenCalledWith('blocked');
    expect(screen.getByRole('listbox', { name: 'Status' })).toBeInTheDocument();
  });
});

describe('FilterSelect searchable', () => {
  const renderSearchable = (onChange = vi.fn()) => {
    render(
      <>
        <button type="button">Elsewhere</button>
        <FilterSelect label="Judge" options={OPTIONS} value="" onChange={onChange} searchable />
      </>,
    );
    return { onChange, trigger: screen.getByRole('button', { name: /^Judge\s*All actions/ }) };
  };

  it('focuses a search box that narrows the options and picks with Enter', async () => {
    const { trigger, onChange } = renderSearchable();
    await userEvent.click(trigger);
    const search = screen.getByRole('combobox', { name: 'Search judge' });
    expect(search).toHaveFocus();
    expect(
      screen.getByRole('listbox', { name: 'Judge' }).closest('[style]')?.getAttribute('style'),
    ).toContain('fixed');

    await userEvent.type(search, 'off ');
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Offered a slot',
    ]);
    expect(search).toHaveValue('off ');
    await userEvent.keyboard('{Home}x');
    expect(search).toHaveValue('xoff ');
    await userEvent.clear(search);
    await userEvent.type(search, 'off');
    await userEvent.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith('offered');
    expect(trigger).toHaveFocus();
  });

  it('says when nothing matches and starts fresh when reopened', async () => {
    const { trigger } = renderSearchable();
    await userEvent.click(trigger);
    await userEvent.type(screen.getByRole('combobox', { name: 'Search judge' }), 'zzz');
    expect(screen.getByRole('status')).toHaveTextContent('No matches');
    expect(screen.queryAllByRole('option')).toHaveLength(0);

    fireEvent.mouseDown(screen.getByRole('button', { name: 'Elsewhere' }));
    await userEvent.click(trigger);
    expect(screen.getByRole('combobox', { name: 'Search judge' })).toHaveValue('');
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });
});

describe('FilterSelect accessible name', () => {
  it('keeps a space between the label and the chosen value in the name', () => {
    render(
      <FilterSelect
        label="Status"
        options={[{ value: 'active', label: 'Active (not closed)' }]}
        value="active"
      />,
    );

    expect(screen.getByRole('button')).toHaveAccessibleName('Status Active (not closed)');
  });

  it('names an unlabelled trigger by its value alone', () => {
    render(<FilterSelect options={[{ value: 'all', label: 'All panels' }]} value="all" />);

    expect(screen.getByRole('button')).toHaveAccessibleName('All panels');
  });
});

describe('FilterSelect disabled', () => {
  it('shows the chosen value but never opens or changes', async () => {
    const onChange = vi.fn();
    render(
      <FilterSelect
        label="Panel"
        disabled
        options={[
          { value: '', label: 'All panels' },
          { value: '4', label: 'Morning finalists' },
        ]}
        value="4"
        onChange={onChange}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Panel Morning finalists' });

    expect(trigger).toBeDisabled();
    expect(trigger).toHaveClass('disabled:cursor-not-allowed');
    await userEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('FilterSelect field', () => {
  it('draws its trigger on the field shell at the medium control height', () => {
    render(<FilterSelect label="Sort" options={OPTIONS} value="" />);

    expect(screen.getByRole('button', { name: /^Sort/ })).toHaveClass(
      'propellant-field',
      'min-h-[var(--control-md)]',
    );
  });
});

describe('FilterBar controls', () => {
  it('reports tabs, range segments, quick chips, filter chips and the clear action', async () => {
    const onTabChange = vi.fn();
    const onSegmentChange = vi.fn();
    const onQuickChip = vi.fn();
    const onChip = vi.fn();
    const onClear = vi.fn();
    render(
      <FilterBar
        hideSearch
        tabs={[
          { id: 'all', label: 'All', count: 12 },
          { id: 'flagged', label: 'Flagged', count: 3 },
        ]}
        tabValue="all"
        onTabChange={onTabChange}
        segments={[
          { id: '30d', label: '30 days' },
          { id: '7d', label: '7 days' },
        ]}
        segmentValue="30d"
        onSegmentChange={onSegmentChange}
        quickChips={[{ id: 'week', label: 'This week', active: true, onClick: onQuickChip }]}
        chips={[{ id: 'track', label: 'Track', count: 2, active: true, onClick: onChip }]}
        onClear={onClear}
        clearActive
      />,
    );

    expect(screen.getByRole('tab', { name: /All/ })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(screen.getByRole('tab', { name: /Flagged/ }));
    expect(onTabChange).toHaveBeenCalledWith('flagged');

    await userEvent.click(screen.getByRole('radio', { name: '7 days' }));
    expect(onSegmentChange).toHaveBeenCalledWith('7d');

    const quickChip = screen.getByRole('button', { name: 'This week' });
    expect(quickChip).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(quickChip);
    expect(onQuickChip).toHaveBeenCalledTimes(1);

    const chip = screen.getByRole('button', { name: /Track/ });
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(chip);
    expect(onChip).toHaveBeenCalledTimes(1);

    const clear = screen.getByRole('button', { name: 'Clear all' });
    expect(clear).toHaveClass('text-[var(--tint)]');
    await userEvent.click(clear);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('reports search text with a visually hidden label', async () => {
    const onSearchChange = vi.fn();
    render(<FilterBar onSearchChange={onSearchChange} searchPlaceholder="Search applicants" />);

    await userEvent.type(screen.getByRole('searchbox', { name: 'Search' }), 'a');
    expect(onSearchChange).toHaveBeenCalledWith('a');
  });
});

describe('FilterPopover', () => {
  it('toggles checklist options and applies from its footer', async () => {
    const onToggle = vi.fn();
    const onApply = vi.fn();
    render(
      <FilterPopover
        options={[
          { id: 'climate', label: 'Climate', count: 8, checked: true },
          { id: 'health', label: 'Healthcare', count: 5 },
        ]}
        onToggle={onToggle}
        onApply={onApply}
        onClear={() => {}}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Filters, 1 active' });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const healthcare = screen.getByRole('checkbox', { name: /Healthcare/ });
    expect(healthcare).toHaveAttribute('aria-checked', 'false');
    healthcare.focus();
    await userEvent.keyboard(' ');
    expect(onToggle).toHaveBeenCalledWith('health');
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onApply).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('shows the empty state with an add filter action', async () => {
    const onAddFilter = vi.fn();
    render(<FilterPopover open empty onAddFilter={onAddFilter} />);

    expect(screen.getByText('No filters applied')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Add filter' }));
    expect(onAddFilter).toHaveBeenCalledTimes(1);
  });
});

describe('FilterConditions', () => {
  it('edits and removes condition rows', async () => {
    const onChange = vi.fn();
    render(
      <FilterConditions
        rows={[{ field: 'Track', operator: 'Equals', value: '' }]}
        fieldOptions={['Track', 'Stage']}
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Filter value' }), {
      target: { value: 'Climate' },
    });
    expect(onChange).toHaveBeenLastCalledWith([
      { field: 'Track', operator: 'Equals', value: 'Climate' },
    ]);
    await userEvent.click(screen.getByRole('button', { name: 'Remove filter' }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });
});

describe('FilterDrawer', () => {
  it('opens as an inspector named by its title and closes from its close button', async () => {
    const onClose = vi.fn();
    render(
      <FilterDrawer
        open
        title="Filters"
        onClose={onClose}
        rows={[{ field: 'Track', operator: 'Equals', value: 'Climate' }]}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply filters' })).toBeEnabled();
    await userEvent.click(screen.getByRole('button', { name: 'Close filters' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('disables its footer actions until there is a condition', () => {
    render(<FilterDrawer open onClose={() => {}} />);

    expect(screen.getByText('No conditions yet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply filters' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Clear all' })).toBeDisabled();
  });
});
