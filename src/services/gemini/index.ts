import { GEMINI_MIN_REQUEST_INTERVAL_MS } from '../../config/constants';
import { getStadiumFactsContext } from '../data/stadiumFacts';
import type { Announcement } from '../../types/announcement';
import type { DensityReading } from '../../types/crowd';
import type { Incident } from '../../types/incident';
import type { KpiSnapshot } from '../../types/operational';
import type { Gate, StadiumSection } from '../../types/stadium';
import type { SustainabilityMetrics } from '../../types/sustainability';
import type { TransitOption } from '../../types/transportation';
import { detectLanguage } from '../../utils/detectLanguage';
import { parseJsonResponse, requestGemini } from './client';
import {
  mockAccessibilityResponse,
  mockAnnouncementTranslationResponse,
  mockCrowdManagementResponse,
  mockMultilingualAssistanceResponse,
  mockNavigationResponse,
  mockOperationalIntelligenceResponse,
  mockPlainLanguageResponse,
  mockRealTimeDecisionSupportResponse,
  mockScenarioPlanResponse,
  mockSustainabilityReportResponse,
  mockSustainabilityResponse,
  mockTransportationResponse,
} from './mock';
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
import type {
  AccessibilityResponse,
  AnnouncementTranslationResponse,
  CrowdManagementResponse,
  FeatureId,
  MultilingualAssistanceResponse,
  NavigationResponse,
  OperationalIntelligenceResponse,
  PlainLanguageResponse,
  RealTimeDecisionSupportResponse,
  SustainabilityReportResponse,
  SustainabilityResponse,
  TransportationResponse,
} from './responses';
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

export interface GeminiResult<T> {
  data: T;
  /** "mock" drives the "Demo data" badge in the UI — live and mock never look identical to the fan. */
  source: 'live' | 'mock';
}

/**
 * Secondary AI actions get their own limiter key so they never rate-limit the
 * primary feature they share a screen with (e.g. translating an announcement
 * vs. the concierge chat — used back-to-back on the same screen).
 */
type LimiterKey =
  | FeatureId
  | 'announcement-translation'
  | 'scenario-planning'
  | 'plain-language'
  | 'sustainability-report';

const lastCalledAt = new Map<LimiterKey, number>();

function isWithinMinInterval(feature: LimiterKey): boolean {
  const last = lastCalledAt.get(feature);
  return last !== undefined && Date.now() - last < GEMINI_MIN_REQUEST_INTERVAL_MS;
}

/**
 * Shared per-feature request flow: client-side rate limiting (so rapid
 * repeated triggers on one screen don't hammer the API), then a live
 * Gemini call, defensively parsed — falling back to the deterministic mock
 * on any failure so the app never shows an error state for AI content.
 */
async function callFeature<T>(
  feature: LimiterKey,
  prompt: string,
  isValidResponse: (value: unknown) => value is T,
  mockResponse: () => T,
): Promise<GeminiResult<T>> {
  if (isWithinMinInterval(feature)) {
    return { data: mockResponse(), source: 'mock' };
  }

  lastCalledAt.set(feature, Date.now());

  try {
    const text = await requestGemini(prompt);
    const data = parseJsonResponse(text, isValidResponse);
    return { data, source: 'live' };
  } catch {
    return { data: mockResponse(), source: 'mock' };
  }
}

/** Turn-by-turn walking directions from an entry gate to a seating section. */
export async function getNavigationDirections(
  gate: Gate,
  section: StadiumSection,
): Promise<GeminiResult<NavigationResponse>> {
  return callFeature(
    'navigation',
    buildNavigationPrompt({ gate, section }),
    isNavigationResponse,
    () => mockNavigationResponse(gate.label, section.label),
  );
}

/** Gate/steward recommendations and a congestion forecast over the live sensor sweep. */
export async function getCrowdManagementSummary(
  readings: DensityReading[],
): Promise<GeminiResult<CrowdManagementResponse>> {
  return callFeature(
    'crowd-management',
    buildCrowdManagementPrompt({ readings }),
    isCrowdManagementResponse,
    mockCrowdManagementResponse,
  );
}

/** Step-free route from an entry gate to an accessible seating section. */
export async function getStepFreeRoute(
  gate: Gate,
  section: StadiumSection,
): Promise<GeminiResult<AccessibilityResponse>> {
  return callFeature(
    'accessibility',
    buildAccessibilityPrompt({ gate, section }),
    isAccessibilityResponse,
    () => mockAccessibilityResponse(gate.label, section.label),
  );
}

/** "Access Companion": rewrites a venue announcement into plain language. */
export async function getPlainLanguageRewrite(
  announcement: Announcement,
): Promise<GeminiResult<PlainLanguageResponse>> {
  return callFeature(
    'plain-language',
    buildPlainLanguagePrompt({ message: announcement.message }),
    isPlainLanguageResponse,
    () => mockPlainLanguageResponse(announcement),
  );
}

/** Personalized post-match departure strategy built from the live transit board. */
export async function getTransportationRecommendation(
  options: TransitOption[],
  destination: string,
): Promise<GeminiResult<TransportationResponse>> {
  return callFeature(
    'transportation',
    buildTransportationPrompt({ options, destination }),
    isTransportationResponse,
    mockTransportationResponse,
  );
}

/** Per-fan eco-actions grounded in the live venue metrics. */
export async function getSustainabilityTips(
  metrics: SustainabilityMetrics,
): Promise<GeminiResult<SustainabilityResponse>> {
  return callFeature(
    'sustainability',
    buildSustainabilityPrompt({ metrics }),
    isSustainabilityResponse,
    mockSustainabilityResponse,
  );
}

/** Organizer sustainability match report over the same venue metrics. */
export async function getSustainabilityReport(
  metrics: SustainabilityMetrics,
): Promise<GeminiResult<SustainabilityReportResponse>> {
  return callFeature(
    'sustainability-report',
    buildSustainabilityReportPrompt({ metrics }),
    isSustainabilityReportResponse,
    mockSustainabilityReportResponse,
  );
}

/**
 * Concierge chat: the model detects the fan's language and answers in it,
 * grounded in the local stadium facts. On the mock path, the client-side
 * heuristic picks the reply language so offline detection still works.
 */
export async function getMultilingualReply(
  message: string,
): Promise<GeminiResult<MultilingualAssistanceResponse>> {
  const detected = detectLanguage(message);
  return callFeature(
    'multilingual-assistance',
    buildMultilingualAssistancePrompt({ message, facts: getStadiumFactsContext() }),
    isMultilingualAssistanceResponse,
    () => mockMultilingualAssistanceResponse(detected),
  );
}

/** One-click translation of a venue announcement into the fan's chosen language. */
export async function getAnnouncementTranslation(
  announcement: Announcement,
  targetLanguage: string,
): Promise<GeminiResult<AnnouncementTranslationResponse>> {
  return callFeature(
    'announcement-translation',
    buildAnnouncementTranslationPrompt({ message: announcement.message, targetLanguage }),
    isAnnouncementTranslationResponse,
    () => mockAnnouncementTranslationResponse(announcement, targetLanguage),
  );
}

/** On-demand executive briefing over the organizer KPI snapshot. */
export async function getOperationalIntelligenceSummary(
  kpis: KpiSnapshot[],
): Promise<GeminiResult<OperationalIntelligenceResponse>> {
  return callFeature(
    'operational-intelligence',
    buildOperationalIntelligencePrompt({ kpis }),
    isOperationalIntelligenceResponse,
    mockOperationalIntelligenceResponse,
  );
}

/** Structured action plan (actions, teams, escalation criteria) for a reported incident. */
export async function getRealTimeDecisionSupport(
  incident: Incident,
): Promise<GeminiResult<RealTimeDecisionSupportResponse>> {
  return callFeature(
    'real-time-decision-support',
    buildRealTimeDecisionSupportPrompt({ incident }),
    isRealTimeDecisionSupportResponse,
    mockRealTimeDecisionSupportResponse,
  );
}

/** Organizer "what-if" scenario planning — same action-plan shape as incident analysis. */
export async function getScenarioPlan(
  scenario: string,
): Promise<GeminiResult<RealTimeDecisionSupportResponse>> {
  return callFeature(
    'scenario-planning',
    buildScenarioPrompt({ scenario }),
    isRealTimeDecisionSupportResponse,
    mockScenarioPlanResponse,
  );
}
