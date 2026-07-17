import type { FormEvent } from 'react';
import { Button } from '../../components/ui/Button';
import { FormSelect } from '../../components/ui/FormSelect';
import { useUiStrings } from '../../hooks/useUiStrings';
import { GATES, SECTIONS, TIER_NAMES } from '../../services/data/stadiumLayout';
import type { SectionTier } from '../../types/stadium';

export interface RoutePlannerFormProps {
  gateId: string;
  sectionId: string;
  onGateChange: (gateId: string) => void;
  onSectionChange: (sectionId: string) => void;
  onSubmit: () => void;
}

const TIERS: readonly SectionTier[] = ['lower', 'club', 'upper'];

/** Gate + seating-section pickers feeding the AI directions request. */
export function RoutePlannerForm({
  gateId,
  sectionId,
  onGateChange,
  onSectionChange,
  onSubmit,
}: RoutePlannerFormProps) {
  const strings = useUiStrings();
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
      <FormSelect label="Your seating section" onChange={onSectionChange} value={sectionId}>
        <option disabled value="">
          Choose a section…
        </option>
        {TIERS.map((tier) => (
          <optgroup key={tier} label={TIER_NAMES[tier]}>
            {SECTIONS.filter((section) => section.tier === tier).map((section) => (
              <option key={section.id} value={section.id}>
                Section {section.label}
              </option>
            ))}
          </optgroup>
        ))}
      </FormSelect>
      <Button className="self-start" disabled={sectionId === ''} type="submit">
        {strings['action.getDirections']}
      </Button>
    </form>
  );
}
