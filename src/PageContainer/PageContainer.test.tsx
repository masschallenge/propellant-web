import { render, cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { PageContainer } from './PageContainer';

afterEach(cleanup);

describe('PageContainer', () => {
  it('centers a 960px column by default', () => {
    render(<PageContainer>Body</PageContainer>);
    const container = screen.getByText('Body');
    expect(container.className).toContain('max-w-[960px]');
    expect(container.className).toContain('mx-auto');
    expect(container.className).toContain('gap-[var(--space-6)]');
  });

  it('widens to the page width token or the full width', () => {
    const { rerender } = render(<PageContainer size="wide">Body</PageContainer>);
    expect(screen.getByText('Body').className).toContain('max-w-[var(--width-page)]');
    rerender(<PageContainer size="full">Body</PageContainer>);
    expect(screen.getByText('Body').className).toContain('max-w-none');
  });

  it('renders as another element', () => {
    render(<PageContainer as="main">Body</PageContainer>);
    expect(screen.getByRole('main')).toHaveTextContent('Body');
  });
});
