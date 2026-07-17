import { getUiStrings, type UiStrings } from '../services/data/uiStrings';
import { useLanguage } from './useLanguage';

/**
 * The static interface-string table for the current interface language.
 *
 * @returns The UiStrings table for the language selected in the sidebar
 *   picker, falling back to English for unsupported codes.
 * @throws When rendered outside a LanguageProvider (via useLanguage).
 */
export function useUiStrings(): UiStrings {
  return getUiStrings(useLanguage().language);
}
