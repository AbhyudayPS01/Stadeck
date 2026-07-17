import { createContext } from 'react';

/** Value shape provided by LanguageProvider and consumed via useLanguage. */
export interface LanguageContextValue {
  /** BCP-47 tag for the interface strings and AI-generated content. */
  language: string;
  /** Switches the interface language. Must be a code from SUPPORTED_LANGUAGES. */
  setLanguage: (code: string) => void;
}

/**
 * The interface language preference. Drives the bounded static string table
 * (services/data/uiStrings — module titles, primary buttons, placeholders,
 * empty states; deliberately not full UI i18n) instantly with no API call,
 * and AI response regions follow the same setting, setting `lang` on their
 * own containers.
 */
export const LanguageContext = createContext<LanguageContextValue | null>(null);
