import { useCallback } from 'react';
import { Card } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/ErrorState';
import { Spinner } from '../../components/ui/Spinner';
import { useGemini } from '../../hooks/useGemini';
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
  const fetcher = useCallback(() => getRealTimeDecisionSupport(incident), [incident]);
  const { data, source, isLoading, error, refetch } = useGemini(fetcher);

  return (
    <Card theme="ops">
      <h2 className="font-display text-h2 text-ops-ink">Action plan</h2>
      <p className="mt-1.5 text-body-sm text-ops-muted">
        {incident.summary} — {incident.location}
      </p>
      <div className="mt-4">
        {isLoading ? (
          <div className="flex items-center gap-3 py-6 text-glow">
            <Spinner label="Generating action plan" size="md" />
            <span aria-hidden="true" className="text-body-sm text-ops-muted">
              Generating action plan…
            </span>
          </div>
        ) : error !== null || data === null || source === null ? (
          <ErrorState
            message="The action plan could not be generated."
            onRetry={refetch}
            theme="ops"
            title="Plan failed"
          />
        ) : (
          <ActionPlanDetails plan={data} source={source} />
        )}
      </div>
    </Card>
  );
}
