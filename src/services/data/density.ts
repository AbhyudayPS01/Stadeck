import type { DensityLevel, DensityReading } from '../../types/crowd';
import type { VenueLayout } from '../../types/stadium';
import { DEFAULT_VENUE_LAYOUT } from './stadiumLayout';
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
 * Simulates live occupancy sensors across every section and gate of a venue
 * layout. Called on an interval by useMockStream to drive the "real-time"
 * crowd heatmap without a live feed — the sweep size scales with the venue
 * because the zone list is the layout's own section/gate list.
 *
 * @param layout The venue layout to sweep; defaults to the demo venue's.
 * @returns One reading per section and gate.
 */
export function generateDensityReadings(
  layout: VenueLayout = DEFAULT_VENUE_LAYOUT,
): DensityReading[] {
  const updatedAt = new Date().toISOString();
  return [
    ...layout.sections.map((section) => readingFor(section.id, 40, 100, updatedAt)),
    ...layout.gates.map((gate) => readingFor(gate.id, 20, 100, updatedAt)),
  ];
}
