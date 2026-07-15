import type { ModuleId } from '../../types/module';

/**
 * The JSON contracts each feature's prompt asks Gemini to return. Mocks
 * (mock.ts) and shape guards (validators.ts) are written against these, so a
 * contract change breaks the compile everywhere it matters.
 */

/** Reuses the eight-module identifier as the feature key for prompts, mocks, and the public API. */
export type FeatureId = ModuleId;

export interface NavigationResponse {
  summary: string;
  steps: string[];
  etaMinutes: number;
}

export interface CrowdManagementResponse {
  summary: string;
  /** Gates staff should open (or keep prioritized) to relieve pressure. */
  gatesToOpen: string[];
  /** Concrete steward redeployment moves, one per entry. */
  stewardRedeployment: string[];
  /** Short forecast of how congestion will develop over the next ~30 minutes. */
  congestionForecast: string;
}

export interface AccessibilityResponse {
  summary: string;
  recommendedRoute: string;
  accommodations: string[];
}

export interface PlainLanguageResponse {
  /** The announcement rewritten in plain language. */
  rewrite: string;
}

export interface TransportationResponse {
  summary: string;
  /** Id of the recommended TransitOption — the transit board highlights it. */
  recommendedOptionId: string;
  /** Concrete departure window with clock times, e.g. "Leave between 5:05 and 5:20 PM". */
  departureWindow: string;
  /** Ordered strategy steps, each with a time and the crowd load to expect. */
  steps: string[];
}

export interface SustainabilityResponse {
  summary: string;
  tips: string[];
}

export interface SustainabilityReportResponse {
  /** One-line verdict on the matchday's sustainability performance. */
  headline: string;
  /** What went well, tied to the metrics. */
  highlights: string[];
  /** What organizers should improve for the next match. */
  recommendations: string[];
}

export interface MultilingualAssistanceResponse {
  reply: string;
  /** BCP-47 code of the reply — the model detects the fan's language and reports it here. */
  language: string;
}

export interface AnnouncementTranslationResponse {
  translation: string;
  /** BCP-47 code of the translation. */
  language: string;
}

export interface OperationalIntelligenceResponse {
  /** State-of-venue summary in two or three sentences. */
  summary: string;
  /** Metrics outside normal range and what to do about each. */
  anomalies: string[];
  /** Where the numbers are heading over the next hour. */
  trends: string[];
}

export interface RealTimeDecisionSupportResponse {
  summary: string;
  /** Ordered steps to take right now. */
  immediateActions: string[];
  /** Teams/roles to notify, e.g. "Medical response team". */
  teamsToNotify: string[];
  /** Conditions under which the incident must be escalated. */
  escalationCriteria: string[];
  priority: 'normal' | 'elevated' | 'critical';
}
