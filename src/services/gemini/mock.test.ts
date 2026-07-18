import { describe, expect, it } from 'vitest';
import { SUPPORTED_LANGUAGES } from '../../config/constants';
import { getInitialAnnouncements } from '../data/announcements';
import { getVenueLayout } from '../data/stadiumLayout';
import { findVenue, VENUES } from '../data/venues';
import {
  mockAccessibilityResponse,
  mockAnnouncementTranslationResponse,
  mockCrowdManagementResponse,
  mockMultilingualAssistanceResponse,
  mockNavigationResponse,
  mockOperationalIntelligenceResponse,
  mockPlainLanguageResponse,
  mockRealTimeDecisionSupportResponse,
  mockScenarioPlanResponse,
  mockSustainabilityReportResponse,
  mockSustainabilityResponse,
  mockTransportationResponse,
} from './mock';

const MOCK_FNS: ReadonlyArray<[string, () => unknown]> = [
  ['mockNavigationResponse', mockNavigationResponse],
  ['mockCrowdManagementResponse', mockCrowdManagementResponse],
  ['mockAccessibilityResponse', mockAccessibilityResponse],
  ['mockTransportationResponse', mockTransportationResponse],
  ['mockSustainabilityResponse', mockSustainabilityResponse],
  ['mockSustainabilityReportResponse', mockSustainabilityReportResponse],
  ['mockMultilingualAssistanceResponse', mockMultilingualAssistanceResponse],
  ['mockOperationalIntelligenceResponse', mockOperationalIntelligenceResponse],
  ['mockRealTimeDecisionSupportResponse', mockRealTimeDecisionSupportResponse],
  ['mockScenarioPlanResponse', mockScenarioPlanResponse],
];

describe('mock responses', () => {
  it.each(MOCK_FNS)('%s is deterministic across calls', (_name, mockFn) => {
    expect(mockFn()).toEqual(mockFn());
  });
});

function requireVenue(id: string) {
  const venue = findVenue(id);
  if (!venue) {
    throw new Error(`missing test venue ${id}`);
  }
  return venue;
}

describe('mockNavigationResponse', () => {
  it('returns a non-empty summary and at least one step', () => {
    const response = mockNavigationResponse();
    expect(response.summary.length).toBeGreaterThan(0);
    expect(response.steps.length).toBeGreaterThan(0);
    expect(response.etaMinutes).toBeGreaterThan(0);
  });

  it('embeds the chosen gate and section so offline directions match the map route', () => {
    const response = mockNavigationResponse('Gate H', '312');
    expect(response.summary).toContain('Gate H');
    expect(response.summary).toContain('Section 312');
    expect(response.steps.join(' ')).toContain('Gate H');
  });
});

describe('mockAccessibilityResponse', () => {
  it('embeds the chosen gate and section so offline guidance matches the map route', () => {
    const response = mockAccessibilityResponse('Gate G', '120');
    expect(response.summary).toContain('Gate G');
    expect(response.summary).toContain('Section 120');
    expect(response.recommendedRoute).toContain('Gate G');
    expect(response.accommodations.length).toBeGreaterThan(0);
  });
});

describe('mockPlainLanguageResponse', () => {
  it('serves a rewrite matched to the announcement category', () => {
    const [match, transit] = getInitialAnnouncements().filter((announcement) =>
      ['match', 'transit'].includes(announcement.category),
    );
    if (!match || !transit) {
      throw new Error('announcement categories missing in test setup');
    }
    expect(mockPlainLanguageResponse(match).rewrite).not.toBe(
      mockPlainLanguageResponse(transit).rewrite,
    );
  });

  it('is deterministic for the same announcement', () => {
    const announcement = getInitialAnnouncements()[0];
    if (!announcement) {
      throw new Error('announcement feed unexpectedly empty in test setup');
    }
    expect(mockPlainLanguageResponse(announcement)).toEqual(
      mockPlainLanguageResponse(announcement),
    );
  });

  it('substitutes the venue’s own rail station and first-aid sections, leaving no template tokens', () => {
    const toronto = requireVenue('bmo-field');
    const [transit, services] = getInitialAnnouncements(toronto).filter((announcement) =>
      ['transit', 'services'].includes(announcement.category),
    );
    if (!transit || !services) {
      throw new Error('announcement categories missing in test setup');
    }

    const transitRewrite = mockPlainLanguageResponse(transit, toronto).rewrite;
    expect(transitRewrite).toContain('Exhibition Station');
    expect(transitRewrite).not.toContain('{{');

    const servicesRewrite = mockPlainLanguageResponse(services, toronto).rewrite;
    expect(servicesRewrite).not.toContain('{{');
  });
});

describe('mockCrowdManagementResponse', () => {
  it('recommends gates, steward moves, and a forecast', () => {
    const response = mockCrowdManagementResponse();
    expect(response.gatesToOpen.length).toBeGreaterThan(0);
    expect(response.stewardRedeployment.length).toBeGreaterThan(0);
    expect(response.congestionForecast.length).toBeGreaterThan(0);
  });

  it('reproduces the original hand-tuned sections for the default venue', () => {
    const response = mockCrowdManagementResponse();
    expect(response.stewardRedeployment.join(' ')).toContain('Sections 128-132');
  });

  it('cites only sections that exist in each venue’s generated layout', () => {
    for (const venue of VENUES) {
      const sectionLabels = new Set(
        getVenueLayout(venue.id).sections.map((section) => section.label),
      );
      const response = mockCrowdManagementResponse(venue);
      const cited = response.stewardRedeployment.join(' ').match(/Sections (\d+)-(\d+)/);
      if (cited) {
        expect(sectionLabels.has(cited[1] ?? ''), venue.id).toBe(true);
        expect(sectionLabels.has(cited[2] ?? ''), venue.id).toBe(true);
      }
    }
  });

  it('flags the altitude effect on fan exertion at a high-altitude venue, unlike the default venue', () => {
    const azteca = requireVenue('estadio-azteca');
    const response = mockCrowdManagementResponse(azteca);
    expect(response.stewardRedeployment.join(' ')).toContain('2240m altitude');

    const metlife = mockCrowdManagementResponse();
    expect(metlife.stewardRedeployment.join(' ')).not.toContain('altitude');
  });
});

describe('mockRealTimeDecisionSupportResponse', () => {
  it('returns a valid priority and every structured plan section', () => {
    const response = mockRealTimeDecisionSupportResponse();
    expect(['normal', 'elevated', 'critical']).toContain(response.priority);
    expect(response.immediateActions.length).toBeGreaterThan(0);
    expect(response.teamsToNotify.length).toBeGreaterThan(0);
    expect(response.escalationCriteria.length).toBeGreaterThan(0);
  });

  it('serves the full child-safety protocol for lost-child incidents', () => {
    const response = mockRealTimeDecisionSupportResponse('lost-child');
    expect(response.priority).toBe('critical');
    expect(response.immediateActions.join(' ')).toContain('do not move them');
    expect(response.immediateActions.join(' ')).toContain('Radio Guest Services');
    expect(response.teamsToNotify.join(' ')).toContain('Section 121');
    expect(response.escalationCriteria.join(' ')).toContain('15 minutes');
  });

  it('pages the guest services desk actually nearest the reunification point, agreeing with the facts sheet', () => {
    // stadiumFacts.ts computes the same "nearest desk" for its reunification
    // fact — this keeps the offline action plan and the concierge's grounded
    // answer consistent instead of citing two different desks for one venue.
    const response = mockRealTimeDecisionSupportResponse('lost-child');
    expect(response.teamsToNotify.join(' ')).toContain('Guest Services desk 123');
  });

  it('keeps the generic containment plan for every other category', () => {
    expect(mockRealTimeDecisionSupportResponse('medical')).toEqual(
      mockRealTimeDecisionSupportResponse(),
    );
  });

  it('anchors the lost-child plan to a different venue’s own reunification section', () => {
    const toronto = requireVenue('bmo-field');
    const response = mockRealTimeDecisionSupportResponse('lost-child', toronto);

    const reunification = getVenueLayout('bmo-field').amenities.find(
      (amenity) => amenity.type === 'family-reunification',
    );
    expect(reunification).toBeDefined();
    const expectedSection = reunification?.sectionId.replace('sec-', '');

    expect(response.summary).toContain(`Section ${expectedSection}`);
    expect(response.summary).not.toContain('Section 121');
  });

  it('names the venue’s own guest services desk for a generic containment plan', () => {
    const toronto = requireVenue('bmo-field');
    const response = mockRealTimeDecisionSupportResponse('medical', toronto);
    expect(response.teamsToNotify.join(' ')).not.toContain('desk 103');
  });

  it('tells staff to evaluate closing the roof for a weather incident at a retractable-roof venue', () => {
    const attStadium = requireVenue('att-stadium');
    const response = mockRealTimeDecisionSupportResponse('weather', attStadium);
    expect(response.summary).toContain('retractable roof');
    expect(response.immediateActions.join(' ')).toContain('closing the retractable roof');
    expect(response.priority).toBe('critical');
  });

  it('gives a different weather plan for an open-air venue with no roof to close', () => {
    const metlife = mockRealTimeDecisionSupportResponse('weather');
    expect(metlife.summary).toContain('no roof to close');
    expect(metlife.summary).not.toContain('retractable');
  });

  it('gives a different weather plan for a fixed-roof venue', () => {
    const sofi = requireVenue('sofi-stadium');
    const response = mockRealTimeDecisionSupportResponse('weather', sofi);
    expect(response.summary).toContain('fixed roof already shields the bowl');
  });
});

describe('mockTransportationResponse', () => {
  it('reproduces the default venue’s rail station in the departure narrative', () => {
    const response = mockTransportationResponse();
    expect(response.steps.join(' ')).toContain('Meadowlands Station');
    expect(response.steps.join(' ')).toContain('Secaucus');
  });

  it('names a different venue’s own rail station and hub', () => {
    const toronto = requireVenue('bmo-field');
    const response = mockTransportationResponse(toronto);
    expect(response.steps.join(' ')).toContain('Exhibition Station');
    expect(response.steps.join(' ')).toContain('Union Station');
    expect(response.steps.join(' ')).not.toContain('Meadowlands');
  });
});

describe('mockScenarioPlanResponse', () => {
  it('returns a full contingency plan', () => {
    const response = mockScenarioPlanResponse();
    expect(response.immediateActions.length).toBeGreaterThan(0);
    expect(response.teamsToNotify.length).toBeGreaterThan(0);
    expect(response.escalationCriteria.length).toBeGreaterThan(0);
  });
});

describe('mockMultilingualAssistanceResponse', () => {
  it('defaults to English', () => {
    const response = mockMultilingualAssistanceResponse();
    expect(response.language).toBe('en');
    expect(response.reply.length).toBeGreaterThan(0);
  });

  it.each(SUPPORTED_LANGUAGES.map((option) => option.code))(
    'replies in %s when that language is detected',
    (code) => {
      const response = mockMultilingualAssistanceResponse(code);
      expect(response.language).toBe(code);
      expect(response.reply.length).toBeGreaterThan(0);
    },
  );

  it('falls back to English for an unsupported language code', () => {
    const response = mockMultilingualAssistanceResponse('xx');
    expect(response.language).toBe('en');
  });

  it('reproduces the default venue’s sections in the English reply', () => {
    const response = mockMultilingualAssistanceResponse('en');
    expect(response.reply).toContain('sections 112 and 132');
    expect(response.reply).toContain('sections 103 and 123');
  });

  it('cites a different venue’s own first-aid and guest-services sections', () => {
    const toronto = requireVenue('bmo-field');
    const response = mockMultilingualAssistanceResponse('en', toronto);

    const layout = getVenueLayout('bmo-field');
    const firstAid = [
      ...new Set(
        layout.amenities
          .filter((amenity) => amenity.type === 'first-aid')
          .map((amenity) => amenity.sectionId.replace('sec-', '')),
      ),
    ];
    expect(response.reply).toContain(firstAid[0]);
    expect(response.reply).not.toContain('sections 112 and 132');
  });

  it('leaves no template tokens in any supported language for any venue', () => {
    for (const venue of VENUES) {
      for (const code of SUPPORTED_LANGUAGES.map((option) => option.code)) {
        const response = mockMultilingualAssistanceResponse(code, venue);
        expect(response.reply, `${venue.id} ${code}`).not.toContain('{{');
      }
    }
  });
});

describe('mockAnnouncementTranslationResponse', () => {
  const announcement = getInitialAnnouncements()[0];
  if (!announcement) {
    throw new Error('announcement feed unexpectedly empty in test setup');
  }

  it('serves the canned translation for a supported language', () => {
    const response = mockAnnouncementTranslationResponse(announcement, 'es');
    expect(response.language).toBe('es');
    expect(response.translation).toBe(announcement.translations['es']);
  });

  it('returns the English source when English is requested', () => {
    const response = mockAnnouncementTranslationResponse(announcement, 'en');
    expect(response).toEqual({ translation: announcement.message, language: 'en' });
  });

  it('falls back to the labelled English source for an unknown language', () => {
    const response = mockAnnouncementTranslationResponse(announcement, 'xx');
    expect(response).toEqual({ translation: announcement.message, language: 'en' });
  });
});
