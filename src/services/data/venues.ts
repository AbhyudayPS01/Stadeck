import { DEFAULT_VENUE_ID } from '../../config/constants';
import type { Venue } from '../../types/venue';
import { VENUES } from './venuesData';

/**
 * Lookup helpers over the venue registry (raw data in venuesData.ts). Every
 * layout, fact sheet, and mock feed is generated from these entries, so
 * adding a venue to venuesData.ts is all it takes to bring it into the app.
 */
export { VENUES } from './venuesData';

/**
 * Finds a venue by registry id.
 *
 * @param venueId The venue's registry id, e.g. "metlife-stadium".
 * @returns The venue entry, or undefined when the id is unknown.
 */
export function findVenue(venueId: string): Venue | undefined {
  return VENUES.find((venue) => venue.id === venueId);
}

function requireDefaultVenue(): Venue {
  const venue = findVenue(DEFAULT_VENUE_ID);
  if (!venue) {
    throw new Error(`Default venue "${DEFAULT_VENUE_ID}" is missing from the venue registry`);
  }
  return venue;
}

/** The venue every screen renders until a venue switcher lands (see constants.ts). */
export const DEFAULT_VENUE: Venue = requireDefaultVenue();
