import type { Incident, IncidentCategory, IncidentSeverity } from '../../types/incident';
import type { Venue } from '../../types/venue';
import { getVenueLayout, sectionNumber, sectionNumberAtRingFraction } from './stadiumLayout';
import { pickRandom } from './random';
import { DEFAULT_VENUE } from './venues';

interface IncidentTemplate {
  category: IncidentCategory;
  severity: IncidentSeverity;
  summary: string;
  location: string;
}

/**
 * Incident locations are drawn from the venue's own generated layout (and
 * its registry rail link), so the feed never cites a section or station the
 * venue does not have. The lost-child template anchors to the same
 * reunification point the facts and action plans reference.
 */
function incidentTemplatesFor(venue: Venue): IncidentTemplate[] {
  const layout = getVenueLayout(venue.id);
  const reunification = layout.amenities.find((amenity) => amenity.type === 'family-reunification');
  const reunificationSection = reunification ? sectionNumber(reunification.sectionId) : '';
  return [
    {
      category: 'medical',
      severity: 'elevated',
      summary: 'Fan requiring medical assistance',
      location: `Section ${sectionNumberAtRingFraction(layout, 'lower', 0.425)}, Row 20`,
    },
    {
      category: 'crowd',
      severity: 'elevated',
      summary: 'Dense queue building at entry',
      location: 'Gate C concourse',
    },
    {
      category: 'security',
      severity: 'normal',
      summary: 'Unattended bag reported',
      location: 'Gate F plaza',
    },
    {
      category: 'lost-child',
      severity: 'critical',
      summary: 'Lost child reported by a parent',
      location: `Section ${reunificationSection} concourse`,
    },
    {
      category: 'weather',
      severity: 'critical',
      summary: 'Lightning within 8 miles — delay protocol in effect',
      location: 'Venue-wide',
    },
    {
      category: 'facilities',
      severity: 'normal',
      summary: 'Restroom facility reporting a plumbing issue',
      location: `Section ${sectionNumberAtRingFraction(layout, 'club', 0.5625)} concourse`,
    },
    {
      category: 'transportation',
      severity: 'elevated',
      summary: 'Rail platform overcrowded after final whistle',
      location: `${venue.rail.station} Rail Station`,
    },
  ];
}

/** Template sets are deterministic per venue, so each is built once and reused. */
const templateCache = new Map<string, readonly IncidentTemplate[]>();

function templatesFor(venue: Venue): readonly IncidentTemplate[] {
  const cached = templateCache.get(venue.id);
  if (cached) {
    return cached;
  }
  const templates = incidentTemplatesFor(venue);
  templateCache.set(venue.id, templates);
  return templates;
}

let incidentSequence = 0;

/**
 * Generates one randomly-sampled incident, used by useMockStream to grow the
 * live feed over time.
 *
 * @param venue The venue reporting the incident; defaults to the demo venue.
 * @returns A fresh open incident.
 */
export function generateIncident(venue: Venue = DEFAULT_VENUE): Incident {
  incidentSequence += 1;
  const template = pickRandom(templatesFor(venue));
  return {
    id: `incident-${incidentSequence}`,
    category: template.category,
    severity: template.severity,
    summary: template.summary,
    location: template.location,
    reportedAt: new Date().toISOString(),
    status: 'open',
  };
}

/**
 * A handful of incidents already "in progress" to seed the feed before
 * useMockStream starts adding more.
 *
 * @param venue The venue reporting the incidents; defaults to the demo venue.
 * @returns Three seed incidents in monitoring state.
 */
export function getInitialIncidents(venue: Venue = DEFAULT_VENUE): Incident[] {
  return templatesFor(venue)
    .slice(0, 3)
    .map((template, index) => ({
      id: `incident-seed-${index + 1}`,
      category: template.category,
      severity: template.severity,
      summary: template.summary,
      location: template.location,
      reportedAt: new Date().toISOString(),
      status: 'monitoring',
    }));
}
