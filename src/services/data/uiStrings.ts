import type { ModuleId } from '../../types/module';
import { UI_STRING_TRANSLATIONS } from './uiStringsTranslations';

/**
 * Static interface strings for all eight supported languages: module titles
 * and descriptions, primary button labels, input placeholders, and
 * empty-state messages. Deliberately NOT full UI i18n — this bounded table
 * is what makes the sidebar language picker visibly work with zero API key
 * and zero network; AI-generated content follows the same setting through
 * the Gemini prompts. Flat dotted keys keep every string on one line and let
 * the Record type enforce completeness per language at compile time.
 */

type ActionKey =
  | 'action.send'
  | 'action.translate'
  | 'action.getDirections'
  | 'action.planStepFreeRoute'
  | 'action.planExit'
  | 'action.getEcoActions'
  | 'action.generateBriefing'
  | 'action.planScenario';

type PlaceholderKey =
  | 'placeholder.conciergeMessage'
  | 'placeholder.destination'
  | 'placeholder.scenario';

type EmptyStateKey =
  | 'empty.conciergeIntro'
  | 'empty.announcements'
  | 'empty.incidents'
  | 'empty.incidentNotSelected';

export type UiStringKey =
  | `module.${ModuleId}.title`
  | `module.${ModuleId}.description`
  | ActionKey
  | PlaceholderKey
  | EmptyStateKey;

/** One complete interface-string table for a single language. */
export type UiStrings = Readonly<Record<UiStringKey, string>>;

/** English is the source copy — every other language mirrors these keys. */
const EN_STRINGS: UiStrings = {
  'module.navigation.title': 'Navigation',
  'module.navigation.description':
    'Turn-by-turn wayfinding to seats, gates, and amenities across MetLife Stadium. Pick your gate and section — or tap them on the map.',
  'module.crowd-management.title': 'Crowd Management',
  'module.crowd-management.description':
    'Live occupancy from simulated sensors across all 96 sections and 8 gates, with AI staff recommendations for keeping the crowd moving.',
  'module.accessibility.title': 'Accessibility',
  'module.accessibility.description':
    'Step-free routes to accessible seating, plain-language announcements, and display settings that apply across the whole app.',
  'module.transportation.title': 'Transportation',
  'module.transportation.description':
    'Beat the post-match rush: live transit options and an AI departure plan tuned to your destination.',
  'module.sustainability.title': 'Sustainability',
  'module.sustainability.description':
    'How the venue is performing right now — and what you can do to lower the matchday footprint.',
  'module.multilingual-assistance.title': 'Multilingual Assistance',
  'module.multilingual-assistance.description':
    'Ask the concierge anything in your own language, and translate venue announcements instantly. AI answers are grounded in verified stadium facts.',
  'module.operational-intelligence.title': 'Operational Intelligence',
  'module.operational-intelligence.description':
    'The operational picture at a glance — live KPIs from every monitored system, with an AI executive briefing on demand.',
  'module.real-time-decision-support.title': 'Real-Time Decision Support',
  'module.real-time-decision-support.description':
    'Triage live incidents and get structured AI action plans — plus what-if scenario planning for organizers.',
  'action.send': 'Send',
  'action.translate': 'Translate',
  'action.getDirections': 'Get directions',
  'action.planStepFreeRoute': 'Plan step-free route',
  'action.planExit': 'Plan my exit',
  'action.getEcoActions': 'Get my eco actions',
  'action.generateBriefing': 'Generate briefing',
  'action.planScenario': 'Plan scenario',
  'placeholder.conciergeMessage': 'e.g. Where is Gate C?',
  'placeholder.destination': 'e.g. Penn Station, New York',
  'placeholder.scenario': 'e.g. The rail line goes down 20 minutes before the final whistle',
  'empty.conciergeIntro': 'Ask anything about the stadium — in any language. Try one of these:',
  'empty.announcements': 'Venue announcements will appear here as they are issued.',
  'empty.incidents': 'Reported incidents will appear here in real time.',
  'empty.incidentNotSelected':
    'Pick an incident from the feed to generate immediate actions, notifications, and escalation criteria.',
};

const UI_STRINGS: Readonly<Record<string, UiStrings>> = {
  en: EN_STRINGS,
  ...UI_STRING_TRANSLATIONS,
};

/**
 * The interface-string table for a language, falling back to English for any
 * unsupported code so a stale or unexpected preference never blanks the UI.
 */
export function getUiStrings(language: string): UiStrings {
  return UI_STRINGS[language] ?? EN_STRINGS;
}
