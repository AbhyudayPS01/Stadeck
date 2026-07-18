import { useCallback, useId, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingRow } from '../../components/ui/LoadingRow';
import { MAX_USER_INPUT_LENGTH } from '../../config/constants';
import { useGemini } from '../../hooks/useGemini';
import { useUiStrings } from '../../hooks/useUiStrings';
import { getScenarioPlan } from '../../services/gemini';
import type { Venue } from '../../types/venue';
import { ActionPlanDetails } from './ActionPlanDetails';

export interface ScenarioPlannerProps {
  venue: Venue;
}

function ScenarioResult({ scenario, venue }: { scenario: string; venue: Venue }) {
  const strings = useUiStrings();
  const fetcher = useCallback(() => getScenarioPlan(scenario, venue), [scenario, venue]);
  const { data, source, mockReason, isLoading, error, refetch } = useGemini(fetcher);

  if (isLoading) {
    return <LoadingRow label={strings['rtds.planningScenario']} theme="ops" />;
  }
  if (error !== null || data === null || source === null) {
    return (
      <ErrorState
        message={strings['rtds.scenarioFailed']}
        onRetry={refetch}
        theme="ops"
        title={strings['rtds.planFailedTitle']}
      />
    );
  }
  return <ActionPlanDetails mockReason={mockReason ?? undefined} plan={data} source={source} />;
}

/**
 * Organizer-only "what-if" tool: describe a hypothetical matchday scenario
 * and get a structured contingency plan. Input is length-capped here and
 * sanitized + delimiter-wrapped by guard.ts inside the prompt builder before
 * it ever reaches the model.
 */
export function ScenarioPlanner({ venue }: ScenarioPlannerProps) {
  const strings = useUiStrings();
  const [draft, setDraft] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);
  const textareaId = useId();

  return (
    <Card theme="ops">
      <h2 className="font-display text-h2 text-ops-ink">{strings['rtds.whatIf']}</h2>
      <form
        className="mt-3 flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const scenario = draft.trim();
          if (scenario.length > 0) {
            setSubmitted(scenario);
          }
        }}
      >
        <label className="text-label font-semibold text-ops-faint" htmlFor={textareaId}>
          {strings['rtds.describeScenario']}
        </label>
        <textarea
          className="min-h-[84px] rounded-md border border-ops-border bg-ops-surface2 px-3 py-2.5 text-body-sm text-ops-body placeholder:text-ops-faint focus:border-glow focus:outline-none focus:shadow-inputfocus"
          id={textareaId}
          maxLength={MAX_USER_INPUT_LENGTH}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={strings['placeholder.scenario']}
          value={draft}
        />
        <Button className="self-start" disabled={draft.trim().length === 0} size="sm" type="submit">
          {strings['action.planScenario']}
        </Button>
      </form>
      {submitted !== null ? (
        <div className="mt-4">
          <ScenarioResult scenario={submitted} venue={venue} />
        </div>
      ) : null}
    </Card>
  );
}
