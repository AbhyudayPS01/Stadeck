import { useCallback, useId, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingRow } from '../../components/ui/LoadingRow';
import { MAX_USER_INPUT_LENGTH } from '../../config/constants';
import { useGemini } from '../../hooks/useGemini';
import { getScenarioPlan } from '../../services/gemini';
import { ActionPlanDetails } from './ActionPlanDetails';

function ScenarioResult({ scenario }: { scenario: string }) {
  const fetcher = useCallback(() => getScenarioPlan(scenario), [scenario]);
  const { data, source, isLoading, error, refetch } = useGemini(fetcher);

  if (isLoading) {
    return <LoadingRow label="Planning scenario" theme="ops" />;
  }
  if (error !== null || data === null || source === null) {
    return (
      <ErrorState
        message="The scenario plan could not be generated."
        onRetry={refetch}
        theme="ops"
        title="Plan failed"
      />
    );
  }
  return <ActionPlanDetails plan={data} source={source} />;
}

/**
 * Organizer-only "what-if" tool: describe a hypothetical matchday scenario
 * and get a structured contingency plan. Input is length-capped here and
 * sanitized + delimiter-wrapped by guard.ts inside the prompt builder before
 * it ever reaches the model.
 */
export function ScenarioPlanner() {
  const [draft, setDraft] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);
  const textareaId = useId();

  return (
    <Card theme="ops">
      <h2 className="font-display text-h2 text-ops-ink">What-if scenario</h2>
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
          Describe a hypothetical situation to war-game
        </label>
        <textarea
          className="min-h-[84px] rounded-md border border-ops-border bg-ops-surface2 px-3 py-2.5 text-body-sm text-ops-body placeholder:text-ops-faint focus:border-glow focus:outline-none focus:shadow-inputfocus"
          id={textareaId}
          maxLength={MAX_USER_INPUT_LENGTH}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="e.g. The rail line goes down 20 minutes before the final whistle"
          value={draft}
        />
        <Button className="self-start" disabled={draft.trim().length === 0} size="sm" type="submit">
          Plan scenario
        </Button>
      </form>
      {submitted !== null ? (
        <div className="mt-4">
          <ScenarioResult scenario={submitted} />
        </div>
      ) : null}
    </Card>
  );
}
