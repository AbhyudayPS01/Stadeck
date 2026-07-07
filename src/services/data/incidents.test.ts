import { describe, expect, it } from 'vitest';
import { generateIncident, getInitialIncidents } from './incidents';

const VALID_CATEGORIES = [
  'medical',
  'security',
  'crowd',
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
