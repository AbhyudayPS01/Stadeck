import { getStadiumFactsContext } from '../../data/stadiumFacts';
import { DEFAULT_VENUE } from '../../data/venues';
import type { Announcement } from '../../../types/announcement';
import type { Gate, StadiumSection } from '../../../types/stadium';
import type { SustainabilityMetrics } from '../../../types/sustainability';
import type { TransitOption } from '../../../types/transportation';
import type { Venue } from '../../../types/venue';
import { detectLanguage } from '../../../utils/detectLanguage';
import { callFeature, type GeminiResult } from '../callFeature';
import {
  mockAccessibilityResponse,
  mockAnnouncementTranslationResponse,
  mockMultilingualAssistanceResponse,
  mockNavigationResponse,
  mockPlainLanguageResponse,
  mockSustainabilityResponse,
  mockTransportationResponse,
} from '../mock';
import {
  buildAccessibilityPrompt,
  buildAnnouncementTranslationPrompt,
  buildMultilingualAssistancePrompt,
  buildNavigationPrompt,
  buildPlainLanguagePrompt,
  buildSustainabilityPrompt,
  buildTransportationPrompt,
} from '../prompts';
import type {
  AccessibilityResponse,
  AnnouncementTranslationResponse,
  MultilingualAssistanceResponse,
  NavigationResponse,
  PlainLanguageResponse,
  SustainabilityResponse,
  TransportationResponse,
} from '../responses';
import {
  isAccessibilityResponse,
  isAnnouncementTranslationResponse,
  isMultilingualAssistanceResponse,
  isNavigationResponse,
  isPlainLanguageResponse,
  isSustainabilityResponse,
  isTransportationResponse,
} from '../validators';

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
    'accessibility:plain-language',
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
    'multilingual:announcement-translation',
    buildAnnouncementTranslationPrompt({ message: announcement.message, targetLanguage, venue }),
    isAnnouncementTranslationResponse,
    () => mockAnnouncementTranslationResponse(announcement, targetLanguage),
  );
}
