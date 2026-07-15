import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { ErrorState } from '../../components/ui/ErrorState';
import { Spinner } from '../../components/ui/Spinner';
import { MAX_USER_INPUT_LENGTH } from '../../config/constants';
import { useGemini } from '../../hooks/useGemini';
import { getTransportationRecommendation } from '../../services/gemini';
import type { TransitOption } from '../../types/transportation';

export interface EgressPlannerProps {
  options: TransitOption[];
  /** Reports the AI's recommended option so the transit board can highlight it. */
  onRecommendation: (optionId: string | null) => void;
}

interface EgressPlan {
  destination: string;
  /** Transit board snapshot at submit time, so feed ticks don't retrigger the AI call. */
  options: TransitOption[];
}

interface StrategyResultProps extends EgressPlannerProps {
  plan: EgressPlan;
}

function StrategyResult({ plan, onRecommendation }: StrategyResultProps) {
  const fetcher = useCallback(
    () => getTransportationRecommendation(plan.options, plan.destination),
    [plan],
  );
  const { data, source, isLoading, error, refetch } = useGemini(fetcher);

  useEffect(() => {
    onRecommendation(data?.recommendedOptionId ?? null);
  }, [data, onRecommendation]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-4 text-pitch-deep">
        <Spinner label="Planning your departure" size="md" />
        <span aria-hidden="true" className="text-body-sm text-fan-muted">
          Planning your departure…
        </span>
      </div>
    );
  }

  if (error !== null || data === null) {
    return (
      <ErrorState
        message="Your departure strategy could not be planned."
        onRetry={refetch}
        title="Planner unavailable"
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
        <p className="mt-2 rounded-md bg-pitch-tint px-3 py-2 text-body-sm font-semibold text-pitch-darker">
          {data.departureWindow}
        </p>
        <ol className="mt-3 flex flex-col gap-2">
          {data.steps.map((step, index) => (
            <li key={step} className="flex gap-2.5 text-body-sm text-fan-ink">
              <span
                aria-hidden="true"
                className="shrink-0 font-mono font-bold text-pitch-deep"
              >{`${index + 1}.`}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/**
 * Post-match egress planner: the fan says where they are headed, and the AI
 * turns the live transit board into a personalized departure strategy with
 * concrete times and expected crowd loads.
 */
export function EgressPlanner({ options, onRecommendation }: EgressPlannerProps) {
  const [destination, setDestination] = useState('');
  const [plan, setPlan] = useState<EgressPlan | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (destination.trim() !== '') {
      setPlan({ destination: destination.trim(), options: [...options] });
    }
  };

  return (
    <Card accent="gold">
      <h2 className="font-display text-h2 text-fan-ink">Departure strategy</h2>
      <form className="mt-3 flex flex-col gap-3" onSubmit={handleSubmit}>
        <label className="block text-label font-semibold text-fan-muted">
          Where are you headed after the match?
          <input
            className="mt-1.5 w-full rounded-lg border border-fan-border bg-fan-surface px-3 py-2.5 text-body-sm text-fan-ink focus-visible:outline-none focus-visible:shadow-inputfocus"
            maxLength={MAX_USER_INPUT_LENGTH}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="e.g. Penn Station, New York"
            type="text"
            value={destination}
          />
        </label>
        <Button className="self-start" disabled={destination.trim() === ''} type="submit">
          Plan my exit
        </Button>
      </form>
      {plan ? (
        <StrategyResult onRecommendation={onRecommendation} options={options} plan={plan} />
      ) : null}
    </Card>
  );
}
