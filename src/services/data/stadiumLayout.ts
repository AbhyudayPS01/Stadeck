import { DEFAULT_VENUE_ID } from '../../config/constants';
import type {
  Amenity,
  AmenityType,
  CompassPoint,
  Gate,
  SectionTier,
  StadiumSection,
  VenueLayout,
} from '../../types/stadium';
import type { Venue } from '../../types/venue';
import { angularDistanceDegrees } from '../../utils/geometry';
import { clamp } from '../../utils/numbers';
import { AMENITY_DESCRIPTIONS, AMENITY_LABELS, AMENITY_PLAN } from './stadiumAmenities';
import { findVenue } from './venues';

/**
 * Generates each venue's typed schematic-map config — the map component maps
 * a VenueLayout straight to SVG elements, never hand-draws paths. Section
 * counts derive from registry capacity, so every layout is an illustrative
 * approximation of that venue at tournament configuration, not its real
 * seating chart.
 */

export { AMENITY_LABELS } from './stadiumAmenities';

interface TierPlan {
  tier: SectionTier;
  startNumber: number;
  /** Share of total venue capacity this tier absorbs — an approximate three-ring bowl profile. */
  capacityShare: number;
  /** Seats per section, fixed per tier so section granularity feels consistent across venues. */
  capacityPerSection: number;
}

/** Lower/club/upper bowl profile for a venue.tierCount === 3 registry entry. */
const THREE_TIER_PLANS: readonly TierPlan[] = [
  { tier: 'lower', startNumber: 101, capacityShare: 0.44, capacityPerSection: 900 },
  { tier: 'club', startNumber: 201, capacityShare: 0.1, capacityPerSection: 500 },
  { tier: 'upper', startNumber: 301, capacityShare: 0.46, capacityPerSection: 955 },
];

/**
 * Lower/upper bowl profile for a venue.tierCount === 2 registry entry — smaller
 * soccer-specific grounds with no club level. No amenity in stadiumAmenities.ts
 * anchors to the 'club' tier, so dropping it never leaves an amenity orphaned.
 */
const TWO_TIER_PLANS: readonly TierPlan[] = [
  { tier: 'lower', startNumber: 101, capacityShare: 0.55, capacityPerSection: 900 },
  { tier: 'upper', startNumber: 301, capacityShare: 0.45, capacityPerSection: 955 },
];

/** The tier plan for a venue's registry tierCount — drives its generated bowl shape. */
function tierPlansFor(venue: Venue): readonly TierPlan[] {
  return venue.tierCount === 2 ? TWO_TIER_PLANS : THREE_TIER_PLANS;
}

/**
 * Section counts snap to multiples of 4 so every ring is quarter-symmetric
 * and the four cardinal emergency exits land on distinct sections at any
 * venue size. Bounds keep tiny/huge capacities from degenerating the ring
 * (fewer than 8 sections) or overflowing a tier's hundred-number block.
 */
function sectionCountFor(plan: TierPlan, capacity: number): number {
  const quarters = Math.round((plan.capacityShare * capacity) / plan.capacityPerSection / 4);
  return 4 * clamp(quarters, 2, 12);
}

function buildSections(capacity: number, tierPlans: readonly TierPlan[]): StadiumSection[] {
  return tierPlans.flatMap((plan) => {
    const count = sectionCountFor(plan, capacity);
    const angleStep = 360 / count;
    return Array.from({ length: count }, (_, index) => {
      const angleStart = index * angleStep;
      const number = plan.startNumber + index;
      return {
        id: `sec-${number}`,
        label: String(number),
        tier: plan.tier,
        capacity: plan.capacityPerSection,
        angleStart,
        angleEnd: angleStart + angleStep,
      };
    });
  });
}

/** Human-readable tier names, shared by map accessible labels and AI prompts. */
export const TIER_NAMES: Record<SectionTier, string> = {
  lower: 'lower bowl',
  club: 'club level',
  upper: 'upper bowl',
};

const GATE_DEFINITIONS: ReadonlyArray<{ label: string; compassPoint: CompassPoint }> = [
  { label: 'A', compassPoint: 'N' },
  { label: 'B', compassPoint: 'NE' },
  { label: 'C', compassPoint: 'E' },
  { label: 'D', compassPoint: 'SE' },
  { label: 'E', compassPoint: 'S' },
  { label: 'F', compassPoint: 'SW' },
  { label: 'G', compassPoint: 'W' },
  { label: 'H', compassPoint: 'NW' },
];

/** Gates A–H at compass points — a schematic convention shared by every venue. */
export const GATES: readonly Gate[] = GATE_DEFINITIONS.map((definition, index) => ({
  id: `gate-${definition.label.toLowerCase()}`,
  label: `Gate ${definition.label}`,
  compassPoint: definition.compassPoint,
  angle: index * 45,
}));

/** The gate set for a venue's registry gateCount — every venue currently uses all 8. */
function gatesFor(venue: Venue): readonly Gate[] {
  return GATES.slice(0, venue.gateCount);
}

function buildAmenities(sections: readonly StadiumSection[]): Amenity[] {
  return AMENITY_PLAN.map((entry, index) => {
    const ring = sections.filter((section) => section.tier === entry.tier);
    const anchor = ring[Math.floor(entry.ringFraction * ring.length)];
    if (anchor === undefined) {
      throw new Error(`Amenity plan entry ${index} resolves outside the ${entry.tier} ring`);
    }
    return {
      id: `amenity-${entry.type}-${index + 1}`,
      type: entry.type,
      label: AMENITY_LABELS[entry.type],
      description: AMENITY_DESCRIPTIONS[entry.type],
      sectionId: anchor.id,
      angle: entry.angle,
    };
  });
}

/**
 * Layouts are deterministic per venue, so each is generated once and cached —
 * screens, facts, and prompt builders all share the same object identity.
 */
const layoutCache = new Map<string, VenueLayout>();

function buildVenueLayout(venue: Venue): VenueLayout {
  const sections = buildSections(venue.capacity, tierPlansFor(venue));
  const gates = gatesFor(venue);
  return { venueId: venue.id, sections, gates, amenities: buildAmenities(sections) };
}

/**
 * The generated schematic layout for a registered venue.
 *
 * @param venueId A registry id from services/data/venues.ts.
 * @returns The memoised layout for that venue.
 * @throws When the id is not in the venue registry.
 */
export function getVenueLayout(venueId: string): VenueLayout {
  const cached = layoutCache.get(venueId);
  if (cached) {
    return cached;
  }
  const venue = findVenue(venueId);
  if (!venue) {
    throw new Error(`Unknown venue id "${venueId}" — see services/data/venues.ts`);
  }
  const layout = buildVenueLayout(venue);
  layoutCache.set(venueId, layout);
  return layout;
}

/** Layout of the default demo venue — the one every screen currently renders. */
export const DEFAULT_VENUE_LAYOUT: VenueLayout = getVenueLayout(DEFAULT_VENUE_ID);

/** Sections of the default venue layout — shorthand for the current screens. */
export const SECTIONS: readonly StadiumSection[] = DEFAULT_VENUE_LAYOUT.sections;

/** Amenities of the default venue layout — shorthand for the current screens. */
export const AMENITIES: readonly Amenity[] = DEFAULT_VENUE_LAYOUT.amenities;

/** Zone-label maps are derived per layout on first use, then reused for every lookup. */
const zoneLabelCache = new WeakMap<VenueLayout, Map<string, string>>();

function zoneLabelsFor(layout: VenueLayout): Map<string, string> {
  const cached = zoneLabelCache.get(layout);
  if (cached) {
    return cached;
  }
  const labels = new Map<string, string>([
    ...layout.sections.map((section) => [section.id, `Section ${section.label}`] as const),
    ...layout.gates.map((gate) => [gate.id, gate.label] as const),
  ]);
  zoneLabelCache.set(layout, labels);
  return labels;
}

/** Human-readable name for a sensor zone id, e.g. "sec-118" → "Section 118", "gate-a" → "Gate A". */
export function findZoneLabel(zoneId: string, layout: VenueLayout = DEFAULT_VENUE_LAYOUT): string {
  return zoneLabelsFor(layout).get(zoneId) ?? zoneId;
}

/** Bare section number from a section id, e.g. "sec-118" → "118". */
export function sectionNumber(sectionId: string): string {
  return sectionId.replace('sec-', '');
}

/**
 * The section number a given fraction of the way around a tier's ring —
 * mirrors the amenity plan's ring-fraction convention (stadiumAmenities.ts),
 * so mock content can reference "a section on this venue's ring" without
 * hardcoding a number that only exists at some venues.
 */
export function sectionNumberAtRingFraction(
  layout: VenueLayout,
  tier: SectionTier,
  fraction: number,
): string {
  const ring = layout.sections.filter((section) => section.tier === tier);
  const section = ring[Math.floor(fraction * ring.length)];
  return section ? sectionNumber(section.id) : '';
}

/** Compass bearing of a section's center, matching the angle convention of gates and amenities. */
export function sectionMidAngle(section: StadiumSection): number {
  return (section.angleStart + section.angleEnd) / 2;
}

function nearestByAngle<T>(items: readonly T[], angleOf: (item: T) => number, target: number): T {
  const [first, ...rest] = items;
  if (first === undefined) {
    throw new Error('nearestByAngle requires at least one candidate');
  }
  return rest.reduce(
    (best, item) =>
      angularDistanceDegrees(angleOf(item), target) < angularDistanceDegrees(angleOf(best), target)
        ? item
        : best,
    first,
  );
}

/**
 * The amenity of a given type with the smallest walk around the concourse
 * ring from a section — powers the "nearest restroom / food" callouts.
 */
export function nearestAmenity(
  section: StadiumSection,
  type: AmenityType,
  layout: VenueLayout = DEFAULT_VENUE_LAYOUT,
): Amenity {
  const candidates = layout.amenities.filter((amenity) => amenity.type === type);
  return nearestByAngle(candidates, (amenity) => amenity.angle, sectionMidAngle(section));
}

/** The gate closest around the ring to a section — the fan's quickest exit. */
export function nearestGate(section: StadiumSection): Gate {
  return nearestByAngle(GATES, (gate) => gate.angle, sectionMidAngle(section));
}

/**
 * Section numbers nearest an amenity: its anchor section plus the ring
 * neighbour on either side, wrapping across the tier's 0° seam — powers the
 * "near sections" line in the map's amenity popup.
 */
export function amenityNearbySectionLabels(
  amenity: Amenity,
  layout: VenueLayout = DEFAULT_VENUE_LAYOUT,
): string[] {
  const anchor = layout.sections.find((section) => section.id === amenity.sectionId);
  if (anchor === undefined) {
    return [sectionNumber(amenity.sectionId)];
  }
  const ring = layout.sections.filter((section) => section.tier === anchor.tier);
  const index = ring.indexOf(anchor);
  // ?? anchor is unreachable (ring always contains anchor) but keeps index
  // access total under strict checking.
  const previous = ring[(index - 1 + ring.length) % ring.length] ?? anchor;
  const next = ring[(index + 1) % ring.length] ?? anchor;
  return [previous.label, anchor.label, next.label];
}
