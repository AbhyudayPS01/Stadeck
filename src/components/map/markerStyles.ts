import type { AmenityType } from '../../types/stadium';

/** Single-letter marker glyphs; the accessible name carries the full label. */
export const AMENITY_GLYPHS: Record<AmenityType, string> = {
  restroom: 'R',
  food: 'C',
  water: 'W',
  'first-aid': '+',
  'accessible-seating': 'A',
  merchandise: 'M',
  'guest-services': 'i',
  'prayer-room': 'P',
  'family-reunification': 'F',
  'emergency-exit': 'X',
};

const PITCH_MARKER = { stroke: '#106634', fill: '#FFFFFF' };

/**
 * Marker palette per amenity type. Most share the pitch green; water uses
 * the fan info pair, the family reunification point the fan elevated (gold)
 * pair so it stands apart from everyday amenities, and emergency exits the
 * fan danger pair (DESIGN.md severity tokens, all AA on their tints). Color
 * is never the only channel: every type also has a distinct glyph, an
 * accessible name, and a legend entry (MapLegend).
 */
export const AMENITY_COLORS: Record<AmenityType, { stroke: string; fill: string }> = {
  restroom: PITCH_MARKER,
  food: PITCH_MARKER,
  water: { stroke: '#234B9E', fill: '#EAF0FB' },
  'first-aid': PITCH_MARKER,
  'accessible-seating': PITCH_MARKER,
  merchandise: PITCH_MARKER,
  'guest-services': PITCH_MARKER,
  'prayer-room': PITCH_MARKER,
  'family-reunification': { stroke: '#96610E', fill: '#FDF3E1' },
  'emergency-exit': { stroke: '#B0241A', fill: '#FDE8E5' },
};
