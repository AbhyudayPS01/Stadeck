import { useCallback } from 'react';
import { Badge } from '../../components/ui/Badge';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingRow } from '../../components/ui/LoadingRow';
import { StepList } from '../../components/ui/StepList';
import { useGemini } from '../../hooks/useGemini';
import { useUiStrings } from '../../hooks/useUiStrings';
import { getNavigationDirections } from '../../services/gemini';
import type { Gate, StadiumSection } from '../../types/stadium';
import type { Venue } from '../../types/venue';
import { formatUiString } from '../../utils/uiText';

export interface DirectionsPanelProps {
  gate: Gate;
  section: StadiumSection;
  venue: Venue;
}

/**
 * AI turn-by-turn directions for a submitted gate → section plan. Re-fetches
 * when the fan submits a different plan (the props change), never on map
 * hover/selection alone — the parent only re-renders this with a new plan.
 */
export function DirectionsPanel({ gate, section, venue }: DirectionsPanelProps) {
  const fetcher = useCallback(
    () => getNavigationDirections(gate, section, venue),
    [gate, section, venue],
  );
  const { data, source, mockReason, isLoading, error, refetch } = useGemini(fetcher);
  const strings = useUiStrings();

  if (isLoading) {
    return <LoadingRow label={strings['navigation.fetchingDirections']} />;
  }

  if (error !== null || data === null) {
    return (
      <ErrorState
        message={formatUiString(strings['navigation.directionsError'], {
          gate: gate.label,
          section: `Section ${section.label}`,
        })}
        onRetry={refetch}
        title={strings['navigation.directionsUnavailable']}
      />
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge severity="normal">
          {formatUiString(strings['navigation.minWalk'], { minutes: data.etaMinutes })}
        </Badge>
        {source === 'mock' ? <DemoDataBadge reason={mockReason ?? undefined} /> : null}
      </div>
      {/* AI response region per SPEC.md accessibility rules */}
      <div aria-live="polite">
        <p className="text-body-sm text-fan-ink">{data.summary}</p>
        <StepList items={data.steps} ordered />
      </div>
    </div>
  );
}
