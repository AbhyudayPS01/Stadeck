import type { TransitMode, TransitOption, TransitStatus } from '../../types/transportation';
import type { Venue } from '../../types/venue';
import { randomInt } from './random';
import { DEFAULT_VENUE } from './venues';

interface TransitTemplate {
  id: string;
  mode: TransitMode;
  label: string;
  baseEtaMinutes: number;
}

/**
 * The five board rows, labelled from the venue's registry entry. Ids are
 * venue-independent so mock Gemini recommendations (which name an option id)
 * stay valid at every venue.
 */
function transitTemplatesFor(venue: Venue): TransitTemplate[] {
  return [
    {
      id: 'venue-rail',
      mode: 'rail',
      label: `${venue.rail.service} — ${venue.rail.line}`,
      baseEtaMinutes: 12,
    },
    { id: 'coach-bus', mode: 'bus', label: 'Coach Express Bus', baseEtaMinutes: 18 },
    {
      id: 'rideshare-zone',
      mode: 'rideshare',
      label: `Rideshare Pickup — ${venue.rideshareLot}`,
      baseEtaMinutes: 8,
    },
    {
      id: 'venue-parking',
      mode: 'parking',
      label: `${venue.parkingLot} Parking`,
      baseEtaMinutes: 5,
    },
    {
      id: 'walk-transit-hub',
      mode: 'walk',
      label: `Walking Path from ${venue.rail.hub}`,
      baseEtaMinutes: 22,
    },
  ];
}

export function statusForDelay(delayMinutes: number): TransitStatus {
  if (delayMinutes >= 10) return 'disrupted';
  if (delayMinutes >= 4) return 'delayed';
  return 'on-time';
}

/**
 * Simulated live transit board for a venue's arrivals and departures.
 *
 * @param venue The venue whose board to simulate; defaults to the demo venue.
 * @returns All five options with fresh ETAs, statuses, and crowding levels.
 */
export function getTransitOptions(venue: Venue = DEFAULT_VENUE): TransitOption[] {
  return transitTemplatesFor(venue).map((template) => {
    const delayMinutes = randomInt(-3, 12);
    const etaMinutes = Math.max(1, template.baseEtaMinutes + delayMinutes);
    return {
      id: template.id,
      mode: template.mode,
      label: template.label,
      etaMinutes,
      status: statusForDelay(delayMinutes),
      crowdingLevel: delayMinutes >= 8 ? 'critical' : delayMinutes >= 4 ? 'elevated' : 'normal',
    };
  });
}
