import { memo, type KeyboardEvent, type ReactNode } from 'react';
import { STADIUM_NAME } from '../../config/constants';
import { AMENITIES, GATES, SECTIONS, TIER_NAMES } from '../../services/data/stadiumLayout';
import type { SectionTier, StadiumSection } from '../../types/stadium';
import { cx } from '../../utils/cx';
import {
  MAP_SIZE,
  sectionHitPath,
  sectionLabelPoint,
  sectionLabelVisibility,
  sectionPath,
} from './mapGeometry';
import { AmenityMarker, GateMarker, PitchField } from './markers';

export interface StadiumMapProps {
  /**
   * Overlay layers (density heatmaps, routes, alert rings) rendered in a
   * group above the base map. Position overlay elements with the helpers in
   * mapGeometry.ts; the group is pointer-transparent so the base stays
   * clickable, and purely visual overlays should be aria-hidden.
   */
  overlays?: ReactNode;
  /** Highlighted section, e.g. the fan's seat block. */
  selectedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
  onSelectGate?: (gateId: string) => void;
  className?: string;
}

const TIER_FILLS: Record<SectionTier, string> = {
  lower: '#E7F5EC',
  club: '#FDF3E1',
  upper: '#F0EEE6',
};

interface SectionShapeProps {
  section: StadiumSection;
  selected: boolean;
  onSelect?: (sectionId: string) => void;
}

/** One keyboard-focusable seating section with its number label. */
function SectionShape({ section, selected, onSelect }: SectionShapeProps) {
  const labelPoint = sectionLabelPoint(section);
  const labelVisibility = sectionLabelVisibility(section);
  const activate = (): void => onSelect?.(section.id);
  const handleKeyDown = (event: KeyboardEvent<SVGPathElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate();
    }
  };

  return (
    <g>
      <path
        aria-label={`Section ${section.label}, ${TIER_NAMES[section.tier]}`}
        aria-pressed={selected}
        className="map-focusable"
        d={sectionPath(section)}
        fill={selected ? '#1B8A4A' : TIER_FILLS[section.tier]}
        onClick={activate}
        onKeyDown={handleKeyDown}
        role="button"
        stroke="#E4E1D6"
        strokeWidth="1"
        tabIndex={0}
      />
      {/* Invisible expanded touch target (see HIT_RINGS) — the visible wedge
          stays the keyboard/AT surface; this only widens where a tap lands. */}
      <path
        aria-hidden="true"
        className="map-section-hit"
        d={sectionHitPath(section)}
        fill="transparent"
        onClick={activate}
      />
      {labelVisibility === 'never' ? null : (
        <text
          aria-hidden="true"
          className={cx(
            'map-section-label pointer-events-none select-none',
            labelVisibility === 'wide' && 'map-label-wide',
          )}
          dominantBaseline="central"
          fill={selected ? '#FFFFFF' : '#5B6472'}
          fontFamily="JetBrains Mono, monospace"
          fontWeight="700"
          textAnchor="middle"
          x={labelPoint.x}
          y={labelPoint.y}
        >
          {section.label}
        </text>
      )}
    </g>
  );
}

interface StadiumMapBaseProps {
  selectedSectionId: string | null;
  onSelectSection?: (sectionId: string) => void;
  onSelectGate?: (gateId: string) => void;
}

/**
 * The base map: pitch, 96 section arcs, amenities, gates — all derived from
 * the typed stadiumLayout config, never hand-drawn. Memoized so overlay
 * updates (which change on every simulated tick) never re-render these ~200
 * computed SVG nodes; only selection or handler changes do.
 */
const StadiumMapBase = memo(function StadiumMapBase({
  selectedSectionId,
  onSelectSection,
  onSelectGate,
}: StadiumMapBaseProps) {
  return (
    <>
      <PitchField />
      {SECTIONS.map((section) => (
        <SectionShape
          key={section.id}
          onSelect={onSelectSection}
          section={section}
          selected={section.id === selectedSectionId}
        />
      ))}
      {AMENITIES.map((amenity) => (
        <AmenityMarker key={amenity.id} amenity={amenity} />
      ))}
      {GATES.map((gate) => (
        <GateMarker key={gate.id} gate={gate} onSelect={onSelectGate} />
      ))}
    </>
  );
});

/**
 * Clean schematic map of the demo venue: concentric ring layout with labeled
 * section blocks (101–140 lower, 201–216 club, 301–340 upper), Gates A–H at
 * compass points, and amenity markers. Every section and gate is
 * keyboard-focusable with an accessible name (CLAUDE.md stadium map rules).
 */
export function StadiumMap({
  overlays,
  selectedSectionId = null,
  onSelectSection,
  onSelectGate,
  className,
}: StadiumMapProps) {
  return (
    <svg
      aria-label={`Schematic seating map of ${STADIUM_NAME}`}
      className={cx('h-auto w-full', className)}
      preserveAspectRatio="xMidYMid meet"
      role="group"
      viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}
    >
      <StadiumMapBase
        onSelectGate={onSelectGate}
        onSelectSection={onSelectSection}
        selectedSectionId={selectedSectionId}
      />
      {overlays ? <g className="pointer-events-none">{overlays}</g> : null}
    </svg>
  );
}
