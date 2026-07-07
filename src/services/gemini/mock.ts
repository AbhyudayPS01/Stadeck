import type {
  AccessibilityResponse,
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
      'Gate C and the east concourse are approaching capacity; other gates are flowing normally.',
    recommendation: 'Route incoming fans toward Gates A, B, and F until east-side density eases.',
    hotZones: ['Gate C', 'East Concourse', 'Section 130'],
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

export function mockMultilingualAssistanceResponse(): MultilingualAssistanceResponse {
  return {
    reply: 'Thanks for your message — a member of our team will help you shortly.',
    language: 'en',
  };
}

export function mockOperationalIntelligenceResponse(): OperationalIntelligenceResponse {
  return {
    summary: 'Operations are running within normal parameters across all monitored systems.',
    alerts: ['Gate C wait times trending up ahead of kickoff.'],
  };
}

export function mockRealTimeDecisionSupportResponse(): RealTimeDecisionSupportResponse {
  return {
    summary: 'Dispatch a response team and monitor the situation until it is resolved.',
    actionPlan: [
      'Notify the nearest response team of the incident location.',
      'Redirect fan flow away from the affected area if needed.',
      'Confirm resolution and update the incident status.',
    ],
    priority: 'elevated',
  };
}
