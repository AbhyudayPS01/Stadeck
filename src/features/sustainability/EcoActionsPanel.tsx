import { useCallback, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingRow } from '../../components/ui/LoadingRow';
import { StepList } from '../../components/ui/StepList';
import { useGemini } from '../../hooks/useGemini';
import { getSustainabilityTips } from '../../services/gemini';
import type { SustainabilityMetrics } from '../../types/sustainability';

export interface EcoActionsPanelProps {
  metrics: SustainabilityMetrics;
}

function ActionsResult({ metrics }: EcoActionsPanelProps) {
  const fetcher = useCallback(() => getSustainabilityTips(metrics), [metrics]);
  const { data, source, isLoading, error, refetch } = useGemini(fetcher);

  if (isLoading) {
    return <LoadingRow label="Finding eco actions" />;
  }

  if (error !== null || data === null) {
    return (
      <ErrorState
        message="Your eco actions could not be generated."
        onRetry={refetch}
        title="Eco actions unavailable"
      />
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-3">
      {source === 'mock' ? (
        <span className="self-start">
          <DemoDataBadge />
        </span>
      ) : null}
      {/* AI response region per CLAUDE.md accessibility rules */}
      <div aria-live="polite">
        <p className="text-body-sm text-fan-ink">{data.summary}</p>
        <StepList items={data.tips} />
      </div>
    </div>
  );
}

/**
 * "Your eco actions": snapshots the metrics at click time (the 20-second feed
 * ticks must not retrigger the AI call) and renders per-fan actions grounded
 * in how the venue is actually performing right now.
 */
export function EcoActionsPanel({ metrics }: EcoActionsPanelProps) {
  const [snapshot, setSnapshot] = useState<SustainabilityMetrics | null>(null);

  return (
    <Card accent="pitch">
      <h2 className="font-display text-h2 text-fan-ink">Your eco actions</h2>
      {snapshot === null ? (
        <div className="mt-3 flex flex-col items-start gap-3">
          <p className="text-body-sm text-fan-muted">
            Get 3-4 concrete actions you can take right now, based on today&apos;s live venue
            metrics.
          </p>
          <Button onClick={() => setSnapshot(metrics)}>Get my eco actions</Button>
        </div>
      ) : (
        <ActionsResult metrics={snapshot} />
      )}
    </Card>
  );
}
