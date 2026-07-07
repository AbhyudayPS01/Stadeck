import type { DensityLevel, DensityReading } from '../../types/crowd';
import { GATES, SECTIONS } from './stadiumLayout';
import { randomInt } from './random';

export function levelForPercent(percent: number): DensityLevel {
  if (percent >= 95) return 'critical';
  if (percent >= 80) return 'elevated';
  return 'normal';
}

function readingFor(zoneId: string, min: number, max: number, updatedAt: string): DensityReading {
  const percent = randomInt(min, max);
  return { zoneId, level: levelForPercent(percent), percentOfCapacity: percent, updatedAt };
}

/**
 * Simulates live occupancy sensors across every section and gate. Called on
 * an interval by useMockStream to drive the "real-time" crowd heatmap
 * without a live feed.
 */
export function generateDensityReadings(): DensityReading[] {
  const updatedAt = new Date().toISOString();
  return [
    ...SECTIONS.map((section) => readingFor(section.id, 40, 100, updatedAt)),
    ...GATES.map((gate) => readingFor(gate.id, 20, 100, updatedAt)),
  ];
}
