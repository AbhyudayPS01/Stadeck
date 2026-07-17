import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DemoDataBadge } from './DemoDataBadge';

describe('DemoDataBadge', () => {
  it('labels demo content in both themes', () => {
    const { rerender } = render(<DemoDataBadge />);
    expect(screen.getByText('Demo data')).toBeInTheDocument();

    rerender(<DemoDataBadge theme="ops" />);
    expect(screen.getByText('Demo data')).toBeInTheDocument();
  });

  it('reads as offline capability when the mock was served for a network failure', () => {
    render(<DemoDataBadge reason="offline" />);
    expect(screen.getByText('Offline mode')).toBeInTheDocument();
  });

  it('keeps the demo label when no API key is configured', () => {
    render(<DemoDataBadge reason="no-key" />);
    expect(screen.getByText('Demo data')).toBeInTheDocument();
  });
});
