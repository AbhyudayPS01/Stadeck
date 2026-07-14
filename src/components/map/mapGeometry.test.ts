import { describe, expect, it } from 'vitest';
import { AMENITIES, GATES, SECTIONS } from '../../services/data/stadiumLayout';
import {
  amenityPoint,
  gatePoint,
  MAP_CENTER,
  MAP_SIZE,
  sectionLabelPoint,
  sectionPath,
  TIER_RINGS,
} from './mapGeometry';

function distanceFromCenter(point: { x: number; y: number }): number {
  return Math.hypot(point.x - MAP_CENTER, point.y - MAP_CENTER);
}

describe('mapGeometry', () => {
  it('places every section label inside its tier ring band', () => {
    for (const section of SECTIONS) {
      const ring = TIER_RINGS[section.tier];
      const distance = distanceFromCenter(sectionLabelPoint(section));

      expect(distance).toBeGreaterThan(ring.inner);
      expect(distance).toBeLessThan(ring.outer);
    }
  });

  it('builds a closed path for every section', () => {
    for (const section of SECTIONS) {
      const path = sectionPath(section);

      expect(path.startsWith('M ')).toBe(true);
      expect(path.endsWith('Z')).toBe(true);
    }
  });

  it('places Gate A due North of the center', () => {
    const gateA = GATES.find((gate) => gate.label === 'Gate A');
    expect(gateA).toBeDefined();

    const point = gatePoint(gateA as (typeof GATES)[number]);
    expect(point.x).toBe(MAP_CENTER);
    expect(point.y).toBeLessThan(MAP_CENTER);
  });

  it('keeps every gate and amenity marker inside the viewBox', () => {
    for (const gate of GATES) {
      const point = gatePoint(gate);
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.x).toBeLessThanOrEqual(MAP_SIZE);
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThanOrEqual(MAP_SIZE);
    }
    for (const amenity of AMENITIES) {
      const distance = distanceFromCenter(amenityPoint(amenity));
      expect(distance).toBeLessThan(TIER_RINGS.club.inner);
      expect(distance).toBeGreaterThan(TIER_RINGS.lower.outer);
    }
  });
});
