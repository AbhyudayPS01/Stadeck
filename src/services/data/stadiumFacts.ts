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
    fact: 'Only clear bags up to 12 x 6 x 12 inches are allowed; small clutches are screened at every gate.',
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
    fact: 'Free water refill stations are on every concourse; bring an empty reusable bottle.',
  },
  {
    id: 'fact-food',
    topic: 'services',
    fact: 'Concessions near sections 108, 118, 128, and 138 include halal, vegetarian, and gluten-free options.',
  },
  {
    id: 'fact-restrooms',
    topic: 'services',
    fact: 'Restrooms are near sections 105, 115, 125, and 135 on the lower concourse.',
  },
  {
    id: 'fact-guest-services',
    topic: 'services',
    fact: 'Guest Services desks at sections 103 and 123 handle lost and found, lost children, and language help.',
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
 * per entry, small enough to embed in every concierge prompt (~1.5 KB, well
 * under the proxy's payload cap).
 */
export function getStadiumFactsContext(): string {
  return STADIUM_FACTS.map((entry) => `- ${entry.topic}: ${entry.fact}`).join('\n');
}
