import { getVenueLayout, sectionNumber } from '../data/stadiumLayout';
import type { Venue } from '../../types/venue';

/**
 * Anchor sections shared by several deterministic mock responses (mock.ts,
 * mockConcierge.ts, mockIncidentResponses.ts), so every offline fallback
 * that names a first-aid or Guest Services desk cites one that actually
 * exists at the active venue.
 */
export function venueAnchors(venue: Venue): {
  firstAid: string[];
  guestServices: string[];
} {
  const layout = getVenueLayout(venue.id);
  const anchorsFor = (type: 'first-aid' | 'guest-services'): string[] => [
    ...new Set(
      layout.amenities
        .filter((amenity) => amenity.type === type)
        .map((amenity) => sectionNumber(amenity.sectionId)),
    ),
  ];
  return { firstAid: anchorsFor('first-aid'), guestServices: anchorsFor('guest-services') };
}
