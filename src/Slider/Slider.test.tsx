import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Slider } from './Slider';

afterEach(cleanup);

describe('Slider thumb description', () => {
  it('forwards the describing ids and the invalid flag to the thumb', () => {
    render(<Slider value={4} aria-label="Fit" aria-describedby="fit-error" aria-invalid />);
    const thumb = screen.getByRole('slider', { name: 'Fit' });
    expect(thumb).toHaveAttribute('aria-describedby', 'fit-error');
    expect(thumb).toHaveAttribute('aria-invalid', 'true');
  });

  it('leaves the thumb undescribed and valid by default', () => {
    render(<Slider value={4} aria-label="Fit" />);
    const thumb = screen.getByRole('slider', { name: 'Fit' });
    expect(thumb).not.toHaveAttribute('aria-describedby');
    expect(thumb).not.toHaveAttribute('aria-invalid');
  });
});

describe('Slider keyboard and pointer', () => {
  it('steps with the arrow keys and jumps to the ends with Home and End', () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={4} min={0} max={10} aria-label="Score" onChange={onChange} />);
    const thumb = screen.getByRole('slider', { name: 'Score' });
    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    expect(thumb).toHaveAttribute('aria-valuenow', '5');
    fireEvent.keyDown(thumb, { key: 'ArrowDown' });
    expect(thumb).toHaveAttribute('aria-valuenow', '4');
    fireEvent.keyDown(thumb, { key: 'End' });
    expect(thumb).toHaveAttribute('aria-valuenow', '10');
    fireEvent.keyDown(thumb, { key: 'Home' });
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('keeps range thumbs from crossing and names them by default', () => {
    const onRangeChange = vi.fn();
    render(<Slider defaultRangeValue={[3, 5]} min={0} max={10} onRangeChange={onRangeChange} />);
    const minimum = screen.getByRole('slider', { name: 'Minimum' });
    const maximum = screen.getByRole('slider', { name: 'Maximum' });
    fireEvent.keyDown(minimum, { key: 'End' });
    expect(onRangeChange).toHaveBeenLastCalledWith([5, 5]);
    fireEvent.keyDown(maximum, { key: 'Home' });
    expect(onRangeChange).toHaveBeenLastCalledWith([5, 5]);
  });

  it('follows the pointer along the track', () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={0} min={0} max={100} aria-label="Score" onChange={onChange} />);
    const thumb = screen.getByRole('slider', { name: 'Score' });
    const track = thumb.parentElement?.firstElementChild as HTMLElement;
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      width: 200,
      top: 0,
      height: 4,
      right: 200,
      bottom: 4,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    fireEvent.pointerDown(thumb, { clientX: 50 });
    expect(onChange).toHaveBeenLastCalledWith(25);
    fireEvent.pointerMove(document, { clientX: 150 });
    expect(onChange).toHaveBeenLastCalledWith(75);
    fireEvent.pointerUp(document);
    fireEvent.pointerMove(document, { clientX: 200 });
    expect(onChange).toHaveBeenLastCalledWith(75);
  });

  it('ignores the keyboard and pointer while disabled', () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={4} aria-label="Score" onChange={onChange} disabled />);
    const thumb = screen.getByRole('slider', { name: 'Score' });
    expect(thumb).toHaveAttribute('tabindex', '-1');
    expect(thumb).toHaveAttribute('aria-disabled', 'true');
    fireEvent.pointerDown(thumb, { clientX: 50 });
    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();
    expect(thumb).toHaveAttribute('aria-valuenow', '4');
  });
});
