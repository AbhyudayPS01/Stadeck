import { useCallback, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { ErrorState } from '../../components/ui/ErrorState';
import { Spinner } from '../../components/ui/Spinner';
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
    return (
      <div className="flex items-center gap-3 py-4 text-pitch-deep">
        <Spinner label="Finding eco actions" size="md" />
        <span aria-hidden="true" className="text-body-sm text-fan-muted">
          Finding eco actions…
        </span>
      </div>
    );
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
        <ul className="mt-3 flex flex-col gap-1.5">
          {data.tips.map((tip) => (
            <li key={tip} className="flex gap-2.5 text-body-sm text-fan-ink">
              <span aria-hidden="true" className="shrink-0 font-mono font-bold text-pitch-deep">
                ▸
              </span>
              {tip}
            </li>
          ))}
        </ul>
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
