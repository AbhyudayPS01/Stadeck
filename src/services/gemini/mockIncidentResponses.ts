import { getVenueLayout, nearestAmenity, sectionNumber } from '../data/stadiumLayout';
import { DEFAULT_VENUE } from '../data/venues';
import type { IncidentCategory } from '../../types/incident';
import type { Venue } from '../../types/venue';
import { venueAnchors } from './mockVenueHelpers';
import type { RealTimeDecisionSupportResponse } from './responses';

/**
 * The lost-child plan is safety-critical, so its offline fallback carries the
 * full protocol (stay put, radio Guest Services, reunification point, hard
 * time threshold) instead of the generic containment plan. The reunification
 * section and paired Guest Services desk come from the venue's own layout —
 * the same anchors the facts and live prompt use (see prompts.ts's
 * lostChildProtocol) — so the plan never sends staff to a section that only
 * exists at a different venue.
 */
function lostChildPlan(venue: Venue): RealTimeDecisionSupportResponse {
  const layout = getVenueLayout(venue.id);
  const reunification = layout.amenities.find((amenity) => amenity.type === 'family-reunification');
  const reunificationAnchor = layout.sections.find(
    (section) => section.id === reunification?.sectionId,
  );
  const section = reunification ? sectionNumber(reunification.sectionId) : '';
  // The desk paged for reunification must be the one actually nearest the
  // reunification point on this venue's ring (same lookup stadiumFacts.ts uses).
  const desk = reunificationAnchor
    ? sectionNumber(nearestAmenity(reunificationAnchor, 'guest-services', layout).sectionId)
    : '';

  return {
    summary: `Begin the lost-child protocol: stay with the child, radio Guest Services, and reunite at the Family Reunification point near Section ${section}.`,
    immediateActions: [
      'Stay with the child (or the reporting adult) exactly where they are — do not move them through the crowd.',
      "Radio Guest Services and the security control room with the child's description and last known location.",
      `Send a steward to the Family Reunification point near Section ${section} and page the guardian there.`,
      'Never take the child outside the venue or hand them to anyone but the verified guardian or Guest Services staff.',
    ],
    teamsToNotify: [
      `Guest Services desk ${desk}`,
      'Security control room',
      `Family Reunification point steward (Section ${section})`,
    ],
    escalationCriteria: [
      'No reunification within 15 minutes — escalate to the venue security lead and the on-site police detail.',
      'Any sign the child is injured, distressed, or was seen leaving with an unrelated adult.',
    ],
    priority: 'critical',
  };
}

/**
 * The roof determines whether "close the roof" is even an available move, so
 * the weather plan's first action names the venue's actual roof type instead
 * of a generic shelter instruction — mirrors buildRealTimeDecisionSupportPrompt's
 * venueConditionsLine grounding on the live path (see prompts.ts).
 */
const ROOF_WEATHER_ACTIONS: Record<Venue['roof'], string> = {
  retractable:
    'Evaluate closing the retractable roof now to protect play and move fans under cover.',
  fixed:
    'The fixed roof already shields the bowl — focus stewards on outer-concourse and parking-lot safety instead of in-bowl shelter.',
  open: 'There is no roof to close — direct fans to the covered concourses and follow the weather-delay protocol.',
};

function weatherPlan(venue: Venue): RealTimeDecisionSupportResponse {
  const roofAction = ROOF_WEATHER_ACTIONS[venue.roof];
  return {
    summary: `Weather incident: ${roofAction}`,
    immediateActions: [
      roofAction,
      'Pause concessions and activities using open flames or exposed equipment.',
      'Brief stewards on the shelter-in-place plan and reassess in 15 minutes.',
    ],
    teamsToNotify: ['Operations control room', 'Grounds and roof crew', 'Security control room'],
    escalationCriteria: [
      'The weather threat persists past the 15-minute reassessment window.',
      'Wind, hail, or lightning begins directly affecting fan safety in the concourses.',
    ],
    priority: 'critical',
  };
}

export function mockRealTimeDecisionSupportResponse(
  category?: IncidentCategory,
  venue: Venue = DEFAULT_VENUE,
): RealTimeDecisionSupportResponse {
  if (category === 'lost-child') {
    return lostChildPlan(venue);
  }
  if (category === 'weather') {
    return weatherPlan(venue);
  }
  const { guestServices } = venueAnchors(venue);
  return {
    summary:
      'Contain the incident locally, keep fan flow moving around it, and reassess in 10 minutes.',
    immediateActions: [
      'Dispatch the nearest response team to the reported location.',
      'Cordon the immediate area and redirect fan flow around it.',
      'Confirm resolution with the on-scene lead and update the incident status.',
    ],
    teamsToNotify: [
      'Venue response team',
      'Security control room',
      `Guest Services desk ${guestServices[0] ?? ''}`,
    ],
    escalationCriteria: [
      'No on-scene confirmation within 10 minutes.',
      'The affected area starts blocking an egress route.',
    ],
    priority: 'elevated',
  };
}

/** Deterministic contingency plan for the organizer "what-if" scenario tool. */
export function mockScenarioPlanResponse(): RealTimeDecisionSupportResponse {
  return {
    summary:
      'Stage resources before the scenario can develop, keep fans informed early, and hold a clear escalation trigger.',
    immediateActions: [
      'Brief zone leads on the scenario and their first move.',
      'Pre-position steward teams at the gates and concourses the scenario would stress.',
      'Queue a multilingual fan announcement so messaging is ready to publish.',
    ],
    teamsToNotify: ['Operations control room', 'Steward coordinators', 'Transportation liaison'],
    escalationCriteria: [
      'Any zone sustains critical density for more than 5 minutes.',
      'The scenario begins to affect more than one gate at once.',
    ],
    priority: 'elevated',
  };
}
