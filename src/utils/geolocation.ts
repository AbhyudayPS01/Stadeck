import type { Venue } from '../types/venue';

/**
 * A latitude/longitude pair in degrees. Used only for the on-device
 * nearest-venue calculation below — never transmitted anywhere, and
 * discarded once the nearest venue is found (see SECURITY.md, "Location
 * privacy").
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Great-circle distance between two coordinates via the haversine formula.
 * Pure and local: no network call, no third-party geocoding service — the
 * coordinates never leave the browser (see SECURITY.md, "Location privacy").
 *
 * @param a First coordinate.
 * @param b Second coordinate.
 * @returns Distance in kilometers, always >= 0.
 */
export function haversineDistanceKm(a: Coordinates, b: Coordinates): number {
  const deltaLat = toRadians(b.latitude - a.latitude);
  const deltaLon = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const h =
    Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export interface NearestVenueResult {
  venue: Venue;
  distanceKm: number;
}

/**
 * Finds the venue closest to a coordinate — the "Find nearest venue" button's
 * whole computation, done locally against the bundled venue registry.
 *
 * @param coords The fan's on-device coordinates.
 * @param venues The venue registry to search (VENUES from services/data/venues.ts).
 * @returns The nearest venue and its distance, or null when the list is empty.
 */
export function findNearestVenue(
  coords: Coordinates,
  venues: readonly Venue[],
): NearestVenueResult | null {
  return venues.reduce<NearestVenueResult | null>((nearest, venue) => {
    const distanceKm = haversineDistanceKm(coords, venue);
    if (nearest === null || distanceKm < nearest.distanceKm) {
      return { venue, distanceKm };
    }
    return nearest;
  }, null);
}
