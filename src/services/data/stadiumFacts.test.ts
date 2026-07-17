import { describe, expect, it } from 'vitest';
import { MAX_GEMINI_PROMPT_LENGTH } from '../../config/constants';
import { getStadiumFacts, getStadiumFactsContext } from './stadiumFacts';
import { getVenueLayout } from './stadiumLayout';
import { findVenue, VENUES } from './venues';

function requireVenue(id: string) {
  const venue = findVenue(id);
  if (!venue) {
    throw new Error(`missing test venue ${id}`);
  }
  return venue;
}

describe('getStadiumFacts', () => {
  it('has unique ids', () => {
    const ids = getStadiumFacts().map((fact) => fact.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has a non-empty topic and fact on every entry', () => {
    for (const entry of getStadiumFacts()) {
      expect(entry.topic.length).toBeGreaterThan(0);
      expect(entry.fact.length).toBeGreaterThan(0);
    }
  });

  it('returns the memoised sheet on repeat calls', () => {
    expect(getStadiumFacts()).toBe(getStadiumFacts());
  });

  it('stays consistent with the default venue layout amenities', () => {
    const context = getStadiumFactsContext();
    expect(context).toContain('112 and 132'); // first aid + prayer room sections
    expect(context).toContain('101 and 120'); // accessible seating sections
    expect(context).toContain('103 and 123'); // guest services sections
    expect(context).toContain('section 121'); // family reunification section
  });

  it('grounds transit facts in the venue registry entry', () => {
    const context = getStadiumFactsContext();
    expect(context).toContain('NJ Transit Rail');
    expect(context).toContain('Secaucus Junction to Meadowlands Station');
    expect(context).toContain('Lot E');

    const toronto = getStadiumFactsContext(requireVenue('bmo-field'));
    expect(toronto).toContain('Union Station to Exhibition Station');
  });

  it('only cites section numbers that exist in each venue’s generated layout', () => {
    for (const venue of VENUES) {
      const sectionLabels = new Set(
        getVenueLayout(venue.id).sections.map((section) => section.label),
      );
      const citedNumbers = getStadiumFactsContext(venue).match(/\b\d{3}\b/g) ?? [];
      for (const cited of citedNumbers) {
        expect(sectionLabels.has(cited), `${venue.id} cites section ${cited}`).toBe(true);
      }
    }
  });

  it('covers the topics that catch international visitors out', () => {
    const context = getStadiumFactsContext().toLowerCase();
    for (const topic of [
      'cashless',
      'clear bags',
      'water refill',
      'prayer',
      'halal',
      'kosher',
      'reunification',
      'lost child',
      'no re-entry',
      'smoke-free',
      'emergency exits',
      'rideshare',
    ]) {
      expect(context).toContain(topic);
    }
  });
});

describe('getStadiumFactsContext', () => {
  it('renders one line per fact', () => {
    expect(getStadiumFactsContext().split('\n')).toHaveLength(getStadiumFacts().length);
  });

  it('leaves generous room for the rest of the prompt under the proxy payload cap at every venue', () => {
    for (const venue of VENUES) {
      expect(getStadiumFactsContext(venue).length, venue.id).toBeLessThan(
        MAX_GEMINI_PROMPT_LENGTH / 2,
      );
    }
  });
});
