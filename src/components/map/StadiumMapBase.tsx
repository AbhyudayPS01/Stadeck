import { memo, type KeyboardEvent } from 'react';
import { TIER_NAMES } from '../../services/data/stadiumLayout';
import type { SectionTier, StadiumSection, VenueLayout } from '../../types/stadium';
import { cx } from '../../utils/cx';
import { sectionHitPath, sectionLabelPoint, sectionLabelVisibility, sectionPath } from './mapGeometry';
import { AmenityMarker, GateMarker, PitchField } from './markers';

const TIER_FILLS: Record<SectionTier, string> = {
  lower: '#E7F5EC',
  club: '#FDF3E1',
  upper: '#F0EEE6',
};

export interface SectionShapeProps {
  section: StadiumSection;
  selected: boolean;
  onSelect?: (sectionId: string) => void;
}

/** One keyboard-focusable seating section with its number label. */
export function SectionShape({ section, selected, onSelect }: SectionShapeProps) {
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

export interface StadiumMapBaseProps {
  layout: VenueLayout;
  selectedSectionId: string | null;
  openAmenityId: string | null;
  onSelectSection?: (sectionId: string) => void;
  onSelectGate?: (gateId: string) => void;
  onToggleAmenity: (amenityId: string) => void;
}

/**
 * The base map: pitch, section arcs, amenities, gates — all derived from a
 * venue's generated layout, never hand-drawn. Memoized so overlay updates
 * (which change on every simulated tick) never re-render these ~200 computed
 * SVG nodes; only a selection, amenity-popup, handler, or venue change does —
 * `layout` is a stable object per venue (see getVenueLayout), so switching
 * back to an already-visited venue reuses the same reference too.
 */
export const StadiumMapBase = memo(function StadiumMapBase({
  layout,
  selectedSectionId,
  openAmenityId,
  onSelectSection,
  onSelectGate,
  onToggleAmenity,
}: StadiumMapBaseProps) {
  return (
    <>
      <PitchField />
      {layout.sections.map((section) => (
        <SectionShape
          key={section.id}
          onSelect={onSelectSection}
          section={section}
          selected={section.id === selectedSectionId}
        />
      ))}
      {layout.amenities.map((amenity) => (
        <AmenityMarker
          key={amenity.id}
          amenity={amenity}
          expanded={amenity.id === openAmenityId}
          onToggle={onToggleAmenity}
        />
      ))}
      {layout.gates.map((gate) => (
        <GateMarker key={gate.id} gate={gate} onSelect={onSelectGate} />
      ))}
    </>
  );
});
