import { createContext } from 'react';
import type { Venue } from '../types/venue';

/** Value shape provided by VenueProvider and consumed via useVenue. */
export interface VenueContextValue {
  /** The venue every screen is currently scoped to. */
  venue: Venue;
  /** Switches the active venue. Must be an id from services/data/venues.ts. */
  setVenueId: (venueId: string) => void;
}

/**
 * Venue selection lives in React context only — deliberately never
 * localStorage, matching roleContext.ts and languageContext.ts — so a
 * refresh always returns to the default (Final) venue.
 */
export const VenueContext = createContext<VenueContextValue | null>(null);
