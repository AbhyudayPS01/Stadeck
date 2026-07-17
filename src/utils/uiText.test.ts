import { describe, expect, it } from 'vitest';
import { formatUiString } from './uiText';

describe('formatUiString', () => {
  it('substitutes placeholders with bidi-isolated values', () => {
    const result = formatUiString('Closest to {id}', { id: 'Section 102' });
    expect(result).toBe('Closest to ⁨Section 102⁩');
  });

  it('keeps wayfinding identifiers verbatim inside RTL templates', () => {
    // The identifier must survive untouched — venue signage reads "GATE A".
    const result = formatUiString('أقرب مخرج: {id}', { id: 'Gate A' });
    expect(result).toContain('Gate A');
    expect(result).toContain('⁨Gate A⁩');
  });

  it('substitutes multiple placeholders including numbers', () => {
    const result = formatUiString('{critical} critical of {total} zones', {
      critical: 3,
      total: 104,
    });
    expect(result).toBe('⁨3⁩ critical of ⁨104⁩ zones');
  });

  it('leaves unknown placeholders untouched', () => {
    expect(formatUiString('Near {id}', {})).toBe('Near {id}');
  });
});
