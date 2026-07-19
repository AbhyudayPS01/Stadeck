import type { Venue } from '../../types/venue';
import { CENTRAL_VENUES } from './venuesDataCentral';
import { EASTERN_VENUES } from './venuesDataEast';
import { WESTERN_VENUES } from './venuesDataWest';

/**
 * Registry of the sixteen FIFA World Cup 2026 host venues, composed from
 * FIFA's official Eastern/Central/Western host-region grouping (one data file
 * per region — see venuesDataEast/Central/West). venues.ts holds the lookup
 * helpers built on top of this array. Capacities are approximate tournament
 * configurations; rail links and lot names are demo fiction anchored to each
 * city's real transit network. Coordinates, altitude, and roof type are
 * approximate public facts about each real venue (used only for on-device
 * distance math and AI grounding — see utils/geolocation.ts), not precise
 * engineering data.
 */
export const VENUES: readonly Venue[] = [...EASTERN_VENUES, ...CENTRAL_VENUES, ...WESTERN_VENUES];
