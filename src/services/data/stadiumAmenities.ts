import type { AmenityType, SectionTier } from '../../types/stadium';

/**
 * Venue-independent amenity placement plan. Positions are expressed as a
 * fraction of the way around a tier's ring rather than as fixed section
 * numbers, so the same plan anchors amenities sensibly whether a venue's
 * lower bowl has 24 sections or 44 — the layout generator resolves each
 * fraction to that venue's section ring (see stadiumLayout.ts).
 */

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
export const AMENITY_DESCRIPTIONS: Record<AmenityType, string> = {
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

/** One planned amenity: where it sits on the ring and which tier anchors it. */
export interface AmenityPlanEntry {
  type: AmenityType;
  /** Tier whose section ring the amenity is anchored to. */
  tier: SectionTier;
  /** Fraction of the way around the tier ring (0 = the tier's first section). */
  ringFraction: number;
  /** Marker bearing in degrees, 0 = North, clockwise — fixed across venues. */
  angle: number;
}

/**
 * The plan, in stable order — amenity ids derive from array position, so
 * entries must only ever be appended. Restrooms, food, and water repeat
 * around the ring so every stretch of concourse has each within a short
 * walk; prayer rooms share the first-aid anchors (calm, staffed corners) and
 * the reunification point sits beside Guest Services so lost-child handoffs
 * happen next to staff. Emergency exits anchor to the upper tier at the four
 * cardinal bearings: they render on the upper concourse ring, not the main
 * one — see EMERGENCY_EXIT_RADIUS in mapGeometry for why.
 */
export const AMENITY_PLAN: readonly AmenityPlanEntry[] = [
  { type: 'restroom', tier: 'lower', ringFraction: 0.1, angle: 20 },
  { type: 'restroom', tier: 'lower', ringFraction: 0.35, angle: 110 },
  { type: 'restroom', tier: 'lower', ringFraction: 0.6, angle: 200 },
  { type: 'restroom', tier: 'lower', ringFraction: 0.85, angle: 290 },
  { type: 'food', tier: 'lower', ringFraction: 0.175, angle: 50 },
  { type: 'food', tier: 'lower', ringFraction: 0.425, angle: 140 },
  { type: 'food', tier: 'lower', ringFraction: 0.675, angle: 230 },
  { type: 'food', tier: 'lower', ringFraction: 0.925, angle: 320 },
  { type: 'first-aid', tier: 'lower', ringFraction: 0.275, angle: 90 },
  { type: 'first-aid', tier: 'lower', ringFraction: 0.775, angle: 270 },
  { type: 'accessible-seating', tier: 'lower', ringFraction: 0, angle: 5 },
  { type: 'accessible-seating', tier: 'lower', ringFraction: 0.475, angle: 175 },
  { type: 'merchandise', tier: 'lower', ringFraction: 0.225, angle: 80 },
  { type: 'merchandise', tier: 'lower', ringFraction: 0.725, angle: 260 },
  { type: 'guest-services', tier: 'lower', ringFraction: 0.05, angle: 15 },
  { type: 'guest-services', tier: 'lower', ringFraction: 0.55, angle: 195 },
  { type: 'water', tier: 'lower', ringFraction: 0.075, angle: 35 },
  { type: 'water', tier: 'lower', ringFraction: 0.175, angle: 65 },
  { type: 'water', tier: 'lower', ringFraction: 0.325, angle: 125 },
  { type: 'water', tier: 'lower', ringFraction: 0.425, angle: 155 },
  { type: 'water', tier: 'lower', ringFraction: 0.575, angle: 215 },
  { type: 'water', tier: 'lower', ringFraction: 0.675, angle: 245 },
  { type: 'water', tier: 'lower', ringFraction: 0.825, angle: 305 },
  { type: 'water', tier: 'lower', ringFraction: 0.925, angle: 335 },
  { type: 'prayer-room', tier: 'lower', ringFraction: 0.275, angle: 100 },
  { type: 'prayer-room', tier: 'lower', ringFraction: 0.775, angle: 280 },
  { type: 'family-reunification', tier: 'lower', ringFraction: 0.5, angle: 185 },
  { type: 'emergency-exit', tier: 'upper', ringFraction: 0, angle: 0 },
  { type: 'emergency-exit', tier: 'upper', ringFraction: 0.25, angle: 90 },
  { type: 'emergency-exit', tier: 'upper', ringFraction: 0.5, angle: 180 },
  { type: 'emergency-exit', tier: 'upper', ringFraction: 0.75, angle: 270 },
];
