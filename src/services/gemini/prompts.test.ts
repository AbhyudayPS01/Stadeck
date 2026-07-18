import { describe, expect, it } from 'vitest';
import { findGate, findSection } from '../../test/stadiumFixtures';
import { getVenueLayout, sectionNumber } from '../data/stadiumLayout';
import { findVenue } from '../data/venues';
import {
  buildAccessibilityPrompt,
  buildAnnouncementTranslationPrompt,
  buildCrowdManagementPrompt,
  buildMultilingualAssistancePrompt,
  buildNavigationPrompt,
  buildOperationalIntelligencePrompt,
  buildPlainLanguagePrompt,
  buildRealTimeDecisionSupportPrompt,
  buildScenarioPrompt,
  buildSustainabilityPrompt,
  buildSustainabilityReportPrompt,
  buildTransportationPrompt,
} from './prompts';

const JSON_INSTRUCTION = 'Respond with JSON only';

describe('query-based prompt builders', () => {
  it('buildNavigationPrompt grounds the route in the chosen gate, section, and nearby landmarks', () => {
    const prompt = buildNavigationPrompt({
      gate: findGate('gate-c'),
      section: findSection('sec-118'),
    });
    expect(prompt).toContain('Gate C');
    expect(prompt).toContain('Section 118');
    expect(prompt).toContain('lower bowl');
    expect(prompt).toContain('Restroom near Section');
    expect(prompt).toContain('closest exit Gate');
    expect(prompt).toContain(JSON_INSTRUCTION);
    expect(prompt).toContain('"steps"');
  });

  it('buildAccessibilityPrompt asks for a step-free route between the chosen endpoints', () => {
    const prompt = buildAccessibilityPrompt({
      gate: findGate('gate-a'),
      section: findSection('sec-101'),
    });
    expect(prompt).toContain('Gate A');
    expect(prompt).toContain('Section 101');
    expect(prompt).toContain('step-free');
    expect(prompt).toContain(JSON_INSTRUCTION);
    expect(prompt).toContain('"accommodations"');
  });

  it('buildPlainLanguagePrompt wraps the announcement feed text as untrusted data', () => {
    const prompt = buildPlainLanguagePrompt({ message: 'Gates are open.' });
    expect(prompt).toContain('###USER_DATA###');
    expect(prompt).toContain('Gates are open.');
    expect(prompt).toContain('plain language');
    expect(prompt).toContain('"rewrite"');
    expect(prompt).toContain(JSON_INSTRUCTION);
  });

  it('buildMultilingualAssistancePrompt asks for language auto-detection and grounds in the facts', () => {
    const prompt = buildMultilingualAssistancePrompt({
      message: 'Hola, necesito ayuda',
      facts: '- entry: Gates open 3 hours before kickoff.',
    });
    expect(prompt).toContain('Detect the language');
    expect(prompt).toContain('Gates open 3 hours before kickoff.');
    expect(prompt).toContain('###USER_DATA###');
    expect(prompt).toContain(JSON_INSTRUCTION);
  });

  it('buildMultilingualAssistancePrompt replies in an explicit target language when given one', () => {
    const prompt = buildMultilingualAssistancePrompt({
      message: 'Where is first aid?',
      facts: '- health: First aid is next to sections 112 and 132.',
      targetLanguage: 'ar',
    });
    expect(prompt).toContain('BCP-47 code "ar"');
    expect(prompt).not.toContain('Detect the language');
    expect(prompt).toContain('###USER_DATA###');
  });

  it('buildAnnouncementTranslationPrompt includes the target language and wraps the feed text as untrusted', () => {
    const prompt = buildAnnouncementTranslationPrompt({
      message: 'Gates are open.',
      targetLanguage: 'pt',
    });
    expect(prompt).toContain('pt');
    expect(prompt).toContain('###USER_DATA###');
    expect(prompt).toContain('Gates are open.');
    expect(prompt).toContain('"translation"');
    expect(prompt).toContain(JSON_INSTRUCTION);
  });

  it('sanitizes control characters out of user text before embedding it', () => {
    const prompt = buildTransportationPrompt({
      options: [],
      destination: `bad${String.fromCharCode(0)}input`,
    });
    expect(prompt).not.toContain(String.fromCharCode(0));
    expect(prompt).toContain('badinput');
  });
});

describe('data-based prompt builders', () => {
  it('buildCrowdManagementPrompt embeds aggregated readings with the hottest zones', () => {
    const readings = [
      { zoneId: 'gate-a', level: 'critical' as const, percentOfCapacity: 99, updatedAt: 'now' },
      { zoneId: 'sec-101', level: 'normal' as const, percentOfCapacity: 41, updatedAt: 'now' },
    ];
    const prompt = buildCrowdManagementPrompt({ readings });
    expect(prompt).toContain('"zoneId":"gate-a"');
    expect(prompt).toContain('"criticalZones":1');
    expect(prompt).toContain('"averagePercentOfCapacity":70');
    expect(prompt).toContain(JSON_INSTRUCTION);
    expect(prompt).toContain('"gatesToOpen"');
    expect(prompt).toContain('"stewardRedeployment"');
    expect(prompt).toContain('"congestionForecast"');
  });

  it('buildCrowdManagementPrompt keeps a full 104-zone sweep under the proxy payload cap', () => {
    const readings = Array.from({ length: 104 }, (_, index) => ({
      zoneId: `sec-${101 + index}`,
      level: 'elevated' as const,
      percentOfCapacity: 85,
      updatedAt: new Date().toISOString(),
    }));
    const prompt = buildCrowdManagementPrompt({ readings });
    expect(prompt.length).toBeLessThan(8_000);
  });

  it('buildTransportationPrompt embeds transit options and wraps the destination', () => {
    const options = [
      {
        id: 'rail',
        mode: 'rail' as const,
        label: 'Rail',
        etaMinutes: 10,
        status: 'on-time' as const,
        crowdingLevel: 'normal' as const,
      },
    ];
    const prompt = buildTransportationPrompt({ options, destination: 'Gate C' });
    expect(prompt).toContain('"id":"rail"');
    expect(prompt).toContain('###USER_DATA###');
    expect(prompt).toContain('Gate C');
    expect(prompt).toContain('final whistle');
    expect(prompt).toContain('"departureWindow"');
  });

  it('buildSustainabilityPrompt embeds the metrics as JSON', () => {
    const metrics = {
      timestamp: 'now',
      wasteDivertedPercent: 70,
      renewableEnergyPercent: 50,
      waterUsageLiters: 200_000,
      carbonOffsetKg: 15_000,
      transitModeSharePercent: 75,
    };
    const prompt = buildSustainabilityPrompt({ metrics });
    expect(prompt).toContain('"wasteDivertedPercent":70');
    expect(prompt).toContain('"tips"');
  });

  it('buildSustainabilityReportPrompt asks for the organizer match report shape', () => {
    const metrics = {
      timestamp: 'now',
      wasteDivertedPercent: 70,
      renewableEnergyPercent: 50,
      waterUsageLiters: 200_000,
      carbonOffsetKg: 15_000,
      transitModeSharePercent: 75,
    };
    const prompt = buildSustainabilityReportPrompt({ metrics });
    expect(prompt).toContain('organizers');
    expect(prompt).toContain('"headline"');
    expect(prompt).toContain('"highlights"');
    expect(prompt).toContain('"recommendations"');
    expect(prompt).toContain(JSON_INSTRUCTION);
  });

  it('buildOperationalIntelligencePrompt embeds the KPI snapshot as JSON', () => {
    const kpis = [
      {
        id: 'attendance',
        label: 'Attendance',
        value: 80_000,
        unit: 'fans',
        trend: 'up' as const,
        severity: 'normal' as const,
        timestamp: 'now',
      },
    ];
    const prompt = buildOperationalIntelligencePrompt({ kpis });
    expect(prompt).toContain('"id":"attendance"');
    expect(prompt).toContain('"anomalies"');
    expect(prompt).toContain('"trends"');
  });

  it('buildRealTimeDecisionSupportPrompt embeds the incident and requests the structured plan', () => {
    const incident = {
      id: 'incident-1',
      category: 'medical' as const,
      severity: 'elevated' as const,
      summary: 'Fan down',
      location: 'Section 118',
      reportedAt: 'now',
      status: 'open' as const,
    };
    const prompt = buildRealTimeDecisionSupportPrompt({ incident });
    expect(prompt).toContain('"id":"incident-1"');
    expect(prompt).toContain('"immediateActions"');
    expect(prompt).toContain('"teamsToNotify"');
    expect(prompt).toContain('"escalationCriteria"');
    expect(prompt).toContain('"priority"');
  });

  it('buildRealTimeDecisionSupportPrompt dictates the child-safety protocol for lost-child incidents', () => {
    const incident = {
      id: 'incident-2',
      category: 'lost-child' as const,
      severity: 'critical' as const,
      summary: 'Lost child reported by a parent',
      location: 'Section 121 concourse',
      reportedAt: 'now',
      status: 'open' as const,
    };
    const prompt = buildRealTimeDecisionSupportPrompt({ incident });
    expect(prompt).toContain('never moves them through the crowd');
    expect(prompt).toContain('Family Reunification point near section 121');
    expect(prompt).toContain('never taken outside the venue');
    expect(prompt).toContain('15 minutes');
  });

  it('buildScenarioPrompt wraps the organizer scenario as untrusted data', () => {
    const prompt = buildScenarioPrompt({ scenario: 'Rail line goes down at halftime' });
    expect(prompt).toContain('###USER_DATA###');
    expect(prompt).toContain('Rail line goes down at halftime');
    expect(prompt).toContain('"immediateActions"');
    expect(prompt).toContain(JSON_INSTRUCTION);
  });
});

describe('venue context', () => {
  it('grounds prompts in the default venue when none is passed', () => {
    const prompt = buildScenarioPrompt({ scenario: 'Heavy rain at kickoff' });
    expect(prompt).toContain(
      'at MetLife Stadium in East Rutherford, hosting the Final at FIFA World Cup 2026',
    );
  });

  it('switches the persona to the venue passed in', () => {
    const toronto = findVenue('bmo-field');
    expect(toronto).toBeDefined();
    if (!toronto) return;
    const prompt = buildCrowdManagementPrompt({ readings: [], venue: toronto });
    expect(prompt).toContain('at BMO Field in Toronto');
    expect(prompt).toContain('hosting Group stage matches at FIFA World Cup 2026');
    expect(prompt).toContain('45,000 fans');
    expect(prompt).not.toContain('MetLife');
  });

  it('grounds crowd management reasoning in the venue’s roof, without an altitude note below threshold', () => {
    const attStadium = findVenue('att-stadium');
    expect(attStadium).toBeDefined();
    if (!attStadium) return;
    const prompt = buildCrowdManagementPrompt({ readings: [], venue: attStadium });
    expect(prompt).toContain('retractable roof');
    expect(prompt).not.toContain('elevation');
  });

  it('adds an altitude note to ops reasoning at high-altitude venues', () => {
    const azteca = findVenue('estadio-azteca');
    expect(azteca).toBeDefined();
    if (!azteca) return;

    const crowdPrompt = buildCrowdManagementPrompt({ readings: [], venue: azteca });
    expect(crowdPrompt).toContain('2240m elevation');
    expect(crowdPrompt).toContain('dehydration');

    const scenarioPrompt = buildScenarioPrompt({ scenario: 'Heat wave during a match', venue: azteca });
    expect(scenarioPrompt).toContain('2240m elevation');
  });

  it('carries the venue conditions line into real-time decision support prompts', () => {
    const sofiStadium = findVenue('sofi-stadium');
    expect(sofiStadium).toBeDefined();
    if (!sofiStadium) return;
    const incident = {
      id: 'incident-4',
      category: 'weather' as const,
      severity: 'critical' as const,
      summary: 'Storm approaching',
      location: 'Venue-wide',
      reportedAt: 'now',
      status: 'open' as const,
    };
    const prompt = buildRealTimeDecisionSupportPrompt({ incident, venue: sofiStadium });
    expect(prompt).toContain('fixed roof');
  });

  it('anchors the lost-child protocol to the venue’s own reunification section', () => {
    const toronto = findVenue('bmo-field');
    expect(toronto).toBeDefined();
    if (!toronto) return;
    const reunification = getVenueLayout(toronto.id).amenities.find(
      (amenity) => amenity.type === 'family-reunification',
    );
    expect(reunification).toBeDefined();
    if (!reunification) return;
    const incident = {
      id: 'incident-3',
      category: 'lost-child' as const,
      severity: 'critical' as const,
      summary: 'Lost child reported by a parent',
      location: 'Concourse',
      reportedAt: 'now',
      status: 'open' as const,
    };
    const prompt = buildRealTimeDecisionSupportPrompt({ incident, venue: toronto });
    expect(prompt).toContain(
      `Family Reunification point near section ${sectionNumber(reunification.sectionId)}`,
    );
  });
});
