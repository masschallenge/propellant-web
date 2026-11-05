import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Sheet } from '../Sheet/Sheet';
import { SingleComboBox } from '../ComboBox/SingleComboBox';
import { FilterSelect } from '../FilterBar/FilterBar';

afterEach(cleanup);

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];

const renderInModal = (field: React.ReactNode) => {
  const onClose = vi.fn();
  render(
    <Sheet open onClose={onClose} title="Move judge">
      {field}
    </Sheet>,
  );
  return { onClose };
};

describe('Escape on an open select inside a Sheet', () => {
  it('closes only the SingleComboBox menu, then the Sheet on a second Escape', async () => {
    const { onClose } = renderInModal(<SingleComboBox label="Panel" options={OPTIONS} />);
    const trigger = screen.getByRole('combobox', { name: 'Panel' });

    await userEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
    expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clears a SingleComboBox search first, keeping the menu and the Sheet open', async () => {
    const { onClose } = renderInModal(<SingleComboBox label="Panel" options={OPTIONS} />);

    await userEvent.click(screen.getByRole('combobox', { name: 'Panel' }));
    await userEvent.keyboard('Alp');
    await userEvent.keyboard('{Escape}');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes the SingleComboBox from its footer even with a search typed', async () => {
    const { onClose } = renderInModal(
      <SingleComboBox
        label="Panel"
        options={OPTIONS}
        footer={() => <button type="button">New panel</button>}
      />,
    );

    await userEvent.click(screen.getByRole('combobox', { name: 'Panel' }));
    await userEvent.keyboard('Alp');
    screen.getByRole('button', { name: 'New panel' }).focus();
    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it.each([false, true])(
    'closes only the FilterSelect menu (searchable: %s)',
    async (isSearchable) => {
      const { onClose } = renderInModal(
        <FilterSelect label="Action" options={OPTIONS} value="a" searchable={isSearchable} />,
      );
      const trigger = screen.getByRole('button', { name: /^Action/ });

      await userEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      await userEvent.keyboard('{Escape}');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(onClose).not.toHaveBeenCalled();
      expect(trigger).toHaveFocus();
    },
  );
});
