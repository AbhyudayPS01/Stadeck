import { describe, expect, it } from 'vitest';
import {
  mockAccessibilityResponse,
  mockCrowdManagementResponse,
  mockMultilingualAssistanceResponse,
  mockNavigationResponse,
  mockOperationalIntelligenceResponse,
  mockRealTimeDecisionSupportResponse,
  mockSustainabilityReportResponse,
  mockSustainabilityResponse,
  mockTransportationResponse,
} from './mock';
import {
  isAccessibilityResponse,
  isAnnouncementTranslationResponse,
  isCrowdManagementResponse,
  isMultilingualAssistanceResponse,
  isNavigationResponse,
  isOperationalIntelligenceResponse,
  isPlainLanguageResponse,
  isRealTimeDecisionSupportResponse,
  isSustainabilityReportResponse,
  isSustainabilityResponse,
  isTransportationResponse,
} from './validators';

/**
 * Every guard is checked against its own mock (the contract's canonical
 * example) — if a mock ever drifts from the response contract, this suite
 * fails before the drift ships.
 */
const GUARD_CASES: ReadonlyArray<[string, (value: unknown) => boolean, unknown]> = [
  ['isNavigationResponse', isNavigationResponse, mockNavigationResponse()],
  ['isCrowdManagementResponse', isCrowdManagementResponse, mockCrowdManagementResponse()],
  ['isAccessibilityResponse', isAccessibilityResponse, mockAccessibilityResponse()],
  ['isPlainLanguageResponse', isPlainLanguageResponse, { rewrite: 'Short words.' }],
  ['isTransportationResponse', isTransportationResponse, mockTransportationResponse()],
  ['isSustainabilityResponse', isSustainabilityResponse, mockSustainabilityResponse()],
  [
    'isSustainabilityReportResponse',
    isSustainabilityReportResponse,
    mockSustainabilityReportResponse(),
  ],
  [
    'isMultilingualAssistanceResponse',
    isMultilingualAssistanceResponse,
    mockMultilingualAssistanceResponse(),
  ],
  [
    'isAnnouncementTranslationResponse',
    isAnnouncementTranslationResponse,
    { translation: 'Hola', language: 'es' },
  ],
  [
    'isOperationalIntelligenceResponse',
    isOperationalIntelligenceResponse,
    mockOperationalIntelligenceResponse(),
  ],
  [
    'isRealTimeDecisionSupportResponse',
    isRealTimeDecisionSupportResponse,
    mockRealTimeDecisionSupportResponse(),
  ],
];

describe('response shape guards', () => {
  it.each(GUARD_CASES)('%s accepts the canonical mock response', (_name, guard, sample) => {
    expect(guard(sample)).toBe(true);
  });

  it.each(GUARD_CASES)('%s rejects non-objects and empty objects', (_name, guard) => {
    expect(guard(null)).toBe(false);
    expect(guard('a string')).toBe(false);
    expect(guard({})).toBe(false);
  });

  it('rejects a response with a wrong-typed field', () => {
    expect(isNavigationResponse({ summary: 'ok', steps: ['a'], etaMinutes: 'six' })).toBe(false);
  });

  it('rejects an out-of-range priority word', () => {
    const plan = { ...mockRealTimeDecisionSupportResponse(), priority: 'urgent' };
    expect(isRealTimeDecisionSupportResponse(plan)).toBe(false);
  });
});
