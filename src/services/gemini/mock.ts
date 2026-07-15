import type { Announcement } from '../../types/announcement';
import type {
  AccessibilityResponse,
  AnnouncementTranslationResponse,
  CrowdManagementResponse,
  MultilingualAssistanceResponse,
  NavigationResponse,
  OperationalIntelligenceResponse,
  RealTimeDecisionSupportResponse,
  SustainabilityResponse,
  TransportationResponse,
} from './prompts';

/**
 * Deterministic fallback content per feature, served whenever the live
 * Gemini proxy is unreachable, errors after retries, or a feature is
 * client-side rate-limited — so the app is always fully usable offline or
 * with zero API key.
 */

export function mockNavigationResponse(): NavigationResponse {
  return {
    summary: 'Head to Gate C, then follow the lower bowl concourse to Section 118.',
    steps: [
      'Enter through Gate C on the east concourse.',
      'Follow signage toward Sections 110-125.',
      'Section 118 is the third entrance past the merchandise stand.',
    ],
    etaMinutes: 6,
  };
}

export function mockCrowdManagementResponse(): CrowdManagementResponse {
  return {
    summary:
      'Gate C and the surrounding east-side sections are approaching capacity; the rest of the venue is flowing normally.',
    gatesToOpen: ['Gate A', 'Gate B', 'Gate F'],
    stewardRedeployment: [
      'Move two steward teams from the west concourse to Gate C to manage the queue.',
      'Post one team at Sections 128-132 to keep the east stairwells clear.',
      'Hold one mobile team near Gate E in case rail arrivals surge.',
    ],
    congestionForecast:
      'East-side pressure should peak within 15 minutes as rail arrivals land, then ease once Gates A and B absorb the redirected flow.',
  };
}

export function mockAccessibilityResponse(): AccessibilityResponse {
  return {
    summary: 'Accessible seating and a step-free route are available near Section 101.',
    recommendedRoute: 'Enter through Gate A, take the accessible ramp to the lower bowl concourse.',
    accommodations: ['Wheelchair-accessible seating', 'Companion seating', 'Elevator access'],
  };
}

export function mockTransportationResponse(): TransportationResponse {
  return {
    summary: 'Rail is currently the fastest way to reach the stadium.',
    recommendedOptionId: 'nj-transit-rail',
    alternatives: ['coach-bus', 'rideshare-zone'],
  };
}

export function mockSustainabilityResponse(): SustainabilityResponse {
  return {
    summary: 'The venue is on track with waste diversion and renewable energy targets for today.',
    tips: [
      'Use the marked recycling and compost stations on every concourse.',
      'Refill a reusable bottle at a hydration station instead of buying a new one.',
      'Take rail or a shuttle to cut your matchday carbon footprint.',
    ],
  };
}

const ENGLISH_CONCIERGE_REPLY =
  'Happy to help! Gates open three hours before kickoff, first aid is next to sections 112 and 132, and Guest Services at sections 103 and 123 can assist in your language.';

/**
 * One canned concierge reply per supported language, all grounded in the same
 * stadium facts, so the offline demo still auto-detects and answers in the
 * fan's language (detection comes from utils/detectLanguage on this path).
 */
const CONCIERGE_REPLIES: Readonly<Record<string, string>> = {
  en: ENGLISH_CONCIERGE_REPLY,
  es: '¡Con gusto le ayudo! Las puertas abren tres horas antes del partido, los primeros auxilios están junto a las secciones 112 y 132, y Atención al Cliente (secciones 103 y 123) puede asistirle en su idioma.',
  fr: "Avec plaisir ! Les portes ouvrent trois heures avant le coup d'envoi, les premiers secours se trouvent près des sections 112 et 132, et le Service Clients (sections 103 et 123) peut vous aider dans votre langue.",
  pt: 'Claro, posso ajudar! Os portões abrem três horas antes do jogo, os primeiros socorros ficam ao lado das seções 112 e 132, e o Atendimento ao Torcedor (seções 103 e 123) pode ajudar no seu idioma.',
  de: 'Gern helfen wir Ihnen! Die Tore öffnen drei Stunden vor Anpfiff, Erste Hilfe finden Sie neben den Blöcken 112 und 132, und der Gästeservice (Blöcke 103 und 123) hilft Ihnen in Ihrer Sprache.',
  hi: 'हम आपकी मदद के लिए तैयार हैं! गेट किक-ऑफ़ से तीन घंटे पहले खुलते हैं, प्राथमिक चिकित्सा सेक्शन 112 और 132 के पास है, और गेस्ट सर्विसेज़ (सेक्शन 103 और 123) आपकी भाषा में सहायता कर सकती है।',
  ar: 'يسعدنا مساعدتك! تُفتح البوابات قبل انطلاق المباراة بثلاث ساعات، وتوجد الإسعافات الأولية بجوار القسمين 112 و132، ويمكن لخدمات الضيوف (القسمان 103 و123) مساعدتك بلغتك.',
  ja: '喜んでお手伝いします！ゲートはキックオフの3時間前に開き、応急手当所はセクション112と132の隣にあります。ゲストサービス（セクション103と123）では多言語でご案内できます。',
};

export function mockMultilingualAssistanceResponse(
  language = 'en',
): MultilingualAssistanceResponse {
  const reply = CONCIERGE_REPLIES[language];
  return reply ? { reply, language } : { reply: ENGLISH_CONCIERGE_REPLY, language: 'en' };
}

/**
 * Serves the announcement's canned translation; unknown languages fall back
 * to the English source text (correctly labelled "en" so `lang`/RTL handling
 * stays truthful).
 */
export function mockAnnouncementTranslationResponse(
  announcement: Announcement,
  targetLanguage: string,
): AnnouncementTranslationResponse {
  if (targetLanguage === 'en') {
    return { translation: announcement.message, language: 'en' };
  }
  const translation = announcement.translations[targetLanguage];
  return translation
    ? { translation, language: targetLanguage }
    : { translation: announcement.message, language: 'en' };
}

export function mockOperationalIntelligenceResponse(): OperationalIntelligenceResponse {
  return {
    summary: 'Operations are running within normal parameters across all monitored systems.',
    alerts: ['Gate C wait times trending up ahead of kickoff.'],
  };
}

export function mockRealTimeDecisionSupportResponse(): RealTimeDecisionSupportResponse {
  return {
    summary:
      'Contain the incident locally, keep fan flow moving around it, and reassess in 10 minutes.',
    immediateActions: [
      'Dispatch the nearest response team to the reported location.',
      'Cordon the immediate area and redirect fan flow around it.',
      'Confirm resolution with the on-scene lead and update the incident status.',
    ],
    teamsToNotify: ['Venue response team', 'Security control room', 'Guest Services desk 103'],
    escalationCriteria: [
      'No on-scene confirmation within 10 minutes.',
      'The affected area starts blocking an egress route.',
    ],
    priority: 'elevated',
  };
}

/** Deterministic contingency plan for the organizer "what-if" scenario tool. */
export function mockScenarioPlanResponse(): RealTimeDecisionSupportResponse {
  return {
    summary:
      'Stage resources before the scenario can develop, keep fans informed early, and hold a clear escalation trigger.',
    immediateActions: [
      'Brief zone leads on the scenario and their first move.',
      'Pre-position steward teams at the gates and concourses the scenario would stress.',
      'Queue a multilingual fan announcement so messaging is ready to publish.',
    ],
    teamsToNotify: ['Operations control room', 'Steward coordinators', 'Transportation liaison'],
    escalationCriteria: [
      'Any zone sustains critical density for more than 5 minutes.',
      'The scenario begins to affect more than one gate at once.',
    ],
    priority: 'elevated',
  };
}
