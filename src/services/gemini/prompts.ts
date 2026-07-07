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
  recommendation: string;
  hotZones: string[];
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
  language: string;
}

export interface OperationalIntelligenceResponse {
  summary: string;
  alerts: string[];
}

export interface RealTimeDecisionSupportResponse {
  summary: string;
  actionPlan: string[];
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

export function buildCrowdManagementPrompt(params: { readings: DensityReading[] }): string {
  return [
    "You are Stadeck's crowd management assistant for venue staff at MetLife Stadium.",
    `Current occupancy readings:\n${JSON.stringify(params.readings)}`,
    'Summarize crowd conditions and recommend how staff should respond.',
    jsonOnlyInstruction('{ "summary": string, "recommendation": string, "hotZones": string[] }'),
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
  targetLanguage: string;
}): string {
  return [
    "You are Stadeck's multilingual assistant for fans at MetLife Stadium.",
    `Reply in this BCP-47 language code: ${params.targetLanguage}`,
    `A fan's message:\n${wrapUntrustedInput(params.message)}`,
    jsonOnlyInstruction('{ "reply": string, "language": string }'),
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

export function buildRealTimeDecisionSupportPrompt(params: { incident: Incident }): string {
  return [
    "You are Stadeck's real-time decision support assistant for venue staff at MetLife Stadium.",
    `An incident was reported:\n${JSON.stringify(params.incident)}`,
    'Recommend a concrete action plan and its priority.',
    jsonOnlyInstruction(
      '{ "summary": string, "actionPlan": string[], "priority": "normal" | "elevated" | "critical" }',
    ),
  ].join('\n\n');
}
