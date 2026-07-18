import { useCallback, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { ErrorState } from '../../components/ui/ErrorState';
import { InsightCard } from '../../components/ui/InsightCard';
import { LoadingRow } from '../../components/ui/LoadingRow';
import { useGemini } from '../../hooks/useGemini';
import { useUiStrings } from '../../hooks/useUiStrings';
import { getOperationalIntelligenceSummary } from '../../services/gemini';
import type { KpiSnapshot } from '../../types/operational';
import type { Venue } from '../../types/venue';

export interface ExecutiveBriefingPanelProps {
  kpis: KpiSnapshot[];
  venue: Venue;
}

function BriefingResult({
  kpis,
  venue,
  onRefresh,
}: {
  kpis: KpiSnapshot[];
  venue: Venue;
  onRefresh: () => void;
}) {
  const fetcher = useCallback(
    () => getOperationalIntelligenceSummary(kpis, venue),
    [kpis, venue],
  );
  const { data, source, mockReason, isLoading, error, refetch } = useGemini(fetcher);
  const strings = useUiStrings();

  if (isLoading) {
    return <LoadingRow label={strings['oi.writingBriefing']} theme="ops" />;
  }

  if (error !== null || data === null) {
    return (
      <div className="mt-3">
        <ErrorState
          message={strings['oi.briefingFailed']}
          onRetry={refetch}
          theme="ops"
          title={strings['oi.briefingFailedTitle']}
        />
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-3">
      {source === 'mock' ? (
        <span className="self-start">
          <DemoDataBadge reason={mockReason ?? undefined} theme="ops" />
        </span>
      ) : null}
      {/* AI response region per SPEC.md accessibility rules */}
      <p aria-live="polite" className="text-body-sm text-ops-body">
        {data.summary}
      </p>
      <InsightCard items={data.anomalies} title={strings['oi.anomalies']} />
      <InsightCard items={data.trends} title={strings['oi.trends']} />
      <Button className="self-start" onClick={onRefresh} size="sm">
        {strings['oi.rebrief']}
      </Button>
    </div>
  );
}

/**
 * On-demand executive briefing: snapshots the KPI board at click time (the
 * 10-second feed ticks must not retrigger the AI call) and renders the
 * structured state-of-venue read.
 */
export function ExecutiveBriefingPanel({ kpis, venue }: ExecutiveBriefingPanelProps) {
  const strings = useUiStrings();
  const [snapshot, setSnapshot] = useState<KpiSnapshot[] | null>(null);

  return (
    <Card theme="ops">
      <h2 className="font-display text-h2 text-ops-ink">{strings['oi.executiveBriefing']}</h2>
      {snapshot === null ? (
        <div className="mt-3 flex flex-col items-start gap-3">
          <p className="text-body-sm text-ops-muted">{strings['oi.briefingIntro']}</p>
          <Button onClick={() => setSnapshot(kpis)}>{strings['action.generateBriefing']}</Button>
        </div>
      ) : (
        <BriefingResult kpis={snapshot} onRefresh={() => setSnapshot([...kpis])} venue={venue} />
      )}
    </Card>
  );
}
