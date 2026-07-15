import { describe, expect, it } from 'vitest';
import { SUPPORTED_LANGUAGES } from '../../config/constants';
import { getInitialAnnouncements } from '../data/announcements';
import {
  mockAccessibilityResponse,
  mockAnnouncementTranslationResponse,
  mockCrowdManagementResponse,
  mockMultilingualAssistanceResponse,
  mockNavigationResponse,
  mockOperationalIntelligenceResponse,
  mockRealTimeDecisionSupportResponse,
  mockScenarioPlanResponse,
  mockSustainabilityResponse,
  mockTransportationResponse,
} from './mock';

const MOCK_FNS: ReadonlyArray<[string, () => unknown]> = [
  ['mockNavigationResponse', mockNavigationResponse],
  ['mockCrowdManagementResponse', mockCrowdManagementResponse],
  ['mockAccessibilityResponse', mockAccessibilityResponse],
  ['mockTransportationResponse', mockTransportationResponse],
  ['mockSustainabilityResponse', mockSustainabilityResponse],
  ['mockMultilingualAssistanceResponse', mockMultilingualAssistanceResponse],
  ['mockOperationalIntelligenceResponse', mockOperationalIntelligenceResponse],
  ['mockRealTimeDecisionSupportResponse', mockRealTimeDecisionSupportResponse],
  ['mockScenarioPlanResponse', mockScenarioPlanResponse],
];

describe('mock responses', () => {
  it.each(MOCK_FNS)('%s is deterministic across calls', (_name, mockFn) => {
    expect(mockFn()).toEqual(mockFn());
  });
});

describe('mockNavigationResponse', () => {
  it('returns a non-empty summary and at least one step', () => {
    const response = mockNavigationResponse();
    expect(response.summary.length).toBeGreaterThan(0);
    expect(response.steps.length).toBeGreaterThan(0);
    expect(response.etaMinutes).toBeGreaterThan(0);
  });
});

describe('mockCrowdManagementResponse', () => {
  it('recommends gates, steward moves, and a forecast', () => {
    const response = mockCrowdManagementResponse();
    expect(response.gatesToOpen.length).toBeGreaterThan(0);
    expect(response.stewardRedeployment.length).toBeGreaterThan(0);
    expect(response.congestionForecast.length).toBeGreaterThan(0);
  });
});

describe('mockRealTimeDecisionSupportResponse', () => {
  it('returns a valid priority and every structured plan section', () => {
    const response = mockRealTimeDecisionSupportResponse();
    expect(['normal', 'elevated', 'critical']).toContain(response.priority);
    expect(response.immediateActions.length).toBeGreaterThan(0);
    expect(response.teamsToNotify.length).toBeGreaterThan(0);
    expect(response.escalationCriteria.length).toBeGreaterThan(0);
  });
});

describe('mockScenarioPlanResponse', () => {
  it('returns a full contingency plan', () => {
    const response = mockScenarioPlanResponse();
    expect(response.immediateActions.length).toBeGreaterThan(0);
    expect(response.teamsToNotify.length).toBeGreaterThan(0);
    expect(response.escalationCriteria.length).toBeGreaterThan(0);
  });
});

describe('mockMultilingualAssistanceResponse', () => {
  it('defaults to English', () => {
    const response = mockMultilingualAssistanceResponse();
    expect(response.language).toBe('en');
    expect(response.reply.length).toBeGreaterThan(0);
  });

  it.each(SUPPORTED_LANGUAGES.map((option) => option.code))(
    'replies in %s when that language is detected',
    (code) => {
      const response = mockMultilingualAssistanceResponse(code);
      expect(response.language).toBe(code);
      expect(response.reply.length).toBeGreaterThan(0);
    },
  );

  it('falls back to English for an unsupported language code', () => {
    const response = mockMultilingualAssistanceResponse('xx');
    expect(response.language).toBe('en');
  });
});

describe('mockAnnouncementTranslationResponse', () => {
  const announcement = getInitialAnnouncements()[0];
  if (!announcement) {
    throw new Error('announcement feed unexpectedly empty in test setup');
  }

  it('serves the canned translation for a supported language', () => {
    const response = mockAnnouncementTranslationResponse(announcement, 'es');
    expect(response.language).toBe('es');
    expect(response.translation).toBe(announcement.translations['es']);
  });

  it('returns the English source when English is requested', () => {
    const response = mockAnnouncementTranslationResponse(announcement, 'en');
    expect(response).toEqual({ translation: announcement.message, language: 'en' });
  });

  it('falls back to the labelled English source for an unknown language', () => {
    const response = mockAnnouncementTranslationResponse(announcement, 'xx');
    expect(response).toEqual({ translation: announcement.message, language: 'en' });
  });
});
