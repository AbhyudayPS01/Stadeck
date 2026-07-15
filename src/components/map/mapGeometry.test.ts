import { describe, expect, it } from 'vitest';
import { AMENITIES, GATES, SECTIONS } from '../../services/data/stadiumLayout';
import {
  amenityPoint,
  gatePoint,
  MAP_CENTER,
  MAP_SIZE,
  routePath,
  sectionLabelPoint,
  sectionPath,
  TIER_RINGS,
} from './mapGeometry';

function findGate(id: string) {
  const gate = GATES.find((candidate) => candidate.id === id);
  if (!gate) {
    throw new Error(`missing test gate ${id}`);
  }
  return gate;
}

function findSection(id: string) {
  const section = SECTIONS.find((candidate) => candidate.id === id);
  if (!section) {
    throw new Error(`missing test section ${id}`);
  }
  return section;
}

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

  it('routes from the gate, along the concourse, out to the section center', () => {
    const gate = findGate('gate-a');
    const section = findSection('sec-110'); // mid-angle 85.5° — clockwise from Gate A at 0°

    const path = routePath(gate, section);
    const start = gatePoint(gate);
    const end = sectionLabelPoint(section);

    expect(path.startsWith(`M ${start.x} ${start.y}`)).toBe(true);
    expect(path.endsWith(`L ${end.x} ${end.y}`)).toBe(true);
    expect(path).toContain(' A 160 160 0 0 1 '); // clockwise sweep along the concourse ring
  });

  it('arcs counter-clockwise when that is the shorter way around', () => {
    const gate = findGate('gate-a');
    const section = findSection('sec-135'); // mid-angle 310.5° — counter-clockwise from 0°

    expect(routePath(gate, section)).toContain(' A 160 160 0 0 0 ');
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
