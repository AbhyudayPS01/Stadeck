export type DensityLevel = 'normal' | 'elevated' | 'critical';

/** A single occupancy reading for one section or gate zone. */
export interface DensityReading {
  zoneId: string;
  level: DensityLevel;
  percentOfCapacity: number;
  updatedAt: string;
}
