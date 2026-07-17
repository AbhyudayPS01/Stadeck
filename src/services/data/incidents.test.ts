import { describe, expect, it } from 'vitest';
import { generateIncident, getInitialIncidents } from './incidents';
import { getVenueLayout } from './stadiumLayout';
import { VENUES } from './venues';

const VALID_CATEGORIES = [
  'medical',
  'security',
  'crowd',
  'lost-child',
  'weather',
  'facilities',
  'transportation',
];

describe('generateIncident', () => {
  it('returns an open incident with a valid category and severity', () => {
    const incident = generateIncident();
    expect(VALID_CATEGORIES).toContain(incident.category);
    expect(['normal', 'elevated', 'critical']).toContain(incident.severity);
    expect(incident.status).toBe('open');
    expect(incident.summary.length).toBeGreaterThan(0);
  });

  it('gives each call a unique id', () => {
    const first = generateIncident();
    const second = generateIncident();
    expect(first.id).not.toBe(second.id);
  });

  it('can report a critical lost-child incident at the reunification concourse', () => {
    // The template pool is randomly sampled, so sample until it appears.
    const incident = Array.from({ length: 200 }, generateIncident).find(
      (candidate) => candidate.category === 'lost-child',
    );
    expect(incident).toBeDefined();
    expect(incident?.severity).toBe('critical');
    expect(incident?.location).toContain('121');
  });
});

describe('venue-scoped locations', () => {
  it('only cites sections that exist in each venue’s generated layout', () => {
    for (const venue of VENUES) {
      const sectionLabels = new Set(
        getVenueLayout(venue.id).sections.map((section) => section.label),
      );
      const sampled = Array.from({ length: 50 }, () => generateIncident(venue));
      for (const incident of sampled) {
        const cited = incident.location.match(/Section (\d+)/)?.[1];
        if (cited !== undefined) {
          expect(sectionLabels.has(cited), `${venue.id}: ${incident.location}`).toBe(true);
        }
      }
    }
  });

  it('names the venue’s own rail station in transportation incidents', () => {
    const vancouver = VENUES.find((venue) => venue.id === 'bc-place');
    expect(vancouver).toBeDefined();
    if (!vancouver) return;
    const incident = Array.from({ length: 200 }, () => generateIncident(vancouver)).find(
      (candidate) => candidate.category === 'transportation',
    );
    expect(incident?.location).toBe('Stadium-Chinatown Rail Station');
  });
});

describe('getInitialIncidents', () => {
  it('returns 3 seed incidents marked as monitoring', () => {
    const incidents = getInitialIncidents();
    expect(incidents).toHaveLength(3);
    for (const incident of incidents) {
      expect(incident.status).toBe('monitoring');
    }
  });

  it('gives each seed incident a unique id', () => {
    const incidents = getInitialIncidents();
    const ids = new Set(incidents.map((incident) => incident.id));
    expect(ids.size).toBe(incidents.length);
  });
});
