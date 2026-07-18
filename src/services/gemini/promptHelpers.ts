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

const ROOF_REASONING_HINTS: Record<Venue['roof'], string> = {
  open: 'open-air, so weather (rain, heat, lightning) directly affects crowd flow and delay decisions',
  retractable: 'a retractable roof — factor in whether it would realistically be closed for the weather',
  fixed: 'a fixed roof, so outdoor weather does not affect play or crowd flow',
};

/**
 * Elevation above which crowd/ops reasoning should account for altitude
 * effects on fans — shared with the offline mock fallbacks (mock.ts) so the
 * live and offline paths agree on which venues get the altitude callout.
 */
export const HIGH_ALTITUDE_THRESHOLD_METERS = 1500;

/**
 * One-line venue-conditions brief for ops-facing prompts (crowd management,
 * real-time decision support, scenario planning): roof status always, plus
 * an altitude note at high-altitude venues — the two attributes most likely
 * to change what "the right call" is, grounded instead of left for the model
 * to guess or default to sea-level assumptions.
 *
 * @param venue The venue the assistant is reasoning about.
 * @returns The context sentence.
 */
export function venueConditionsLine(venue: Venue): string {
  const roofNote = `The venue is ${ROOF_REASONING_HINTS[venue.roof]}.`;
  if (venue.altitudeMeters <= HIGH_ALTITUDE_THRESHOLD_METERS) {
    return roofNote;
  }
  return `${roofNote} It sits at ${venue.altitudeMeters}m elevation — factor in faster fan fatigue and quicker dehydration when planning steward deployment or pacing.`;
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
