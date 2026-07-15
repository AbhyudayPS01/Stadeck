import { EXPECTED_FINAL_WHISTLE } from '../../config/constants';
import { nearestAmenity, nearestGate, TIER_NAMES } from '../data/stadiumLayout';
import type { DensityReading } from '../../types/crowd';
import type { Incident } from '../../types/incident';
import type { ModuleId } from '../../types/module';
import type { KpiSnapshot } from '../../types/operational';
import type { Gate, StadiumSection } from '../../types/stadium';
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

/**
 * Both endpoints come from the map config's pickers (never free text), so the
 * prompt can be fully structured and grounded in real venue landmarks —
 * the model writes directions, it does not invent geography.
 */
export function buildNavigationPrompt(params: { gate: Gate; section: StadiumSection }): string {
  const { gate, section } = params;
  const describeNearest = (type: 'restroom' | 'food'): string => {
    const amenity = nearestAmenity(section, type);
    return `${amenity.label} near Section ${amenity.sectionId.replace('sec-', '')}`;
  };
  const landmarks = [
    describeNearest('restroom'),
    describeNearest('food'),
    `closest exit ${nearestGate(section).label}`,
  ];
  return [
    "You are Stadeck's navigation assistant for fans at MetLife Stadium.",
    `A fan is entering at ${gate.label} (${gate.compassPoint} side) and needs turn-by-turn walking directions to Section ${section.label} in the ${TIER_NAMES[section.tier]}.`,
    `Landmarks near that section the steps may reference: ${landmarks.join('; ')}.`,
    'Give 3-5 short imperative steps along the concourse and a realistic in-stadium walking time.',
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

/**
 * Step-free route planning. Like navigation, both endpoints come from
 * config-driven pickers, so the prompt is fully structured — the model is
 * asked for step-free specifics (ramps, elevators, level concourses), never
 * invented geography.
 */
export function buildAccessibilityPrompt(params: { gate: Gate; section: StadiumSection }): string {
  const { gate, section } = params;
  return [
    "You are Stadeck's accessibility assistant for fans at MetLife Stadium.",
    `A fan with access needs is entering at ${gate.label} (${gate.compassPoint} side) and needs a fully step-free route to the accessible seating at Section ${section.label} in the ${TIER_NAMES[section.tier]}.`,
    'Describe the step-free route (ramps, elevators, level concourses — never stairs or escalators) and list the accommodations available at that seating area.',
    jsonOnlyInstruction(
      '{ "summary": string, "recommendedRoute": string, "accommodations": string[] }',
    ),
  ].join('\n\n');
}

export interface PlainLanguageResponse {
  /** The announcement rewritten in plain language. */
  rewrite: string;
}

/** "Access Companion": rewrites a venue announcement into plain language. */
export function buildPlainLanguagePrompt(params: { message: string }): string {
  return [
    "You are Stadeck's Access Companion for fans at MetLife Stadium who benefit from plain language.",
    'Rewrite the venue announcement below in plain language: short sentences, everyday words, one idea per sentence. Keep every gate letter, section number, and time exactly as written.',
    // The announcement arrives over the (simulated) venue feed — external data, wrapped like user input.
    `The announcement:\n${wrapUntrustedInput(params.message)}`,
    jsonOnlyInstruction('{ "rewrite": string }'),
  ].join('\n\n');
}

export function buildTransportationPrompt(params: {
  options: TransitOption[];
  destination: string;
}): string {
  return [
    "You are Stadeck's transportation assistant planning post-match egress for fans at MetLife Stadium.",
    `The final whistle is expected around ${EXPECTED_FINAL_WHISTLE}; the heaviest crowd surge is the first 30 minutes after it.`,
    `Live transit options (etaMinutes = time to boarding, crowdingLevel = current load):\n${JSON.stringify(params.options)}`,
    `Where the fan is headed:\n${wrapUntrustedInput(params.destination)}`,
    'Recommend one option by id and give a personalized departure strategy: a concrete departure window with clock times, then 3-4 ordered steps that each name a time and the crowd load to expect.',
    jsonOnlyInstruction(
      '{ "summary": string, "recommendedOptionId": string, "departureWindow": string, "steps": string[] }',
    ),
  ].join('\n\n');
}

export function buildSustainabilityPrompt(params: { metrics: SustainabilityMetrics }): string {
  return [
    "You are Stadeck's sustainability assistant for fans at MetLife Stadium.",
    `Current matchday sustainability metrics:\n${JSON.stringify(params.metrics)}`,
    'Summarize venue sustainability performance in one sentence, then give 3-4 concrete eco-actions an individual fan can take right now at the stadium.',
    jsonOnlyInstruction('{ "summary": string, "tips": string[] }'),
  ].join('\n\n');
}

export interface SustainabilityReportResponse {
  /** One-line verdict on the matchday's sustainability performance. */
  headline: string;
  /** What went well, tied to the metrics. */
  highlights: string[];
  /** What organizers should improve for the next match. */
  recommendations: string[];
}

/** Organizer-facing match report over the same metrics the fan dashboard shows. */
export function buildSustainabilityReportPrompt(params: {
  metrics: SustainabilityMetrics;
}): string {
  return [
    "You are Stadeck's sustainability analyst reporting to organizers at MetLife Stadium.",
    `Matchday sustainability metrics:\n${JSON.stringify(params.metrics)}`,
    'Write a match report: a one-line headline verdict, the highlights that went well, and concrete recommendations for the next match.',
    jsonOnlyInstruction(
      '{ "headline": string, "highlights": string[], "recommendations": string[] }',
    ),
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
