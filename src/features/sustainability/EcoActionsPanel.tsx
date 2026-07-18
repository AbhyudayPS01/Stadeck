import { useCallback, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingRow } from '../../components/ui/LoadingRow';
import { StepList } from '../../components/ui/StepList';
import { useGemini } from '../../hooks/useGemini';
import { useUiStrings } from '../../hooks/useUiStrings';
import { getSustainabilityTips } from '../../services/gemini';
import type { SustainabilityMetrics } from '../../types/sustainability';
import type { Venue } from '../../types/venue';

export interface EcoActionsPanelProps {
  metrics: SustainabilityMetrics;
  venue: Venue;
}

function ActionsResult({ metrics, venue }: EcoActionsPanelProps) {
  const fetcher = useCallback(
    () => getSustainabilityTips(metrics, venue),
    [metrics, venue],
  );
  const { data, source, mockReason, isLoading, error, refetch } = useGemini(fetcher);
  const strings = useUiStrings();

  if (isLoading) {
    return <LoadingRow label={strings['sustainability.findingActions']} />;
  }

  if (error !== null || data === null) {
    return (
      <ErrorState
        message={strings['sustainability.ecoError']}
        onRetry={refetch}
        title={strings['sustainability.ecoUnavailable']}
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
export function EcoActionsPanel({ metrics, venue }: EcoActionsPanelProps) {
  const strings = useUiStrings();
  const [snapshot, setSnapshot] = useState<SustainabilityMetrics | null>(null);

  return (
    <Card accent="pitch">
      <h2 className="font-display text-h2 text-fan-ink">
        {strings['sustainability.yourEcoActions']}
      </h2>
      {snapshot === null ? (
        <div className="mt-3 flex flex-col items-start gap-3">
          <p className="text-body-sm text-fan-muted">{strings['sustainability.ecoIntro']}</p>
          <Button onClick={() => setSnapshot(metrics)}>{strings['action.getEcoActions']}</Button>
        </div>
      ) : (
        <ActionsResult metrics={snapshot} venue={venue} />
      )}
    </Card>
  );
}
