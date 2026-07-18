import { describe, expect, it } from 'vitest';
import { DEFAULT_VENUE_ID } from '../../config/constants';
import { DEFAULT_VENUE, findVenue, VENUES } from './venues';

describe('VENUES', () => {
  it('registers all sixteen FIFA World Cup 2026 host venues', () => {
    expect(VENUES).toHaveLength(16);
  });

  it('has unique ids', () => {
    const ids = new Set(VENUES.map((venue) => venue.id));
    expect(ids.size).toBe(VENUES.length);
  });

  it('spans all three host countries', () => {
    const countries = new Set(VENUES.map((venue) => venue.country));
    expect(countries).toEqual(new Set(['United States', 'Canada', 'Mexico']));
  });

  it('keeps every capacity in a plausible stadium range', () => {
    for (const venue of VENUES) {
      expect(venue.capacity).toBeGreaterThanOrEqual(40_000);
      expect(venue.capacity).toBeLessThanOrEqual(90_000);
    }
  });

  it('gives every venue the fields that ground facts and the transit board', () => {
    for (const venue of VENUES) {
      expect(venue.name.length).toBeGreaterThan(0);
      expect(venue.city.length).toBeGreaterThan(0);
      expect(venue.stage.length).toBeGreaterThan(0);
      expect(venue.rail.service.length).toBeGreaterThan(0);
      expect(venue.rail.line.length).toBeGreaterThan(0);
      expect(venue.rail.hub.length).toBeGreaterThan(0);
      expect(venue.rideshareLot.length).toBeGreaterThan(0);
      expect(venue.parkingLot.length).toBeGreaterThan(0);
    }
  });

  it('keeps rail station names bare so announcement templates can compose them per language', () => {
    for (const venue of VENUES) {
      expect(venue.rail.station).not.toMatch(/station/i);
    }
  });

  it('gives every venue a valid roof type', () => {
    for (const venue of VENUES) {
      expect(['open', 'retractable', 'fixed']).toContain(venue.roof);
    }
  });

  it('keeps altitude within a plausible range for a World Cup host venue', () => {
    for (const venue of VENUES) {
      expect(venue.altitudeMeters).toBeGreaterThanOrEqual(0);
      expect(venue.altitudeMeters).toBeLessThanOrEqual(3000);
    }
  });

  it('flags Mexico City and Guadalajara as the high-altitude venues', () => {
    const highAltitude = VENUES.filter((venue) => venue.altitudeMeters > 1500).map(
      (venue) => venue.id,
    );
    expect(new Set(highAltitude)).toEqual(new Set(['estadio-azteca', 'estadio-akron']));
  });

  it('keeps every coordinate within world bounds and roughly inside its host country', () => {
    for (const venue of VENUES) {
      expect(venue.latitude).toBeGreaterThanOrEqual(-90);
      expect(venue.latitude).toBeLessThanOrEqual(90);
      expect(venue.longitude).toBeGreaterThanOrEqual(-180);
      expect(venue.longitude).toBeLessThanOrEqual(180);
      // North America: a loose sanity bound, not a precise border check.
      expect(venue.latitude).toBeGreaterThanOrEqual(14);
      expect(venue.latitude).toBeLessThanOrEqual(60);
      expect(venue.longitude).toBeGreaterThanOrEqual(-130);
      expect(venue.longitude).toBeLessThanOrEqual(-65);
    }
  });

  it('has unique coordinates per venue', () => {
    const coords = new Set(VENUES.map((venue) => `${venue.latitude},${venue.longitude}`));
    expect(coords.size).toBe(VENUES.length);
  });
});

describe('findVenue', () => {
  it('finds a venue by registry id', () => {
    expect(findVenue('bmo-field')?.city).toBe('Toronto');
  });

  it('returns undefined for an unknown id', () => {
    expect(findVenue('camp-nou')).toBeUndefined();
  });
});

describe('DEFAULT_VENUE', () => {
  it('is the MetLife Stadium Final venue named by DEFAULT_VENUE_ID', () => {
    expect(DEFAULT_VENUE.id).toBe(DEFAULT_VENUE_ID);
    expect(DEFAULT_VENUE.name).toBe('MetLife Stadium');
    expect(DEFAULT_VENUE.capacity).toBe(82_500);
    expect(DEFAULT_VENUE.stage).toBe('the Final');
  });
});
