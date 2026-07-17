import type { Announcement } from '../../types/announcement';
import type { IncidentCategory } from '../../types/incident';
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
 * Deterministic fallback content per feature, served whenever the live
 * Gemini proxy is unreachable, errors after retries, or a feature is
 * client-side rate-limited — so the app is always fully usable offline or
 * with zero API key.
 */

/**
 * Parameterized on the fan's actual gate/section choices so the offline demo
 * never shows directions that contradict the highlighted route on the map.
 */
export function mockNavigationResponse(
  gateLabel = 'Gate C',
  sectionLabel = '118',
): NavigationResponse {
  return {
    summary: `Enter at ${gateLabel} and follow the concourse to Section ${sectionLabel}.`,
    steps: [
      `Enter through ${gateLabel} and clear the security check.`,
      'Follow the main concourse — overhead signs list the section ranges ahead.',
      `Turn in at the entrance marked Section ${sectionLabel}; stewards there can point out your row.`,
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

/** Parameterized on the fan's choices so the offline demo matches the highlighted map route. */
export function mockAccessibilityResponse(
  gateLabel = 'Gate A',
  sectionLabel = '101',
): AccessibilityResponse {
  return {
    summary: `A fully step-free route runs from ${gateLabel} to the accessible seating at Section ${sectionLabel}.`,
    recommendedRoute: `Enter through ${gateLabel}, take the accessible ramp to the level concourse, and follow it to the Section ${sectionLabel} entrance — no stairs at any point.`,
    accommodations: ['Wheelchair-accessible seating', 'Companion seating', 'Elevator access'],
  };
}

/**
 * Canned plain-language rewrite per announcement category — deterministic,
 * and category-matched so the offline rewrite still relates to the
 * announcement the fan picked.
 */
const PLAIN_REWRITES: Readonly<Record<Announcement['category'], string>> = {
  match:
    'The game starts at 3:00 PM. The doors are open now. The security check can take time. Please arrive early.',
  transit:
    'After the game, extra trains leave from Meadowlands Station. They run for 90 minutes. Go to Gate D or Gate E and follow the train signs.',
  services:
    'Free drinking water is on every level. First aid is next to Section 112 and Section 132.',
  safety:
    'Bad weather may be coming. If the game is delayed, listen to the staff. Stay in the covered walkways.',
};

export function mockPlainLanguageResponse(announcement: Announcement): PlainLanguageResponse {
  return { rewrite: PLAIN_REWRITES[announcement.category] };
}

export function mockTransportationResponse(): TransportationResponse {
  return {
    summary:
      'Rail is your best post-match option: it clears the biggest share of the crowd and avoids the parking-lot surge.',
    recommendedOptionId: 'nj-transit-rail',
    departureWindow: 'Leave your seat between 5:05 and 5:15 PM',
    steps: [
      '4:50 PM — final whistle. Stay seated for the trophy ceremony; concourses are packed.',
      '5:05 PM — head up the concourse toward Gates D and E; flow is busy but moving.',
      '5:15 PM — follow the rail-platform signs; extra trains run every 10 minutes.',
      '5:30 PM — board at Meadowlands Station; expect standing room until Secaucus.',
    ],
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

export function mockSustainabilityReportResponse(): SustainabilityReportResponse {
  return {
    headline: 'A strong sustainability matchday: diversion and transit share both beat target.',
    highlights: [
      'Waste diversion held above the 60% tournament target through the full match window.',
      'Most fans arrived by rail or shuttle, keeping the crowd carbon estimate well below an all-car baseline.',
      'Hydration stations cut single-use bottle sales on every concourse.',
    ],
    recommendations: [
      'Add compost stations near the east concessions, where landfill volume peaked.',
      'Extend post-match shuttle frequency to hold the transit mode share through egress.',
      'Shift concourse lighting to the renewable block earlier in the afternoon.',
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
    summary:
      'The venue is running close to plan: attendance is tracking toward capacity, and every monitored system is inside its normal band. Gate throughput is the one number worth watching.',
    anomalies: [
      'Average gate wait is trending above 10 minutes — open an extra lane at Gate C before the pre-kickoff surge.',
      'Transit on-time rate has dipped under 85% — brief the rail liaison and queue a fan announcement.',
    ],
    trends: [
      'Attendance should reach 95% of capacity by kickoff.',
      'Grid energy draw climbs toward its evening peak; the renewable block carries the early load.',
    ],
  };
}

/**
 * The lost-child plan is safety-critical, so its offline fallback carries the
 * full protocol (stay put, radio Guest Services, reunification point, hard
 * time threshold) instead of the generic containment plan.
 */
const LOST_CHILD_PLAN: RealTimeDecisionSupportResponse = {
  summary:
    'Begin the lost-child protocol: stay with the child, radio Guest Services, and reunite at the Family Reunification point near Section 121.',
  immediateActions: [
    'Stay with the child (or the reporting adult) exactly where they are — do not move them through the crowd.',
    "Radio Guest Services and the security control room with the child's description and last known location.",
    'Send a steward to the Family Reunification point near Section 121 and page the guardian there.',
    'Never take the child outside the venue or hand them to anyone but the verified guardian or Guest Services staff.',
  ],
  teamsToNotify: [
    'Guest Services desk 103',
    'Security control room',
    'Family Reunification point steward (Section 121)',
  ],
  escalationCriteria: [
    'No reunification within 15 minutes — escalate to the venue security lead and the on-site police detail.',
    'Any sign the child is injured, distressed, or was seen leaving with an unrelated adult.',
  ],
  priority: 'critical',
};

export function mockRealTimeDecisionSupportResponse(
  category?: IncidentCategory,
): RealTimeDecisionSupportResponse {
  if (category === 'lost-child') {
    return LOST_CHILD_PLAN;
  }
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
