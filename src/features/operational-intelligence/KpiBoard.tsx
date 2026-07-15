import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { StatTile } from '../../components/ui/StatTile';
import type { KpiSeverity, KpiSnapshot, KpiTrend } from '../../types/operational';
import { formatCount } from '../../utils/format';
import { clamp } from '../../utils/numbers';

export interface KpiBoardProps {
  kpis: KpiSnapshot[];
}

/** Trend words pair with the arrows so direction is never symbol-only. */
const TREND_WORDS: Record<KpiTrend, string> = {
  up: '▲ rising',
  down: '▼ falling',
  flat: '→ steady',
};

const SEVERITY_WORDS: Record<KpiSeverity, string> = {
  normal: 'ok',
  elevated: 'watch',
  critical: 'critical',
  info: 'info',
};

/** Live organizer KPI board, refreshed by the simulated operations feed. */
export function KpiBoard({ kpis }: KpiBoardProps) {
  return (
    <Card theme="ops">
      <div className="flex items-center gap-2.5">
        <h2 className="font-display text-h2 text-ops-ink">Venue KPIs</h2>
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 animate-blink rounded-pill bg-ok motion-reduce:animate-none"
        />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <StatTile
            key={kpi.id}
            adornment={
              <Badge severity={kpi.severity} theme="ops">
                {SEVERITY_WORDS[kpi.severity]}
              </Badge>
            }
            caption={`${kpi.unit} · ${TREND_WORDS[kpi.trend]}`}
            label={kpi.label}
            theme="ops"
            // The feed is treated as untrusted — values are bounded before render (SECURITY.md).
            value={formatCount(clamp(kpi.value, 0, Number.MAX_SAFE_INTEGER))}
          />
        ))}
      </div>
    </Card>
  );
}
