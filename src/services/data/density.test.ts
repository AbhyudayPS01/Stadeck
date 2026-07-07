import { describe, expect, it } from 'vitest';
import { generateDensityReadings, levelForPercent } from './density';
import { GATES, SECTIONS } from './stadiumLayout';

describe('levelForPercent', () => {
  it('returns normal below 80', () => {
    expect(levelForPercent(0)).toBe('normal');
    expect(levelForPercent(79)).toBe('normal');
  });

  it('returns elevated from 80 up to 94', () => {
    expect(levelForPercent(80)).toBe('elevated');
    expect(levelForPercent(94)).toBe('elevated');
  });

  it('returns critical from 95 and up', () => {
    expect(levelForPercent(95)).toBe('critical');
    expect(levelForPercent(140)).toBe('critical');
  });
});

describe('generateDensityReadings', () => {
  it('returns one reading per section and gate', () => {
    const readings = generateDensityReadings();
    expect(readings).toHaveLength(SECTIONS.length + GATES.length);
  });

  it('keeps every reading level consistent with its percent', () => {
    const readings = generateDensityReadings();
    for (const reading of readings) {
      expect(reading.level).toBe(levelForPercent(reading.percentOfCapacity));
      expect(reading.percentOfCapacity).toBeGreaterThanOrEqual(0);
      expect(reading.percentOfCapacity).toBeLessThanOrEqual(100);
    }
  });
});
