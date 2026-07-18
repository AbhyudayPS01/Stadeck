import { useContext } from 'react';
import { VenueContext, type VenueContextValue } from '../context/venueContext';

/**
 * The active venue and its setter.
 *
 * @returns The VenueContext value.
 * @throws When rendered outside a VenueProvider — misuse should fail loudly in development.
 */
export function useVenue(): VenueContextValue {
  const value = useContext(VenueContext);
  if (value === null) {
    throw new Error('useVenue must be used within a VenueProvider');
  }
  return value;
}
