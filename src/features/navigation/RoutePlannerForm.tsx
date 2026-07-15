import type { FormEvent } from 'react';
import { Button } from '../../components/ui/Button';
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

const SELECT_CLASSES =
  'mt-1.5 w-full rounded-lg border border-fan-border bg-fan-surface px-3 py-2.5 text-body-sm ' +
  'text-fan-ink focus-visible:outline-none focus-visible:shadow-inputfocus';

/** Gate + seating-section pickers feeding the AI directions request. */
export function RoutePlannerForm({
  gateId,
  sectionId,
  onGateChange,
  onSectionChange,
  onSubmit,
}: RoutePlannerFormProps) {
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
        Your seating section
        <select
          className={SELECT_CLASSES}
          onChange={(event) => onSectionChange(event.target.value)}
          value={sectionId}
        >
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
        </select>
      </label>
      <Button className="self-start" disabled={sectionId === ''} type="submit">
        Get directions
      </Button>
    </form>
  );
}
