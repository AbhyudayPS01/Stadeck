import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('shows the severity word', () => {
    render(<Badge severity="critical">Critical</Badge>);

    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('pairs the word with a decorative glyph so meaning is never color-only', () => {
    render(<Badge severity="critical">Critical</Badge>);

    const glyph = screen.getByText('▲');
    expect(glyph).toHaveAttribute('aria-hidden', 'true');
  });

  it.each([
    ['critical', '▲'],
    ['elevated', '●'],
    ['normal', '✓'],
    ['info', '○'],
  ] as const)('renders the %s glyph in both themes', (severity, glyph) => {
    const { rerender } = render(<Badge severity={severity}>Word</Badge>);
    expect(screen.getByText(glyph)).toBeInTheDocument();

    rerender(
      <Badge severity={severity} theme="ops">
        Word
      </Badge>,
    );
    expect(screen.getByText(glyph)).toBeInTheDocument();
  });
});
