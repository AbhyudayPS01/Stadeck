import { useCallback, useState } from 'react';
import { findNearestVenue, type NearestVenueResult } from '../utils/geolocation';
import { VENUES } from '../services/data/venues';

export type GeolocatedVenueState =
  | { status: 'idle' }
  | { status: 'locating' }
  | { status: 'found'; result: NearestVenueResult };

/**
 * Button-triggered "Find nearest venue" flow over the browser Geolocation
 * API. Never called automatically — `locate()` only runs from a click — so
 * the venue picker works fully with permission never granted. Denial,
 * unavailability, and timeouts all fall back to `idle` with no error state:
 * the picker underneath still works, so there is no dead end to design for.
 * Coordinates are read once, compared against the bundled venue registry on
 * the device, and discarded — see utils/geolocation.ts and SECURITY.md.
 */
export function useGeolocatedVenue(): { state: GeolocatedVenueState; locate: () => void } {
  const [state, setState] = useState<GeolocatedVenueState>({ status: 'idle' });

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState({ status: 'idle' });
      return;
    }
    setState({ status: 'locating' });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const result = findNearestVenue(
          { latitude: position.coords.latitude, longitude: position.coords.longitude },
          VENUES,
        );
        setState(result ? { status: 'found', result } : { status: 'idle' });
      },
      () => {
        setState({ status: 'idle' });
      },
      { timeout: 10_000 },
    );
  }, []);

  return { state, locate };
}
