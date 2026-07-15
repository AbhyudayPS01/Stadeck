import type { KeyboardEvent } from 'react';
import { sectionNumber } from '../../services/data/stadiumLayout';
import type { Amenity, AmenityType, CompassPoint, Gate } from '../../types/stadium';
import { amenityPoint, gatePoint, MAP_CENTER } from './mapGeometry';

/** Full compass names for gate accessible labels. */
const COMPASS_NAMES: Record<CompassPoint, string> = {
  N: 'north',
  NE: 'northeast',
  E: 'east',
  SE: 'southeast',
  S: 'south',
  SW: 'southwest',
  W: 'west',
  NW: 'northwest',
};

/** Single-letter marker glyphs; the accessible name carries the full label. */
const AMENITY_GLYPHS: Record<AmenityType, string> = {
  restroom: 'R',
  food: 'C',
  'first-aid': '+',
  'accessible-seating': 'A',
  merchandise: 'M',
  'guest-services': 'i',
};

/** The schematic pitch at the center of the map (decorative). */
export function PitchField() {
  return (
    <g aria-hidden="true">
      <rect fill="#1B8A4A" height="96" rx="8" width="150" x={MAP_CENTER - 75} y={MAP_CENTER - 48} />
      <line
        stroke="#E7F5EC"
        strokeWidth="1.5"
        x1={MAP_CENTER}
        x2={MAP_CENTER}
        y1={MAP_CENTER - 48}
        y2={MAP_CENTER + 48}
      />
      <circle
        cx={MAP_CENTER}
        cy={MAP_CENTER}
        fill="none"
        r="14"
        stroke="#E7F5EC"
        strokeWidth="1.5"
      />
    </g>
  );
}

interface GateMarkerProps {
  gate: Gate;
  onSelect?: (gateId: string) => void;
}

/** Keyboard-focusable gate marker at its compass point (CLAUDE.md map rules). */
export function GateMarker({ gate, onSelect }: GateMarkerProps) {
  const point = gatePoint(gate);
  const activate = (): void => onSelect?.(gate.id);
  const handleKeyDown = (event: KeyboardEvent<SVGCircleElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate();
    }
  };

  return (
    <g>
      {/* Invisible touch target behind the visible marker — its radius is set
          per breakpoint in index.css so the effective hit area stays ≥44px on
          touch screens. The visible circle remains the keyboard/AT surface. */}
      <circle
        aria-hidden="true"
        className="map-gate-hit"
        cx={point.x}
        cy={point.y}
        fill="transparent"
        onClick={activate}
        r="24"
      />
      <circle
        aria-label={`${gate.label}, ${COMPASS_NAMES[gate.compassPoint]} entrance`}
        className="map-focusable map-gate-ring"
        cx={point.x}
        cy={point.y}
        fill="#106634"
        onClick={activate}
        onKeyDown={handleKeyDown}
        r="13"
        role="button"
        stroke="#0C4F28"
        strokeWidth="1.5"
        tabIndex={0}
      />
      <text
        aria-hidden="true"
        className="map-gate-label pointer-events-none select-none"
        dominantBaseline="central"
        fill="#FFFFFF"
        fontFamily="JetBrains Mono, monospace"
        fontSize="12"
        fontWeight="700"
        textAnchor="middle"
        x={point.x}
        y={point.y}
      >
        {gate.label.replace('Gate ', '')}
      </text>
    </g>
  );
}

interface AmenityMarkerProps {
  amenity: Amenity;
}

/**
 * Amenity marker on the concourse ring; named for assistive tech, not a tab
 * stop. Pointer-transparent so a fingertip landing on the tiny glyph falls
 * through to the section touch target beneath it.
 */
export function AmenityMarker({ amenity }: AmenityMarkerProps) {
  const point = amenityPoint(amenity);

  return (
    <g
      aria-label={`${amenity.label}, near section ${sectionNumber(amenity.sectionId)}`}
      className="pointer-events-none"
      role="img"
    >
      <circle cx={point.x} cy={point.y} fill="#FFFFFF" r="7.5" stroke="#106634" strokeWidth="1.5" />
      <text
        aria-hidden="true"
        className="pointer-events-none select-none"
        dominantBaseline="central"
        fill="#106634"
        fontFamily="JetBrains Mono, monospace"
        fontSize="9"
        fontWeight="700"
        textAnchor="middle"
        x={point.x}
        y={point.y}
      >
        {AMENITY_GLYPHS[amenity.type]}
      </text>
    </g>
  );
}
