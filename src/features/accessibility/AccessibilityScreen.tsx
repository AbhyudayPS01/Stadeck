import { useEffect, useMemo, useState } from 'react';
import { MapLegend } from '../../components/map/MapLegend';
import { RouteOverlayLayer } from '../../components/map/RouteOverlayLayer';
import { StadiumMap } from '../../components/map/StadiumMap';
import { Card } from '../../components/ui/Card';
import { useUiStrings } from '../../hooks/useUiStrings';
import { useVenue } from '../../hooks/useVenue';
import { getVenueLayout } from '../../services/data/stadiumLayout';
import type { Gate, StadiumSection } from '../../types/stadium';
import type { Venue } from '../../types/venue';
import { AccessCompanion } from './AccessCompanion';
import { DisplayControls } from './DisplayControls';
import { StepFreeGuidancePanel } from './StepFreeGuidancePanel';
import { StepFreeRouteForm } from './StepFreeRouteForm';

interface RoutePlan {
  gate: Gate;
  section: StadiumSection;
  /**
   * The venue active when the plan was submitted, captured alongside the
   * gate/section — see NavigationScreen's RoutePlan for why this must not be
   * read live from context.
   */
  venue: Venue;
}

const DEFAULT_GATE_ID = 'gate-a';

/**
 * Accessibility — implements the challenge clause "accessibility". Fans with
 * access needs plan a step-free route to accessible seating (highlighted on
 * the map), rewrite any announcement into plain language with the Access
 * Companion, and set app-wide high-contrast and text-size preferences.
 */
export default function AccessibilityScreen() {
  const strings = useUiStrings();
  const { venue } = useVenue();
  const layout = getVenueLayout(venue.id);
  /** The seating sections that host accessible seating, per the venue's own layout config. */
  const accessibleSections: readonly StadiumSection[] = useMemo(
    () =>
      layout.amenities
        .filter((amenity) => amenity.type === 'accessible-seating')
        .flatMap((amenity) => layout.sections.filter((section) => section.id === amenity.sectionId)),
    [layout],
  );
  const [gateId, setGateId] = useState(DEFAULT_GATE_ID);
  const [sectionId, setSectionId] = useState(accessibleSections[0]?.id ?? '');
  const [plan, setPlan] = useState<RoutePlan | null>(null);

  // Accessible-seating sections differ per venue — reset the selection and
  // any in-progress plan rather than let them survive a switch. accessibleSections
  // only gets a new reference when the venue does (it's derived from layout,
  // which is cached per venue id), so it's an equivalent, lint-clean trigger.
  useEffect(() => {
    setSectionId(accessibleSections[0]?.id ?? '');
    setPlan(null);
  }, [accessibleSections]);

  const selectedSection = accessibleSections.find((section) => section.id === sectionId) ?? null;

  const submitPlan = (): void => {
    const gate = layout.gates.find((candidate) => candidate.id === gateId);
    if (gate && selectedSection) {
      setPlan({ gate, section: selectedSection, venue });
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
            <h2 className="font-display text-h2 text-fan-ink">
              {strings['accessibility.routeMap']}
            </h2>
            <StadiumMap
              className="mt-4"
              onSelectGate={setGateId}
              overlays={plan ? <RouteOverlayLayer gate={plan.gate} section={plan.section} /> : null}
              selectedSectionId={sectionId}
              venue={venue}
            />
            <MapLegend />
          </Card>
          <AccessCompanion key={venue.id} venue={venue} />
        </div>
        <div className="flex flex-col gap-gutter">
          <Card accent="pitch">
            <h2 className="font-display text-h2 text-fan-ink">
              {strings['accessibility.routePlanner']}
            </h2>
            <StepFreeRouteForm
              destinations={accessibleSections}
              gateId={gateId}
              gates={layout.gates}
              onGateChange={setGateId}
              onSectionChange={setSectionId}
              onSubmit={submitPlan}
              sectionId={sectionId}
            />
            {plan ? (
              <StepFreeGuidancePanel gate={plan.gate} section={plan.section} venue={plan.venue} />
            ) : null}
          </Card>
          <DisplayControls />
        </div>
      </div>
    </main>
  );
}
