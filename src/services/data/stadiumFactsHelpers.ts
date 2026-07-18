import type { AmenityType, StadiumSection, VenueLayout } from '../../types/stadium';
import type { Venue } from '../../types/venue';
import { formatCount } from '../../utils/format';
import { sectionNumber } from './stadiumLayout';

/** Building blocks for buildStadiumFacts (stadiumFacts.ts) — one helper per venue-derived fact clause. */

/** en-US so lists read as English prose, matching the rest of the fact sheet. */
const LIST_FORMAT = new Intl.ListFormat('en-US', { style: 'long', type: 'conjunction' });

/** Distinct anchor-section numbers for an amenity type, in ring order. */
export function anchorNumbers(layout: VenueLayout, type: AmenityType): string[] {
  const numbers = layout.amenities
    .filter((amenity) => amenity.type === type)
    .map((amenity) => sectionNumber(amenity.sectionId));
  return [...new Set(numbers)];
}

export function sectionList(layout: VenueLayout, type: AmenityType): string {
  return LIST_FORMAT.format(anchorNumbers(layout, type));
}

/** Formats a plain list of section numbers as English prose, e.g. ["103", "123"] → "103 and 123". */
export function formatList(items: readonly string[]): string {
  return LIST_FORMAT.format(items);
}

export function tierRange(layout: VenueLayout, tier: StadiumSection['tier']): string {
  const ring = layout.sections.filter((section) => section.tier === tier);
  return `${ring[0]?.label ?? ''}-${ring[ring.length - 1]?.label ?? ''}`;
}

/**
 * Mexican venues are the one place in the registry where cash is accepted
 * alongside cards — a real, venue-specific difference from the cashless US
 * and Canada venues, not just a cosmetic variation, so the concierge answers
 * a Mexican fan's payment question correctly.
 */
export function paymentsFact(venue: Venue): string {
  if (venue.country === 'Mexico') {
    return 'Cards, mobile payments, and cash are all accepted at concessions and merchandise stands here, unlike most World Cup venues in the US and Canada, which are cashless; a cash-to-card kiosk is still available on each concourse for convenience.';
  }
  if (venue.country === 'Canada') {
    return 'As a Canadian venue, concessions and merchandise stands are cashless — card and mobile payments only, charged in Canadian dollars, so US and international cards should expect a currency conversion. Cash-to-card kiosks on each concourse convert cash to a free prepaid card.';
  }
  return 'The stadium is fully cashless: card and mobile payments only, no cash accepted anywhere. Cash-to-card kiosks on each concourse convert cash to a free prepaid card.';
}

/**
 * Canadian venues clear slightly larger bags than the US default — a real
 * cross-border difference in venue security norms, not a cosmetic variation,
 * so the concierge gives a BMO Field or BC Place fan the right bag size.
 */
export function bagPolicyFact(venue: Venue): string {
  if (venue.country === 'Canada') {
    return 'Clear bags up to 14 x 14 x 6 inches are allowed here — a slightly larger allowance than US gates use; non-compliant bags can be checked for a fee at the bag-check tents outside Gate B.';
  }
  return 'Only clear bags up to 12 x 6 x 12 inches or small clutches are allowed; non-compliant bags can be checked for a fee at the bag-check tents outside Gate B.';
}

/** Smaller-capacity host venues get an explicit size comparison in their profile fact. */
const SMALLER_VENUE_CAPACITY_THRESHOLD = 60_000;

/**
 * Baseline venue-profile fact grounding the registry's own stage, capacity,
 * elevation, and time zone facts for every venue — not just the four
 * flagship venues — so the concierge can state which stage this venue hosts
 * (e.g. MetLife's Final) and its local time zone without the model guessing.
 */
export function venueProfileFact(venue: Venue): string {
  const base = `${venue.name} seats ${formatCount(venue.capacity)} fans at ${venue.altitudeMeters}m elevation, hosting ${venue.stage} of FIFA World Cup 2026, time zone ${venue.timezone}.`;
  if (venue.capacity < SMALLER_VENUE_CAPACITY_THRESHOLD) {
    return `${base} One of the tournament's smaller host venues; several 2026 venues top 80,000.`;
  }
  return base;
}

const ROOF_DESCRIPTIONS: Record<Venue['roof'], string> = {
  open: 'The stadium has an open-air bowl with no roof, so matches proceed rain or shine; follow staff instructions if severe weather pauses play.',
  retractable:
    'The stadium has a retractable roof, typically closed ahead of severe weather (heat or storms) to keep play uninterrupted, and concourses stay climate-controlled regardless of roof position; check with stewards for today’s roof status.',
  fixed: 'The stadium has a fixed roof providing permanent weather protection, so matches are not affected by rain or heat.',
};

/** Elevation above which the concierge proactively mentions altitude — Mexico City and Guadalajara. */
const HIGH_ALTITUDE_THRESHOLD_METERS = 1500;

/**
 * Roof status and, at high-altitude venues only, a hydration/pacing note —
 * the two venue attributes most likely to change a fan's plan, so both are
 * grounded facts rather than left for the model to guess at.
 */
export function venueConditionsFact(venue: Venue): string {
  const roofNote = ROOF_DESCRIPTIONS[venue.roof];
  if (venue.altitudeMeters <= HIGH_ALTITUDE_THRESHOLD_METERS) {
    return roofNote;
  }
  return `${roofNote} At ${venue.altitudeMeters}m above sea level, fans may notice shortness of breath on stairs — pace yourself, use elevators at Gates A, C, E, G, and stay hydrated. It also raises heat/cardiac medical-incident risk — seek help early if unwell.`;
}
