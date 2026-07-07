import type { TransitMode, TransitOption, TransitStatus } from '../../types/transportation';
import { randomInt } from './random';

interface TransitTemplate {
  id: string;
  mode: TransitMode;
  label: string;
  baseEtaMinutes: number;
}

const TRANSIT_TEMPLATES: readonly TransitTemplate[] = [
  {
    id: 'nj-transit-rail',
    mode: 'rail',
    label: 'NJ Transit Rail — Meadowlands Line',
    baseEtaMinutes: 12,
  },
  { id: 'coach-bus', mode: 'bus', label: 'Coach Express Bus', baseEtaMinutes: 18 },
  { id: 'rideshare-zone', mode: 'rideshare', label: 'Rideshare Pickup — Lot E', baseEtaMinutes: 8 },
  { id: 'lot-g-parking', mode: 'parking', label: 'Lot G Parking', baseEtaMinutes: 5 },
  {
    id: 'walk-secaucus',
    mode: 'walk',
    label: 'Walking Path from Secaucus Junction',
    baseEtaMinutes: 22,
  },
];

export function statusForDelay(delayMinutes: number): TransitStatus {
  if (delayMinutes >= 10) return 'disrupted';
  if (delayMinutes >= 4) return 'delayed';
  return 'on-time';
}

/** Simulated live transit board for MetLife Stadium arrivals and departures. */
export function getTransitOptions(): TransitOption[] {
  return TRANSIT_TEMPLATES.map((template) => {
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
