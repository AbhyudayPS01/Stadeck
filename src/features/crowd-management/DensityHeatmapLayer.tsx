import { gatePoint, sectionPath } from '../../components/map/mapGeometry';
import { GATES, SECTIONS } from '../../services/data/stadiumLayout';
import type { DensityReading } from '../../types/crowd';

const SECTION_BY_ID = new Map(SECTIONS.map((section) => [section.id, section]));
const GATE_BY_ID = new Map(GATES.map((gate) => [gate.id, gate]));

/** Elevated zones get a translucent gold wash. */
const ELEVATED_FILL = 'rgba(232,169,59,0.55)';

/** Labeled swatches for every heatmap treatment — the non-color channel for the map. */
export function HeatmapLegend() {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
      <li className="flex items-center gap-2 text-label text-ops-muted">
        <svg aria-hidden="true" height="14" width="14">
          <rect fill="#E7F5EC" height="13" stroke="#B7C2D6" width="13" x="0.5" y="0.5" />
        </svg>
        Normal — base color
      </li>
      <li className="flex items-center gap-2 text-label text-ops-muted">
        <svg aria-hidden="true" height="14" width="14">
          <rect fill={ELEVATED_FILL} height="13" stroke="#E8A93B" width="13" x="0.5" y="0.5" />
        </svg>
        Elevated — gold wash, dashed gate ring
      </li>
      <li className="flex items-center gap-2 text-label text-ops-muted">
        <svg aria-hidden="true" height="14" width="14">
          <defs>
            <pattern
              height="6"
              id="legend-critical-hatch"
              patternTransform="rotate(45)"
              patternUnits="userSpaceOnUse"
              width="6"
            >
              <rect fill="rgba(255,107,94,0.55)" height="6" width="6" />
              <line stroke="rgba(176,36,26,0.85)" strokeWidth="2.25" x1="1" x2="1" y1="0" y2="6" />
            </pattern>
          </defs>
          <rect
            fill="url(#legend-critical-hatch)"
            height="13"
            stroke="#FF6B5E"
            width="13"
            x="0.5"
            y="0.5"
          />
        </svg>
        Critical — hatch pattern, pulsing gate ring
      </li>
    </ul>
  );
}

/**
 * Density heatmap rendered through StadiumMap's overlay slot, so live sensor
 * ticks never re-render the memoized base map. Decorative by design
 * (aria-hidden): the ZoneWatchlist next to the map carries the same data as
 * text. Critical zones get a hatch pattern on top of the red wash, and the
 * legend labels every treatment — meaning is never color-only.
 */
export function DensityHeatmapLayer({ readings }: { readings: DensityReading[] }) {
  const hotReadings = readings.filter((reading) => reading.level !== 'normal');

  return (
    <g aria-hidden="true">
      <defs>
        <pattern
          height="6"
          id="density-critical-hatch"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
          width="6"
        >
          <rect fill="rgba(255,107,94,0.55)" height="6" width="6" />
          <line stroke="rgba(176,36,26,0.85)" strokeWidth="2.25" x1="1" x2="1" y1="0" y2="6" />
        </pattern>
      </defs>
      {hotReadings.map((reading) => {
        const section = SECTION_BY_ID.get(reading.zoneId);
        if (section) {
          return (
            <path
              key={reading.zoneId}
              d={sectionPath(section)}
              fill={reading.level === 'critical' ? 'url(#density-critical-hatch)' : ELEVATED_FILL}
            />
          );
        }

        const gate = GATE_BY_ID.get(reading.zoneId);
        if (!gate) {
          return null; // sensor zone with no map geometry — nothing to paint
        }
        const point = gatePoint(gate);
        return (
          <g key={reading.zoneId}>
            <circle
              cx={point.x}
              cy={point.y}
              fill="none"
              r="16"
              stroke={reading.level === 'critical' ? '#FF6B5E' : '#E8A93B'}
              strokeDasharray={reading.level === 'critical' ? undefined : '4 3'}
              strokeWidth="3"
            />
            {reading.level === 'critical' ? (
              <circle
                className="map-pulse animate-pulse-ring motion-reduce:animate-none"
                cx={point.x}
                cy={point.y}
                fill="none"
                r="16"
                stroke="#FF6B5E"
                strokeWidth="2"
              />
            ) : null}
          </g>
        );
      })}
    </g>
  );
}
