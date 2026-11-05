import * as React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SingleComboBox } from './SingleComboBox';

afterEach(cleanup);

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];

describe('SingleComboBox hidden label', () => {
  it('keeps the label as the accessible name and filter name while hiding it visually', async () => {
    render(
      <div data-propellant>
        <SingleComboBox label="Round timezone" hideLabel options={options} />
      </div>,
    );

    expect(screen.getByText('Round timezone')).toHaveClass('sr-only');
    await userEvent.click(screen.getByRole('combobox', { name: 'Round timezone' }));
    expect(
      await screen.findByRole('textbox', { name: 'Filter round timezone' }),
    ).toBeInTheDocument();
  });
});

describe('SingleComboBox footer', () => {
  it('renders the footer only while the dropdown is open', async () => {
    render(
      <div data-propellant>
        <SingleComboBox
          ariaLabel="Program"
          options={options}
          value="a"
          footer={() => <button type="button">New program</button>}
        />
      </div>,
    );

    expect(screen.queryByText('New program')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('combobox', { name: 'Program' }));
    expect(await screen.findByText('New program')).toBeInTheDocument();
  });

  it('passes a close callback so a footer action can dismiss the menu', async () => {
    const onRun = vi.fn();
    render(
      <div data-propellant>
        <SingleComboBox
          ariaLabel="Program"
          options={options}
          value="a"
          footer={(close) => (
            <button
              type="button"
              onClick={() => {
                close();
                onRun();
              }}
            >
              New program
            </button>
          )}
        />
      </div>,
    );

    await userEvent.click(screen.getByRole('combobox', { name: 'Program' }));
    await userEvent.click(await screen.findByText('New program'));

    expect(onRun).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('New program')).not.toBeInTheDocument();
  });

  it('keeps the footer outside the scrolling option list', async () => {
    render(
      <div data-propellant>
        <SingleComboBox
          ariaLabel="Program"
          options={options}
          value="a"
          footer={() => <button type="button">New program</button>}
        />
      </div>,
    );

    await userEvent.click(screen.getByRole('combobox', { name: 'Program' }));
    const action = await screen.findByText('New program');

    expect(screen.getByRole('listbox')).not.toContainElement(action);
  });

  it('lets the keyboard reach the footer and leave it cleanly', async () => {
    render(
      <div data-propellant>
        <SingleComboBox
          ariaLabel="Program"
          options={options}
          value="a"
          footer={() => (
            <>
              <button type="button">Edit Alpha</button>
              <button type="button">New program</button>
            </>
          )}
        />
      </div>,
    );
    const trigger = screen.getByRole('combobox', { name: 'Program' });

    await userEvent.click(trigger);
    const filter = await screen.findByRole('textbox', { name: 'Filter program' });
    expect(filter).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Edit Alpha' })).toHaveFocus();

    await userEvent.tab({ shift: true });
    expect(filter).toHaveFocus();

    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'New program' })).toHaveFocus();

    await userEvent.tab();
    expect(screen.queryByText('New program')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes from the footer on Escape and returns focus to the trigger', async () => {
    render(
      <div data-propellant>
        <SingleComboBox
          ariaLabel="Program"
          options={options}
          value="a"
          footer={() => <button type="button">New program</button>}
        />
      </div>,
    );
    const trigger = screen.getByRole('combobox', { name: 'Program' });

    await userEvent.click(trigger);
    await screen.findByRole('textbox', { name: 'Filter program' });
    await userEvent.tab();
    await userEvent.keyboard('{Escape}');

    expect(screen.queryByText('New program')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

describe('SingleComboBox keyboard exit', () => {
  it('returns focus to the trigger on Shift+Tab from the filter', async () => {
    render(
      <div data-propellant>
        <SingleComboBox ariaLabel="Program" options={options} value="a" />
      </div>,
    );
    const trigger = screen.getByRole('combobox', { name: 'Program' });

    await userEvent.click(trigger);
    await screen.findByRole('textbox', { name: 'Filter program' });
    await userEvent.tab({ shift: true });

    expect(screen.queryByRole('textbox', { name: 'Filter program' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

describe('SingleComboBox accessible name', () => {
  it('names an unlabelled trigger from its overline and the selected value', () => {
    render(
      <div data-propellant>
        <SingleComboBox overline="Current program" options={options} value="b" />
      </div>,
    );

    expect(screen.getByRole('combobox', { name: 'Current program Beta' })).toBeInTheDocument();
  });
});

describe('SingleComboBox required and trigger text', () => {
  it('marks the label and the combobox as required only when asked', () => {
    const { rerender } = render(
      <SingleComboBox label="Primary industry" required options={options} />,
    );
    const combobox = screen.getByRole('combobox', { name: /Primary industry/ });
    expect(combobox).toHaveAttribute('aria-required', 'true');
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
    rerender(<SingleComboBox label="Primary industry" options={options} />);
    expect(screen.getByRole('combobox', { name: 'Primary industry' })).not.toHaveAttribute(
      'aria-required',
    );
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('keeps a long selected subtitle on one truncated line', () => {
    render(
      <SingleComboBox
        ariaLabel="Country code"
        value="vc"
        options={[{ value: 'vc', label: '+1', sub: 'Saint Vincent and the Grenadines' }]}
      />,
    );
    expect(screen.getByText('Saint Vincent and the Grenadines').className).toContain(
      'text-ellipsis',
    );
  });
});

describe('SingleComboBox accessible name', () => {
  it('names the listbox and filter from ariaLabel when no visible label is rendered', async () => {
    render(
      <div data-propellant>
        <SingleComboBox ariaLabel="Country" options={options} value="" />
      </div>,
    );

    await userEvent.click(screen.getByRole('combobox', { name: 'Country' }));

    expect(screen.getByRole('listbox', { name: 'Country' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Filter country' })).toBeInTheDocument();
  });
});

describe('SingleComboBox compact trigger', () => {
  it('shows the short text in the trigger and keeps the full label for screen readers', () => {
    render(
      <SingleComboBox
        ariaLabel="Country code"
        value="us"
        options={[{ value: 'us', label: 'United States', sub: '+1', short: '+1' }]}
      />,
    );
    const combobox = screen.getByRole('combobox', { name: 'Country code' });
    expect(combobox).toHaveTextContent('+1 United States');
    expect(screen.getByText('United States').className).toContain('sr-only');
    expect(combobox.querySelectorAll('span[class*="search-select-item-sub-fg"]')).toHaveLength(0);
  });
});

const groupedOptions = [
  {
    value: 'other-1',
    label: 'Omar Other',
    group: 'Other judges',
    detail: 'Already on a panel at this time',
  },
  { value: 'free-1', label: 'Ana Available', group: 'Available judges', sub: '1 panel' },
  { value: 'free-2', label: 'Ben Available', group: 'Available judges' },
];

describe('SingleComboBox groups', () => {
  it('lists options under their group headings in first-seen order', async () => {
    render(
      <div data-propellant>
        <SingleComboBox ariaLabel="Judge" options={groupedOptions} />
      </div>,
    );

    await userEvent.click(screen.getByRole('combobox', { name: 'Judge' }));
    const groups = await screen.findAllByRole('group');

    expect(groups.map((group) => group.getAttribute('aria-labelledby'))).toHaveLength(2);
    expect(screen.getByRole('group', { name: 'Other judges' })).toHaveTextContent('Omar Other');
    expect(screen.getByRole('group', { name: 'Available judges' })).toHaveTextContent(
      'Ana Available',
    );
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Omar OtherAlready on a panel at this time',
      'Ana Available1 panel',
      'Ben Available',
    ]);
  });

  it('moves the active option in the grouped order and commits with Enter', async () => {
    const onChange = vi.fn();
    render(
      <div data-propellant>
        <SingleComboBox ariaLabel="Judge" options={groupedOptions} onChange={onChange} />
      </div>,
    );

    await userEvent.click(screen.getByRole('combobox', { name: 'Judge' }));
    await screen.findByRole('listbox');
    await userEvent.keyboard('{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenCalledWith('free-1');
  });

  it('filters on the detail line and drops groups with no match', async () => {
    render(
      <div data-propellant>
        <SingleComboBox ariaLabel="Judge" options={groupedOptions} />
      </div>,
    );

    await userEvent.click(screen.getByRole('combobox', { name: 'Judge' }));
    await userEvent.type(await screen.findByRole('textbox'), 'this time');

    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.queryByRole('group', { name: 'Available judges' })).not.toBeInTheDocument();
  });

  it('leaves ungrouped options in a group without a heading when others are grouped', async () => {
    render(
      <div data-propellant>
        <SingleComboBox
          ariaLabel="Judge"
          options={[{ value: 'plain', label: 'Plain option' }, ...groupedOptions]}
        />
      </div>,
    );

    await userEvent.click(screen.getByRole('combobox', { name: 'Judge' }));
    const groups = await screen.findAllByRole('group');

    expect(groups[0]).not.toHaveAttribute('aria-labelledby');
    expect(groups[0]).toHaveTextContent('Plain option');
  });

  it('keeps a flat listbox when no option is grouped', async () => {
    render(
      <div data-propellant>
        <SingleComboBox ariaLabel="Program" options={options} />
      </div>,
    );

    await userEvent.click(screen.getByRole('combobox', { name: 'Program' }));

    expect((await screen.findByRole('listbox')).tagName).toBe('UL');
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
  });
});

describe('SingleComboBox keywords', () => {
  const zones = [
    {
      value: 'America/New_York',
      label: 'Your device (Eastern Daylight Time)',
      keywords: 'America/New_York New York',
    },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
  ];

  it('matches an option on its keywords without showing them', async () => {
    render(
      <div data-propellant>
        <SingleComboBox ariaLabel="Timezone" options={zones} />
      </div>,
    );

    await userEvent.click(screen.getByRole('combobox', { name: 'Timezone' }));
    await userEvent.type(await screen.findByRole('textbox'), 'new york');

    const [match] = screen.getAllByRole('option');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(match).toHaveTextContent('Your device (Eastern Daylight Time)');
    expect(match).not.toHaveTextContent('America/New_York');
  });
});

describe('SingleComboBox disabled options', () => {
  const withDisabled = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta', disabled: true, detail: 'Cannot add: the panel is full' },
    { value: 'c', label: 'Gamma' },
  ];

  it('lets Arrow keys land on a disabled option so its reason is read, but never picks it', async () => {
    const onChange = vi.fn();
    render(<SingleComboBox label="Panel" options={withDisabled} onChange={onChange} />);

    await userEvent.click(screen.getByRole('combobox', { name: 'Panel' }));
    const filter = screen.getByRole('textbox', { name: 'Filter panel' });
    await userEvent.keyboard('{ArrowDown}');

    const active = document.getElementById(filter.getAttribute('aria-activedescendant') as string);
    expect(active).toHaveAttribute('aria-disabled', 'true');
    expect(active).toHaveTextContent('Cannot add: the panel is full');
    await userEvent.keyboard('{Enter}');
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(filter.getAttribute('aria-activedescendant')).toMatch(/-opt-0$/);
    await userEvent.keyboard('{ArrowUp}');
    expect(filter.getAttribute('aria-activedescendant')).toMatch(/-opt-2$/);
  });
});

describe('SingleComboBox reason lines', () => {
  const locked = [
    { value: 'a', label: 'Alpha' },
    {
      value: 'b',
      label: 'Beta',
      disabled: true,
      detail: ['Cannot add: On Midday at the same time', 'No matching industry'],
    },
    { value: 'c', label: 'Gamma', detail: ['Needs override: Panel is full'] },
  ];

  it('shows each reason on its own line and keeps a disabled reason readable', async () => {
    render(<SingleComboBox label="Judge" options={locked} />);

    await userEvent.click(screen.getByRole('combobox', { name: 'Judge' }));

    const lockedReason = screen.getByText('No matching industry');
    expect(lockedReason.className).toContain('--warning');
    expect(lockedReason.className).not.toContain('opacity');
    expect(screen.getByText('Cannot add: On Midday at the same time')).not.toBe(lockedReason);
    expect(screen.getByText('Beta').className).toContain('opacity-[var(--opacity-disabled)]');
    expect(screen.getByRole('option', { name: /Beta/ }).className).not.toContain('opacity');
    expect(screen.getByText('Needs override: Panel is full').className).toContain(
      '--option-secondary',
    );
    expect(screen.getByText('Gamma').className).not.toContain('opacity');
  });

  it('matches the filter against any reason line', async () => {
    render(<SingleComboBox label="Judge" options={locked} />);

    await userEvent.click(screen.getByRole('combobox', { name: 'Judge' }));
    await userEvent.type(screen.getByRole('textbox', { name: 'Filter judge' }), 'industry');

    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option')).toHaveTextContent('Beta');
  });
});

describe('SingleComboBox unlabelled list name and long values', () => {
  it('names the list with the aria label when there is no visible label', async () => {
    render(
      <div data-propellant>
        <SingleComboBox ariaLabel="Filter by panel" options={options} />
      </div>,
    );

    await userEvent.click(screen.getByRole('combobox', { name: 'Filter by panel' }));

    expect(await screen.findByRole('listbox', { name: 'Filter by panel' })).toBeInTheDocument();
  });

  it('names the empty list with the aria label too', async () => {
    render(
      <div data-propellant>
        <SingleComboBox ariaLabel="Filter by panel" options={options} />
      </div>,
    );

    await userEvent.click(screen.getByRole('combobox', { name: 'Filter by panel' }));
    await userEvent.type(await screen.findByRole('textbox'), 'zzz');

    expect(screen.getByRole('listbox', { name: 'Filter by panel' })).toHaveTextContent(
      'No results',
    );
  });

  it('keeps the visible label as the list name', async () => {
    render(
      <div data-propellant>
        <SingleComboBox label="Program" ariaLabel="Ignored" options={options} />
      </div>,
    );

    await userEvent.click(screen.getByRole('combobox', { name: 'Program' }));

    const list = await screen.findByRole('listbox', { name: 'Program' });
    expect(list).not.toHaveAttribute('aria-label');
  });

  it('shows the full chosen label as a title so a truncated value can be read', () => {
    const longLabel = 'Morning finalists in the main auditorium with the visiting judges';
    render(
      <div data-propellant>
        <SingleComboBox
          ariaLabel="Filter by panel"
          options={[{ value: 'long', label: longLabel }]}
          value="long"
        />
      </div>,
    );

    const shown = screen.getByText(longLabel);
    expect(shown).toHaveAttribute('title', longLabel);
    expect(shown).toHaveClass('overflow-hidden', 'text-ellipsis', 'whitespace-nowrap');
  });
});

describe('SingleComboBox layer host', () => {
  it('opens the menu inside the nearest layer host so the host counts it as inside', async () => {
    render(
      <div data-propellant>
        <div data-testid="host" data-propellant-layer-host="">
          <SingleComboBox ariaLabel="Zone" options={options} />
        </div>
      </div>,
    );

    await userEvent.click(screen.getByRole('combobox', { name: 'Zone' }));

    expect(screen.getByTestId('host')).toContainElement(
      await screen.findByRole('listbox', { name: 'Zone' }),
    );
  });

  it('opens the menu on the page body without a layer host', async () => {
    const { container } = render(
      <div data-propellant>
        <SingleComboBox ariaLabel="Zone" options={options} />
      </div>,
    );

    await userEvent.click(screen.getByRole('combobox', { name: 'Zone' }));

    const menu = await screen.findByRole('listbox', { name: 'Zone' });
    expect(container).not.toContainElement(menu);
    expect(document.body).toContainElement(menu);
  });
});

describe('SingleComboBox long option labels', () => {
  it('truncates each option label and keeps the full name as its title', async () => {
    const longName = 'Bartholomew Alexander Fitzgerald-Montgomery the Third';
    render(
      <div data-propellant>
        <SingleComboBox
          ariaLabel="Pick a judge"
          options={[
            { value: 'long', label: longName, sub: 'On 2 panels', detail: 'Needs override' },
            { value: 'short', label: 'Ana' },
          ]}
        />
      </div>,
    );

    await userEvent.click(screen.getByRole('combobox', { name: 'Pick a judge' }));
    const listbox = await screen.findByRole('listbox');

    const longLabel = Array.from(listbox.querySelectorAll('span')).find(
      (element) => element.textContent === longName,
    );
    expect(longLabel).toHaveAttribute('title', longName);
    expect(longLabel).toHaveClass('truncate', 'min-w-0');
    expect(screen.getByText('On 2 panels')).toHaveClass('shrink-0');
    const shortLabel = Array.from(listbox.querySelectorAll('span')).find(
      (element) => element.textContent === 'Ana',
    );
    expect(shortLabel).toHaveAttribute('title', 'Ana');
  });
});
