import { useEffect, useRef } from 'react';
import { amenityNearbySectionLabels } from '../../services/data/stadiumLayout';
import type { Amenity } from '../../types/stadium';
import { amenityPoint, MAP_CENTER, MAP_SIZE } from './mapGeometry';
import { AMENITY_COLORS } from './markerStyles';

export interface AmenityPopupProps {
  amenity: Amenity;
  /** Called when the fan dismisses the popup (Escape or a tap outside it). */
  onDismiss: () => void;
}

/**
 * Detail card for one amenity marker, absolutely positioned over the map SVG
 * at the marker's location and mounted only while open. Escape and
 * click-outside dismissal use document listeners registered here and removed
 * on unmount. Focus stays on the marker button (a disclosure with
 * aria-expanded) — the card holds no interactive content, so there is no
 * focus to trap or restore.
 */
export function AmenityPopup({ amenity, onDismiss }: AmenityPopupProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onDismiss();
        // Return focus to the marker so a keyboard user resumes exactly
        // where they opened the popup (a pointer dismissal below moves focus
        // to whatever was clicked, so only Escape restores it).
        const marker = document.querySelector(`[data-amenity-id="${amenity.id}"]`);
        if (marker instanceof SVGElement) {
          marker.focus();
        }
      }
    };
    const handlePointerDown = (event: PointerEvent): void => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      // Marker taps toggle the popup via their own onClick — dismissing on
      // their pointerdown too would close and instantly reopen it.
      if (cardRef.current?.contains(target) || target.closest('[data-amenity-marker]')) {
        return;
      }
      onDismiss();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [amenity.id, onDismiss]);

  const point = amenityPoint(amenity);
  // Markers in the top half of the bowl open their card downward (and vice
  // versa) so the card never extends past the map edge.
  const opensDownward = point.y < MAP_CENTER;

  return (
    <div
      aria-hidden={false}
      aria-label={`${amenity.label} details`}
      className="absolute z-10 w-44 rounded-xl border border-fan-border bg-fan-surface p-3 shadow-card"
      ref={cardRef}
      role="dialog"
      style={{
        left: `${(point.x / MAP_SIZE) * 100}%`,
        top: `${(point.y / MAP_SIZE) * 100}%`,
        transform: opensDownward ? 'translate(-50%, 14px)' : 'translate(-50%, calc(-100% - 14px))',
      }}
    >
      {/* Header takes the marker's stroke color (AA on white for all types),
          so the Emergency Exit card leads with the danger red — reinforced by
          the X glyph and the word itself, never color alone. */}
      <p
        className="font-display text-body-sm font-semibold"
        style={{ color: AMENITY_COLORS[amenity.type].stroke }}
      >
        {amenity.label}
      </p>
      <p className="mt-1 text-label text-fan-muted">{amenity.description}</p>
      <p className="mt-2 font-mono text-label text-pitch-deep">
        Near sections {amenityNearbySectionLabels(amenity).join(' · ')}
      </p>
    </div>
  );
}
