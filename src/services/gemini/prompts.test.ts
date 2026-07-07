import { describe, expect, it } from 'vitest';
import {
  buildAccessibilityPrompt,
  buildCrowdManagementPrompt,
  buildMultilingualAssistancePrompt,
  buildNavigationPrompt,
  buildOperationalIntelligencePrompt,
  buildRealTimeDecisionSupportPrompt,
  buildSustainabilityPrompt,
  buildTransportationPrompt,
} from './prompts';

const JSON_INSTRUCTION = 'Respond with JSON only';

describe('query-based prompt builders', () => {
  it('buildNavigationPrompt wraps the query as untrusted data and requests JSON', () => {
    const prompt = buildNavigationPrompt({ query: 'Where is Section 118?' });
    expect(prompt).toContain('###USER_DATA###');
    expect(prompt).toContain('Where is Section 118?');
    expect(prompt).toContain(JSON_INSTRUCTION);
    expect(prompt).toContain('"steps"');
  });

  it('buildAccessibilityPrompt wraps the query as untrusted data and requests JSON', () => {
    const prompt = buildAccessibilityPrompt({ query: 'I use a wheelchair, where should I sit?' });
    expect(prompt).toContain('###USER_DATA###');
    expect(prompt).toContain(JSON_INSTRUCTION);
    expect(prompt).toContain('"accommodations"');
  });

  it('buildMultilingualAssistancePrompt includes the target language and wraps the message', () => {
    const prompt = buildMultilingualAssistancePrompt({
      message: 'Hola, necesito ayuda',
      targetLanguage: 'es',
    });
    expect(prompt).toContain('es');
    expect(prompt).toContain('###USER_DATA###');
    expect(prompt).toContain(JSON_INSTRUCTION);
  });

  it('sanitizes control characters out of a query before embedding it', () => {
    const prompt = buildNavigationPrompt({ query: `bad${String.fromCharCode(0)}input` });
    expect(prompt).not.toContain(String.fromCharCode(0));
    expect(prompt).toContain('badinput');
  });
});

describe('data-based prompt builders', () => {
  it('buildCrowdManagementPrompt embeds the density readings as JSON', () => {
    const readings = [
      { zoneId: 'gate-a', level: 'critical' as const, percentOfCapacity: 99, updatedAt: 'now' },
    ];
    const prompt = buildCrowdManagementPrompt({ readings });
    expect(prompt).toContain('"zoneId":"gate-a"');
    expect(prompt).toContain(JSON_INSTRUCTION);
    expect(prompt).toContain('"hotZones"');
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
    expect(prompt).toContain('"alerts"');
  });

  it('buildRealTimeDecisionSupportPrompt embeds the incident and requests a priority field', () => {
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
    expect(prompt).toContain('"actionPlan"');
    expect(prompt).toContain('"priority"');
  });
});
