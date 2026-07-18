import type { FormEvent } from 'react';
import { Button } from '../../components/ui/Button';
import { FormSelect } from '../../components/ui/FormSelect';
import { useUiStrings } from '../../hooks/useUiStrings';
import type { Gate, SectionTier, StadiumSection } from '../../types/stadium';

export interface RoutePlannerFormProps {
  gateId: string;
  sectionId: string;
  /** The active venue's own gates and sections (from its generated layout). */
  gates: readonly Gate[];
  sections: readonly StadiumSection[];
  onGateChange: (gateId: string) => void;
  onSectionChange: (sectionId: string) => void;
  onSubmit: () => void;
}

const TIERS: readonly SectionTier[] = ['lower', 'club', 'upper'];

/** Gate + seating-section pickers feeding the AI directions request. */
export function RoutePlannerForm({
  gateId,
  sectionId,
  gates,
  sections,
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
      <FormSelect label={strings['navigation.entryGate']} onChange={onGateChange} value={gateId}>
        {gates.map((gate) => (
          <option key={gate.id} value={gate.id}>
            {gate.label} ({gate.compassPoint})
          </option>
        ))}
      </FormSelect>
      <FormSelect
        label={strings['navigation.yourSeatingSection']}
        onChange={onSectionChange}
        value={sectionId}
      >
        <option disabled value="">
          {strings['navigation.chooseSection']}
        </option>
        {TIERS.map((tier) => (
          <optgroup key={tier} label={strings[`tier.${tier}`]}>
            {sections
              .filter((section) => section.tier === tier)
              .map((section) => (
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
