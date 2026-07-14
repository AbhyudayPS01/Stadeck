import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_LANGUAGE } from '../config/constants';
import { LanguageContext, type LanguageContextValue } from './languageContext';

interface LanguageProviderProps {
  children: ReactNode;
}

/** Provides the AI content language preference. See languageContext.ts for scope. */
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);

  const setLanguage = useCallback((code: string) => setLanguageState(code), []);

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
