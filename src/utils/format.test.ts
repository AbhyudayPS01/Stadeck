import { describe, expect, it } from 'vitest';
import { formatCount } from './format';

describe('formatCount', () => {
  it('groups digits', () => {
    expect(formatCount(214_000)).toBe('214,000');
  });

  it('rounds to whole numbers', () => {
    expect(formatCount(1234.6)).toBe('1,235');
  });

  it('leaves small numbers untouched', () => {
    expect(formatCount(42)).toBe('42');
  });
});
