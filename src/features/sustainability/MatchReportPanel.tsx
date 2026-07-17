import { useCallback, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingRow } from '../../components/ui/LoadingRow';
import { StepList } from '../../components/ui/StepList';
import { useGemini } from '../../hooks/useGemini';
import { getSustainabilityReport } from '../../services/gemini';
import type { SustainabilityMetrics } from '../../types/sustainability';

export interface MatchReportPanelProps {
  metrics: SustainabilityMetrics;
}

interface ReportListProps {
  title: string;
  items: string[];
}

function ReportList({ title, items }: ReportListProps) {
  return (
    <section>
      <h3 className="font-display text-h3 text-fan-ink">{title}</h3>
      <StepList items={items} />
    </section>
  );
}

function ReportResult({ metrics }: MatchReportPanelProps) {
  const fetcher = useCallback(() => getSustainabilityReport(metrics), [metrics]);
  const { data, source, mockReason, isLoading, error, refetch } = useGemini(fetcher);

  if (isLoading) {
    return <LoadingRow label="Writing match report" />;
  }

  if (error !== null || data === null) {
    return (
      <ErrorState
        message="The sustainability match report could not be generated."
        onRetry={refetch}
        title="Report unavailable"
      />
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-3">
      {source === 'mock' ? (
        <span className="self-start">
          <DemoDataBadge reason={mockReason ?? undefined} />
        </span>
      ) : null}
      {/* AI response region per CLAUDE.md accessibility rules */}
      <div aria-live="polite" className="flex flex-col gap-3">
        <p className="rounded-md bg-pitch-tint px-3 py-2 text-body-sm font-semibold text-pitch-darker">
          {data.headline}
        </p>
        <ReportList items={data.highlights} title="Highlights" />
        <ReportList items={data.recommendations} title="For the next match" />
      </div>
    </div>
  );
}

/**
 * Organizer-only sustainability match report over a metrics snapshot — the
 * screen renders this panel only for the organizer role.
 */
export function MatchReportPanel({ metrics }: MatchReportPanelProps) {
  const [snapshot, setSnapshot] = useState<SustainabilityMetrics | null>(null);

  return (
    <Card accent="steel">
      <h2 className="font-display text-h2 text-fan-ink">Match report</h2>
      {snapshot === null ? (
        <div className="mt-3 flex flex-col items-start gap-3">
          <p className="text-body-sm text-fan-muted">
            An AI report for organizers: headline verdict, highlights, and what to improve for the
            next match.
          </p>
          <Button onClick={() => setSnapshot(metrics)}>Generate match report</Button>
        </div>
      ) : (
        <ReportResult metrics={snapshot} />
      )}
    </Card>
  );
}
