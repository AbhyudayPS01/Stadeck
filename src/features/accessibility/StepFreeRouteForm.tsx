import type { FormEvent } from 'react';
import { Button } from '../../components/ui/Button';
import { FormSelect } from '../../components/ui/FormSelect';
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
      <FormSelect label="Entry gate" onChange={onGateChange} value={gateId}>
        {GATES.map((gate) => (
          <option key={gate.id} value={gate.id}>
            {gate.label} ({gate.compassPoint})
          </option>
        ))}
      </FormSelect>
      <FormSelect label="Accessible seating area" onChange={onSectionChange} value={sectionId}>
        {destinations.map((section) => (
          <option key={section.id} value={section.id}>
            Section {section.label} ({TIER_NAMES[section.tier]})
          </option>
        ))}
      </FormSelect>
      <Button className="self-start" type="submit">
        Plan step-free route
      </Button>
    </form>
  );
}
