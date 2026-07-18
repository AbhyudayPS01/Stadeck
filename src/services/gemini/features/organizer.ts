import { getStadiumFactsContext } from '../../data/stadiumFacts';
import { DEFAULT_VENUE } from '../../data/venues';
import type { DensityReading } from '../../../types/crowd';
import type { Incident } from '../../../types/incident';
import type { KpiSnapshot } from '../../../types/operational';
import type { SustainabilityMetrics } from '../../../types/sustainability';
import type { Venue } from '../../../types/venue';
import { callFeature, type GeminiResult } from '../callFeature';
import {
  mockCrowdManagementResponse,
  mockMultilingualAssistanceResponse,
  mockOperationalIntelligenceResponse,
  mockRealTimeDecisionSupportResponse,
  mockScenarioPlanResponse,
  mockSustainabilityReportResponse,
} from '../mock';
import {
  buildCrowdManagementPrompt,
  buildMultilingualAssistancePrompt,
  buildOperationalIntelligencePrompt,
  buildRealTimeDecisionSupportPrompt,
  buildScenarioPrompt,
  buildSustainabilityReportPrompt,
} from '../prompts';
import type {
  CrowdManagementResponse,
  MultilingualAssistanceResponse,
  OperationalIntelligenceResponse,
  RealTimeDecisionSupportResponse,
  SustainabilityReportResponse,
} from '../responses';
import {
  isCrowdManagementResponse,
  isMultilingualAssistanceResponse,
  isOperationalIntelligenceResponse,
  isRealTimeDecisionSupportResponse,
  isSustainabilityReportResponse,
} from '../validators';

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
    'sustainability:report',
    buildSustainabilityReportPrompt({ metrics, venue }),
    isSustainabilityReportResponse,
    mockSustainabilityReportResponse,
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
    targetLanguage === 'en' ? 'multilingual-assistance' : 'multilingual:volunteer-assist-translation',
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
    'real-time-decision-support:scenario-planning',
    buildScenarioPrompt({ scenario, venue }),
    isRealTimeDecisionSupportResponse,
    mockScenarioPlanResponse,
  );
}
