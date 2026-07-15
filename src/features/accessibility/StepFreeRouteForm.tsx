import type { FormEvent } from 'react';
import { Button } from '../../components/ui/Button';
import { GATES, TIER_NAMES } from '../../services/data/stadiumLayout';
import type { StadiumSection } from '../../types/stadium';

export interface StepFreeRouteFormProps {
  gateId: string;
  sectionId: string;
  /** The accessible seating destinations (from the stadium layout config). */
  destinations: readonly StadiumSection[];
  onGateChange: (gateId: string) => void;
  onSectionChange: (sectionId: string) => void;
  onSubmit: () => void;
}

const SELECT_CLASSES =
  'mt-1.5 w-full rounded-lg border border-fan-border bg-fan-surface px-3 py-2.5 text-body-sm ' +
  'text-fan-ink focus-visible:outline-none focus-visible:shadow-inputfocus';

/** Gate + accessible-seating pickers feeding the step-free route request. */
export function StepFreeRouteForm({
  gateId,
  sectionId,
  destinations,
  onGateChange,
  onSectionChange,
  onSubmit,
}: StepFreeRouteFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="mt-3 flex flex-col gap-3" onSubmit={handleSubmit}>
      <label className="block text-label font-semibold text-fan-muted">
        Entry gate
        <select
          className={SELECT_CLASSES}
          onChange={(event) => onGateChange(event.target.value)}
          value={gateId}
        >
          {GATES.map((gate) => (
            <option key={gate.id} value={gate.id}>
              {gate.label} ({gate.compassPoint})
            </option>
          ))}
        </select>
      </label>
      <label className="block text-label font-semibold text-fan-muted">
        Accessible seating area
        <select
          className={SELECT_CLASSES}
          onChange={(event) => onSectionChange(event.target.value)}
          value={sectionId}
        >
          {destinations.map((section) => (
            <option key={section.id} value={section.id}>
              Section {section.label} ({TIER_NAMES[section.tier]})
            </option>
          ))}
        </select>
      </label>
      <Button className="self-start" type="submit">
        Plan step-free route
      </Button>
    </form>
  );
}
