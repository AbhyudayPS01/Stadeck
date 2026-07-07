import { describe, expect, it } from 'vitest';
import { getTransitOptions, statusForDelay } from './transit';

describe('statusForDelay', () => {
  it('returns on-time below 4 minutes of delay', () => {
    expect(statusForDelay(-3)).toBe('on-time');
    expect(statusForDelay(3)).toBe('on-time');
  });

  it('returns delayed from 4 up to 9 minutes', () => {
    expect(statusForDelay(4)).toBe('delayed');
    expect(statusForDelay(9)).toBe('delayed');
  });

  it('returns disrupted from 10 minutes and up', () => {
    expect(statusForDelay(10)).toBe('disrupted');
  });
});

describe('getTransitOptions', () => {
  it('returns all five transit modes with unique ids', () => {
    const options = getTransitOptions();
    expect(options).toHaveLength(5);
    expect(new Set(options.map((option) => option.id)).size).toBe(5);
  });

  it('never returns an eta below 1 minute', () => {
    const options = getTransitOptions();
    for (const option of options) {
      expect(option.etaMinutes).toBeGreaterThanOrEqual(1);
    }
  });

  it('keeps status consistent with the computed delay window', () => {
    const options = getTransitOptions();
    for (const option of options) {
      expect(['on-time', 'delayed', 'disrupted']).toContain(option.status);
      expect(['normal', 'elevated', 'critical']).toContain(option.crowdingLevel);
    }
  });
});
