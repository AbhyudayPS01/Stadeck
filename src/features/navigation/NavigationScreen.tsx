import { useMemo, useState } from 'react';
import { StadiumMap } from '../../components/map/StadiumMap';
import { RouteOverlayLayer } from '../../components/map/RouteOverlayLayer';
import { Card } from '../../components/ui/Card';
import { GATES, SECTIONS } from '../../services/data/stadiumLayout';
import type { Gate, StadiumSection } from '../../types/stadium';
import { DirectionsPanel } from './DirectionsPanel';
import { NearbyAmenities } from './NearbyAmenities';
import { RoutePlannerForm } from './RoutePlannerForm';

interface RoutePlan {
  gate: Gate;
  section: StadiumSection;
}

const DEFAULT_GATE_ID = 'gate-a';

/**
 * Navigation — implements the challenge clause "improve navigation". Fans
 * pick their entry gate and seating section (form or map), get AI turn-by-turn
 * directions with the route highlighted on the schematic map, plus the
 * closest restroom, food, and exit for their block.
 */
export default function NavigationScreen() {
  const [gateId, setGateId] = useState(DEFAULT_GATE_ID);
  const [sectionId, setSectionId] = useState('');
  const [plan, setPlan] = useState<RoutePlan | null>(null);

  const selectedSection = useMemo(
    () => SECTIONS.find((section) => section.id === sectionId) ?? null,
    [sectionId],
  );

  const submitPlan = (): void => {
    const gate = GATES.find((candidate) => candidate.id === gateId);
    if (gate && selectedSection) {
      setPlan({ gate, section: selectedSection });
    }
  };

  return (
    <main className="min-h-screen bg-fan-bg px-gutter py-section md:px-page">
      <h1 className="font-display text-h1 text-fan-ink">Navigation</h1>
      <p className="mt-2 max-w-2xl text-body text-fan-muted">
        Turn-by-turn wayfinding to seats, gates, and amenities across MetLife Stadium. Pick your
        gate and section — or tap them on the map.
      </p>
      <div className="mt-section grid grid-cols-1 items-start gap-gutter xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <Card>
          <h2 className="font-display text-h2 text-fan-ink">Stadium map</h2>
          <StadiumMap
            className="mt-4"
            onSelectGate={setGateId}
            onSelectSection={setSectionId}
            overlays={plan ? <RouteOverlayLayer gate={plan.gate} section={plan.section} /> : null}
            selectedSectionId={sectionId === '' ? null : sectionId}
          />
        </Card>
        <div className="flex flex-col gap-gutter">
          <Card accent="gold">
            <h2 className="font-display text-h2 text-fan-ink">Plan your route</h2>
            <RoutePlannerForm
              gateId={gateId}
              onGateChange={setGateId}
              onSectionChange={setSectionId}
              onSubmit={submitPlan}
              sectionId={sectionId}
            />
            {plan ? <DirectionsPanel gate={plan.gate} section={plan.section} /> : null}
          </Card>
          {selectedSection ? <NearbyAmenities section={selectedSection} /> : null}
        </div>
      </div>
    </main>
  );
}
