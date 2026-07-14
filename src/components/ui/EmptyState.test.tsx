import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the title, message, and optional action', () => {
    render(
      <EmptyState
        action={<Button>Ask a question</Button>}
        message="Start a conversation to see it here."
        title="No messages yet"
      />,
    );

    expect(screen.getByRole('heading', { name: 'No messages yet' })).toBeInTheDocument();
    expect(screen.getByText('Start a conversation to see it here.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ask a question' })).toBeInTheDocument();
  });

  it('keeps the mascot decorative and allows hiding it', () => {
    const { container, rerender } = render(<EmptyState message="Nothing." title="Empty" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    rerender(<EmptyState message="Nothing." showMascot={false} title="Empty" />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
