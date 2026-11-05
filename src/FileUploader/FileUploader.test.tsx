import * as React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FileRow, FileUploader } from './FileUploader';

afterEach(() => {
  cleanup();
});

const fileInput = () => document.querySelector('input[type="file"]') as HTMLInputElement;

const countChooserOpens = () => {
  const opens = vi.fn();
  fileInput().addEventListener('click', opens);
  return opens;
};

describe('FileUploader', () => {
  it('opens the chooser once when the browse link is clicked', () => {
    render(<FileUploader label="Drop here, or" ctaLabel="browse" />);
    const opens = countChooserOpens();

    fireEvent.click(screen.getByText('browse'));

    expect(opens).toHaveBeenCalledTimes(1);
  });

  it('opens the chooser once when the drop zone itself is clicked', () => {
    render(<FileUploader hint="PNG only" />);
    const opens = countChooserOpens();

    fireEvent.click(screen.getByText('PNG only'));

    expect(opens).toHaveBeenCalledTimes(1);
  });

  it('does not reopen the chooser when the input click bubbles back up', () => {
    render(<FileUploader />);
    const opens = countChooserOpens();

    fireEvent.click(fileInput());

    expect(opens).toHaveBeenCalledTimes(1);
  });

  it('ignores clicks while disabled', () => {
    render(<FileUploader hint="PNG only" disabled />);
    const opens = countChooserOpens();

    fireEvent.click(screen.getByText('PNG only'));

    expect(opens).not.toHaveBeenCalled();
  });

  it('hands the chosen files to onFiles', () => {
    const onFiles = vi.fn();
    render(<FileUploader onFiles={onFiles} />);
    const file = new File(['x'], 'cover.png', { type: 'image/png' });

    fireEvent.change(fileInput(), { target: { files: [file] } });

    expect(onFiles).toHaveBeenCalledTimes(1);
    expect(onFiles.mock.calls[0][0][0]).toBe(file);
  });

  it('hands dropped files to onFiles and ignores a drop while disabled', () => {
    const onFiles = vi.fn();
    const { container, rerender } = render(<FileUploader onFiles={onFiles} />);
    const zone = container.firstElementChild as HTMLElement;
    const file = new File(['deck'], 'deck.pdf', { type: 'application/pdf' });
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(onFiles).toHaveBeenCalledTimes(1);

    rerender(<FileUploader onFiles={onFiles} disabled />);
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(onFiles).toHaveBeenCalledTimes(1);
  });

  it('describes the input by its hint and pairs an error with a glyph', () => {
    render(<FileUploader error hint="Only CSV files." />);
    expect(fileInput()).toHaveAccessibleDescription('Only CSV files.');
    expect(fileInput()).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Only CSV files.').querySelector('svg')).not.toBeNull();
  });
});

describe('FileRow', () => {
  it('announces upload progress and offers a retry and removal when it fails', () => {
    const onRetry = vi.fn();
    const onRemove = vi.fn();
    const { rerender } = render(
      <FileRow name="deck.pdf" status="uploading" progress={40} progressStyle="bar" />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('40% uploaded');
    expect(screen.getByRole('progressbar', { name: 'deck.pdf upload' })).toHaveAttribute(
      'aria-valuenow',
      '40',
    );

    rerender(<FileRow name="deck.pdf" status="failed" onRetry={onRetry} onRemove={onRemove} />);
    expect(screen.getByRole('status')).toHaveTextContent('Upload failed');
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove deck.pdf' }));
    expect(onRetry).toHaveBeenCalled();
    expect(onRemove).toHaveBeenCalled();
  });
});
