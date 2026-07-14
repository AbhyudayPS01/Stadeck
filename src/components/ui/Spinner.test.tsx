import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('exposes a status role with a default accessible label', () => {
    render(<Spinner />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading');
  });

  it('accepts a custom label for context-specific loading', () => {
    render(<Spinner label="Loading module" />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading module');
  });

  it('hides the animated artwork from assistive technology', () => {
    const { container } = render(<Spinner />);

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
