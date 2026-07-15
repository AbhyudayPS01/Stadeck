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
});
