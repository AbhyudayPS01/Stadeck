import { ACCESSIBILITY_STRINGS, type AccessibilityStringKey } from './uiStringsAccessibility';
import {
  CROWD_MANAGEMENT_STRINGS,
  type CrowdManagementStringKey,
} from './uiStringsCrowdManagement';
import {
  EMERGENCY_SERVICES_STRINGS,
  type EmergencyServicesStringKey,
} from './uiStringsEmergencyServices';
import { LANDING_STRINGS, type LandingStringKey } from './uiStringsLanding';
import {
  LOST_AND_FOUND_STRINGS,
  type LostAndFoundStringKey,
} from './uiStringsLostAndFound';
import { MAP_STRINGS, type MapStringKey } from './uiStringsMap';
import { MODULE_META_STRINGS, type ModuleMetaStringKey } from './uiStringsModuleMeta';
import {
  MULTILINGUAL_ASSISTANCE_STRINGS,
  type MultilingualAssistanceStringKey,
} from './uiStringsMultilingualAssistance';
import { NAVIGATION_STRINGS, type NavigationStringKey } from './uiStringsNavigation';
import {
  OPERATIONAL_INTELLIGENCE_STRINGS,
  type OperationalIntelligenceStringKey,
} from './uiStringsOperationalIntelligence';
import {
  REAL_TIME_DECISION_SUPPORT_STRINGS,
  type RealTimeDecisionSupportStringKey,
} from './uiStringsRealTimeDecisionSupport';
import { SHELL_STRINGS, type ShellStringKey } from './uiStringsShell';
import { SUSTAINABILITY_STRINGS, type SustainabilityStringKey } from './uiStringsSustainability';
import { TRANSPORTATION_STRINGS, type TransportationStringKey } from './uiStringsTransportation';
import { UI_LANGUAGES, type UiLanguage } from './uiStringsTypes';
import { VENUE_STRINGS, type VenueStringKey } from './uiStringsVenue';
import { VOLUNTEER_STRINGS, type VolunteerStringKey } from './uiStringsVolunteer';

/**
 * Static interface strings for all eight supported languages — every static
 * string the user reads (headings, labels, buttons, badges, empty/error
 * states, tooltips, landing copy). Deliberately NOT full i18n middleware:
 * plain typed tables, instant switching, zero API calls, works with zero key.
 *
 * Wayfinding identifiers ("Section 102", "Gate A", "Row 14") are NEVER in
 * these tables — they must match the venue's physical signage exactly; see
 * utils/uiText.ts for the composition helper and full rationale.
 *
 * Tables are split by module (uiStrings<Module>.ts) so a module's strings
 * stay together; each table's Record type makes the compiler fail the build
 * if any language misses a key.
 */

export type { UiLanguage } from './uiStringsTypes';
export { UI_LANGUAGES } from './uiStringsTypes';

export type UiStringKey =
  | ModuleMetaStringKey
  | ShellStringKey
  | LandingStringKey
  | MapStringKey
  | NavigationStringKey
  | CrowdManagementStringKey
  | AccessibilityStringKey
  | TransportationStringKey
  | SustainabilityStringKey
  | MultilingualAssistanceStringKey
  | VolunteerStringKey
  | OperationalIntelligenceStringKey
  | RealTimeDecisionSupportStringKey
  | VenueStringKey
  | EmergencyServicesStringKey
  | LostAndFoundStringKey;

/** One complete interface-string table for a single language. */
export type UiStrings = Readonly<Record<UiStringKey, string>>;

/** Every per-module table, keyed for the runtime completeness test. */
export const UI_STRING_TABLES = {
  moduleMeta: MODULE_META_STRINGS,
  shell: SHELL_STRINGS,
  landing: LANDING_STRINGS,
  map: MAP_STRINGS,
  navigation: NAVIGATION_STRINGS,
  crowdManagement: CROWD_MANAGEMENT_STRINGS,
  accessibility: ACCESSIBILITY_STRINGS,
  transportation: TRANSPORTATION_STRINGS,
  sustainability: SUSTAINABILITY_STRINGS,
  multilingualAssistance: MULTILINGUAL_ASSISTANCE_STRINGS,
  volunteer: VOLUNTEER_STRINGS,
  operationalIntelligence: OPERATIONAL_INTELLIGENCE_STRINGS,
  realTimeDecisionSupport: REAL_TIME_DECISION_SUPPORT_STRINGS,
  venue: VENUE_STRINGS,
  emergencyServices: EMERGENCY_SERVICES_STRINGS,
  lostAndFound: LOST_AND_FOUND_STRINGS,
} as const;

function buildLanguage(language: UiLanguage): UiStrings {
  return {
    ...MODULE_META_STRINGS[language],
    ...SHELL_STRINGS[language],
    ...LANDING_STRINGS[language],
    ...MAP_STRINGS[language],
    ...NAVIGATION_STRINGS[language],
    ...CROWD_MANAGEMENT_STRINGS[language],
    ...ACCESSIBILITY_STRINGS[language],
    ...TRANSPORTATION_STRINGS[language],
    ...SUSTAINABILITY_STRINGS[language],
    ...MULTILINGUAL_ASSISTANCE_STRINGS[language],
    ...VOLUNTEER_STRINGS[language],
    ...OPERATIONAL_INTELLIGENCE_STRINGS[language],
    ...REAL_TIME_DECISION_SUPPORT_STRINGS[language],
    ...VENUE_STRINGS[language],
    ...EMERGENCY_SERVICES_STRINGS[language],
    ...LOST_AND_FOUND_STRINGS[language],
  };
}

// Built once at module load — eight small object spreads, not per render.
const UI_STRINGS: Readonly<Record<UiLanguage, UiStrings>> = Object.fromEntries(
  UI_LANGUAGES.map((language) => [language, buildLanguage(language)]),
) as Record<UiLanguage, UiStrings>;

function isUiLanguage(language: string): language is UiLanguage {
  return (UI_LANGUAGES as readonly string[]).includes(language);
}

/**
 * The interface-string table for a language, falling back to English for any
 * unsupported code so a stale or unexpected preference never blanks the UI.
 */
export function getUiStrings(language: string): UiStrings {
  return isUiLanguage(language) ? UI_STRINGS[language] : UI_STRINGS.en;
}
