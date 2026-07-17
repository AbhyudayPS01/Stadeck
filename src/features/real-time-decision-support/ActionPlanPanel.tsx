import { useCallback } from 'react';
import { Card } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingRow } from '../../components/ui/LoadingRow';
import { useGemini } from '../../hooks/useGemini';
import { useUiStrings } from '../../hooks/useUiStrings';
import { getRealTimeDecisionSupport } from '../../services/gemini';
import type { Incident } from '../../types/incident';
import { ActionPlanDetails } from './ActionPlanDetails';

interface ActionPlanPanelProps {
  incident: Incident;
}

/**
 * Generates the structured action plan for the selected incident. Keyed by
 * incident in the parent, so selecting a different incident remounts the
 * panel and requests a fresh plan.
 */
export function ActionPlanPanel({ incident }: ActionPlanPanelProps) {
  const strings = useUiStrings();
  const fetcher = useCallback(() => getRealTimeDecisionSupport(incident), [incident]);
  const { data, source, mockReason, isLoading, error, refetch } = useGemini(fetcher);

  return (
    <Card theme="ops">
      <h2 className="font-display text-h2 text-ops-ink">{strings['rtds.actionPlan']}</h2>
      <p className="mt-1.5 text-body-sm text-ops-muted">
        {incident.summary} — {incident.location}
      </p>
      <div className="mt-4">
        {isLoading ? (
          <LoadingRow label={strings['rtds.generatingPlan']} theme="ops" />
        ) : error !== null || data === null || source === null ? (
          <ErrorState
            message={strings['rtds.planFailed']}
            onRetry={refetch}
            theme="ops"
            title={strings['rtds.planFailedTitle']}
          />
        ) : (
          <ActionPlanDetails mockReason={mockReason ?? undefined} plan={data} source={source} />
        )}
      </div>
    </Card>
  );
}
