/** Seating tier, used for both capacity planning and map ring placement. */
export type SectionTier = 'lower' | 'club' | 'upper';

/** One labeled seating block on the schematic stadium map. */
export interface StadiumSection {
  id: string;
  label: string;
  tier: SectionTier;
  capacity: number;
  /** Degrees, 0 = North, clockwise — where this section sits on the concentric ring layout. */
  angleStart: number;
  angleEnd: number;
}

export type CompassPoint = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

/** One of the eight venue entry points, placed at a compass point on the map. */
export interface Gate {
  id: string;
  label: string;
  compassPoint: CompassPoint;
  /** Degrees, 0 = North, clockwise. */
  angle: number;
}

export type AmenityType =
  | 'restroom'
  | 'food'
  | 'first-aid'
  | 'accessible-seating'
  | 'merchandise'
  | 'guest-services';

/** A fixed venue amenity marker, anchored near a section on the map. */
export interface Amenity {
  id: string;
  type: AmenityType;
  label: string;
  /** One-line fan-facing description, shown in the map's amenity popup. */
  description: string;
  sectionId: string;
  /** Degrees, 0 = North, clockwise. */
  angle: number;
}
