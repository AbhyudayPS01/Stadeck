import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingRow } from './LoadingRow';

describe('LoadingRow', () => {
  it('announces the label once, through the spinner status role', () => {
    render(<LoadingRow label="Fetching directions" />);

    expect(screen.getByRole('status')).toHaveTextContent('Fetching directions');
    expect(screen.getByText('Fetching directions…')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the visible status text on ops surfaces too', () => {
    render(<LoadingRow label="Analyzing crowd state" theme="ops" />);

    expect(screen.getByText('Analyzing crowd state…')).toBeInTheDocument();
  });
});
