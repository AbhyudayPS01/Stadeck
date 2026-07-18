import { describe, expect, it } from 'vitest';
import { findVenue, VENUES } from './venues';
import { generateDensityReadings, levelForPercent } from './density';
import { getVenueLayout, GATES, SECTIONS } from './stadiumLayout';

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

  it('sweeps every venue’s own layout, citing only zones that actually exist there', () => {
    for (const venue of VENUES) {
      const layout = getVenueLayout(venue.id);
      const readings = generateDensityReadings(layout);
      expect(readings, venue.id).toHaveLength(layout.sections.length + layout.gates.length);

      const zoneIds = new Set([
        ...layout.sections.map((section) => section.id),
        ...layout.gates.map((gate) => gate.id),
      ]);
      for (const reading of readings) {
        expect(zoneIds.has(reading.zoneId), `${venue.id}: ${reading.zoneId}`).toBe(true);
      }
    }
  });

  it('sweeps a different section/gate count for a smaller venue than the default', () => {
    const toronto = findVenue('bmo-field');
    expect(toronto).toBeDefined();
    if (!toronto) return;

    const torontoReadings = generateDensityReadings(getVenueLayout(toronto.id));
    expect(torontoReadings.length).not.toBe(generateDensityReadings().length);
  });
});
