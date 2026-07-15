import { describe, expect, it } from 'vitest';
import { GATES, SECTIONS } from '../data/stadiumLayout';
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

function findGate(id: string) {
  const gate = GATES.find((candidate) => candidate.id === id);
  if (!gate) {
    throw new Error(`missing test gate ${id}`);
  }
  return gate;
}

function findSection(id: string) {
  const section = SECTIONS.find((candidate) => candidate.id === id);
  if (!section) {
    throw new Error(`missing test section ${id}`);
  }
  return section;
}

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

  it('buildScenarioPrompt wraps the organizer scenario as untrusted data', () => {
    const prompt = buildScenarioPrompt({ scenario: 'Rail line goes down at halftime' });
    expect(prompt).toContain('###USER_DATA###');
    expect(prompt).toContain('Rail line goes down at halftime');
    expect(prompt).toContain('"immediateActions"');
    expect(prompt).toContain(JSON_INSTRUCTION);
  });
});
