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
    // fact-venue-profile states registry numbers (capacity, elevation) that
    // happen to format as bare 3-digit tokens (e.g. a 180m elevation) without
    // being section citations, so it is excluded from this scan — every
    // other fact's numbers must still resolve to a real section.
    for (const venue of VENUES) {
      const sectionLabels = new Set(
        getVenueLayout(venue.id).sections.map((section) => section.label),
      );
      const sectionFacts = getStadiumFacts(venue)
        .filter((fact) => fact.id !== 'fact-venue-profile')
        .map((fact) => fact.fact)
        .join('\n');
      const citedNumbers = sectionFacts.match(/\b\d{3}\b/g) ?? [];
      for (const cited of citedNumbers) {
        expect(sectionLabels.has(cited), `${venue.id} cites section ${cited}`).toBe(true);
      }
    }
  });

  it('tells Mexican-venue fans cash is accepted, unlike the cashless US/Canada default', () => {
    const metlife = getStadiumFactsContext().toLowerCase();
    expect(metlife).toContain('fully cashless');
    expect(metlife).not.toContain('cash are all accepted');

    const azteca = getStadiumFactsContext(requireVenue('estadio-azteca')).toLowerCase();
    expect(azteca).toContain('cash are all accepted');
    expect(azteca).not.toContain('fully cashless');
  });

  it('describes each venue’s actual roof configuration', () => {
    const attStadium = getStadiumFactsContext(requireVenue('att-stadium'));
    expect(attStadium).toContain('retractable roof');

    const sofiStadium = getStadiumFactsContext(requireVenue('sofi-stadium'));
    expect(sofiStadium).toContain('fixed roof');

    const metlife = getStadiumFactsContext();
    expect(metlife).toContain('open-air bowl');
  });

  it('adds an altitude advisory only for high-altitude venues', () => {
    const azteca = getStadiumFactsContext(requireVenue('estadio-azteca'));
    expect(azteca).toContain('2240m above sea level');
    expect(azteca).toContain('stay hydrated');

    const metlife = getStadiumFactsContext();
    expect(metlife).not.toContain('above sea level');
  });

  it('states MetLife’s Final-venue profile: stage, cashless payments, clear-bag policy, and Meadowlands rail egress', () => {
    const metlife = getStadiumFactsContext().toLowerCase();
    expect(metlife).toContain('hosting the final');
    expect(metlife).toContain('fully cashless');
    expect(metlife).toContain('clear bags up to 12 x 6 x 12 inches');
    expect(metlife).toContain('meadowlands');
  });

  it('states Azteca’s altitude, hydration guidance, and medical-incident risk note', () => {
    const azteca = getStadiumFactsContext(requireVenue('estadio-azteca')).toLowerCase();
    expect(azteca).toContain('2240m elevation');
    expect(azteca).toContain('stay hydrated');
    expect(azteca).toContain('medical-incident');
  });

  it('states AT&T Stadium’s retractable roof and its climate-controlled concourses', () => {
    const attStadium = getStadiumFactsContext(requireVenue('att-stadium')).toLowerCase();
    expect(attStadium).toContain('retractable roof');
    expect(attStadium).toContain('climate-controlled');
  });

  it('states BMO Field’s smaller capacity, Canadian venue, and different payment/bag norms', () => {
    const bmo = getStadiumFactsContext(requireVenue('bmo-field')).toLowerCase();
    expect(bmo).toContain('smaller host venues');
    expect(bmo).toContain('canadian venue');
    expect(bmo).toContain('canadian dollars');
    expect(bmo).toContain('14 x 14 x 6 inches');
  });

  it('gives every venue its own registry facts (capacity, roof, elevation, time zone) with no empty fact set', () => {
    for (const venue of VENUES) {
      const context = getStadiumFactsContext(venue);
      expect(context.length, venue.id).toBeGreaterThan(0);
      expect(context, venue.id).toContain(venue.timezone);
      expect(context, venue.id).toContain(`${venue.altitudeMeters}m elevation`);
      expect(context.toLowerCase(), venue.id).toContain(venue.stage.toLowerCase());
    }
  });

  it('drops the club-level line from the seating fact for two-tier venues', () => {
    const bmo = getStadiumFactsContext(requireVenue('bmo-field'));
    expect(bmo).not.toContain('club level');

    const metlife = getStadiumFactsContext();
    expect(metlife).toContain('club level');
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
