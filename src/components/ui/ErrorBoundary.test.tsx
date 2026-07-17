import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../../context/LanguageProvider';
import { ErrorBoundary } from './ErrorBoundary';

function Boom(): never {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  it('renders a friendly recovery card when a child throws during render', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <LanguageProvider>
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      </LanguageProvider>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i);
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('names the crashed scope in the recovery message', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <LanguageProvider>
        <ErrorBoundary scope="Crowd Management">
          <Boom />
        </ErrorBoundary>
      </LanguageProvider>,
    );

    // The scope is bidi-isolated by formatUiString; '.' absorbs the mark.
    expect(screen.getByRole('alert')).toHaveTextContent(/Crowd Management. ran into/);
  });

  it('re-mounts the crashed subtree when "Try again" is pressed', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const user = userEvent.setup();

    let shouldThrow = true;
    function FlakyOnce() {
      if (shouldThrow) {
        throw new Error('boom');
      }
      return <p>Recovered content</p>;
    }

    render(
      <LanguageProvider>
        <ErrorBoundary>
          <FlakyOnce />
        </ErrorBoundary>
      </LanguageProvider>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(screen.getByText('Recovered content')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders children when there is no error', () => {
    render(
      <LanguageProvider>
        <ErrorBoundary>
          <p>All good</p>
        </ErrorBoundary>
      </LanguageProvider>,
    );

    expect(screen.getByText('All good')).toBeInTheDocument();
  });
});
