/**
 * Local knowledge base that grounds the multilingual concierge. Every fact is
 * consistent with the stadiumLayout config (amenity sections, gate letters)
 * so AI answers, the schematic map, and mock feeds never contradict each
 * other. Details are demo fiction for the 2026 Final, not venue guidance.
 */

export interface StadiumFact {
  id: string;
  /** Coarse grouping, useful for future retrieval-style filtering. */
  topic: string;
  fact: string;
}

export const STADIUM_FACTS: readonly StadiumFact[] = [
  {
    id: 'fact-gates',
    topic: 'entry',
    fact: 'Gates A through H sit at compass points around the stadium and open 3 hours before kickoff.',
  },
  {
    id: 'fact-bag-policy',
    topic: 'entry',
    fact: 'Only clear bags up to 12 x 6 x 12 inches or small clutches are allowed; non-compliant bags can be checked for a fee at the bag-check tents outside Gate B.',
  },
  {
    id: 'fact-cashless',
    topic: 'payments',
    fact: 'The stadium is fully cashless: card and mobile payments only, no cash accepted anywhere. Cash-to-card kiosks on each concourse convert cash to a free prepaid card.',
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
    fact: 'Seating: lower bowl sections 101-140, club level 201-216, upper bowl 301-340.',
  },
  {
    id: 'fact-accessible-seating',
    topic: 'accessibility',
    fact: 'Accessible seating is next to sections 101 and 120, with elevators at Gates A, C, E, and G.',
  },
  {
    id: 'fact-sensory-room',
    topic: 'accessibility',
    fact: 'A quiet sensory room is available beside Guest Services at section 103.',
  },
  {
    id: 'fact-first-aid',
    topic: 'health',
    fact: 'First aid stations are next to sections 112 and 132 and are staffed until one hour after the match.',
  },
  {
    id: 'fact-water',
    topic: 'services',
    fact: 'Free filtered water refill stations are on every concourse, including near sections 104, 118, 124, and 138; bringing an empty reusable bottle through security is permitted.',
  },
  {
    id: 'fact-food',
    topic: 'services',
    fact: 'Concessions near sections 108, 118, 128, and 138 include halal, kosher, vegetarian, and gluten-free options.',
  },
  {
    id: 'fact-prayer-rooms',
    topic: 'services',
    fact: 'Multi-faith prayer and quiet rooms are on the main concourse near sections 112 and 132, open from gate time until one hour after the final whistle.',
  },
  {
    id: 'fact-restrooms',
    topic: 'services',
    fact: 'Restrooms are near sections 105, 115, 125, and 135 on the lower concourse.',
  },
  {
    id: 'fact-guest-services',
    topic: 'services',
    fact: 'Guest Services desks at sections 103 and 123 handle lost and found, lost children, language help, and free sensory kits to borrow.',
  },
  {
    id: 'fact-family-reunification',
    topic: 'safety',
    fact: 'If your group is separated, meet at the Family Reunification point near section 121, beside Guest Services at section 123.',
  },
  {
    id: 'fact-lost-child',
    topic: 'safety',
    fact: 'Report a lost child to any steward or Guest Services desk immediately: staff stay with the child where they are found and page the guardian to the Family Reunification point near section 121. Children are never taken outside the venue.',
  },
  {
    id: 'fact-emergency-exits',
    topic: 'safety',
    fact: 'Emergency exits marked with an X on the upper concourse at the four compass points are for emergencies only — follow staff instructions and do not use them during normal operations.',
  },
  {
    id: 'fact-step-free',
    topic: 'accessibility',
    fact: 'Step-free routes connect every gate to accessible seating via ramps and elevators, and accessible restrooms adjoin every restroom location.',
  },
  {
    id: 'fact-merchandise',
    topic: 'services',
    fact: 'Official merchandise stands are near sections 110 and 130.',
  },
  {
    id: 'fact-rail',
    topic: 'transportation',
    fact: 'NJ Transit rail runs from Secaucus Junction to Meadowlands Station, a short walk from Gates D and E.',
  },
  {
    id: 'fact-rideshare',
    topic: 'transportation',
    fact: 'The rideshare pickup and drop-off zone is in Lot E, outside Gate F.',
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

/**
 * The knowledge base flattened into prompt context — one "- topic: fact" line
 * per entry, small enough to embed in every concierge prompt (~3 KB, well
 * under the proxy's payload cap; the size test guards the headroom).
 */
export function getStadiumFactsContext(): string {
  return STADIUM_FACTS.map((entry) => `- ${entry.topic}: ${entry.fact}`).join('\n');
}
