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
import { hasShape, isNumber, isOneOf, isString, isStringArray } from '../../utils/validate';
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
  buildTransportationPrompt,
  type AccessibilityResponse,
  type AnnouncementTranslationResponse,
  type CrowdManagementResponse,
  type FeatureId,
  type MultilingualAssistanceResponse,
  type NavigationResponse,
  type OperationalIntelligenceResponse,
  type PlainLanguageResponse,
  type RealTimeDecisionSupportResponse,
  type SustainabilityResponse,
  type TransportationResponse,
} from './prompts';

export interface GeminiResult<T> {
  data: T;
  /** "mock" drives the "Demo data" badge in the UI — live and mock never look identical to the fan. */
  source: 'live' | 'mock';
}

/**
 * Announcement translation gets its own limiter key so translating an
 * announcement never rate-limits the concierge chat (both live on the
 * Multilingual Assistance screen and are used back-to-back).
 */
type LimiterKey =
  | FeatureId
  | 'announcement-translation'
  | 'scenario-planning'
  | 'plain-language';

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

const isNavigationResponse = (value: unknown): value is NavigationResponse =>
  hasShape<NavigationResponse>(value, {
    summary: isString,
    steps: isStringArray,
    etaMinutes: isNumber,
  });

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

const isCrowdManagementResponse = (value: unknown): value is CrowdManagementResponse =>
  hasShape<CrowdManagementResponse>(value, {
    summary: isString,
    gatesToOpen: isStringArray,
    stewardRedeployment: isStringArray,
    congestionForecast: isString,
  });

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

const isAccessibilityResponse = (value: unknown): value is AccessibilityResponse =>
  hasShape<AccessibilityResponse>(value, {
    summary: isString,
    recommendedRoute: isString,
    accommodations: isStringArray,
  });

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

const isPlainLanguageResponse = (value: unknown): value is PlainLanguageResponse =>
  hasShape<PlainLanguageResponse>(value, { rewrite: isString });

/**
 * "Access Companion": rewrites a venue announcement into plain language. Own
 * limiter key so a rewrite never rate-limits the step-free planner (both live
 * on the Accessibility screen and are used back-to-back).
 */
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

const isTransportationResponse = (value: unknown): value is TransportationResponse =>
  hasShape<TransportationResponse>(value, {
    summary: isString,
    recommendedOptionId: isString,
    alternatives: isStringArray,
  });

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

const isSustainabilityResponse = (value: unknown): value is SustainabilityResponse =>
  hasShape<SustainabilityResponse>(value, { summary: isString, tips: isStringArray });

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

const isMultilingualAssistanceResponse = (
  value: unknown,
): value is MultilingualAssistanceResponse =>
  hasShape<MultilingualAssistanceResponse>(value, { reply: isString, language: isString });

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

const isAnnouncementTranslationResponse = (
  value: unknown,
): value is AnnouncementTranslationResponse =>
  hasShape<AnnouncementTranslationResponse>(value, { translation: isString, language: isString });

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

const isOperationalIntelligenceResponse = (
  value: unknown,
): value is OperationalIntelligenceResponse =>
  hasShape<OperationalIntelligenceResponse>(value, { summary: isString, alerts: isStringArray });

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

const isRealTimeDecisionSupportResponse = (
  value: unknown,
): value is RealTimeDecisionSupportResponse =>
  hasShape<RealTimeDecisionSupportResponse>(value, {
    summary: isString,
    immediateActions: isStringArray,
    teamsToNotify: isStringArray,
    escalationCriteria: isStringArray,
    priority: isOneOf(['normal', 'elevated', 'critical'] as const),
  });

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

/**
 * Organizer "what-if" scenario planning. Shares the action-plan shape with
 * incident analysis but gets its own limiter key — both live on the
 * Real-Time Decision Support screen and are used back-to-back.
 */
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
