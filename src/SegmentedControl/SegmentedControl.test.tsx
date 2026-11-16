import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SegmentedControl } from './SegmentedControl';
import { TabPanel } from '../TabBar/TabBar';

afterEach(cleanup);

const ITEMS = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month', disabled: true },
  { id: 'year', label: 'Year' },
];

describe('SegmentedControl as a radio group', () => {
  it('exposes a labelled radio group with the first segment checked', () => {
    render(<SegmentedControl items={ITEMS} aria-label="Range" />);
    expect(screen.getByRole('radiogroup', { name: 'Range' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('tabindex', '-1');
  });

  it('selects on click and reports the id', async () => {
    const onChange = vi.fn();
    render(<SegmentedControl items={ITEMS} aria-label="Range" onChange={onChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Week' }));
    expect(onChange).toHaveBeenCalledWith('week');
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('aria-checked', 'true');
  });

  it('moves and selects with the arrow keys, skipping disabled segments', async () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl items={ITEMS} defaultValue="week" aria-label="Range" onChange={onChange} />,
    );
    screen.getByRole('radio', { name: 'Week' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Year' })).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('year');
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'Year' })).toHaveFocus();
  });

  it('follows the value prop when controlled', async () => {
    const onChange = vi.fn();
    render(<SegmentedControl items={ITEMS} value="day" aria-label="Range" onChange={onChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Week' }));
    expect(onChange).toHaveBeenCalledWith('week');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'true');
  });

  it('shows a neutral count and a critical badge', () => {
    render(
      <SegmentedControl
        aria-label="Alerts"
        items={[
          { id: 'open', label: 'Open', meta: 12, badge: 2 },
          { id: 'all', label: 'All' },
        ]}
      />,
    );
    expect(screen.getByText('12').className).toContain('bg-[var(--fill-secondary)]');
    expect(screen.getByText('2').className).toContain('bg-[var(--critical-fill)]');
  });
});

describe('SegmentedControl with panels', () => {
  it('becomes a tab list wired to its panels', async () => {
    render(
      <>
        <SegmentedControl id="groups" items={ITEMS} aria-label="Groups" controlsPanels />
        <TabPanel tabsId="groups" value="day">
          Day panel
        </TabPanel>
      </>,
    );
    const tab = screen.getByRole('tab', { name: 'Day' });
    expect(screen.getByRole('tablist', { name: 'Groups' })).toBeInTheDocument();
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveAttribute('aria-controls', 'groups-panel-day');
    expect(screen.getByRole('tabpanel', { name: 'Day' })).toHaveTextContent('Day panel');
  });

  it('moves focus without selecting until Enter or a click', async () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl items={ITEMS} aria-label="Groups" controlsPanels onChange={onChange} />,
    );
    screen.getByRole('tab', { name: 'Day' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Week' })).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('week');
  });
});
