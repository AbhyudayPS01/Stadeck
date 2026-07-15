import { clamp } from './numbers';

/**
 * Simple per-fan travel emission factors for the crowd carbon estimate, in kg
 * CO2e per round trip. Deliberately coarse demo figures (order-of-magnitude
 * for a ~30 km round trip): the dashboard shows how transit mode share moves
 * the crowd's footprint, not a certified inventory.
 */
const CAR_TRIP_KG = 9;
const TRANSIT_TRIP_KG = 2;

/**
 * Estimates the crowd's total travel footprint for the matchday.
 *
 * @param attendance Number of fans traveling to the venue.
 * @param transitModeSharePercent Share of fans arriving by rail/bus/shuttle (0-100).
 * @returns Whole tonnes of CO2e for the crowd's round trips.
 */
export function estimateCrowdCarbonTonnes(
  attendance: number,
  transitModeSharePercent: number,
): number {
  const transitShare = clamp(transitModeSharePercent, 0, 100) / 100;
  const perFanKg = transitShare * TRANSIT_TRIP_KG + (1 - transitShare) * CAR_TRIP_KG;
  return Math.round((Math.max(attendance, 0) * perFanKg) / 1000);
}
