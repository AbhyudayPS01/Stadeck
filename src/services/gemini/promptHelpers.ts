import type { DensityReading } from '../../types/crowd';
import type { Venue } from '../../types/venue';

/** Shared building blocks for the prompt templates in prompts.ts. */

/**
 * The JSON-only output instruction appended to every structured prompt.
 *
 * @param shapeDescription The exact response shape, quoted from responses.ts.
 * @returns The instruction line.
 */
export function jsonOnlyInstruction(shapeDescription: string): string {
  return `Respond with JSON only — no prose, no markdown code fences — matching exactly this shape: ${shapeDescription}`;
}

/**
 * Shared persona opener naming the venue, its city, and what it is hosting —
 * the venue-context line every prompt starts from.
 *
 * @param descriptor Who the assistant is, e.g. "navigation assistant for fans".
 * @param venue The venue the assistant speaks for.
 * @returns The persona sentence.
 */
export function venuePersona(descriptor: string, venue: Venue): string {
  return `You are Stadeck's ${descriptor} at ${venue.name} in ${venue.city}, hosting ${venue.stage} at FIFA World Cup 2026.`;
}

/**
 * The full sensor sweep is one zone per section and gate — raw JSON would
 * blow the proxy's payload cap and bury the signal. The prompt gets
 * aggregates plus the hottest zones only.
 *
 * @param readings The full live sweep.
 * @returns Compact JSON with totals, level counts, and the 12 hottest zones.
 */
export function compactDensityReadings(readings: DensityReading[]): string {
  const sorted = [...readings].sort((a, b) => b.percentOfCapacity - a.percentOfCapacity);
  const average =
    readings.length === 0
      ? 0
      : Math.round(
          readings.reduce((sum, reading) => sum + reading.percentOfCapacity, 0) / readings.length,
        );
  return JSON.stringify({
    totalZones: readings.length,
    averagePercentOfCapacity: average,
    criticalZones: readings.filter((reading) => reading.level === 'critical').length,
    elevatedZones: readings.filter((reading) => reading.level === 'elevated').length,
    hottestZones: sorted.slice(0, 12).map((reading) => ({
      zoneId: reading.zoneId,
      level: reading.level,
      percentOfCapacity: reading.percentOfCapacity,
    })),
  });
}
