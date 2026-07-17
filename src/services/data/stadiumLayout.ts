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

/** Display name per amenity type, shared by markers, the detail popup, and the map legend. */
export const AMENITY_LABELS: Record<AmenityType, string> = {
  restroom: 'Restroom',
  food: 'Concessions',
  water: 'Water Refill Station',
  'first-aid': 'First Aid',
  'accessible-seating': 'Accessible Seating',
  merchandise: 'Merchandise',
  'guest-services': 'Guest Services',
  'prayer-room': 'Prayer & Quiet Room',
  'family-reunification': 'Family Reunification',
  'emergency-exit': 'Emergency Exit',
};

/** One-line fan-facing description per amenity type, shown in the map popup. */
const AMENITY_DESCRIPTIONS: Record<AmenityType, string> = {
  restroom: 'Public restrooms on the main concourse.',
  food: 'Food and drink stands with local and international options.',
  water: 'Free filtered water available.',
  'first-aid': 'Staffed medical station with trained personnel.',
  'accessible-seating': 'Wheelchair-accessible seating area with companion seats.',
  merchandise: 'Official tournament merchandise and souvenirs.',
  'guest-services': 'Help desk for tickets, lost and found, and general questions.',
  'prayer-room': 'Multi-faith prayer room and sensory quiet space.',
  'family-reunification':
    'Meeting point for separated groups and lost children, staffed by Guest Services.',
  'emergency-exit': 'Follow staff instructions. Do not use during normal operations.',
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
  // Water refill stations sit midway between the existing marker clusters so
  // every eighth of the main concourse has one within a short walk.
  { type: 'water', sectionLabel: '104', angle: 35 },
  { type: 'water', sectionLabel: '108', angle: 65 },
  { type: 'water', sectionLabel: '114', angle: 125 },
  { type: 'water', sectionLabel: '118', angle: 155 },
  { type: 'water', sectionLabel: '124', angle: 215 },
  { type: 'water', sectionLabel: '128', angle: 245 },
  { type: 'water', sectionLabel: '134', angle: 305 },
  { type: 'water', sectionLabel: '138', angle: 335 },
  // Prayer & quiet rooms beside the two first-aid stations (calm, staffed
  // corners of the concourse); the reunification point sits beside Guest
  // Services at 123 so lost-child handoffs happen next to staff.
  { type: 'prayer-room', sectionLabel: '112', angle: 100 },
  { type: 'prayer-room', sectionLabel: '132', angle: 280 },
  { type: 'family-reunification', sectionLabel: '121', angle: 185 },
  // Emergency exits at the four cardinal bearings, anchored to the upper
  // bowl: they render on the upper concourse ring, not the main one — see
  // EMERGENCY_EXIT_RADIUS in mapGeometry for why.
  { type: 'emergency-exit', sectionLabel: '301', angle: 0 },
  { type: 'emergency-exit', sectionLabel: '311', angle: 90 },
  { type: 'emergency-exit', sectionLabel: '321', angle: 180 },
  { type: 'emergency-exit', sectionLabel: '331', angle: 270 },
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
