import { Card } from '../../components/ui/Card';
import { StatTile } from '../../components/ui/StatTile';
import { STADIUM_CAPACITY } from '../../config/constants';
import { useUiStrings } from '../../hooks/useUiStrings';
import type { SustainabilityMetrics } from '../../types/sustainability';
import { estimateCrowdCarbonTonnes } from '../../utils/carbon';
import { formatCount } from '../../utils/format';
import { clamp } from '../../utils/numbers';
import { formatUiString } from '../../utils/uiText';

export interface SustainabilityDashboardProps {
  metrics: SustainabilityMetrics;
}

/**
 * The venue sustainability dashboard. The metrics feed is treated as
 * untrusted (SECURITY.md): percentages are clamped to 0-100 and volumes to
 * non-negative before render.
 */
export function SustainabilityDashboard({ metrics }: SustainabilityDashboardProps) {
  const strings = useUiStrings();
  const wastePercent = clamp(metrics.wasteDivertedPercent, 0, 100);
  const energyPercent = clamp(metrics.renewableEnergyPercent, 0, 100);
  const transitPercent = clamp(metrics.transitModeSharePercent, 0, 100);
  const waterLiters = clamp(metrics.waterUsageLiters, 0, Number.MAX_SAFE_INTEGER);
  const offsetKg = clamp(metrics.carbonOffsetKg, 0, Number.MAX_SAFE_INTEGER);
  const crowdCarbonTonnes = estimateCrowdCarbonTonnes(STADIUM_CAPACITY, transitPercent);

  return (
    <Card>
      <div className="flex items-center gap-2.5">
        <h2 className="font-display text-h2 text-fan-ink">
          {strings['sustainability.venueDashboard']}
        </h2>
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 animate-blink rounded-pill bg-ok motion-reduce:animate-none"
        />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile
          caption={strings['sustainability.wasteCaption']}
          label={strings['sustainability.wasteDiverted']}
          value={`${wastePercent}%`}
        />
        <StatTile
          caption={strings['sustainability.renewableCaption']}
          label={strings['sustainability.renewableEnergy']}
          value={`${energyPercent}%`}
        />
        <StatTile
          caption={strings['sustainability.waterCaption']}
          label={strings['sustainability.waterUsed']}
          value={`${formatCount(waterLiters)} L`}
        />
        <StatTile
          caption={strings['sustainability.carbonCaption']}
          label={strings['sustainability.carbonOffset']}
          value={`${formatCount(offsetKg)} kg`}
        />
        <StatTile
          caption={strings['sustainability.transitCaption']}
          label={strings['sustainability.transitShare']}
          value={`${transitPercent}%`}
        />
        <StatTile
          caption={formatUiString(strings['sustainability.crowdCarbonCaption'], {
            count: formatCount(STADIUM_CAPACITY),
          })}
          label={strings['sustainability.crowdCarbon']}
          value={`~${formatCount(crowdCarbonTonnes)} t`}
        />
      </div>
    </Card>
  );
}
