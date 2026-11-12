import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ColorPicker } from './ColorPicker';

afterEach(cleanup);

describe('ColorPicker swatch picker', () => {
  it('picks a swatch, marks it pressed and accepts a typed value', () => {
    const onChange = vi.fn();
    render(
      <ColorPicker
        variant="swatch-picker"
        defaultValue="#0facbd"
        swatches={['#0facbd', '#5c940d']}
        onChange={onChange}
        withAlpha={false}
        showOpacity={false}
      />,
    );
    expect(screen.getByRole('button', { name: 'Use #0facbd' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Use #5c940d' }));
    expect(onChange).toHaveBeenLastCalledWith('#5c940d');
    expect(screen.getByRole('button', { name: 'Use #5c940d' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    fireEvent.change(screen.getByRole('textbox', { name: 'Hex value' }), {
      target: { value: '#123456' },
    });
    expect(onChange).toHaveBeenLastCalledWith('#123456');
    expect(screen.queryByLabelText('Opacity percent')).not.toBeInTheDocument();
  });

  it('offers the brand chart colors in chart order as the default swatches', () => {
    render(<ColorPicker variant="swatch-picker" />);
    const chartOrder = [
      ['Teal', 'var(--mc-teal)'],
      ['Yellow', 'var(--mc-yellow)'],
      ['Navy', 'var(--mc-navy)'],
      ['MC Blue', 'var(--mc-blue)'],
      ['Deep Teal', 'var(--mc-deep-teal)'],
      ['Gray 300', 'var(--gray-300)'],
    ];
    const group = screen.getByRole('group', { name: 'Hues' });
    const swatchButtons = within(group).getAllByRole('button');
    expect(swatchButtons.map((swatch) => swatch.getAttribute('aria-label'))).toEqual(
      chartOrder.map(([name]) => name),
    );
    expect(swatchButtons.map((swatch) => swatch.style.background)).toEqual(
      chartOrder.map(([, color]) => color),
    );
    expect(screen.queryByRole('button', { name: 'Slate' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Bright teal' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Magenta' })).not.toBeInTheDocument();
  });
});

describe('ColorPicker full panel', () => {
  it('moves the hue and opacity sliders from the keyboard and wraps the hue', () => {
    const onHueChange = vi.fn();
    const onOpacityChange = vi.fn();
    render(<ColorPicker onHueChange={onHueChange} onOpacityChange={onOpacityChange} />);
    const hue = screen.getByRole('slider', { name: 'Hue' });
    fireEvent.keyDown(hue, { key: 'ArrowRight', shiftKey: true });
    expect(onHueChange).toHaveBeenLastCalledWith(194);
    fireEvent.keyDown(hue, { key: 'End' });
    expect(onHueChange).toHaveBeenLastCalledWith(0);
    const opacity = screen.getByRole('slider', { name: 'Opacity' });
    fireEvent.keyDown(opacity, { key: 'ArrowUp' });
    expect(onOpacityChange).toHaveBeenLastCalledWith(100);
    fireEvent.keyDown(opacity, { key: 'Home' });
    expect(opacity).toHaveAttribute('aria-valuenow', '0');
  });

  it('switches tabs, picks a format from the menu and closes', () => {
    const onTabChange = vi.fn();
    const onFormatChange = vi.fn();
    const onClose = vi.fn();
    render(
      <ColorPicker onTabChange={onTabChange} onFormatChange={onFormatChange} onClose={onClose} />,
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Gradient' }));
    expect(onTabChange).toHaveBeenCalledWith('Gradient');
    expect(screen.getByRole('tab', { name: 'Gradient' })).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Color format' }));
    fireEvent.click(screen.getByRole('option', { name: 'RGB' }));
    expect(onFormatChange).toHaveBeenCalledWith('RGB');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'RGB value' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close color picker' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('hides the add swatch button when told to with null', () => {
    const { rerender } = render(<ColorPicker />);
    expect(screen.getByRole('button', { name: 'Add current color' })).toBeInTheDocument();
    rerender(<ColorPicker onAddSwatch={null} />);
    expect(screen.queryByRole('button', { name: 'Add current color' })).not.toBeInTheDocument();
  });
});
