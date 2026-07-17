import { Badge } from '../../components/ui/Badge';
import { useUiStrings } from '../../hooks/useUiStrings';
import { Card } from '../../components/ui/Card';
import { StatTile } from '../../components/ui/StatTile';
import type { KpiSeverity, KpiSnapshot, KpiTrend } from '../../types/operational';
import { formatCount } from '../../utils/format';
import { clamp } from '../../utils/numbers';

export interface KpiBoardProps {
  kpis: KpiSnapshot[];
}

/** Trend words pair with the arrows so direction is never symbol-only. */
const TREND_KEYS = {
  up: 'oi.rising',
  down: 'oi.falling',
  flat: 'oi.steady',
} as const satisfies Record<KpiTrend, string>;

const SEVERITY_KEYS = {
  normal: 'oi.kpiOk',
  elevated: 'oi.kpiWatch',
  critical: 'oi.kpiCritical',
  info: 'oi.kpiInfo',
} as const satisfies Record<KpiSeverity, string>;

/** Live organizer KPI board, refreshed by the simulated operations feed. */
export function KpiBoard({ kpis }: KpiBoardProps) {
  const strings = useUiStrings();
  return (
    <Card theme="ops">
      <div className="flex items-center gap-2.5">
        <h2 className="font-display text-h2 text-ops-ink">{strings['oi.venueKpis']}</h2>
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
                {strings[SEVERITY_KEYS[kpi.severity]]}
              </Badge>
            }
            caption={`${kpi.unit} · ${strings[TREND_KEYS[kpi.trend]]}`}
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
