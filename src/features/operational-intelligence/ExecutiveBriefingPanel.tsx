import { useCallback, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { ErrorState } from '../../components/ui/ErrorState';
import { InsightCard } from '../../components/ui/InsightCard';
import { LoadingRow } from '../../components/ui/LoadingRow';
import { useGemini } from '../../hooks/useGemini';
import { getOperationalIntelligenceSummary } from '../../services/gemini';
import type { KpiSnapshot } from '../../types/operational';

export interface ExecutiveBriefingPanelProps {
  kpis: KpiSnapshot[];
}

function BriefingResult({ kpis, onRefresh }: { kpis: KpiSnapshot[]; onRefresh: () => void }) {
  const fetcher = useCallback(() => getOperationalIntelligenceSummary(kpis), [kpis]);
  const { data, source, isLoading, error, refetch } = useGemini(fetcher);

  if (isLoading) {
    return <LoadingRow label="Writing executive briefing" theme="ops" />;
  }

  if (error !== null || data === null) {
    return (
      <div className="mt-3">
        <ErrorState
          message="The executive briefing could not be generated."
          onRetry={refetch}
          theme="ops"
          title="Briefing failed"
        />
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-3">
      {source === 'mock' ? (
        <span className="self-start">
          <DemoDataBadge theme="ops" />
        </span>
      ) : null}
      {/* AI response region per CLAUDE.md accessibility rules */}
      <p aria-live="polite" className="text-body-sm text-ops-body">
        {data.summary}
      </p>
      <InsightCard items={data.anomalies} title="Anomalies to act on" />
      <InsightCard items={data.trends} title="Trends to watch" />
      <Button className="self-start" onClick={onRefresh} size="sm">
        Re-brief with latest KPIs
      </Button>
    </div>
  );
}

/**
 * On-demand executive briefing: snapshots the KPI board at click time (the
 * 10-second feed ticks must not retrigger the AI call) and renders the
 * structured state-of-venue read.
 */
export function ExecutiveBriefingPanel({ kpis }: ExecutiveBriefingPanelProps) {
  const [snapshot, setSnapshot] = useState<KpiSnapshot[] | null>(null);

  return (
    <Card theme="ops">
      <h2 className="font-display text-h2 text-ops-ink">Executive briefing</h2>
      {snapshot === null ? (
        <div className="mt-3 flex flex-col items-start gap-3">
          <p className="text-body-sm text-ops-muted">
            An AI state-of-venue read over the live KPI board: anomalies to act on and trends to
            watch.
          </p>
          <Button onClick={() => setSnapshot(kpis)}>Generate briefing</Button>
        </div>
      ) : (
        <BriefingResult kpis={snapshot} onRefresh={() => setSnapshot([...kpis])} />
      )}
    </Card>
  );
}
