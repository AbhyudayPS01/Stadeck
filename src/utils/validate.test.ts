import { describe, expect, it } from 'vitest';
import { hasShape, isNumber, isOneOf, isString, isStringArray } from './validate';

describe('isString', () => {
  it('returns true for strings', () => {
    expect(isString('hello')).toBe(true);
  });

  it('returns false for non-strings', () => {
    expect(isString(42)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
  });
});

describe('isNumber', () => {
  it('returns true for finite numbers', () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-12.5)).toBe(true);
  });

  it('returns false for NaN, Infinity, and non-numbers', () => {
    expect(isNumber(Number.NaN)).toBe(false);
    expect(isNumber(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isNumber('42')).toBe(false);
  });
});

describe('isStringArray', () => {
  it('returns true for an array of strings, including empty', () => {
    expect(isStringArray([])).toBe(true);
    expect(isStringArray(['a', 'b'])).toBe(true);
  });

  it('returns false for a non-array or mixed-type array', () => {
    expect(isStringArray('a,b')).toBe(false);
    expect(isStringArray(['a', 1])).toBe(false);
  });
});

describe('isOneOf', () => {
  const isSeverity = isOneOf(['normal', 'elevated', 'critical'] as const);

  it('returns true for a listed value', () => {
    expect(isSeverity('elevated')).toBe(true);
  });

  it('returns false for an unlisted value', () => {
    expect(isSeverity('extreme')).toBe(false);
    expect(isSeverity(1)).toBe(false);
  });
});

describe('hasShape', () => {
  interface Sample {
    summary: string;
    count: number;
  }

  const isSample = (value: unknown): value is Sample =>
    hasShape<Sample>(value, { summary: isString, count: isNumber });

  it('returns true when every field matches its validator', () => {
    expect(isSample({ summary: 'ok', count: 3 })).toBe(true);
  });

  it('returns false when a field fails its validator', () => {
    expect(isSample({ summary: 'ok', count: '3' })).toBe(false);
  });

  it('returns false when a field is missing', () => {
    expect(isSample({ summary: 'ok' })).toBe(false);
  });

  it('returns false for non-objects', () => {
    expect(isSample(null)).toBe(false);
    expect(isSample('ok')).toBe(false);
  });

  it('ignores extra fields not listed in the shape', () => {
    expect(isSample({ summary: 'ok', count: 3, extra: true })).toBe(true);
  });
});
