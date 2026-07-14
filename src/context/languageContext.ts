import { createContext } from 'react';

/** Value shape provided by LanguageProvider and consumed via useLanguage. */
export interface LanguageContextValue {
  /** BCP-47 tag for AI-generated content (chat replies, translated announcements). */
  language: string;
  /** Switches the AI content language. Must be a code from SUPPORTED_LANGUAGES. */
  setLanguage: (code: string) => void;
}

/**
 * AI content language preference. UI chrome stays English (CLAUDE.md rules out
 * full UI i18n) — only AI response regions read this and set `lang` on their
 * own containers.
 */
export const LanguageContext = createContext<LanguageContextValue | null>(null);
