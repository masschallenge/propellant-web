import { createRef } from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Textarea } from './Textarea';

afterEach(cleanup);

describe('Textarea hint row', () => {
  it('describes the field by its hint alone when there is no trailing content', () => {
    render(<Textarea label="Bio" hint="Visible to programs." />);
    const field = screen.getByRole('textbox', { name: 'Bio' });
    expect(field).toHaveAccessibleDescription('Visible to programs.');
  });

  it('puts trailing content on the hint row and in the description', () => {
    render(<Textarea label="Bio" hint="Visible to programs." hintEnd="12/7500" />);
    const field = screen.getByRole('textbox', { name: 'Bio' });
    expect(field).toHaveAccessibleDescription('Visible to programs. 12/7500');
    expect(screen.getByText('12/7500').className).toContain('ml-auto');
  });

  it('lets long trailing content wrap on a narrow screen instead of overflowing', () => {
    render(
      <Textarea label="Bio" hintEnd="150 characters remaining of the 150 character minimum" />,
    );
    const trailing = screen.getByText('150 characters remaining of the 150 character minimum');
    expect(trailing.className).not.toContain('whitespace-nowrap');
    expect(trailing.className).toContain('text-right');
  });

  it('shows trailing content without a hint and gives both the error tone when invalid', () => {
    render(<Textarea label="Bio" invalid hintEnd="7500/7500" />);
    const field = screen.getByRole('textbox', { name: 'Bio' });
    expect(field).toHaveAccessibleDescription('7500/7500');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('7500/7500').className).toContain('--critical');
  });

  it('has no description when there is neither a hint nor trailing content', () => {
    render(<Textarea label="Bio" />);
    expect(screen.getByRole('textbox', { name: 'Bio' })).not.toHaveAttribute('aria-describedby');
  });
});

describe('Textarea label emphasis', () => {
  it('keeps the quiet secondary label by default', () => {
    render(<Textarea label="Notes" />);
    expect(screen.getByText('Notes')).toHaveClass(
      'text-subheadline',
      'font-medium',
      'text-[var(--label-secondary)]',
    );
  });

  it('sets the label in semibold primary text when strong, still naming the field', () => {
    render(<Textarea label="Feedback for the founders" emphasis="strong" />);
    expect(screen.getByText('Feedback for the founders')).toHaveClass(
      'font-semibold',
      'text-[var(--label)]',
    );
    expect(screen.getByRole('textbox', { name: 'Feedback for the founders' })).toBeInTheDocument();
  });
});

describe('Textarea field shell', () => {
  it('sits in the shared field shell and flags it when invalid', () => {
    const { rerender } = render(<Textarea label="Bio" invalid hint="Add a short bio." />);
    const field = screen.getByRole('textbox', { name: 'Bio' });
    expect(field.closest('.propellant-field')).toHaveAttribute('data-invalid', 'true');
    expect(screen.getByText('Add a short bio.').querySelector('svg')).not.toBeNull();
    rerender(<Textarea label="Bio" />);
    expect(
      screen.getByRole('textbox', { name: 'Bio' }).closest('.propellant-field'),
    ).not.toHaveAttribute('data-invalid');
  });

  it('passes native attributes through to the text area', () => {
    render(<Textarea label="Bio" rows={6} maxLength={200} name="bio" />);
    const field = screen.getByRole('textbox', { name: 'Bio' });
    expect(field).toHaveAttribute('rows', '6');
    expect(field).toHaveAttribute('maxlength', '200');
    expect(field).toHaveAttribute('name', 'bio');
  });
});

describe('Textarea ref', () => {
  it('forwards its ref to the text area', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea label="Reason" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Reason' }));
  });
});
