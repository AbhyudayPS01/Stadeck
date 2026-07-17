import { describe, expect, it } from 'vitest';
import { MAX_GEMINI_PROMPT_LENGTH } from '../../config/constants';
import { getStadiumFactsContext, STADIUM_FACTS } from './stadiumFacts';

describe('STADIUM_FACTS', () => {
  it('has unique ids', () => {
    const ids = STADIUM_FACTS.map((fact) => fact.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has a non-empty topic and fact on every entry', () => {
    for (const entry of STADIUM_FACTS) {
      expect(entry.topic.length).toBeGreaterThan(0);
      expect(entry.fact.length).toBeGreaterThan(0);
    }
  });

  it('stays consistent with the stadium layout amenities', () => {
    const context = getStadiumFactsContext();
    expect(context).toContain('112 and 132'); // first aid + prayer room sections
    expect(context).toContain('101 and 120'); // accessible seating sections
    expect(context).toContain('103 and 123'); // guest services sections
    expect(context).toContain('section 121'); // family reunification section
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
    expect(getStadiumFactsContext().split('\n')).toHaveLength(STADIUM_FACTS.length);
  });

  it('leaves generous room for the rest of the prompt under the proxy payload cap', () => {
    expect(getStadiumFactsContext().length).toBeLessThan(MAX_GEMINI_PROMPT_LENGTH / 2);
  });
});
