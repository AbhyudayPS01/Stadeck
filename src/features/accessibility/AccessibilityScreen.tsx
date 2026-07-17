import { useState } from 'react';
import { MapLegend } from '../../components/map/MapLegend';
import { RouteOverlayLayer } from '../../components/map/RouteOverlayLayer';
import { StadiumMap } from '../../components/map/StadiumMap';
import { Card } from '../../components/ui/Card';
import { useUiStrings } from '../../hooks/useUiStrings';
import { AMENITIES, GATES, SECTIONS } from '../../services/data/stadiumLayout';
import type { Gate, StadiumSection } from '../../types/stadium';
import { AccessCompanion } from './AccessCompanion';
import { DisplayControls } from './DisplayControls';
import { StepFreeGuidancePanel } from './StepFreeGuidancePanel';
import { StepFreeRouteForm } from './StepFreeRouteForm';

interface RoutePlan {
  gate: Gate;
  section: StadiumSection;
}

/** The seating sections that host accessible seating, per the layout config. */
const ACCESSIBLE_SECTIONS: readonly StadiumSection[] = AMENITIES.filter(
  (amenity) => amenity.type === 'accessible-seating',
).flatMap((amenity) => SECTIONS.filter((section) => section.id === amenity.sectionId));

const DEFAULT_GATE_ID = 'gate-a';

/**
 * Accessibility — implements the challenge clause "accessibility". Fans with
 * access needs plan a step-free route to accessible seating (highlighted on
 * the map), rewrite any announcement into plain language with the Access
 * Companion, and set app-wide high-contrast and text-size preferences.
 */
export default function AccessibilityScreen() {
  const strings = useUiStrings();
  const [gateId, setGateId] = useState(DEFAULT_GATE_ID);
  const [sectionId, setSectionId] = useState(ACCESSIBLE_SECTIONS[0]?.id ?? '');
  const [plan, setPlan] = useState<RoutePlan | null>(null);

  const selectedSection = ACCESSIBLE_SECTIONS.find((section) => section.id === sectionId) ?? null;

  const submitPlan = (): void => {
    const gate = GATES.find((candidate) => candidate.id === gateId);
    if (gate && selectedSection) {
      setPlan({ gate, section: selectedSection });
    }
  };

  return (
    <main className="min-h-screen bg-fan-bg px-gutter py-section md:px-page">
      <h1 className="font-display text-h1 text-fan-ink">{strings['module.accessibility.title']}</h1>
      <p className="mt-2 max-w-2xl text-body text-fan-muted">
        {strings['module.accessibility.description']}
      </p>
      <div className="mt-section grid grid-cols-1 items-start gap-gutter xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div className="flex flex-col gap-gutter">
          <Card>
            <h2 className="font-display text-h2 text-fan-ink">Step-free route map</h2>
            <StadiumMap
              className="mt-4"
              onSelectGate={setGateId}
              overlays={plan ? <RouteOverlayLayer gate={plan.gate} section={plan.section} /> : null}
              selectedSectionId={sectionId}
            />
            <MapLegend />
          </Card>
          <AccessCompanion />
        </div>
        <div className="flex flex-col gap-gutter">
          <Card accent="pitch">
            <h2 className="font-display text-h2 text-fan-ink">Step-free route planner</h2>
            <StepFreeRouteForm
              destinations={ACCESSIBLE_SECTIONS}
              gateId={gateId}
              onGateChange={setGateId}
              onSectionChange={setSectionId}
              onSubmit={submitPlan}
              sectionId={sectionId}
            />
            {plan ? <StepFreeGuidancePanel gate={plan.gate} section={plan.section} /> : null}
          </Card>
          <DisplayControls />
        </div>
      </div>
    </main>
  );
}
