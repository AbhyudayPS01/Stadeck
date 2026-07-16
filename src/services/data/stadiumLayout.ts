import type {
  Amenity,
  AmenityType,
  CompassPoint,
  Gate,
  SectionTier,
  StadiumSection,
} from '../../types/stadium';
import { angularDistanceDegrees } from '../../utils/geometry';

/**
 * Typed JSON config for the schematic stadium map — the map component maps
 * this straight to SVG elements, never hand-draws paths. Capacities and
 * counts are illustrative approximations of an 82,500-seat World Cup Final
 * venue, not MetLife Stadium's real seating chart.
 */

interface TierConfig {
  tier: SectionTier;
  startNumber: number;
  count: number;
  capacityPerSection: number;
}

const TIER_CONFIGS: readonly TierConfig[] = [
  { tier: 'lower', startNumber: 101, count: 40, capacityPerSection: 900 },
  { tier: 'club', startNumber: 201, count: 16, capacityPerSection: 500 },
  { tier: 'upper', startNumber: 301, count: 40, capacityPerSection: 955 },
];

function buildSections(): StadiumSection[] {
  return TIER_CONFIGS.flatMap((config) => {
    const angleStep = 360 / config.count;
    return Array.from({ length: config.count }, (_, index) => {
      const angleStart = index * angleStep;
      const number = config.startNumber + index;
      return {
        id: `sec-${number}`,
        label: String(number),
        tier: config.tier,
        capacity: config.capacityPerSection,
        angleStart,
        angleEnd: angleStart + angleStep,
      };
    });
  });
}

export const SECTIONS: readonly StadiumSection[] = buildSections();

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

export const GATES: readonly Gate[] = GATE_DEFINITIONS.map((definition, index) => ({
  id: `gate-${definition.label.toLowerCase()}`,
  label: `Gate ${definition.label}`,
  compassPoint: definition.compassPoint,
  angle: index * 45,
}));

const AMENITY_LABELS: Record<AmenityType, string> = {
  restroom: 'Restroom',
  food: 'Concessions',
  'first-aid': 'First Aid',
  'accessible-seating': 'Accessible Seating',
  merchandise: 'Merchandise',
  'guest-services': 'Guest Services',
};

/** One-line fan-facing description per amenity type, shown in the map popup. */
const AMENITY_DESCRIPTIONS: Record<AmenityType, string> = {
  restroom: 'Public restrooms on the main concourse.',
  food: 'Food and drink stands with local and international options.',
  'first-aid': 'Staffed medical station with trained personnel.',
  'accessible-seating': 'Wheelchair-accessible seating area with companion seats.',
  merchandise: 'Official tournament merchandise and souvenirs.',
  'guest-services': 'Help desk for tickets, lost and found, and general questions.',
};

const AMENITY_DEFINITIONS: ReadonlyArray<{
  type: AmenityType;
  sectionLabel: string;
  angle: number;
}> = [
  { type: 'restroom', sectionLabel: '105', angle: 20 },
  { type: 'restroom', sectionLabel: '115', angle: 110 },
  { type: 'restroom', sectionLabel: '125', angle: 200 },
  { type: 'restroom', sectionLabel: '135', angle: 290 },
  { type: 'food', sectionLabel: '108', angle: 50 },
  { type: 'food', sectionLabel: '118', angle: 140 },
  { type: 'food', sectionLabel: '128', angle: 230 },
  { type: 'food', sectionLabel: '138', angle: 320 },
  { type: 'first-aid', sectionLabel: '112', angle: 90 },
  { type: 'first-aid', sectionLabel: '132', angle: 270 },
  { type: 'accessible-seating', sectionLabel: '101', angle: 5 },
  { type: 'accessible-seating', sectionLabel: '120', angle: 175 },
  { type: 'merchandise', sectionLabel: '110', angle: 80 },
  { type: 'merchandise', sectionLabel: '130', angle: 260 },
  { type: 'guest-services', sectionLabel: '103', angle: 15 },
  { type: 'guest-services', sectionLabel: '123', angle: 195 },
];

export const AMENITIES: readonly Amenity[] = AMENITY_DEFINITIONS.map((definition, index) => ({
  id: `amenity-${definition.type}-${index + 1}`,
  type: definition.type,
  label: AMENITY_LABELS[definition.type],
  description: AMENITY_DESCRIPTIONS[definition.type],
  sectionId: `sec-${definition.sectionLabel}`,
  angle: definition.angle,
}));

const ZONE_LABELS = new Map<string, string>([
  ...SECTIONS.map((section) => [section.id, `Section ${section.label}`] as const),
  ...GATES.map((gate) => [gate.id, gate.label] as const),
]);

/** Human-readable name for a sensor zone id, e.g. "sec-118" → "Section 118", "gate-a" → "Gate A". */
export function findZoneLabel(zoneId: string): string {
  return ZONE_LABELS.get(zoneId) ?? zoneId;
}

/** Bare section number from a section id, e.g. "sec-118" → "118". */
export function sectionNumber(sectionId: string): string {
  return sectionId.replace('sec-', '');
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
export function nearestAmenity(section: StadiumSection, type: AmenityType): Amenity {
  const candidates = AMENITIES.filter((amenity) => amenity.type === type);
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
export function amenityNearbySectionLabels(amenity: Amenity): string[] {
  const anchor = SECTIONS.find((section) => section.id === amenity.sectionId);
  if (anchor === undefined) {
    return [sectionNumber(amenity.sectionId)];
  }
  const ring = SECTIONS.filter((section) => section.tier === anchor.tier);
  const index = ring.indexOf(anchor);
  // ?? anchor is unreachable (ring always contains anchor) but keeps index
  // access total under strict checking.
  const previous = ring[(index - 1 + ring.length) % ring.length] ?? anchor;
  const next = ring[(index + 1) % ring.length] ?? anchor;
  return [previous.label, anchor.label, next.label];
}
