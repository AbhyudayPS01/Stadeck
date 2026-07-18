import { useCallback } from 'react';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingRow } from '../../components/ui/LoadingRow';
import { StepList } from '../../components/ui/StepList';
import { useGemini } from '../../hooks/useGemini';
import { useUiStrings } from '../../hooks/useUiStrings';
import { getStepFreeRoute } from '../../services/gemini';
import type { Gate, StadiumSection } from '../../types/stadium';
import type { Venue } from '../../types/venue';
import { formatUiString } from '../../utils/uiText';

export interface StepFreeGuidancePanelProps {
  gate: Gate;
  section: StadiumSection;
  venue: Venue;
}

/** AI step-free route guidance for a submitted gate → accessible seating plan. */
export function StepFreeGuidancePanel({ gate, section, venue }: StepFreeGuidancePanelProps) {
  const fetcher = useCallback(
    () => getStepFreeRoute(gate, section, venue),
    [gate, section, venue],
  );
  const { data, source, mockReason, isLoading, error, refetch } = useGemini(fetcher);
  const strings = useUiStrings();

  if (isLoading) {
    return <LoadingRow label={strings['accessibility.planningRoute']} />;
  }

  if (error !== null || data === null) {
    return (
      <ErrorState
        message={formatUiString(strings['accessibility.routeError'], {
          gate: gate.label,
          section: `Section ${section.label}`,
        })}
        onRetry={refetch}
        title={strings['accessibility.routeUnavailable']}
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
        <p className="mt-2 rounded-md bg-pitch-tint px-3 py-2 text-body-sm text-pitch-darker">
          {data.recommendedRoute}
        </p>
        <h3 className="mt-3 font-display text-h3 text-fan-ink">
          {strings['accessibility.atYourSeatingArea']}
        </h3>
        <StepList items={data.accommodations} />
      </div>
    </div>
  );
}
