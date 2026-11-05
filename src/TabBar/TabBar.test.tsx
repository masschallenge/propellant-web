import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TabBar, TabPanel } from './TabBar';

afterEach(cleanup);

const ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'judges', label: 'Judges' },
  { id: 'schedule', label: 'Schedule' },
];

describe('TabBar', () => {
  it('wires each tab to its panel', () => {
    render(
      <>
        <TabBar id="round" items={ITEMS} aria-label="Round sections" />
        <TabPanel tabsId="round" value="overview">
          Overview panel
        </TabPanel>
        <TabPanel tabsId="round" value="judges" active={false}>
          Judges panel
        </TabPanel>
      </>,
    );
    const tab = screen.getByRole('tab', { name: 'Overview' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveAttribute('aria-controls', 'round-panel-overview');
    expect(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent('Overview panel');
    expect(screen.getByText('Judges panel')).not.toBeVisible();
  });

  it('marks the current tab with the tint indicator', async () => {
    render(<TabBar items={ITEMS} aria-label="Round sections" />);
    await userEvent.click(screen.getByRole('tab', { name: 'Judges' }));
    expect(screen.getByRole('tab', { name: 'Judges' }).className).toContain(
      'after:bg-[var(--tint)]',
    );
  });

  it('uses up and down arrows when vertical', async () => {
    const onChange = vi.fn();
    render(<TabBar items={ITEMS} vertical aria-label="Sections" onChange={onChange} />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    screen.getByRole('tab', { name: 'Overview' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: 'Judges' })).toHaveFocus();
    await userEvent.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith('judges');
  });

  it('can drop panel wiring for tabs that only filter', () => {
    render(<TabBar items={ITEMS} controlsPanels={false} aria-label="Filter" />);
    expect(screen.getByRole('tab', { name: 'Overview' })).not.toHaveAttribute('aria-controls');
  });
});
