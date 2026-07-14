import type { Amenity, Gate, SectionTier, StadiumSection } from '../../types/stadium';
import { annularSectorPath, polarToCartesian, type Point } from '../../utils/geometry';

/**
 * Presentation geometry for the schematic stadium map. The layout itself
 * (sections, gates, amenities) comes from services/data/stadiumLayout; this
 * module only decides where those config entries land in SVG space, so
 * overlay layers can compute positions with the same functions.
 */

/** SVG viewBox is MAP_SIZE × MAP_SIZE user units. */
export const MAP_SIZE = 600;
export const MAP_CENTER = MAP_SIZE / 2;

/** Concentric ring band (inner/outer radius) per seating tier. */
export const TIER_RINGS: Record<SectionTier, { inner: number; outer: number }> = {
  lower: { inner: 95, outer: 150 },
  club: { inner: 170, outer: 200 },
  upper: { inner: 208, outer: 262 },
};

/** Amenity markers sit on the concourse gap between the lower and club rings. */
export const AMENITY_RADIUS = 160;

/** Gate markers sit outside the upper ring, at their compass angles. */
export const GATE_RADIUS = 281;

/** Degrees trimmed from each side of a section so neighbours read as separate blocks. */
const SECTION_GAP_DEGREES = 0.75;

/** Closed SVG path for one seating section's ring-sector shape. */
export function sectionPath(section: StadiumSection): string {
  const ring = TIER_RINGS[section.tier];
  return annularSectorPath(
    MAP_CENTER,
    MAP_CENTER,
    ring.inner,
    ring.outer,
    section.angleStart + SECTION_GAP_DEGREES,
    section.angleEnd - SECTION_GAP_DEGREES,
  );
}

/** Center of a section's ring band — where its number label renders. */
export function sectionLabelPoint(section: StadiumSection): Point {
  const ring = TIER_RINGS[section.tier];
  const midAngle = (section.angleStart + section.angleEnd) / 2;
  return polarToCartesian(MAP_CENTER, MAP_CENTER, (ring.inner + ring.outer) / 2, midAngle);
}

/** Marker position for a gate. */
export function gatePoint(gate: Gate): Point {
  return polarToCartesian(MAP_CENTER, MAP_CENTER, GATE_RADIUS, gate.angle);
}

/** Marker position for an amenity. */
export function amenityPoint(amenity: Amenity): Point {
  return polarToCartesian(MAP_CENTER, MAP_CENTER, AMENITY_RADIUS, amenity.angle);
}
