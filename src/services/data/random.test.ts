import { afterEach, describe, expect, it, vi } from 'vitest';
import { pickRandom, randomInt } from './random';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('randomInt', () => {
  it('returns min when Math.random returns 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(randomInt(10, 20)).toBe(10);
  });

  it('returns max when Math.random returns just under 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999999);
    expect(randomInt(10, 20)).toBe(20);
  });

  it('stays within [min, max] across many samples', () => {
    for (let i = 0; i < 200; i += 1) {
      const value = randomInt(5, 9);
      expect(value).toBeGreaterThanOrEqual(5);
      expect(value).toBeLessThanOrEqual(9);
    }
  });
});

describe('pickRandom', () => {
  it('returns the item at the randomly chosen index', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(pickRandom(['a', 'b', 'c'])).toBe('b');
  });

  it('throws when called with an empty array', () => {
    expect(() => pickRandom([])).toThrow('pickRandom called with an empty array');
  });
});
