import { describe, expect, it } from 'vitest';
import type { Venue } from '../types/venue';
import { findNearestVenue, haversineDistanceKm } from './geolocation';

const NEW_YORK = { latitude: 40.7128, longitude: -74.006 };
const LONDON = { latitude: 51.5074, longitude: -0.1278 };
const NORTH_POLE = { latitude: 90, longitude: 0 };
const SOUTH_POLE = { latitude: -90, longitude: 0 };

function stubVenue(id: string, latitude: number, longitude: number): Venue {
  return {
    id,
    name: id,
    city: id,
    country: 'United States',
    capacity: 50_000,
    stage: 'Group stage matches',
    rail: { service: '', line: '', station: '', hub: '' },
    rideshareLot: '',
    parkingLot: '',
    roof: 'open',
    altitudeMeters: 0,
    latitude,
    longitude,
  };
}

describe('haversineDistanceKm', () => {
  it('returns 0 for the same point', () => {
    expect(haversineDistanceKm(NEW_YORK, NEW_YORK)).toBe(0);
  });

  it('returns half the Earth’s circumference for antipodal points', () => {
    // Earth's mean radius (6371 km) × π ≈ 20,015 km, the longest possible great-circle distance.
    expect(haversineDistanceKm(NORTH_POLE, SOUTH_POLE)).toBeCloseTo(20_015, -1);
  });

  it('is symmetric', () => {
    expect(haversineDistanceKm(NEW_YORK, LONDON)).toBeCloseTo(
      haversineDistanceKm(LONDON, NEW_YORK),
      6,
    );
  });

  it('matches the known great-circle distance between two real cities', () => {
    // New York to London is ~5,570 km by great-circle distance.
    const distance = haversineDistanceKm(NEW_YORK, LONDON);
    expect(distance).toBeGreaterThan(5400);
    expect(distance).toBeLessThan(5700);
  });

  it('returns a small distance for nearby points', () => {
    // Roughly a 1.1 km hop north.
    const distance = haversineDistanceKm(NEW_YORK, {
      latitude: NEW_YORK.latitude + 0.01,
      longitude: NEW_YORK.longitude,
    });
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(2);
  });
});

describe('findNearestVenue', () => {
  it('returns null for an empty venue list', () => {
    expect(findNearestVenue(NEW_YORK, [])).toBeNull();
  });

  it('picks the closest venue by great-circle distance', () => {
    const near = stubVenue('near', NEW_YORK.latitude + 0.1, NEW_YORK.longitude);
    const mid = stubVenue('mid', NEW_YORK.latitude + 5, NEW_YORK.longitude);
    const far = stubVenue('far', LONDON.latitude, LONDON.longitude);

    const result = findNearestVenue(NEW_YORK, [far, mid, near]);

    expect(result?.venue.id).toBe('near');
    expect(result?.distanceKm).toBeGreaterThan(0);
    expect(result?.distanceKm).toBeLessThan(20);
  });

  it('returns distance 0 when standing exactly at a venue', () => {
    const here = stubVenue('here', NEW_YORK.latitude, NEW_YORK.longitude);
    const elsewhere = stubVenue('elsewhere', LONDON.latitude, LONDON.longitude);

    const result = findNearestVenue(NEW_YORK, [elsewhere, here]);

    expect(result?.venue.id).toBe('here');
    expect(result?.distanceKm).toBe(0);
  });
});
