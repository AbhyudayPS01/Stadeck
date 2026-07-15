import { Card } from '../../components/ui/Card';
import { StatTile } from '../../components/ui/StatTile';
import { STADIUM_CAPACITY } from '../../config/constants';
import type { SustainabilityMetrics } from '../../types/sustainability';
import { estimateCrowdCarbonTonnes } from '../../utils/carbon';
import { formatCount } from '../../utils/format';
import { clamp } from '../../utils/numbers';

export interface SustainabilityDashboardProps {
  metrics: SustainabilityMetrics;
}

/**
 * The venue sustainability dashboard. The metrics feed is treated as
 * untrusted (SECURITY.md): percentages are clamped to 0-100 and volumes to
 * non-negative before render.
 */
export function SustainabilityDashboard({ metrics }: SustainabilityDashboardProps) {
  const wastePercent = clamp(metrics.wasteDivertedPercent, 0, 100);
  const energyPercent = clamp(metrics.renewableEnergyPercent, 0, 100);
  const transitPercent = clamp(metrics.transitModeSharePercent, 0, 100);
  const waterLiters = clamp(metrics.waterUsageLiters, 0, Number.MAX_SAFE_INTEGER);
  const offsetKg = clamp(metrics.carbonOffsetKg, 0, Number.MAX_SAFE_INTEGER);
  const crowdCarbonTonnes = estimateCrowdCarbonTonnes(STADIUM_CAPACITY, transitPercent);

  return (
    <Card>
      <div className="flex items-center gap-2.5">
        <h2 className="font-display text-h2 text-fan-ink">Venue dashboard</h2>
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 animate-blink rounded-pill bg-ok motion-reduce:animate-none"
        />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile caption="of matchday waste" label="Waste diverted" value={`${wastePercent}%`} />
        <StatTile
          caption="of current venue draw"
          label="Renewable energy"
          value={`${energyPercent}%`}
        />
        <StatTile caption="so far today" label="Water used" value={`${formatCount(waterLiters)} L`} />
        <StatTile
          caption="purchased for this match"
          label="Carbon offset"
          value={`${formatCount(offsetKg)} kg`}
        />
        <StatTile
          caption="fans arriving by rail, bus, or shuttle"
          label="Transit share"
          value={`${transitPercent}%`}
        />
        <StatTile
          caption={`est. travel footprint for ${formatCount(STADIUM_CAPACITY)} fans`}
          label="Crowd carbon"
          value={`~${formatCount(crowdCarbonTonnes)} t`}
        />
      </div>
    </Card>
  );
}
