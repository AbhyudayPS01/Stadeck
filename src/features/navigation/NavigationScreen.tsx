import { useEffect, useState } from 'react';
import { MapLegend } from '../../components/map/MapLegend';
import { StadiumMap } from '../../components/map/StadiumMap';
import { RouteOverlayLayer } from '../../components/map/RouteOverlayLayer';
import { Card } from '../../components/ui/Card';
import { useUiStrings } from '../../hooks/useUiStrings';
import { useVenue } from '../../hooks/useVenue';
import { getVenueLayout } from '../../services/data/stadiumLayout';
import type { Gate, StadiumSection } from '../../types/stadium';
import type { Venue } from '../../types/venue';
import { DirectionsPanel } from './DirectionsPanel';
import { NearbyAmenities } from './NearbyAmenities';
import { RoutePlannerForm } from './RoutePlannerForm';

interface RoutePlan {
  gate: Gate;
  section: StadiumSection;
  /**
   * The venue active when the plan was submitted, captured alongside the
   * gate/section rather than read live from context — otherwise a venue
   * switch could, for one render, pair the old gate/section with the new
   * venue and fire a spurious AI call for a combination that never existed.
   */
  venue: Venue;
}

const DEFAULT_GATE_ID = 'gate-a';

/**
 * Navigation — implements the challenge clause "improve navigation". Fans
 * pick their entry gate and seating section (form or map), get AI turn-by-turn
 * directions with the route highlighted on the schematic map, plus the
 * closest restroom, food, and exit for their block.
 */
export default function NavigationScreen() {
  const strings = useUiStrings();
  const { venue } = useVenue();
  const layout = getVenueLayout(venue.id);
  const [gateId, setGateId] = useState(DEFAULT_GATE_ID);
  const [sectionId, setSectionId] = useState('');
  const [plan, setPlan] = useState<RoutePlan | null>(null);

  // A section chosen at one venue may not exist at another (different
  // section counts) — clear the stale selection and any in-progress plan
  // rather than let them survive a switch.
  useEffect(() => {
    setSectionId('');
    setPlan(null);
  }, [venue]);

  const selectedSection = layout.sections.find((section) => section.id === sectionId) ?? null;

  const submitPlan = (): void => {
    const gate = layout.gates.find((candidate) => candidate.id === gateId);
    if (gate && selectedSection) {
      setPlan({ gate, section: selectedSection, venue });
    }
  };

  return (
    <main className="min-h-screen bg-fan-bg px-gutter py-section md:px-page">
      <h1 className="font-display text-h1 text-fan-ink">{strings['module.navigation.title']}</h1>
      <p className="mt-2 max-w-2xl text-body text-fan-muted">
        {strings['module.navigation.description']}
      </p>
      <div className="mt-section grid grid-cols-1 items-start gap-gutter xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <Card>
          <h2 className="font-display text-h2 text-fan-ink">{strings['navigation.stadiumMap']}</h2>
          <StadiumMap
            className="mt-4"
            onSelectGate={setGateId}
            onSelectSection={setSectionId}
            overlays={plan ? <RouteOverlayLayer gate={plan.gate} section={plan.section} /> : null}
            selectedSectionId={sectionId === '' ? null : sectionId}
            venue={venue}
          />
          <MapLegend />
        </Card>
        <div className="flex flex-col gap-gutter">
          <Card accent="gold">
            <h2 className="font-display text-h2 text-fan-ink">
              {strings['navigation.planYourRoute']}
            </h2>
            <RoutePlannerForm
              gateId={gateId}
              gates={layout.gates}
              onGateChange={setGateId}
              onSectionChange={setSectionId}
              onSubmit={submitPlan}
              sectionId={sectionId}
              sections={layout.sections}
            />
            {plan ? (
              <DirectionsPanel gate={plan.gate} section={plan.section} venue={plan.venue} />
            ) : null}
          </Card>
          {selectedSection ? (
            <NearbyAmenities layout={layout} section={selectedSection} />
          ) : null}
        </div>
      </div>
    </main>
  );
}
