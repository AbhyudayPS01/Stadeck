import { describe, expect, it } from 'vitest';
import { findAmenity, findSection } from '../../test/stadiumFixtures';
import type { AmenityType } from '../../types/stadium';
import {
  AMENITIES,
  amenityNearbySectionLabels,
  DEFAULT_VENUE_LAYOUT,
  findZoneLabel,
  GATES,
  getVenueLayout,
  nearestAmenity,
  nearestGate,
  sectionMidAngle,
  sectionNumber,
  SECTIONS,
} from './stadiumLayout';
import { VENUES } from './venues';

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

  it('spreads 8 water refill stations around the concourse', () => {
    const stations = AMENITIES.filter((amenity) => amenity.type === 'water');
    expect(stations).toHaveLength(8);
    expect(stations.every((station) => station.label === 'Water Refill Station')).toBe(true);
  });

  it('collocates prayer rooms with first aid and the reunification point with Guest Services', () => {
    const prayerSections = AMENITIES.filter((amenity) => amenity.type === 'prayer-room').map(
      (amenity) => amenity.sectionId,
    );
    expect(prayerSections).toEqual(['sec-112', 'sec-132']);

    const reunification = AMENITIES.filter((amenity) => amenity.type === 'family-reunification');
    expect(reunification).toHaveLength(1);
    expect(reunification[0]?.sectionId).toBe('sec-121');
  });

  it('places emergency exits at the four cardinal bearings', () => {
    const exits = AMENITIES.filter((amenity) => amenity.type === 'emergency-exit');
    expect(exits.map((exit) => exit.angle)).toEqual([0, 90, 180, 270]);
    for (const exit of exits) {
      expect(exit.label).toBe('Emergency Exit');
      expect(exit.description).toContain('Do not use during normal operations');
    }
  });
});

describe('getVenueLayout', () => {
  const AMENITY_TYPES: readonly AmenityType[] = [
    'restroom',
    'food',
    'water',
    'first-aid',
    'accessible-seating',
    'merchandise',
    'guest-services',
    'prayer-room',
    'family-reunification',
    'emergency-exit',
  ];

  it('returns the memoised layout object on repeat calls', () => {
    expect(getVenueLayout('bmo-field')).toBe(getVenueLayout('bmo-field'));
    expect(getVenueLayout('metlife-stadium')).toBe(DEFAULT_VENUE_LAYOUT);
  });

  it('throws for a venue id that is not in the registry', () => {
    expect(() => getVenueLayout('camp-nou')).toThrow('Unknown venue id');
  });

  it('reproduces the hand-tuned Final venue layout for MetLife Stadium', () => {
    const layout = getVenueLayout('metlife-stadium');
    const byTier = (tier: string) => layout.sections.filter((section) => section.tier === tier);
    expect(byTier('lower').map((section) => section.label)).toEqual(
      Array.from({ length: 40 }, (_, index) => String(101 + index)),
    );
    expect(byTier('club')).toHaveLength(16);
    expect(byTier('upper')).toHaveLength(40);
  });

  it('generates quarter-symmetric section rings for every venue', () => {
    for (const venue of VENUES) {
      const layout = getVenueLayout(venue.id);
      for (const tier of ['lower', 'club', 'upper'] as const) {
        const count = layout.sections.filter((section) => section.tier === tier).length;
        expect(count % 4, `${venue.id} ${tier}`).toBe(0);
        expect(count, `${venue.id} ${tier}`).toBeGreaterThanOrEqual(8);
        expect(count, `${venue.id} ${tier}`).toBeLessThanOrEqual(48);
      }
    }
  });

  it('approximates each venue’s registry capacity within 10%', () => {
    for (const venue of VENUES) {
      const generated = getVenueLayout(venue.id).sections.reduce(
        (sum, section) => sum + section.capacity,
        0,
      );
      expect(Math.abs(generated - venue.capacity) / venue.capacity, venue.id).toBeLessThan(0.1);
    }
  });

  it('anchors every amenity type to a real section at every venue', () => {
    for (const venue of VENUES) {
      const layout = getVenueLayout(venue.id);
      const sectionIds = new Set(layout.sections.map((section) => section.id));
      for (const amenity of layout.amenities) {
        expect(sectionIds.has(amenity.sectionId), `${venue.id} ${amenity.id}`).toBe(true);
      }
      const presentTypes = new Set(layout.amenities.map((amenity) => amenity.type));
      expect(presentTypes, venue.id).toEqual(new Set(AMENITY_TYPES));
    }
  });

  it('keeps the four emergency exits on distinct upper-bowl sections at every venue', () => {
    for (const venue of VENUES) {
      const layout = getVenueLayout(venue.id);
      const exits = layout.amenities.filter((amenity) => amenity.type === 'emergency-exit');
      expect(new Set(exits.map((exit) => exit.sectionId)).size, venue.id).toBe(4);
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
