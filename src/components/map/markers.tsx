import type { KeyboardEvent } from 'react';
import { sectionNumber } from '../../services/data/stadiumLayout';
import type { Amenity, CompassPoint, Gate } from '../../types/stadium';
import { amenityPoint, gatePoint, MAP_CENTER } from './mapGeometry';
import { AMENITY_COLORS, AMENITY_GLYPHS } from './markerStyles';

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

/** Keyboard-focusable gate marker at its compass point (SPEC.md map rules). */
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
  /** True while this marker's detail popup is open. */
  expanded: boolean;
  onToggle: (amenityId: string) => void;
}

/**
 * Keyboard-focusable amenity marker on the concourse ring. Activating it
 * (click, Enter, or Space) toggles a detail popup rendered by StadiumMap.
 * The data-amenity-marker attribute lets the popup's click-outside dismissal
 * skip marker taps, so a second tap toggles closed instead of the popup
 * closing on pointerdown and instantly reopening on click.
 */
export function AmenityMarker({ amenity, expanded, onToggle }: AmenityMarkerProps) {
  const point = amenityPoint(amenity);
  const colors = AMENITY_COLORS[amenity.type];
  const activate = (): void => onToggle(amenity.id);
  const handleKeyDown = (event: KeyboardEvent<SVGCircleElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate();
    }
  };

  return (
    <g data-amenity-marker="true">
      {/* Invisible touch target behind the visible marker, radius set per
          breakpoint in index.css. Amenity markers cluster as close as 5°
          apart, so the ladder targets ≥24px (WCAG 2.5.8) instead of the 44px
          gates get — anything larger would swallow neighbouring markers and
          the section touch targets beneath. */}
      <circle
        aria-hidden="true"
        className="map-amenity-hit"
        cx={point.x}
        cy={point.y}
        fill="transparent"
        onClick={activate}
        r="20"
      />
      <circle
        aria-expanded={expanded}
        aria-haspopup="dialog"
        aria-label={`${amenity.label}, near section ${sectionNumber(amenity.sectionId)}`}
        className="map-focusable"
        cx={point.x}
        cy={point.y}
        data-amenity-id={amenity.id}
        fill={expanded ? colors.stroke : colors.fill}
        onClick={activate}
        onKeyDown={handleKeyDown}
        r="7.5"
        role="button"
        stroke={colors.stroke}
        strokeWidth="1.5"
        tabIndex={0}
      />
      <text
        aria-hidden="true"
        className="pointer-events-none select-none"
        dominantBaseline="central"
        fill={expanded ? '#FFFFFF' : colors.stroke}
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
