import type { Incident, IncidentCategory, IncidentSeverity } from '../../types/incident';
import { pickRandom } from './random';

interface IncidentTemplate {
  category: IncidentCategory;
  severity: IncidentSeverity;
  summary: string;
  location: string;
}

const INCIDENT_TEMPLATES: readonly IncidentTemplate[] = [
  {
    category: 'medical',
    severity: 'elevated',
    summary: 'Fan requiring medical assistance',
    location: 'Section 118, Row 20',
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
    location: 'Section 121 concourse',
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
    location: 'Section 210 concourse',
  },
  {
    category: 'transportation',
    severity: 'elevated',
    summary: 'Rail platform overcrowded after final whistle',
    location: 'Meadowlands Rail Station',
  },
];

let incidentSequence = 0;

/** Generates one randomly-sampled incident, used by useMockStream to grow the live feed over time. */
export function generateIncident(): Incident {
  incidentSequence += 1;
  const template = pickRandom(INCIDENT_TEMPLATES);
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

/** A handful of incidents already "in progress" to seed the feed before useMockStream starts adding more. */
export function getInitialIncidents(): Incident[] {
  return INCIDENT_TEMPLATES.slice(0, 3).map((template, index) => ({
    id: `incident-seed-${index + 1}`,
    category: template.category,
    severity: template.severity,
    summary: template.summary,
    location: template.location,
    reportedAt: new Date().toISOString(),
    status: 'monitoring',
  }));
}
