import type { DensityReading } from '../../types/crowd';
import type { Incident } from '../../types/incident';
import type { ModuleId } from '../../types/module';
import type { KpiSnapshot } from '../../types/operational';
import type { SustainabilityMetrics } from '../../types/sustainability';
import type { TransitOption } from '../../types/transportation';
import { wrapUntrustedInput } from './guard';

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

export interface TransportationResponse {
  summary: string;
  recommendedOptionId: string;
  alternatives: string[];
}

export interface SustainabilityResponse {
  summary: string;
  tips: string[];
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
  summary: string;
  alerts: string[];
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

function jsonOnlyInstruction(shapeDescription: string): string {
  return `Respond with JSON only — no prose, no markdown code fences — matching exactly this shape: ${shapeDescription}`;
}

export function buildNavigationPrompt(params: { query: string }): string {
  return [
    "You are Stadeck's navigation assistant for fans at MetLife Stadium.",
    `A fan asked for wayfinding help:\n${wrapUntrustedInput(params.query)}`,
    jsonOnlyInstruction('{ "summary": string, "steps": string[], "etaMinutes": number }'),
  ].join('\n\n');
}

/**
 * The full sensor sweep is ~104 zones — raw JSON would blow the proxy's
 * payload cap and bury the signal. The prompt gets aggregates plus the
 * hottest zones only.
 */
function compactDensityReadings(readings: DensityReading[]): string {
  const sorted = [...readings].sort((a, b) => b.percentOfCapacity - a.percentOfCapacity);
  const average =
    readings.length === 0
      ? 0
      : Math.round(
          readings.reduce((sum, reading) => sum + reading.percentOfCapacity, 0) / readings.length,
        );
  return JSON.stringify({
    totalZones: readings.length,
    averagePercentOfCapacity: average,
    criticalZones: readings.filter((reading) => reading.level === 'critical').length,
    elevatedZones: readings.filter((reading) => reading.level === 'elevated').length,
    hottestZones: sorted.slice(0, 12).map((reading) => ({
      zoneId: reading.zoneId,
      level: reading.level,
      percentOfCapacity: reading.percentOfCapacity,
    })),
  });
}

export function buildCrowdManagementPrompt(params: { readings: DensityReading[] }): string {
  return [
    "You are Stadeck's crowd management assistant for venue staff at MetLife Stadium.",
    `Aggregated live occupancy readings (zone ids: sec-<number> = seating section, gate-<letter> = entry gate):\n${compactDensityReadings(params.readings)}`,
    'Recommend which gates to open, how to redeploy stewards, and forecast congestion for the next 30 minutes.',
    jsonOnlyInstruction(
      '{ "summary": string, "gatesToOpen": string[], "stewardRedeployment": string[], "congestionForecast": string }',
    ),
  ].join('\n\n');
}

export function buildAccessibilityPrompt(params: { query: string }): string {
  return [
    "You are Stadeck's accessibility assistant for fans at MetLife Stadium.",
    `A fan asked for accessibility help:\n${wrapUntrustedInput(params.query)}`,
    jsonOnlyInstruction(
      '{ "summary": string, "recommendedRoute": string, "accommodations": string[] }',
    ),
  ].join('\n\n');
}

export function buildTransportationPrompt(params: {
  options: TransitOption[];
  destination: string;
}): string {
  return [
    "You are Stadeck's transportation assistant for fans at MetLife Stadium.",
    `Live transit options:\n${JSON.stringify(params.options)}`,
    `A fan's destination:\n${wrapUntrustedInput(params.destination)}`,
    jsonOnlyInstruction(
      '{ "summary": string, "recommendedOptionId": string, "alternatives": string[] }',
    ),
  ].join('\n\n');
}

export function buildSustainabilityPrompt(params: { metrics: SustainabilityMetrics }): string {
  return [
    "You are Stadeck's sustainability assistant for fans at MetLife Stadium.",
    `Current matchday sustainability metrics:\n${JSON.stringify(params.metrics)}`,
    'Summarize venue sustainability performance and suggest fan-facing tips.',
    jsonOnlyInstruction('{ "summary": string, "tips": string[] }'),
  ].join('\n\n');
}

export function buildMultilingualAssistancePrompt(params: {
  message: string;
  facts: string;
}): string {
  return [
    "You are Stadeck's multilingual concierge for fans at MetLife Stadium.",
    'Detect the language of the fan message and reply in that same language. Report its BCP-47 code in the "language" field.',
    `Answer using only these verified stadium facts:\n${params.facts}`,
    "If the facts do not cover the question, say so in the fan's language and point them to Guest Services at sections 103 or 123.",
    `A fan's message:\n${wrapUntrustedInput(params.message)}`,
    jsonOnlyInstruction('{ "reply": string, "language": string }'),
  ].join('\n\n');
}

export function buildAnnouncementTranslationPrompt(params: {
  message: string;
  targetLanguage: string;
}): string {
  return [
    "You are Stadeck's announcement translator for fans at MetLife Stadium.",
    `Translate the venue announcement below into this BCP-47 language code: ${params.targetLanguage}. Keep gate letters and section numbers unchanged.`,
    // The announcement arrives over the (simulated) venue feed — external data, wrapped like user input.
    `The announcement:\n${wrapUntrustedInput(params.message)}`,
    jsonOnlyInstruction('{ "translation": string, "language": string }'),
  ].join('\n\n');
}

export function buildOperationalIntelligencePrompt(params: { kpis: KpiSnapshot[] }): string {
  return [
    "You are Stadeck's operational intelligence assistant for organizers at MetLife Stadium.",
    `Current KPI snapshot:\n${JSON.stringify(params.kpis)}`,
    'Summarize operational health and flag anything organizers should act on.',
    jsonOnlyInstruction('{ "summary": string, "alerts": string[] }'),
  ].join('\n\n');
}

const ACTION_PLAN_SHAPE =
  '{ "summary": string, "immediateActions": string[], "teamsToNotify": string[], "escalationCriteria": string[], "priority": "normal" | "elevated" | "critical" }';

export function buildRealTimeDecisionSupportPrompt(params: { incident: Incident }): string {
  return [
    "You are Stadeck's real-time decision support assistant for venue staff at MetLife Stadium.",
    `An incident was reported:\n${JSON.stringify(params.incident)}`,
    'Produce a structured action plan: immediate actions in order, teams to notify, and escalation criteria.',
    jsonOnlyInstruction(ACTION_PLAN_SHAPE),
  ].join('\n\n');
}

export function buildScenarioPrompt(params: { scenario: string }): string {
  return [
    "You are Stadeck's real-time decision support assistant for venue staff at MetLife Stadium.",
    `An organizer wants to war-game a hypothetical matchday scenario:\n${wrapUntrustedInput(params.scenario)}`,
    'Produce a structured contingency plan: immediate actions in order, teams to notify, and escalation criteria.',
    jsonOnlyInstruction(ACTION_PLAN_SHAPE),
  ].join('\n\n');
}
