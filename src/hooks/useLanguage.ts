import { useContext } from 'react';
import { LanguageContext, type LanguageContextValue } from '../context/languageContext';

/**
 * The interface language preference and its setter.
 *
 * @returns The LanguageContext value.
 * @throws When rendered outside a LanguageProvider — misuse should fail loudly in development.
 */
export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (value === null) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return value;
}
