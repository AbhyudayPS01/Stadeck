import { EXPECTED_FINAL_WHISTLE } from '../../config/constants';
import {
  getVenueLayout,
  nearestAmenity,
  nearestGate,
  sectionNumber,
  TIER_NAMES,
} from '../data/stadiumLayout';
import { DEFAULT_VENUE } from '../data/venues';
import type { DensityReading } from '../../types/crowd';
import type { Incident } from '../../types/incident';
import type { KpiSnapshot } from '../../types/operational';
import type { Gate, StadiumSection } from '../../types/stadium';
import type { SustainabilityMetrics } from '../../types/sustainability';
import type { TransitOption } from '../../types/transportation';
import type { Venue } from '../../types/venue';
import { formatCount } from '../../utils/format';
import { wrapUntrustedInput } from './guard';
import {
  compactDensityReadings,
  jsonOnlyInstruction,
  venueConditionsLine,
  venuePersona,
} from './promptHelpers';

/**
 * All prompt templates as typed builder functions. Each builder asks for
 * JSON matching a contract from responses.ts; the shape names quoted in the
 * instructions must stay in sync with those interfaces. Every builder takes
 * the venue it speaks for (defaulting to the demo venue) so the model is
 * always grounded in the venue the rest of the app is rendering.
 */

/**
 * Both endpoints come from the map config's pickers (never free text), so the
 * prompt can be fully structured and grounded in real venue landmarks —
 * the model writes directions, it does not invent geography.
 */
export function buildNavigationPrompt(params: {
  gate: Gate;
  section: StadiumSection;
  venue?: Venue;
}): string {
  const { gate, section, venue = DEFAULT_VENUE } = params;
  const layout = getVenueLayout(venue.id);
  const describeNearest = (type: 'restroom' | 'food'): string => {
    const amenity = nearestAmenity(section, type, layout);
    return `${amenity.label} near Section ${sectionNumber(amenity.sectionId)}`;
  };
  const landmarks = [
    describeNearest('restroom'),
    describeNearest('food'),
    `closest exit ${nearestGate(section).label}`,
  ];
  return [
    venuePersona('navigation assistant for fans', venue),
    `A fan is entering at ${gate.label} (${gate.compassPoint} side) and needs turn-by-turn walking directions to Section ${section.label} in the ${TIER_NAMES[section.tier]}.`,
    `Landmarks near that section the steps may reference: ${landmarks.join('; ')}.`,
    'Give 3-5 short imperative steps along the concourse and a realistic in-stadium walking time.',
    jsonOnlyInstruction('{ "summary": string, "steps": string[], "etaMinutes": number }'),
  ].join('\n\n');
}

export function buildCrowdManagementPrompt(params: {
  readings: DensityReading[];
  venue?: Venue;
}): string {
  const { readings, venue = DEFAULT_VENUE } = params;
  const gateCount = getVenueLayout(venue.id).gates.length;
  return [
    venuePersona('crowd management assistant for venue staff', venue),
    `The venue seats ${formatCount(venue.capacity)} fans behind ${gateCount} gates. ${venueConditionsLine(venue)}`,
    `Aggregated live occupancy readings (zone ids: sec-<number> = seating section, gate-<letter> = entry gate):\n${compactDensityReadings(readings)}`,
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
export function buildAccessibilityPrompt(params: {
  gate: Gate;
  section: StadiumSection;
  venue?: Venue;
}): string {
  const { gate, section, venue = DEFAULT_VENUE } = params;
  return [
    venuePersona('accessibility assistant for fans', venue),
    `A fan with access needs is entering at ${gate.label} (${gate.compassPoint} side) and needs a fully step-free route to the accessible seating at Section ${section.label} in the ${TIER_NAMES[section.tier]}.`,
    'Describe the step-free route (ramps, elevators, level concourses — never stairs or escalators) and list the accommodations available at that seating area.',
    jsonOnlyInstruction(
      '{ "summary": string, "recommendedRoute": string, "accommodations": string[] }',
    ),
  ].join('\n\n');
}

/** "Access Companion": rewrites a venue announcement into plain language. */
export function buildPlainLanguagePrompt(params: { message: string; venue?: Venue }): string {
  const { message, venue = DEFAULT_VENUE } = params;
  return [
    venuePersona('Access Companion for fans who benefit from plain language', venue),
    'Rewrite the venue announcement below in plain language: short sentences, everyday words, one idea per sentence. Keep every gate letter, section number, and time exactly as written.',
    // The announcement arrives over the (simulated) venue feed — external data, wrapped like user input.
    `The announcement:\n${wrapUntrustedInput(message)}`,
    jsonOnlyInstruction('{ "rewrite": string }'),
  ].join('\n\n');
}

export function buildTransportationPrompt(params: {
  options: TransitOption[];
  destination: string;
  venue?: Venue;
}): string {
  const { options, destination, venue = DEFAULT_VENUE } = params;
  return [
    venuePersona('transportation assistant planning post-match egress for fans', venue),
    `The final whistle is expected around ${EXPECTED_FINAL_WHISTLE}; the heaviest crowd surge is the first 30 minutes after it.`,
    `Live transit options (etaMinutes = time to boarding, crowdingLevel = current load):\n${JSON.stringify(options)}`,
    `Where the fan is headed:\n${wrapUntrustedInput(destination)}`,
    'Recommend one option by id and give a personalized departure strategy: a concrete departure window with clock times, then 3-4 ordered steps that each name a time and the crowd load to expect.',
    jsonOnlyInstruction(
      '{ "summary": string, "recommendedOptionId": string, "departureWindow": string, "steps": string[] }',
    ),
  ].join('\n\n');
}

export function buildSustainabilityPrompt(params: {
  metrics: SustainabilityMetrics;
  venue?: Venue;
}): string {
  const { metrics, venue = DEFAULT_VENUE } = params;
  return [
    venuePersona('sustainability assistant for fans', venue),
    `Current matchday sustainability metrics:\n${JSON.stringify(metrics)}`,
    'Summarize venue sustainability performance in one sentence, then give 3-4 concrete eco-actions an individual fan can take right now at the stadium.',
    jsonOnlyInstruction('{ "summary": string, "tips": string[] }'),
  ].join('\n\n');
}

/** Organizer-facing match report over the same metrics the fan dashboard shows. */
export function buildSustainabilityReportPrompt(params: {
  metrics: SustainabilityMetrics;
  venue?: Venue;
}): string {
  const { metrics, venue = DEFAULT_VENUE } = params;
  return [
    venuePersona('sustainability analyst reporting to organizers', venue),
    `Matchday sustainability metrics:\n${JSON.stringify(metrics)}`,
    'Write a match report: a one-line headline verdict, the highlights that went well, and concrete recommendations for the next match.',
    jsonOnlyInstruction(
      '{ "headline": string, "highlights": string[], "recommendations": string[] }',
    ),
  ].join('\n\n');
}

/**
 * Fan chat detects the language from the message itself; the volunteer view
 * passes an explicit targetLanguage instead (the question is English, the
 * answer is shown to a fan in their language). Same grounding either way.
 */
export function buildMultilingualAssistancePrompt(params: {
  message: string;
  facts: string;
  targetLanguage?: string;
  venue?: Venue;
}): string {
  const { message, facts, targetLanguage, venue = DEFAULT_VENUE } = params;
  const languageInstruction = targetLanguage
    ? `Reply in the language with BCP-47 code "${targetLanguage}" and report that code in the "language" field.`
    : 'Detect the language of the fan message and reply in that same language. Report its BCP-47 code in the "language" field.';
  const guestServicesDesks = getVenueLayout(venue.id)
    .amenities.filter((amenity) => amenity.type === 'guest-services')
    .map((amenity) => sectionNumber(amenity.sectionId))
    .join(' or ');
  return [
    venuePersona('multilingual concierge for fans', venue),
    languageInstruction,
    `Answer using only these verified stadium facts:\n${facts}`,
    `If the facts do not cover the question, say so in the reply language and point them to Guest Services at sections ${guestServicesDesks}.`,
    `A fan's message:\n${wrapUntrustedInput(message)}`,
    jsonOnlyInstruction('{ "reply": string, "language": string }'),
  ].join('\n\n');
}

export function buildAnnouncementTranslationPrompt(params: {
  message: string;
  targetLanguage: string;
  venue?: Venue;
}): string {
  const { message, targetLanguage, venue = DEFAULT_VENUE } = params;
  return [
    venuePersona('announcement translator for fans', venue),
    `Translate the venue announcement below into this BCP-47 language code: ${targetLanguage}. Keep gate letters and section numbers unchanged.`,
    // The announcement arrives over the (simulated) venue feed — external data, wrapped like user input.
    `The announcement:\n${wrapUntrustedInput(message)}`,
    jsonOnlyInstruction('{ "translation": string, "language": string }'),
  ].join('\n\n');
}

export function buildOperationalIntelligencePrompt(params: {
  kpis: KpiSnapshot[];
  venue?: Venue;
}): string {
  const { kpis, venue = DEFAULT_VENUE } = params;
  return [
    venuePersona('operational intelligence analyst briefing organizers', venue),
    `The venue seats ${formatCount(venue.capacity)} fans.`,
    `Current KPI snapshot:\n${JSON.stringify(kpis)}`,
    'Write an executive briefing: a state-of-venue summary, the anomalies organizers should act on (with the action), and the trends to watch over the next hour.',
    jsonOnlyInstruction('{ "summary": string, "anomalies": string[], "trends": string[] }'),
  ].join('\n\n');
}

const ACTION_PLAN_SHAPE =
  '{ "summary": string, "immediateActions": string[], "teamsToNotify": string[], "escalationCriteria": string[], "priority": "normal" | "elevated" | "critical" }';

/**
 * The lost-child protocol is dictated, not left to the model: child-safety
 * steps must be the same every time, so the prompt states them and the model
 * only phrases the plan around them. The reunification section comes from the
 * venue's own layout so the plan, the map, and the facts all name one place.
 */
function lostChildProtocol(venue: Venue): string {
  const reunification = getVenueLayout(venue.id).amenities.find(
    (amenity) => amenity.type === 'family-reunification',
  );
  const section = reunification ? sectionNumber(reunification.sectionId) : '';
  return `This is a lost-child incident. The plan MUST follow the venue child-safety protocol: a staff member stays with the child (or the reporting adult) exactly where they are and never moves them through the crowd; Guest Services and the security control room are radioed with a description; the guardian is paged to the Family Reunification point near section ${section}; the child is never taken outside the venue; and escalation includes a hard time threshold of 15 minutes without reunification.`;
}

export function buildRealTimeDecisionSupportPrompt(params: {
  incident: Incident;
  venue?: Venue;
}): string {
  const { incident, venue = DEFAULT_VENUE } = params;
  return [
    venuePersona('real-time decision support assistant for venue staff', venue),
    venueConditionsLine(venue),
    `An incident was reported:\n${JSON.stringify(incident)}`,
    ...(incident.category === 'lost-child' ? [lostChildProtocol(venue)] : []),
    'Produce a structured action plan: immediate actions in order, venue staff to notify (stewards, ground staff, security/police liaison, gate/concourse staff), and escalation criteria.',
    jsonOnlyInstruction(ACTION_PLAN_SHAPE),
  ].join('\n\n');
}

export function buildScenarioPrompt(params: { scenario: string; venue?: Venue }): string {
  const { scenario, venue = DEFAULT_VENUE } = params;
  return [
    venuePersona('real-time decision support assistant for venue staff', venue),
    venueConditionsLine(venue),
    `An organizer wants to war-game a hypothetical matchday scenario:\n${wrapUntrustedInput(scenario)}`,
    'Produce a structured contingency plan: immediate actions in order, venue staff to notify (stewards, ground staff, security/police liaison, gate/concourse staff), and escalation criteria.',
    jsonOnlyInstruction(ACTION_PLAN_SHAPE),
  ].join('\n\n');
}
