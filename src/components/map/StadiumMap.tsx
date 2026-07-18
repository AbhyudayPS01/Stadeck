import { memo, useCallback, useEffect, useState, type KeyboardEvent, type ReactNode } from 'react';
import { getVenueLayout, TIER_NAMES } from '../../services/data/stadiumLayout';
import { DEFAULT_VENUE } from '../../services/data/venues';
import type { SectionTier, StadiumSection, VenueLayout } from '../../types/stadium';
import type { Venue } from '../../types/venue';
import { cx } from '../../utils/cx';
import { AmenityPopup } from './AmenityPopup';
import {
  MAP_SIZE,
  sectionHitPath,
  sectionLabelPoint,
  sectionLabelVisibility,
  sectionPath,
} from './mapGeometry';
import { AmenityMarker, GateMarker, PitchField } from './markers';

export interface StadiumMapProps {
  /** Venue whose generated layout to render; defaults to the demo venue. */
  venue?: Venue;
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
const StadiumMapBase = memo(function StadiumMapBase({
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

/**
 * Clean schematic map of the active venue: concentric ring layout with
 * labeled section blocks, Gates A–H at compass points, and amenity markers
 * that open a detail popup. Every section, gate, and amenity is
 * keyboard-focusable with an accessible name (CLAUDE.md stadium map rules).
 */
export function StadiumMap({
  venue = DEFAULT_VENUE,
  overlays,
  selectedSectionId = null,
  onSelectSection,
  onSelectGate,
  className,
}: StadiumMapProps) {
  const [openAmenityId, setOpenAmenityId] = useState<string | null>(null);
  const layout = getVenueLayout(venue.id);
  // Amenity ids are shared across venues (same plan, different anchors), so
  // an open popup would otherwise silently re-anchor to the new venue's
  // section instead of closing — close it so a venue switch never leaves an
  // amenity detail open behind the fan's back.
  useEffect(() => {
    setOpenAmenityId(null);
  }, [venue]);
  // Stable identities: both handlers reach StadiumMapBase, so a new function
  // per render would defeat its memo and redraw all ~200 base SVG nodes.
  const toggleAmenity = useCallback((amenityId: string): void => {
    setOpenAmenityId((current) => (current === amenityId ? null : amenityId));
  }, []);
  const dismissAmenity = useCallback((): void => {
    setOpenAmenityId(null);
  }, []);
  const openAmenity = layout.amenities.find((amenity) => amenity.id === openAmenityId);

  return (
    <div className={cx('relative', className)}>
      <svg
        aria-label={`Schematic seating map of ${venue.name}`}
        className="h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
        role="group"
        viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}
      >
        <StadiumMapBase
          layout={layout}
          onSelectGate={onSelectGate}
          onSelectSection={onSelectSection}
          onToggleAmenity={toggleAmenity}
          openAmenityId={openAmenityId}
          selectedSectionId={selectedSectionId}
        />
        {overlays ? <g className="pointer-events-none">{overlays}</g> : null}
      </svg>
      {openAmenity ? <AmenityPopup amenity={openAmenity} onDismiss={dismissAmenity} /> : null}
    </div>
  );
}
