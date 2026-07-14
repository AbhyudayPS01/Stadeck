import { describe, expect, it } from 'vitest';
import { cx } from './cx';

describe('cx', () => {
  it('joins truthy class fragments with single spaces', () => {
    expect(cx('a', 'b', 'c')).toBe('a b c');
  });

  it('skips false, null, and undefined fragments', () => {
    expect(cx('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('returns an empty string when every fragment is falsy', () => {
    expect(cx(false, undefined)).toBe('');
  });

  it('supports conditional expressions inline', () => {
    const active = true;
    expect(cx('base', active && 'active')).toBe('base active');
  });
});
