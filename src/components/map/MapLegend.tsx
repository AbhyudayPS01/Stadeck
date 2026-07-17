import { AMENITY_LABELS } from '../../services/data/stadiumLayout';
import type { AmenityType } from '../../types/stadium';
import { cx } from '../../utils/cx';
import { AMENITY_COLORS, AMENITY_GLYPHS } from './markerStyles';

/** Swatch order: everyday amenities first, safety markers last. */
const LEGEND_ORDER: readonly AmenityType[] = [
  'restroom',
  'food',
  'water',
  'merchandise',
  'guest-services',
  'prayer-room',
  'accessible-seating',
  'first-aid',
  'family-reunification',
  'emergency-exit',
];

export interface MapLegendProps {
  /** Match the theme of the surrounding Card; defaults to the light fan theme. */
  theme?: 'fan' | 'ops';
}

/**
 * Labeled swatches for every amenity marker glyph on the stadium map — the
 * non-color channel DESIGN.md requires ("no color-only meaning"): each entry
 * pairs the marker's glyph and palette with its text label, so the blue W
 * and red X are readable without color perception.
 */
export function MapLegend({ theme = 'fan' }: MapLegendProps) {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
      {LEGEND_ORDER.map((type) => {
        const colors = AMENITY_COLORS[type];
        return (
          <li
            key={type}
            className={cx(
              'flex items-center gap-1.5 text-label',
              theme === 'ops' ? 'text-ops-muted' : 'text-fan-muted',
            )}
          >
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
              <circle
                cx="8"
                cy="8"
                fill={colors.fill}
                r="7"
                stroke={colors.stroke}
                strokeWidth="1.5"
              />
              <text
                dominantBaseline="central"
                fill={colors.stroke}
                fontFamily="JetBrains Mono, monospace"
                fontSize="8.5"
                fontWeight="700"
                textAnchor="middle"
                x="8"
                y="8"
              >
                {AMENITY_GLYPHS[type]}
              </text>
            </svg>
            {AMENITY_LABELS[type]}
          </li>
        );
      })}
    </ul>
  );
}
