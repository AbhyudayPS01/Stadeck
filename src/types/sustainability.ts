/** A single matchday sustainability snapshot. */
export interface SustainabilityMetrics {
  timestamp: string;
  wasteDivertedPercent: number;
  renewableEnergyPercent: number;
  waterUsageLiters: number;
  carbonOffsetKg: number;
  transitModeSharePercent: number;
}
