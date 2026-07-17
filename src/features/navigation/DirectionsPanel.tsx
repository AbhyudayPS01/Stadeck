import { useCallback } from 'react';
import { Badge } from '../../components/ui/Badge';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingRow } from '../../components/ui/LoadingRow';
import { StepList } from '../../components/ui/StepList';
import { useGemini } from '../../hooks/useGemini';
import { getNavigationDirections } from '../../services/gemini';
import type { Gate, StadiumSection } from '../../types/stadium';

export interface DirectionsPanelProps {
  gate: Gate;
  section: StadiumSection;
}

/**
 * AI turn-by-turn directions for a submitted gate → section plan. Re-fetches
 * when the fan submits a different plan (the props change), never on map
 * hover/selection alone — the parent only re-renders this with a new plan.
 */
export function DirectionsPanel({ gate, section }: DirectionsPanelProps) {
  const fetcher = useCallback(() => getNavigationDirections(gate, section), [gate, section]);
  const { data, source, mockReason, isLoading, error, refetch } = useGemini(fetcher);

  if (isLoading) {
    return <LoadingRow label="Fetching directions" />;
  }

  if (error !== null || data === null) {
    return (
      <ErrorState
        message={`Directions from ${gate.label} to Section ${section.label} could not be fetched.`}
        onRetry={refetch}
        title="Directions unavailable"
      />
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge severity="normal">~{data.etaMinutes} min walk</Badge>
        {source === 'mock' ? <DemoDataBadge reason={mockReason ?? undefined} /> : null}
      </div>
      {/* AI response region per CLAUDE.md accessibility rules */}
      <div aria-live="polite">
        <p className="text-body-sm text-fan-ink">{data.summary}</p>
        <StepList items={data.steps} ordered />
      </div>
    </div>
  );
}
