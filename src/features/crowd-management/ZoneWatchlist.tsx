import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { CROWD_WATCHLIST_COUNT } from '../../config/constants';
import { findZoneLabel } from '../../services/data/stadiumLayout';
import type { DensityReading } from '../../types/crowd';

interface ZoneWatchlistProps {
  readings: DensityReading[];
}

/**
 * The busiest zones from the live sensor sweep as text — badge word + zone
 * label + occupancy — so the heatmap's meaning never depends on color alone.
 */
export function ZoneWatchlist({ readings }: ZoneWatchlistProps) {
  const busiest = [...readings]
    .sort((a, b) => b.percentOfCapacity - a.percentOfCapacity)
    .slice(0, CROWD_WATCHLIST_COUNT);
  const criticalCount = readings.filter((reading) => reading.level === 'critical').length;
  const elevatedCount = readings.filter((reading) => reading.level === 'elevated').length;

  return (
    <Card theme="ops">
      <h2 className="font-display text-h2 text-ops-ink">Busiest zones</h2>
      <p className="mt-1.5 text-body-sm text-ops-muted">
        {criticalCount} critical · {elevatedCount} elevated ·{' '}
        {readings.length - criticalCount - elevatedCount} normal of {readings.length} zones
      </p>
      {busiest.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            message="Sensor readings will appear here as soon as the sweep starts."
            showMascot={false}
            theme="ops"
            title="No readings yet"
          />
        </div>
      ) : (
        <ul aria-label="Busiest zones" className="mt-4 flex flex-col">
          {busiest.map((reading) => (
            <li
              key={reading.zoneId}
              className="flex items-center justify-between gap-3 border-b border-ops-border py-2.5 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center gap-2.5">
                <Badge severity={reading.level} theme="ops">
                  {reading.level}
                </Badge>
                <span className="text-body-sm text-ops-body">{findZoneLabel(reading.zoneId)}</span>
              </div>
              <span className="font-mono text-body-sm font-bold text-ops-ink">
                {reading.percentOfCapacity}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
