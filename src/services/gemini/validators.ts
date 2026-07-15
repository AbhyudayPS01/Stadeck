import { hasShape, isNumber, isOneOf, isString, isStringArray } from '../../utils/validate';
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

/**
 * Shape guards for every feature's Gemini response. Model output is untrusted
 * JSON: index.ts parses each reply against the matching guard and falls back
 * to the deterministic mock if it does not conform.
 */

export const isNavigationResponse = (value: unknown): value is NavigationResponse =>
  hasShape<NavigationResponse>(value, {
    summary: isString,
    steps: isStringArray,
    etaMinutes: isNumber,
  });

export const isCrowdManagementResponse = (value: unknown): value is CrowdManagementResponse =>
  hasShape<CrowdManagementResponse>(value, {
    summary: isString,
    gatesToOpen: isStringArray,
    stewardRedeployment: isStringArray,
    congestionForecast: isString,
  });

export const isAccessibilityResponse = (value: unknown): value is AccessibilityResponse =>
  hasShape<AccessibilityResponse>(value, {
    summary: isString,
    recommendedRoute: isString,
    accommodations: isStringArray,
  });

export const isPlainLanguageResponse = (value: unknown): value is PlainLanguageResponse =>
  hasShape<PlainLanguageResponse>(value, { rewrite: isString });

export const isTransportationResponse = (value: unknown): value is TransportationResponse =>
  hasShape<TransportationResponse>(value, {
    summary: isString,
    recommendedOptionId: isString,
    departureWindow: isString,
    steps: isStringArray,
  });

export const isSustainabilityResponse = (value: unknown): value is SustainabilityResponse =>
  hasShape<SustainabilityResponse>(value, { summary: isString, tips: isStringArray });

export const isSustainabilityReportResponse = (
  value: unknown,
): value is SustainabilityReportResponse =>
  hasShape<SustainabilityReportResponse>(value, {
    headline: isString,
    highlights: isStringArray,
    recommendations: isStringArray,
  });

export const isMultilingualAssistanceResponse = (
  value: unknown,
): value is MultilingualAssistanceResponse =>
  hasShape<MultilingualAssistanceResponse>(value, { reply: isString, language: isString });

export const isAnnouncementTranslationResponse = (
  value: unknown,
): value is AnnouncementTranslationResponse =>
  hasShape<AnnouncementTranslationResponse>(value, { translation: isString, language: isString });

export const isOperationalIntelligenceResponse = (
  value: unknown,
): value is OperationalIntelligenceResponse =>
  hasShape<OperationalIntelligenceResponse>(value, {
    summary: isString,
    anomalies: isStringArray,
    trends: isStringArray,
  });

export const isRealTimeDecisionSupportResponse = (
  value: unknown,
): value is RealTimeDecisionSupportResponse =>
  hasShape<RealTimeDecisionSupportResponse>(value, {
    summary: isString,
    immediateActions: isStringArray,
    teamsToNotify: isStringArray,
    escalationCriteria: isStringArray,
    priority: isOneOf(['normal', 'elevated', 'critical'] as const),
  });
