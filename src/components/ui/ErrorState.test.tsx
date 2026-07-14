import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('announces the failure through an alert region', () => {
    render(<ErrorState message="The live feed is unreachable." />);

    expect(screen.getByRole('alert')).toHaveTextContent('The live feed is unreachable.');
    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
  });

  it('renders a retry button only when a handler is provided', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const { rerender } = render(<ErrorState message="Failed." onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(<ErrorState message="Failed." />);
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
  });

  it('supports a custom title', () => {
    render(<ErrorState message="Detail." title="Feed unavailable" />);

    expect(screen.getByRole('heading', { name: 'Feed unavailable' })).toBeInTheDocument();
  });
});
