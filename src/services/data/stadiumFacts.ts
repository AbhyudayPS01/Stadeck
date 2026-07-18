import type { Venue } from '../../types/venue';
import { getVenueLayout, nearestAmenity, sectionNumber } from './stadiumLayout';
import {
  anchorNumbers,
  bagPolicyFact,
  formatList,
  paymentsFact,
  sectionList,
  tierRange,
  venueConditionsFact,
  venueProfileFact,
} from './stadiumFactsHelpers';
import { DEFAULT_VENUE } from './venues';

/**
 * Local knowledge base that grounds the multilingual concierge, generated
 * per venue. Section numbers, gate letters, and transit details are derived
 * from the same registry entry and layout the schematic map renders, so AI
 * answers, the map, and mock feeds never contradict each other. Details are
 * demo fiction for World Cup 2026 matchdays, not venue guidance. Per-clause
 * building blocks live in stadiumFactsHelpers.ts.
 */

export interface StadiumFact {
  id: string;
  /** Coarse grouping, useful for future retrieval-style filtering. */
  topic: string;
  fact: string;
}

function buildStadiumFacts(venue: Venue): readonly StadiumFact[] {
  const layout = getVenueLayout(venue.id);
  const guestServices = anchorNumbers(layout, 'guest-services');
  // Every other water station keeps the fact line short; the map shows them all.
  const waterSample = anchorNumbers(layout, 'water').filter((_, index) => index % 2 === 0);
  const reunification = layout.amenities.find((amenity) => amenity.type === 'family-reunification');
  const reunificationAnchor = layout.sections.find(
    (section) => section.id === reunification?.sectionId,
  );
  const reunificationSection = reunification ? sectionNumber(reunification.sectionId) : '';
  // The desk fans are told to meet "beside" must be the one actually nearest
  // the reunification point on this venue's ring.
  const reunificationDesk = reunificationAnchor
    ? sectionNumber(nearestAmenity(reunificationAnchor, 'guest-services', layout).sectionId)
    : '';

  return [
    {
      id: 'fact-venue-profile',
      topic: 'venue',
      fact: venueProfileFact(venue),
    },
    {
      id: 'fact-gates',
      topic: 'entry',
      fact: `Gates ${layout.gates[0]?.label.replace('Gate ', '') ?? ''} through ${layout.gates[layout.gates.length - 1]?.label.replace('Gate ', '') ?? ''} sit at compass points around the stadium and open 3 hours before kickoff.`,
    },
    {
      id: 'fact-bag-policy',
      topic: 'entry',
      fact: bagPolicyFact(venue),
    },
    {
      id: 'fact-cashless',
      topic: 'payments',
      fact: paymentsFact(venue),
    },
    {
      id: 'fact-re-entry',
      topic: 'entry',
      fact: 'There is no re-entry: a scanned ticket cannot exit and enter again, except for documented medical emergencies handled at Guest Services.',
    },
    {
      id: 'fact-smoking',
      topic: 'entry',
      fact: 'The venue is smoke-free, including e-cigarettes and vaping; there is no smoking area inside the gates.',
    },
    {
      id: 'fact-seating-tiers',
      topic: 'seating',
      fact:
        venue.tierCount === 3
          ? `Seating: lower bowl sections ${tierRange(layout, 'lower')}, club level ${tierRange(layout, 'club')}, upper bowl ${tierRange(layout, 'upper')}.`
          : `Seating: lower bowl sections ${tierRange(layout, 'lower')}, upper bowl ${tierRange(layout, 'upper')}.`,
    },
    {
      id: 'fact-accessible-seating',
      topic: 'accessibility',
      fact: `Accessible seating is next to sections ${sectionList(layout, 'accessible-seating')}, with elevators at Gates A, C, E, and G.`,
    },
    {
      id: 'fact-sensory-room',
      topic: 'accessibility',
      fact: `A quiet sensory room is available beside Guest Services at section ${guestServices[0] ?? ''}.`,
    },
    {
      id: 'fact-first-aid',
      topic: 'health',
      fact: `First aid stations are next to sections ${sectionList(layout, 'first-aid')} and are staffed until one hour after the match.`,
    },
    {
      id: 'fact-water',
      topic: 'services',
      fact: `Free filtered water refill stations are on every concourse, including near sections ${formatList(waterSample)}; bringing an empty reusable bottle through security is permitted.`,
    },
    {
      id: 'fact-food',
      topic: 'services',
      fact: `Concessions near sections ${sectionList(layout, 'food')} include halal, kosher, vegetarian, and gluten-free options.`,
    },
    {
      id: 'fact-prayer-rooms',
      topic: 'services',
      fact: `Multi-faith prayer and quiet rooms are on the main concourse near sections ${sectionList(layout, 'prayer-room')}, open from gate time until one hour after the final whistle.`,
    },
    {
      id: 'fact-restrooms',
      topic: 'services',
      fact: `Restrooms are near sections ${sectionList(layout, 'restroom')} on the lower concourse.`,
    },
    {
      id: 'fact-guest-services',
      topic: 'services',
      fact: `Guest Services desks at sections ${formatList(guestServices)} handle lost and found, lost children, language help, and free sensory kits to borrow.`,
    },
    {
      id: 'fact-family-reunification',
      topic: 'safety',
      fact: `If your group is separated, meet at the Family Reunification point near section ${reunificationSection}, beside Guest Services at section ${reunificationDesk}.`,
    },
    {
      id: 'fact-lost-child',
      topic: 'safety',
      fact: `Report a lost child to any steward or Guest Services desk immediately: staff stay with the child where they are found and page the guardian to the Family Reunification point near section ${reunificationSection}. Children are never taken outside the venue.`,
    },
    {
      id: 'fact-emergency-exits',
      topic: 'safety',
      fact: 'Emergency exits marked with an X on the upper concourse at the four compass points are for emergencies only — follow staff instructions and do not use them during normal operations.',
    },
    {
      id: 'fact-venue-conditions',
      topic: 'weather',
      fact: venueConditionsFact(venue),
    },
    {
      id: 'fact-step-free',
      topic: 'accessibility',
      fact: 'Step-free routes connect every gate to accessible seating via ramps and elevators, and accessible restrooms adjoin every restroom location.',
    },
    {
      id: 'fact-merchandise',
      topic: 'services',
      fact: `Official merchandise stands are near sections ${sectionList(layout, 'merchandise')}.`,
    },
    {
      id: 'fact-rail',
      topic: 'transportation',
      fact: `${venue.rail.service} (${venue.rail.line}) runs from ${venue.rail.hub} to ${venue.rail.station} Station, a short walk from Gates D and E.`,
    },
    {
      id: 'fact-rideshare',
      topic: 'transportation',
      fact: `The rideshare pickup and drop-off zone is in ${venue.rideshareLot}, outside Gate F.`,
    },
    {
      id: 'fact-egress',
      topic: 'transportation',
      fact: 'After the final whistle, exits are released in stages by section block to keep concourses safe — expect a 10-20 minute wait and follow steward instructions; trains and shuttles run for at least 90 minutes.',
    },
    {
      id: 'fact-prohibited',
      topic: 'entry',
      fact: 'Outside food and drink, umbrellas, and noisemakers are not permitted inside the stadium.',
    },
    {
      id: 'fact-wifi',
      topic: 'services',
      fact: 'Free Wi-Fi is available throughout the venue on the "Stadeck-WiFi" network.',
    },
    {
      id: 'fact-sustainability',
      topic: 'sustainability',
      fact: 'Recycling and compost stations are on every concourse; the venue targets 90% matchday waste diversion.',
    },
  ];
}

/** Facts are deterministic per venue, so each sheet is generated once and reused. */
const factsCache = new Map<string, readonly StadiumFact[]>();

/**
 * The verified fact sheet for a venue, generated from its registry entry and
 * layout.
 *
 * @param venue The venue to ground facts in; defaults to the demo venue.
 * @returns The memoised fact list for that venue.
 */
export function getStadiumFacts(venue: Venue = DEFAULT_VENUE): readonly StadiumFact[] {
  const cached = factsCache.get(venue.id);
  if (cached) {
    return cached;
  }
  const facts = buildStadiumFacts(venue);
  factsCache.set(venue.id, facts);
  return facts;
}

/**
 * A venue's knowledge base flattened into prompt context — one "- topic:
 * fact" line per entry, small enough to embed in every concierge prompt
 * (~3 KB, well under the proxy's payload cap; the size test guards the
 * headroom for every venue).
 *
 * @param venue The venue to ground facts in; defaults to the demo venue.
 * @returns The newline-joined context block.
 */
export function getStadiumFactsContext(venue: Venue = DEFAULT_VENUE): string {
  return getStadiumFacts(venue)
    .map((entry) => `- ${entry.topic}: ${entry.fact}`)
    .join('\n');
}
