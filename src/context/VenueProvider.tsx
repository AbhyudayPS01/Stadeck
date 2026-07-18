import { useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_VENUE_ID } from '../config/constants';
import { DEFAULT_VENUE, findVenue } from '../services/data/venues';
import { VenueContext, type VenueContextValue } from './venueContext';

interface VenueProviderProps {
  children: ReactNode;
  /** Starting venue id, for tests and previews. Production always starts at the default (Final) venue. */
  initialVenueId?: string;
}

/** Provides the active venue to the app. See venueContext.ts for the storage rationale. */
export function VenueProvider({ children, initialVenueId = DEFAULT_VENUE_ID }: VenueProviderProps) {
  const [venueId, setVenueId] = useState(initialVenueId);

  // Memoized by venueId (not recomputed every render) so consumers that key
  // off venue identity — useCallback fetcher deps, useMockStream's resetKey —
  // only see a new reference when the venue actually changes.
  const venue = useMemo(() => findVenue(venueId) ?? DEFAULT_VENUE, [venueId]);

  // Stable context identity: without it every provider render would re-render
  // all consumers, and this provider wraps the entire app.
  const value = useMemo<VenueContextValue>(() => ({ venue, setVenueId }), [venue]);

  return <VenueContext.Provider value={value}>{children}</VenueContext.Provider>;
}
