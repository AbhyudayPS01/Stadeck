import { describe, expect, it } from 'vitest';
import { clamp } from './numbers';

describe('clamp', () => {
  it('passes through values already inside the range', () => {
    expect(clamp(5, 1, 10)).toBe(5);
  });

  it('bounds values below the range to the minimum', () => {
    expect(clamp(-3, 1, 10)).toBe(1);
  });

  it('bounds values above the range to the maximum', () => {
    expect(clamp(999, 1, 10)).toBe(10);
  });

  it('treats NaN as the minimum instead of leaking it to the DOM', () => {
    expect(clamp(Number.NaN, 1, 10)).toBe(1);
  });
});
