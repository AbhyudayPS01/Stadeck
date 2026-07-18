import { getVenueLayout, sectionNumberAtRingFraction } from '../data/stadiumLayout';
import { DEFAULT_VENUE } from '../data/venues';
import type { Announcement } from '../../types/announcement';
import type { Venue } from '../../types/venue';
import { HIGH_ALTITUDE_THRESHOLD_METERS } from './promptHelpers';
import type {
  AccessibilityResponse,
  AnnouncementTranslationResponse,
  CrowdManagementResponse,
  NavigationResponse,
  OperationalIntelligenceResponse,
  PlainLanguageResponse,
  SustainabilityReportResponse,
  SustainabilityResponse,
  TransportationResponse,
} from './responses';
import { venueAnchors } from './mockVenueHelpers';

/**
 * Deterministic fallback content per feature, served whenever the live
 * Gemini proxy is unreachable, errors after retries, or a feature is
 * client-side rate-limited — so the app is always fully usable offline or
 * with zero API key. Every fallback that cites a section number or a rail
 * station derives it from the active venue's own layout/registry entry, so
 * the offline demo stays consistent when the venue switches, exactly like
 * the live prompts (see services/gemini/prompts.ts). The multilingual
 * concierge and incident/scenario mocks live in mockConcierge.ts and
 * mockIncidentResponses.ts, re-exported below.
 */
export { mockMultilingualAssistanceResponse } from './mockConcierge';
export {
  mockRealTimeDecisionSupportResponse,
  mockScenarioPlanResponse,
} from './mockIncidentResponses';

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

export function mockCrowdManagementResponse(
  venue: Venue = DEFAULT_VENUE,
): CrowdManagementResponse {
  const layout = getVenueLayout(venue.id);
  const sectionA = sectionNumberAtRingFraction(layout, 'lower', 0.675);
  const sectionB = sectionNumberAtRingFraction(layout, 'lower', 0.775);
  const isHighAltitude = venue.altitudeMeters > HIGH_ALTITUDE_THRESHOLD_METERS;
  return {
    summary:
      'Gate C and the surrounding east-side sections are approaching capacity; the rest of the venue is flowing normally.',
    gatesToOpen: ['Gate A', 'Gate B', 'Gate F'],
    stewardRedeployment: [
      'Move two steward teams from the west concourse to Gate C to manage the queue.',
      `Post one team at Sections ${sectionA}-${sectionB} to keep the east stairwells clear.`,
      'Hold one mobile team near Gate E in case rail arrivals surge.',
      ...(isHighAltitude
        ? [
            `Add an extra medical team on the concourse — at ${venue.altitudeMeters}m altitude, exertion in dense queues raises the chance of a fan needing help.`,
          ]
        : []),
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
 * announcement the fan picked. {{railStation}} and {{firstAidA}}/{{firstAidB}}
 * are filled in from the active venue, mirroring the announcement feed's own
 * token convention (services/data/announcements.ts).
 */
const PLAIN_REWRITES: Readonly<Record<Announcement['category'], string>> = {
  match:
    'The game starts at 3:00 PM. The doors are open now. The security check can take time. Please arrive early.',
  transit:
    'After the game, extra trains leave from {{railStation}} Station. They run for 90 minutes. Go to Gate D or Gate E and follow the train signs.',
  services:
    'Free drinking water is on every level. First aid is next to Section {{firstAidA}} and Section {{firstAidB}}.',
  safety:
    'Bad weather may be coming. If the game is delayed, listen to the staff. Stay in the covered walkways.',
};

export function mockPlainLanguageResponse(
  announcement: Announcement,
  venue: Venue = DEFAULT_VENUE,
): PlainLanguageResponse {
  const { firstAid } = venueAnchors(venue);
  const rewrite = PLAIN_REWRITES[announcement.category]
    .replace('{{railStation}}', venue.rail.station)
    .replace('{{firstAidA}}', firstAid[0] ?? '')
    .replace('{{firstAidB}}', firstAid[1] ?? '');
  return { rewrite };
}

export function mockTransportationResponse(venue: Venue = DEFAULT_VENUE): TransportationResponse {
  return {
    summary:
      'Rail is your best post-match option: it clears the biggest share of the crowd and avoids the parking-lot surge.',
    recommendedOptionId: 'venue-rail',
    departureWindow: 'Leave your seat between 5:05 and 5:15 PM',
    steps: [
      '4:50 PM — final whistle. Stay seated for the trophy ceremony; concourses are packed.',
      '5:05 PM — head up the concourse toward Gates D and E; flow is busy but moving.',
      '5:15 PM — follow the rail-platform signs; extra trains run every 10 minutes.',
      `5:30 PM — board at ${venue.rail.station} Station; expect standing room until ${venue.rail.hub}.`,
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
