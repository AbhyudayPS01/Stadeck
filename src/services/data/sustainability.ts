import type { SustainabilityMetrics } from '../../types/sustainability';
import type { Venue } from '../../types/venue';
import { randomInt } from './random';
import { DEFAULT_VENUE } from './venues';

/**
 * Per-seat rates for the volume metrics, so water and carbon scale with the
 * venue rather than reporting Final-venue volumes at a 45,000-seat ground.
 * At the 82,500-seat demo venue these reproduce the original 180k–260k litre
 * and 12t–22t ranges.
 */
const WATER_LITERS_PER_SEAT = { min: 2.2, max: 3.2 };
const CARBON_OFFSET_KG_PER_SEAT = { min: 0.15, max: 0.27 };

/**
 * Simulated matchday sustainability snapshot, refreshed on an interval by
 * useMockStream. Percentage metrics are venue-independent; volume metrics
 * scale with registry capacity.
 *
 * @param venue The venue being measured; defaults to the demo venue.
 * @returns A fresh metrics snapshot.
 */
export function getSustainabilityMetrics(venue: Venue = DEFAULT_VENUE): SustainabilityMetrics {
  return {
    timestamp: new Date().toISOString(),
    wasteDivertedPercent: randomInt(55, 85),
    renewableEnergyPercent: randomInt(40, 75),
    waterUsageLiters: randomInt(
      Math.round(WATER_LITERS_PER_SEAT.min * venue.capacity),
      Math.round(WATER_LITERS_PER_SEAT.max * venue.capacity),
    ),
    carbonOffsetKg: randomInt(
      Math.round(CARBON_OFFSET_KG_PER_SEAT.min * venue.capacity),
      Math.round(CARBON_OFFSET_KG_PER_SEAT.max * venue.capacity),
    ),
    transitModeSharePercent: randomInt(60, 90),
  };
}
