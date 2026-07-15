import { useCallback } from 'react';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingRow } from '../../components/ui/LoadingRow';
import { StepList } from '../../components/ui/StepList';
import { useGemini } from '../../hooks/useGemini';
import { getStepFreeRoute } from '../../services/gemini';
import type { Gate, StadiumSection } from '../../types/stadium';

export interface StepFreeGuidancePanelProps {
  gate: Gate;
  section: StadiumSection;
}

/** AI step-free route guidance for a submitted gate → accessible seating plan. */
export function StepFreeGuidancePanel({ gate, section }: StepFreeGuidancePanelProps) {
  const fetcher = useCallback(() => getStepFreeRoute(gate, section), [gate, section]);
  const { data, source, isLoading, error, refetch } = useGemini(fetcher);

  if (isLoading) {
    return <LoadingRow label="Planning step-free route" />;
  }

  if (error !== null || data === null) {
    return (
      <ErrorState
        message={`The step-free route from ${gate.label} to Section ${section.label} could not be planned.`}
        onRetry={refetch}
        title="Route unavailable"
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
        <p className="mt-2 rounded-md bg-pitch-tint px-3 py-2 text-body-sm text-pitch-darker">
          {data.recommendedRoute}
        </p>
        <h3 className="mt-3 font-display text-h3 text-fan-ink">At your seating area</h3>
        <StepList items={data.accommodations} />
      </div>
    </div>
  );
}
