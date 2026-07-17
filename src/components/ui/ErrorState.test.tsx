import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../../context/LanguageProvider';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('announces the failure through an alert region', () => {
    render(
      <LanguageProvider>
        <ErrorState message="The live feed is unreachable." />
      </LanguageProvider>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('The live feed is unreachable.');
    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
  });

  it('renders a retry button only when a handler is provided', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const { rerender } = render(
      <LanguageProvider>
        <ErrorState message="Failed." onRetry={onRetry} />
      </LanguageProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(
      <LanguageProvider>
        <ErrorState message="Failed." />
      </LanguageProvider>,
    );
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
  });

  it('supports a custom title', () => {
    render(
      <LanguageProvider>
        <ErrorState message="Detail." title="Feed unavailable" />
      </LanguageProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Feed unavailable' })).toBeInTheDocument();
  });
});
