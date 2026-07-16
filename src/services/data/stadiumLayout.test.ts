import { describe, expect, it } from 'vitest';
import { findAmenity, findSection } from '../../test/stadiumFixtures';
import {
  AMENITIES,
  amenityNearbySectionLabels,
  findZoneLabel,
  GATES,
  nearestAmenity,
  nearestGate,
  sectionMidAngle,
  sectionNumber,
  SECTIONS,
} from './stadiumLayout';

describe('SECTIONS', () => {
  it('generates 96 sections across the three tiers', () => {
    expect(SECTIONS).toHaveLength(96);
  });

  it('has unique ids', () => {
    const ids = new Set(SECTIONS.map((section) => section.id));
    expect(ids.size).toBe(SECTIONS.length);
  });

  it('covers a full 360-degree ring per tier', () => {
    for (const tier of ['lower', 'club', 'upper'] as const) {
      const sectionsInTier = SECTIONS.filter((section) => section.tier === tier);
      const totalDegrees = sectionsInTier.reduce(
        (sum, section) => sum + (section.angleEnd - section.angleStart),
        0,
      );
      expect(totalDegrees).toBeCloseTo(360, 5);
    }
  });

  it('has a plausible total capacity for an 82,500-seat venue', () => {
    const total = SECTIONS.reduce((sum, section) => sum + section.capacity, 0);
    expect(total).toBeGreaterThan(70_000);
    expect(total).toBeLessThan(95_000);
  });
});

describe('GATES', () => {
  it('has 8 gates, one per compass point', () => {
    expect(GATES).toHaveLength(8);
    const compassPoints = new Set(GATES.map((gate) => gate.compassPoint));
    expect(compassPoints.size).toBe(8);
  });
});

describe('findZoneLabel', () => {
  it('labels section and gate zone ids', () => {
    expect(findZoneLabel('sec-118')).toBe('Section 118');
    expect(findZoneLabel('gate-a')).toBe('Gate A');
  });

  it('falls back to the raw id for unknown zones', () => {
    expect(findZoneLabel('mystery-zone')).toBe('mystery-zone');
  });
});

describe('sectionNumber', () => {
  it('strips the section id prefix', () => {
    expect(sectionNumber('sec-118')).toBe('118');
  });
});

describe('sectionMidAngle', () => {
  it('returns the center bearing of a section arc', () => {
    expect(sectionMidAngle(findSection('sec-101'))).toBe(4.5);
  });
});

describe('nearestAmenity', () => {
  it('finds the restroom with the smallest walk around the ring', () => {
    expect(nearestAmenity(findSection('sec-101'), 'restroom').sectionId).toBe('sec-105');
  });

  it('takes the short way across the 0° seam', () => {
    expect(nearestAmenity(findSection('sec-101'), 'food').sectionId).toBe('sec-138');
  });
});

describe('nearestGate', () => {
  it('returns the gate closest to the section bearing', () => {
    expect(nearestGate(findSection('sec-101')).id).toBe('gate-a');
    expect(nearestGate(findSection('sec-130')).id).toBe('gate-g');
  });
});

describe('AMENITIES', () => {
  it('references only section ids that actually exist', () => {
    const sectionIds = new Set(SECTIONS.map((section) => section.id));
    for (const amenity of AMENITIES) {
      expect(sectionIds.has(amenity.sectionId)).toBe(true);
    }
  });

  it('has unique ids', () => {
    const ids = new Set(AMENITIES.map((amenity) => amenity.id));
    expect(ids.size).toBe(AMENITIES.length);
  });

  it('gives every amenity a fan-facing description for the map popup', () => {
    for (const amenity of AMENITIES) {
      expect(amenity.description.length).toBeGreaterThan(0);
    }
  });
});

describe('amenityNearbySectionLabels', () => {
  it('returns the anchor section with its ring neighbours', () => {
    expect(amenityNearbySectionLabels(findAmenity('amenity-first-aid-9'))).toEqual([
      '111',
      '112',
      '113',
    ]);
  });

  it('wraps neighbours across the 0° seam of the tier ring', () => {
    expect(amenityNearbySectionLabels(findAmenity('amenity-accessible-seating-11'))).toEqual([
      '140',
      '101',
      '102',
    ]);
  });

  it('falls back to the raw section number for an unknown anchor', () => {
    const orphan = { ...findAmenity('amenity-restroom-1'), sectionId: 'sec-999' };
    expect(amenityNearbySectionLabels(orphan)).toEqual(['999']);
  });
});
