import type { SustainabilityMetrics } from '../../types/sustainability';
import { randomInt } from './random';

/** Simulated matchday sustainability snapshot, refreshed on an interval by useMockStream. */
export function getSustainabilityMetrics(): SustainabilityMetrics {
  return {
    timestamp: new Date().toISOString(),
    wasteDivertedPercent: randomInt(55, 85),
    renewableEnergyPercent: randomInt(40, 75),
    waterUsageLiters: randomInt(180_000, 260_000),
    carbonOffsetKg: randomInt(12_000, 22_000),
    transitModeSharePercent: randomInt(60, 90),
  };
}
