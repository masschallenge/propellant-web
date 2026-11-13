import { useState } from 'react';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MultiComboBox } from './MultiComboBox';
import type { MultiComboBoxOption } from './MultiComboBox';
import { ComboBox } from './ComboBox';
import { Sheet } from '../Sheet/Sheet';

afterEach(cleanup);

const OPTIONS = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta'].map((name) => ({
  value: name.toLowerCase(),
  label: name,
}));

describe('MultiComboBox chips', () => {
  it('shows the placeholder until something is chosen', () => {
    render(
      <MultiComboBox label="Industries" options={OPTIONS} value={[]} placeholder="None yet" />,
    );

    expect(screen.getByRole('combobox', { name: 'Industries' })).toHaveTextContent('None yet');
    expect(screen.queryByRole('button', { name: /^Remove/ })).toBeNull();
  });

  it('shows each chosen value as a chip with its own remove button', async () => {
    const handleChange = vi.fn();
    render(
      <MultiComboBox
        label="Industries"
        options={OPTIONS}
        value={['alpha', 'gamma']}
        onChange={handleChange}
      />,
    );

    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Industries' })).toHaveTextContent('2 selected');
    expect(screen.queryByText(/more$/)).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: 'Remove Alpha' }));

    expect(handleChange).toHaveBeenCalledWith(['gamma']);
  });

  it('removes a chip from the keyboard', async () => {
    const handleChange = vi.fn();
    render(
      <MultiComboBox
        label="Industries"
        options={OPTIONS}
        value={['beta']}
        onChange={handleChange}
      />,
    );

    screen.getByRole('button', { name: 'Remove Beta' }).focus();
    await userEvent.keyboard('{Enter}');

    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it('collapses past five chips behind a +N more toggle', async () => {
    render(
      <MultiComboBox
        label="Industries"
        options={OPTIONS}
        value={OPTIONS.map((option) => option.value)}
      />,
    );

    const toggle = screen.getByRole('button', { name: '+2 more' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getAllByRole('button', { name: /^Remove/ })).toHaveLength(5);
    expect(screen.queryByText('Zeta')).toBeNull();

    await userEvent.click(toggle);

    expect(screen.getAllByRole('button', { name: /^Remove/ })).toHaveLength(7);
    expect(screen.getByText('Eta')).toBeInTheDocument();
    const collapse = screen.getByRole('button', { name: 'Show fewer' });
    expect(collapse).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps opening the option list from the combobox', async () => {
    const handleChange = vi.fn();
    render(
      <MultiComboBox
        label="Industries"
        options={OPTIONS}
        value={['alpha']}
        onChange={handleChange}
      />,
    );

    await userEvent.click(screen.getByRole('combobox', { name: 'Industries' }));
    const listbox = screen.getByRole('listbox');
    await userEvent.click(within(listbox).getByRole('option', { name: /Beta/ }));

    expect(handleChange).toHaveBeenCalledWith(['alpha', 'beta']);
  });

  it('disables chip removal when the field is disabled', () => {
    render(<MultiComboBox label="Industries" options={OPTIONS} value={['alpha']} disabled />);

    expect(screen.getByRole('button', { name: 'Remove Alpha' })).toBeDisabled();
  });
});

describe('MultiComboBox nested options', () => {
  const TREE = [
    { value: 'health', label: 'Health' },
    { value: 'digital', label: 'Digital health', parent: 'health', sub: 'Health' },
    { value: 'devices', label: 'Medical devices', parent: 'health' },
    { value: 'energy', label: 'Energy' },
  ];

  it('folds children under their parent until it is expanded', async () => {
    render(<MultiComboBox label="Industries" options={TREE} value={[]} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Industries' }));

    expect(screen.getByRole('option', { name: /^Health, 2 sub-options, collapsed/ })).toBeVisible();
    expect(screen.queryByRole('option', { name: /Digital health/ })).toBeNull();

    await userEvent.click(screen.getByTestId('ms-expand-health'));

    expect(screen.getByRole('option', { name: /^Health, 2 sub-options, expanded/ })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Digital health' })).toHaveTextContent(
      /^Digital health$/,
    );
    expect(screen.getByRole('option', { name: 'Medical devices' })).toBeVisible();
  });

  it('expands and folds from the keyboard without choosing the parent', async () => {
    const handleChange = vi.fn();
    render(<MultiComboBox label="Industries" options={TREE} value={[]} onChange={handleChange} />);
    const trigger = screen.getByRole('combobox', { name: 'Industries' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    trigger.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(screen.getByRole('option', { name: 'Digital health' })).toBeVisible();
    expect(handleChange).not.toHaveBeenCalled();

    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.queryByRole('option', { name: 'Digital health' })).toBeNull();
  });

  it('opens a parent whose child is chosen, and lists search matches flat', async () => {
    render(<MultiComboBox label="Industries" options={TREE} value={['devices']} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Industries' }));
    expect(screen.getByRole('option', { name: 'Medical devices' })).toBeVisible();

    await userEvent.type(screen.getByRole('textbox', { name: 'Search options' }), 'digital');

    expect(screen.getByRole('option', { name: /^Digital health/ })).toHaveTextContent(
      'Digital healthHealth',
    );
    expect(screen.queryByRole('option', { name: /^Health/ })).toBeNull();
  });

  it('chooses the parent alone when its row is clicked', async () => {
    const handleChange = vi.fn();
    render(<MultiComboBox label="Industries" options={TREE} value={[]} onChange={handleChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Industries' }));
    await userEvent.click(screen.getByRole('option', { name: /^Health/ }));

    expect(handleChange).toHaveBeenCalledWith(['health']);
  });
});

describe('MultiComboBox Escape inside a Sheet', () => {
  it('closes only the listbox, keeps the choice and the dialog, and returns focus', async () => {
    const handleClose = vi.fn();
    const ChoosingInModal = () => {
      const [chosen, setChosen] = useState<string[]>([]);
      return (
        <Sheet open title="Industries and expertise" onClose={handleClose}>
          <MultiComboBox label="Industries" options={OPTIONS} value={chosen} onChange={setChosen} />
        </Sheet>
      );
    };
    render(<ChoosingInModal />);
    const trigger = screen.getByRole('combobox', { name: /^Industries/ });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('option', { name: /Beta/ }));
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await userEvent.keyboard('{Escape}');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
    expect(handleClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'Industries and expertise' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Remove Beta/ })).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

describe('MultiComboBox search', () => {
  const SECTORS = [
    { value: 'fintech', label: 'Fintech', keywords: 'finance banking payments' },
    { value: 'health', label: 'Healthcare', keywords: 'medical medtech' },
    { value: 'climate', label: 'Climate' },
  ];

  const openAndSearch = async (term: string) => {
    await userEvent.click(screen.getByRole('combobox', { name: 'Sectors' }));
    await userEvent.type(screen.getByRole('textbox', { name: 'Search options' }), term);
  };

  it('matches an option on its keywords without showing them', async () => {
    render(<MultiComboBox label="Sectors" options={SECTORS} value={[]} />);
    await openAndSearch('banking');

    const [match] = screen.getAllByRole('option');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(match).toHaveAccessibleName('Fintech');
    expect(match).not.toHaveTextContent('banking');
  });

  it('still matches on the label and ignores surrounding spaces', async () => {
    render(<MultiComboBox label="Sectors" options={SECTORS} value={[]} />);
    await openAndSearch('  clim ');

    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: 'Climate' })).toBeVisible();
  });

  it('chooses a keyword match from the keyboard', async () => {
    const handleChange = vi.fn();
    render(<MultiComboBox label="Sectors" options={SECTORS} value={[]} onChange={handleChange} />);
    await openAndSearch('medtech');
    const trigger = screen.getByRole('combobox', { name: 'Sectors' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');

    expect(handleChange).toHaveBeenCalledWith(['health']);
  });

  it('uses filterOption in place of the default match, with the trimmed query', async () => {
    const startsWith = vi.fn((option: MultiComboBoxOption, query: string) =>
      option.label.toLowerCase().startsWith(query.toLowerCase()),
    );
    render(
      <MultiComboBox label="Sectors" options={SECTORS} value={[]} filterOption={startsWith} />,
    );
    await openAndSearch(' care');

    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(startsWith).toHaveBeenCalledWith(SECTORS[1], 'care');

    await userEvent.clear(screen.getByRole('textbox', { name: 'Search options' }));
    await userEvent.type(screen.getByRole('textbox', { name: 'Search options' }), 'heal');

    expect(screen.getByRole('option', { name: 'Healthcare' })).toBeVisible();
    expect(screen.getAllByRole('option')).toHaveLength(1);
  });

  it('accepts keywords and filterOption through ComboBox multiple', async () => {
    render(
      <ComboBox
        multiple
        label="Sectors"
        options={SECTORS}
        value={[]}
        filterOption={(option, query) => option.value === query}
      />,
    );
    await openAndSearch('climate');

    expect(screen.getByRole('option', { name: 'Climate' })).toBeVisible();
    expect(screen.getAllByRole('option')).toHaveLength(1);
  });
});
