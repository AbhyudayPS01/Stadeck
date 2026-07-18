import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { getVenueLayout } from '../../services/data/stadiumLayout';
import { DEFAULT_VENUE } from '../../services/data/venues';
import type { Venue } from '../../types/venue';
import { cx } from '../../utils/cx';
import { AmenityPopup } from './AmenityPopup';
import { MAP_SIZE } from './mapGeometry';

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

import { StadiumMapBase } from './StadiumMapBase';

/**
 * Clean schematic map of the active venue: concentric ring layout with
 * labeled section blocks, Gates A–H at compass points, and amenity markers
 * that open a detail popup. Every section, gate, and amenity is
 * keyboard-focusable with an accessible name (SPEC.md stadium map rules).
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
