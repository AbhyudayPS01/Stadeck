import { getStadiumFactsContext } from '../data/stadiumFacts';
import { DEFAULT_VENUE } from '../data/venues';
import type { Announcement } from '../../types/announcement';
import type { DensityReading } from '../../types/crowd';
import type { Incident } from '../../types/incident';
import type { KpiSnapshot } from '../../types/operational';
import type { Gate, StadiumSection } from '../../types/stadium';
import type { SustainabilityMetrics } from '../../types/sustainability';
import type { TransitOption } from '../../types/transportation';
import type { Venue } from '../../types/venue';
import { detectLanguage } from '../../utils/detectLanguage';
import { callFeature, type GeminiResult } from './callFeature';
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

/**
 * Public Gemini API: one named function per feature, all flowing through
 * callFeature.ts (limiter → live call → deterministic mock fallback). The
 * fallback exists because international fans are on expensive roaming inside
 * a congested bowl — the app must never present a dead end, with zero
 * connectivity and zero API key (see callFeature for the full rationale).
 * Every function takes an optional trailing venue so prompts are grounded in
 * the venue being rendered; it defaults to the demo venue.
 */
export type { GeminiResult, MockReason } from './callFeature';

/**
 * Turn-by-turn walking directions from an entry gate to a seating section.
 * @param gate The starting gate for the route.
 * @param section The destination seating section.
 * @param venue The stadium context (defaults to demo venue).
 * @returns A structured plan with steps and an ETA.
 */
export async function getNavigationDirections(
  gate: Gate,
  section: StadiumSection,
  venue: Venue = DEFAULT_VENUE,
): Promise<GeminiResult<NavigationResponse>> {
  return callFeature(
    'navigation',
    buildNavigationPrompt({ gate, section, venue }),
    isNavigationResponse,
    () => mockNavigationResponse(gate.label, section.label),
  );
}

/**
 * Gate/steward recommendations and a congestion forecast over the live sensor sweep.
 * @param readings Array of live density readings for zones/gates.
 * @param venue The stadium context (defaults to demo venue).
 * @returns Congestion forecast and redeployment advice.
 */
export async function getCrowdManagementSummary(
  readings: DensityReading[],
  venue: Venue = DEFAULT_VENUE,
): Promise<GeminiResult<CrowdManagementResponse>> {
  return callFeature(
    'crowd-management',
    buildCrowdManagementPrompt({ readings, venue }),
    isCrowdManagementResponse,
    () => mockCrowdManagementResponse(venue),
  );
}

/**
 * Step-free route from an entry gate to an accessible seating section.
 * @param gate The starting gate.
 * @param section The destination accessible section.
 * @param venue The stadium context (defaults to demo venue).
 * @returns Accessible route and recommended accommodations.
 */
export async function getStepFreeRoute(
  gate: Gate,
  section: StadiumSection,
  venue: Venue = DEFAULT_VENUE,
): Promise<GeminiResult<AccessibilityResponse>> {
  return callFeature(
    'accessibility',
    buildAccessibilityPrompt({ gate, section, venue }),
    isAccessibilityResponse,
    () => mockAccessibilityResponse(gate.label, section.label),
  );
}

/**
 * "Access Companion": rewrites a venue announcement into plain language.
 * @param announcement The venue announcement to rewrite.
 * @param venue The stadium context (defaults to demo venue).
 * @returns The plain-language rewritten text.
 */
export async function getPlainLanguageRewrite(
  announcement: Announcement,
  venue: Venue = DEFAULT_VENUE,
): Promise<GeminiResult<PlainLanguageResponse>> {
  return callFeature(
    'plain-language',
    buildPlainLanguagePrompt({ message: announcement.message, venue }),
    isPlainLanguageResponse,
    () => mockPlainLanguageResponse(announcement, venue),
  );
}

/**
 * Personalized post-match departure strategy built from the live transit board.
 * @param options Array of current transit options available.
 * @param destination The fan's desired final destination.
 * @param venue The stadium context (defaults to demo venue).
 * @returns Recommended departure strategy with concrete times.
 */
export async function getTransportationRecommendation(
  options: TransitOption[],
  destination: string,
  venue: Venue = DEFAULT_VENUE,
): Promise<GeminiResult<TransportationResponse>> {
  return callFeature(
    'transportation',
    buildTransportationPrompt({ options, destination, venue }),
    isTransportationResponse,
    () => mockTransportationResponse(venue),
  );
}

/**
 * Per-fan eco-actions grounded in the live venue metrics.
 * @param metrics The current sustainability metrics for the stadium.
 * @param venue The stadium context (defaults to demo venue).
 * @returns Personalized tips for reducing environmental impact.
 */
export async function getSustainabilityTips(
  metrics: SustainabilityMetrics,
  venue: Venue = DEFAULT_VENUE,
): Promise<GeminiResult<SustainabilityResponse>> {
  return callFeature(
    'sustainability',
    buildSustainabilityPrompt({ metrics, venue }),
    isSustainabilityResponse,
    mockSustainabilityResponse,
  );
}

/**
 * Organizer sustainability match report over the same venue metrics.
 * @param metrics The current sustainability metrics for the stadium.
 * @param venue The stadium context (defaults to demo venue).
 * @returns Executive summary, highlights, and recommendations.
 */
export async function getSustainabilityReport(
  metrics: SustainabilityMetrics,
  venue: Venue = DEFAULT_VENUE,
): Promise<GeminiResult<SustainabilityReportResponse>> {
  return callFeature(
    'sustainability-report',
    buildSustainabilityReportPrompt({ metrics, venue }),
    isSustainabilityReportResponse,
    mockSustainabilityReportResponse,
  );
}

/**
 * Concierge chat: the model detects the fan's language and answers in it,
 * grounded in the local stadium facts. On the mock path, the client-side
 * heuristic picks the reply language so offline detection still works.
 * @param message The user's input message.
 * @param venue The stadium context (defaults to demo venue).
 * @returns Fact-grounded reply and the detected language code.
 */
export async function getMultilingualReply(
  message: string,
  venue: Venue = DEFAULT_VENUE,
): Promise<GeminiResult<MultilingualAssistanceResponse>> {
  const detected = detectLanguage(message);
  return callFeature(
    'multilingual-assistance',
    buildMultilingualAssistancePrompt({ message, facts: getStadiumFactsContext(venue), venue }),
    isMultilingualAssistanceResponse,
    () => mockMultilingualAssistanceResponse(detected, venue),
  );
}

/**
 * Volunteer assist: the same fact-grounded concierge answer, in an explicit
 * target language. The volunteer view requests each answer twice — English
 * for the volunteer, the fan's language to show the fan — so the translated
 * half gets its own limiter key (see LimiterKey) and never rate-limits the
 * English half it always ships with.
 * @param question The fan's question relayed by the volunteer.
 * @param targetLanguage The language code to translate the response into.
 * @param venue The stadium context (defaults to demo venue).
 * @returns Fact-grounded reply translated into the target language.
 */
export async function getVolunteerAnswer(
  question: string,
  targetLanguage: string,
  venue: Venue = DEFAULT_VENUE,
): Promise<GeminiResult<MultilingualAssistanceResponse>> {
  return callFeature(
    targetLanguage === 'en' ? 'multilingual-assistance' : 'volunteer-assist-translation',
    buildMultilingualAssistancePrompt({
      message: question,
      facts: getStadiumFactsContext(venue),
      targetLanguage,
      venue,
    }),
    isMultilingualAssistanceResponse,
    () => mockMultilingualAssistanceResponse(targetLanguage, venue),
  );
}

/**
 * One-click translation of a venue announcement into the fan's chosen language.
 * @param announcement The venue announcement to translate.
 * @param targetLanguage The target language code.
 * @param venue The stadium context (defaults to demo venue).
 * @returns The translated announcement string.
 */
export async function getAnnouncementTranslation(
  announcement: Announcement,
  targetLanguage: string,
  venue: Venue = DEFAULT_VENUE,
): Promise<GeminiResult<AnnouncementTranslationResponse>> {
  return callFeature(
    'announcement-translation',
    buildAnnouncementTranslationPrompt({ message: announcement.message, targetLanguage, venue }),
    isAnnouncementTranslationResponse,
    () => mockAnnouncementTranslationResponse(announcement, targetLanguage),
  );
}

/**
 * On-demand executive briefing over the organizer KPI snapshot.
 * @param kpis Current operational KPIs.
 * @param venue The stadium context (defaults to demo venue).
 * @returns Executive summary, anomalies, and operational trends.
 */
export async function getOperationalIntelligenceSummary(
  kpis: KpiSnapshot[],
  venue: Venue = DEFAULT_VENUE,
): Promise<GeminiResult<OperationalIntelligenceResponse>> {
  return callFeature(
    'operational-intelligence',
    buildOperationalIntelligencePrompt({ kpis, venue }),
    isOperationalIntelligenceResponse,
    mockOperationalIntelligenceResponse,
  );
}

/**
 * Structured action plan (actions, teams, escalation criteria) for a reported incident.
 * @param incident The reported incident requiring an action plan.
 * @param venue The stadium context (defaults to demo venue).
 * @returns A structured decision support plan prioritizing actions.
 */
export async function getRealTimeDecisionSupport(
  incident: Incident,
  venue: Venue = DEFAULT_VENUE,
): Promise<GeminiResult<RealTimeDecisionSupportResponse>> {
  return callFeature(
    'real-time-decision-support',
    buildRealTimeDecisionSupportPrompt({ incident, venue }),
    isRealTimeDecisionSupportResponse,
    () => mockRealTimeDecisionSupportResponse(incident.category, venue),
  );
}

/**
 * Organizer "what-if" scenario planning — same action-plan shape as incident analysis.
 * @param scenario The hypothetical scenario described by the organizer.
 * @param venue The stadium context (defaults to demo venue).
 * @returns A structured decision support plan for the scenario.
 */
export async function getScenarioPlan(
  scenario: string,
  venue: Venue = DEFAULT_VENUE,
): Promise<GeminiResult<RealTimeDecisionSupportResponse>> {
  return callFeature(
    'scenario-planning',
    buildScenarioPrompt({ scenario, venue }),
    isRealTimeDecisionSupportResponse,
    mockScenarioPlanResponse,
  );
}
